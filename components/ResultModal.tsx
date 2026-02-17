import React, { useState, useMemo } from 'react';
import { HighScore } from '../types';
import { findClosestCityByPopulation, findClosestCityByTaxRevenue } from '../data/referenceCities';

interface ResultModalProps {
  score: number;
  taxRevenue: number;
  highScores: HighScore[];
  onRegister: (name: string) => void;
  onRestart: () => void;
}

const formatMoney = (amount: number) => {
  if (amount >= 1000000000000) return (amount / 1000000000000).toFixed(1) + '兆';
  if (amount >= 100000000) return (amount / 100000000).toFixed(0) + '億';
  if (amount >= 10000) return (amount / 10000).toFixed(0) + '万';
  return amount.toString();
};

const ResultModal: React.FC<ResultModalProps> = ({ score, taxRevenue, highScores, onRegister, onRestart }) => {
  const [name, setName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const closestPopulationCity = useMemo(() => findClosestCityByPopulation(score), [score]);
  const closestTaxRevenueCity = useMemo(() => findClosestCityByTaxRevenue(taxRevenue), [taxRevenue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onRegister(name);
    setIsRegistered(true);
  };

  // Sort scores desc
  const sortedScores = [...highScores].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-center text-white">
          <h2 className="text-3xl font-black mb-2">🎉 建設終了！</h2>
          <p className="text-blue-100 text-sm">旭市の未来地図が完成しました</p>
        </div>
        
        <div className="p-6">
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">最終人口</div>
                <div className="text-3xl font-black text-gray-800 tracking-tight">
                {score.toLocaleString()}<span className="text-sm text-gray-400 ml-1">人</span>
                </div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">予想税収</div>
                <div className="text-3xl font-black text-green-700 tracking-tight">
                {formatMoney(taxRevenue)}<span className="text-sm text-gray-400 ml-1">円</span>
                </div>
            </div>
          </div>

          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">🌍 世界都市比較</div>
            <div className="space-y-3">
              {closestPopulationCity && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{closestPopulationCity.emoji}</span>
                      <div>
                        <div className="text-sm font-bold text-gray-800">{closestPopulationCity.nameJa}</div>
                        <div className="text-xs text-gray-500">{closestPopulationCity.country}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-blue-600 font-bold">人口規模</div>
                      <div className="text-sm font-bold text-gray-700">{(closestPopulationCity.population / 10000).toFixed(0)}万人</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((score / closestPopulationCity.population) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-medium w-12 text-right">
                      {((score / closestPopulationCity.population) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
              {closestTaxRevenueCity && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{closestTaxRevenueCity.emoji}</span>
                      <div>
                        <div className="text-sm font-bold text-gray-800">{closestTaxRevenueCity.nameJa}</div>
                        <div className="text-xs text-gray-500">{closestTaxRevenueCity.country}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-600 font-bold">税収規模</div>
                      <div className="text-sm font-bold text-gray-700">{formatMoney(closestTaxRevenueCity.taxRevenue)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((taxRevenue / closestTaxRevenueCity.taxRevenue) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-medium w-12 text-right">
                      {((taxRevenue / closestTaxRevenueCity.taxRevenue) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isRegistered ? (
            <form onSubmit={handleSubmit} className="mb-8">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">ハイスコアに登録</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={10}
                  placeholder="ニックネーム (10文字以内)"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                  disabled={!name.trim()}
                >
                  登録
                </button>
              </div>
            </form>
          ) : (
             <div className="mb-6 bg-green-50 text-green-700 p-3 rounded-lg text-center font-bold text-sm border border-green-200">
               登録しました！
             </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 text-center">🏆 トップランカー</h3>
            <div className="space-y-2">
              {sortedScores.length > 0 ? (
                sortedScores.map((s, idx) => (
                  <div key={s.id} className={`flex justify-between items-center text-sm ${idx === 0 ? 'font-bold text-yellow-600' : 'text-gray-600'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${idx < 3 ? 'bg-white shadow-sm border border-gray-100' : 'text-gray-400'}`}>
                        {idx + 1}
                      </span>
                      <span>{s.name}</span>
                    </div>
                    <span>{s.score.toLocaleString()}人</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 text-xs py-2">まだ記録がありません</div>
              )}
            </div>
          </div>

          <button
            onClick={onRestart}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/></svg>
            新しい地図を作る
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;