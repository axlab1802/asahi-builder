import React from 'react';
import { ReferenceCity } from '../data/referenceCities';

interface CityComparisonProps {
  populationCity: ReferenceCity | null;
  taxRevenueCity: ReferenceCity | null;
  currentPopulation: number;
  currentTaxRevenue: number;
}

const formatMoney = (amount: number) => {
  if (amount >= 1000000000000) return (amount / 1000000000000).toFixed(1) + '兆';
  if (amount >= 100000000) return (amount / 100000000).toFixed(0) + '億';
  if (amount >= 10000) return (amount / 10000).toFixed(0) + '万';
  return amount.toString();
};

const CityComparison: React.FC<CityComparisonProps> = ({ 
  populationCity, 
  taxRevenueCity,
  currentPopulation,
  currentTaxRevenue
}) => {
  if (!populationCity && !taxRevenueCity) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
        🌍 都市比較
      </div>
      
      {populationCity && (
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-2.5 border border-blue-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-lg flex-shrink-0">{populationCity.emoji}</span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-700 truncate">
                  {populationCity.nameJa}
                </div>
                <div className="text-[10px] text-gray-500">
                  {populationCity.country}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-bold text-blue-700">
                {(populationCity.population / 10000).toFixed(0)}万人
              </div>
              <div className="text-[9px] text-gray-400">
                人口規模
              </div>
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex-1 h-1.5 bg-white/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((currentPopulation / populationCity.population) * 100, 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap">
              {((currentPopulation / populationCity.population) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      {taxRevenueCity && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2.5 border border-green-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-lg flex-shrink-0">{taxRevenueCity.emoji}</span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-700 truncate">
                  {taxRevenueCity.nameJa}
                </div>
                <div className="text-[10px] text-gray-500">
                  {taxRevenueCity.country}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-bold text-green-700">
                {formatMoney(taxRevenueCity.taxRevenue)}
              </div>
              <div className="text-[9px] text-gray-400">
                税収規模
              </div>
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex-1 h-1.5 bg-white/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((currentTaxRevenue / taxRevenueCity.taxRevenue) * 100, 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap">
              {((currentTaxRevenue / taxRevenueCity.taxRevenue) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityComparison;
