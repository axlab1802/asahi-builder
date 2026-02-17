import React, { useState, useEffect, useMemo, useRef } from 'react';
import ChatInterface from './components/ChatInterface';
import MapCanvas from './components/MapCanvas';
import ResultModal from './components/ResultModal';
import CityComparison from './components/CityComparison';
import { geminiService } from './services/geminiService';
import { INITIAL_MAP_ITEMS, BASE_POPULATION, BASE_TAX_REVENUE } from './constants';
import { ChatMessage, MapItem, ViewMode, HighScore } from './types';
import { findClosestCityByPopulation, findClosestCityByTaxRevenue } from './data/referenceCities';
import { v4 as uuidv4 } from 'uuid'; 

const generateId = () => Math.random().toString(36).substr(2, 9);
const MAX_ADDITIONAL_ITEMS = 5;
const STORAGE_KEY = 'future-asahi-highscores';

const App: React.FC = () => {
  const [items, setItems] = useState<MapItem[]>(INITIAL_MAP_ITEMS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  
  // Game State
  const [userAddedCount, setUserAddedCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  // Load High Scores
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHighScores(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse high scores", e);
      }
    }
  }, []);

  // Calculate Population
  const currentPopulation = useMemo(() => {
    const addedPop = items.reduce((acc, item) => acc + (item.population || 0), 0);
    return BASE_POPULATION + addedPop;
  }, [items]);

  // Calculate Tax Revenue
  const currentTaxRevenue = useMemo(() => {
    const addedTax = items.reduce((acc, item) => acc + (item.taxRevenue || 0), 0);
    return BASE_TAX_REVENUE + addedTax;
  }, [items]);

  const populationProgress = Math.min((currentPopulation / 1000000) * 100, 100);

  const closestPopulationCity = useMemo(() => 
    findClosestCityByPopulation(currentPopulation), 
    [currentPopulation]
  );

  const closestTaxRevenueCity = useMemo(() => 
    findClosestCityByTaxRevenue(currentTaxRevenue), 
    [currentTaxRevenue]
  );

  // Population Delta Animation Logic
  const [delta, setDelta] = useState<number | null>(null);
  const prevPopulationRef = useRef<number>(currentPopulation);

  useEffect(() => {
    const diff = currentPopulation - prevPopulationRef.current;
    if (diff !== 0) {
      setDelta(diff);
      const timer = setTimeout(() => {
        setDelta(null);
      }, 3000);
      prevPopulationRef.current = currentPopulation;
      return () => clearTimeout(timer);
    }
    prevPopulationRef.current = currentPopulation;
  }, [currentPopulation]);

  // Handle user sending a message
  const handleSendMessage = async (text: string) => {
    if (userAddedCount >= MAX_ADDITIONAL_ITEMS) return;

    // Add User Message
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call Gemini Service
      const response = await geminiService.processUserRequest(text, items);
      
      let addedInThisTurn = 0;

      // Process Actions (Add/Remove/Update items)
      if (response.actions && Array.isArray(response.actions)) {
        let newItems = [...items];
        
        response.actions.forEach((action: any) => {
          if (action.type === 'add') {
             const newItem: MapItem = {
               ...action.item,
               id: generateId(), // ensure internal ID
             };
             newItems.push(newItem);
             addedInThisTurn++;
          } else if (action.type === 'remove') {
             newItems = newItems.filter(i => 
               !i.name.toLowerCase().includes(action.targetName.toLowerCase())
             );
          } else if (action.type === 'update') {
             const index = newItems.findIndex(i => 
               i.name.toLowerCase().includes(action.targetName.toLowerCase())
             );
             if (index !== -1) {
               newItems[index] = { ...newItems[index], ...action.item, id: newItems[index].id };
             }
          }
        });
        
        setItems(newItems);
      }

      // Update Turn Count
      const newUserAddedCount = userAddedCount + addedInThisTurn;
      setUserAddedCount(newUserAddedCount);

      // Check Game Over
      if (newUserAddedCount >= MAX_ADDITIONAL_ITEMS) {
         setIsGameOver(true);
      }

      // Add Model Response
      const aiMsg: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: response.text || "地図を更新しました！",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error("Error in chat loop", error);
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: "エラーが発生しました。もう一度試してみてください。",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterScore = (name: string) => {
    const newScore: HighScore = {
      id: generateId(),
      name,
      score: currentPopulation,
      date: new Date().toISOString()
    };
    const newHighScores = [...highScores, newScore];
    setHighScores(newHighScores);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHighScores));
  };

  const handleRestart = () => {
    setItems(INITIAL_MAP_ITEMS);
    setMessages([]);
    setUserAddedCount(0);
    setIsGameOver(false);
    prevPopulationRef.current = BASE_POPULATION; // Reset delta logic baseline
  };

  const handleExport = (dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `future-asahi-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatMoney = (amount: number) => {
    if (amount >= 1000000000000) return (amount / 1000000000000).toFixed(1) + '兆';
    if (amount >= 100000000) return (amount / 100000000).toFixed(0) + '億';
    if (amount >= 10000) return (amount / 10000).toFixed(0) + '万';
    return amount.toString();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      {/* Result Modal */}
      {isGameOver && (
        <ResultModal 
          score={currentPopulation}
          taxRevenue={currentTaxRevenue}
          highScores={highScores}
          onRegister={handleRegisterScore}
          onRestart={handleRestart}
        />
      )}

      {/* Sidebar Chat */}
      <div className="h-[40vh] md:h-full md:w-96 flex-shrink-0 z-20">
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          remainingTurns={MAX_ADDITIONAL_ITEMS - userAddedCount}
          isGameOver={isGameOver}
        />
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative h-[60vh] md:h-full">
        <MapCanvas 
          items={items} 
          viewMode={viewMode} 
          onExport={handleExport}
        />
        
        {/* Status Overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 w-[95%] md:w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-teal-100 p-4 z-[600] transition-all hover:scale-105">
            {/* Population Section */}
            <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">現在人口</span>
                    <span className="text-teal-600 text-xs font-bold">目標: 100万人</span>
                </div>
                <div className="flex items-baseline gap-1 relative">
                    <span className="text-3xl font-black text-gray-800 tabular-nums tracking-tight">
                        {currentPopulation.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">人</span>
                    
                    {/* Delta Animation Popup */}
                    {delta !== null && (
                      <div 
                        key={Date.now()} // Force re-render for animation restart
                        className={`absolute -top-6 right-0 text-sm font-bold animate-bounce whitespace-nowrap px-2 py-0.5 rounded shadow-sm bg-white/90 backdrop-blur-sm border ${delta > 0 ? 'text-green-600 border-green-200' : 'text-red-500 border-red-200'}`}
                      >
                        {delta > 0 ? '+' : ''}{delta.toLocaleString()}
                      </div>
                    )}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${populationProgress}%` }}
                    />
                </div>
            </div>

            {/* Tax Revenue Section */}
            <div className="pt-3 border-t border-gray-100">
                 <div className="flex justify-between items-end mb-1">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">予想税収</span>
                    <span className="text-green-600 text-[10px]">予算規模</span>
                </div>
                 <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-700 tabular-nums tracking-tight">
                        {formatMoney(currentTaxRevenue)}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">円</span>
                </div>
            </div>

            <div className="mt-2 text-right text-[10px] text-gray-400">
                達成率: {populationProgress.toFixed(1)}%
            </div>

            <CityComparison 
              populationCity={closestPopulationCity}
              taxRevenueCity={closestTaxRevenueCity}
              currentPopulation={currentPopulation}
              currentTaxRevenue={currentTaxRevenue}
            />
        </div>

        {/* View Mode Toggle */}
        <div className="absolute top-[180px] md:top-[160px] right-4 bg-white/90 backdrop-blur rounded-lg shadow-sm p-1 flex space-x-1 z-[600]">
          <button 
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'map' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            通常地図
          </button>
          <button 
            onClick={() => setViewMode('blueprint')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'blueprint' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            設計図
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;