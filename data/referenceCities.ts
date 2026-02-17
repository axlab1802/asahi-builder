export interface ReferenceCity {
  name: string;
  nameJa: string;
  country: string;
  population: number;
  taxRevenue: number;
  emoji: string;
}

export const REFERENCE_CITIES: ReferenceCity[] = [
  { name: "Kamogawa", nameJa: "鴨川", country: "日本", population: 31000, taxRevenue: 16000000000, emoji: "🌊" },
  { name: "Katsuura", nameJa: "勝浦", country: "日本", population: 16000, taxRevenue: 10000000000, emoji: "🏖️" },
  { name: "Isumi", nameJa: "いすみ", country: "日本", population: 35000, taxRevenue: 18000000000, emoji: "🌾" },
  { name: "Sosa", nameJa: "匝瑳", country: "日本", population: 33000, taxRevenue: 17000000000, emoji: "🌸" },
  { name: "Tomisato", nameJa: "富里", country: "日本", population: 49000, taxRevenue: 20000000000, emoji: "🥕" },
  { name: "Yotsukaido", nameJa: "四街道", country: "日本", population: 95000, taxRevenue: 40000000000, emoji: "🏘️" },
  { name: "Yachiyo", nameJa: "八千代", country: "日本", population: 200000, taxRevenue: 85000000000, emoji: "🌳" },
  { name: "Narita", nameJa: "成田", country: "日本", population: 132000, taxRevenue: 60000000000, emoji: "✈️" },
  { name: "Sakura", nameJa: "佐倉", country: "日本", population: 172000, taxRevenue: 75000000000, emoji: "🌸" },
  { name: "Togane", nameJa: "東金", country: "日本", population: 58000, taxRevenue: 25000000000, emoji: "🏞️" },
  
  { name: "Tokyo", nameJa: "東京", country: "日本", population: 14000000, taxRevenue: 7500000000000, emoji: "🗼" },
  { name: "Yokohama", nameJa: "横浜", country: "日本", population: 3750000, taxRevenue: 1800000000000, emoji: "⚓" },
  { name: "Osaka", nameJa: "大阪", country: "日本", population: 2750000, taxRevenue: 1600000000000, emoji: "🏯" },
  { name: "Nagoya", nameJa: "名古屋", country: "日本", population: 2320000, taxRevenue: 1200000000000, emoji: "🏭" },
  { name: "Sapporo", nameJa: "札幌", country: "日本", population: 1970000, taxRevenue: 900000000000, emoji: "⛷️" },
  { name: "Fukuoka", nameJa: "福岡", country: "日本", population: 1610000, taxRevenue: 800000000000, emoji: "🍜" },
  { name: "Kobe", nameJa: "神戸", country: "日本", population: 1540000, taxRevenue: 750000000000, emoji: "⛴️" },
  { name: "Kyoto", nameJa: "京都", country: "日本", population: 1470000, taxRevenue: 700000000000, emoji: "⛩️" },
  { name: "Kawasaki", nameJa: "川崎", country: "日本", population: 1530000, taxRevenue: 720000000000, emoji: "🏙️" },
  { name: "Saitama", nameJa: "さいたま", country: "日本", population: 1310000, taxRevenue: 650000000000, emoji: "🌸" },
  { name: "Hiroshima", nameJa: "広島", country: "日本", population: 1200000, taxRevenue: 600000000000, emoji: "🕊️" },
  { name: "Sendai", nameJa: "仙台", country: "日本", population: 1090000, taxRevenue: 550000000000, emoji: "🌾" },
  { name: "Chiba", nameJa: "千葉", country: "日本", population: 980000, taxRevenue: 500000000000, emoji: "🏖️" },
  { name: "Kitakyushu", nameJa: "北九州", country: "日本", population: 940000, taxRevenue: 480000000000, emoji: "🏭" },
  { name: "Sakai", nameJa: "堺", country: "日本", population: 830000, taxRevenue: 420000000000, emoji: "🏛️" },
  { name: "Niigata", nameJa: "新潟", country: "日本", population: 800000, taxRevenue: 400000000000, emoji: "🌾" },
  { name: "Hamamatsu", nameJa: "浜松", country: "日本", population: 790000, taxRevenue: 390000000000, emoji: "🎸" },
  { name: "Kumamoto", nameJa: "熊本", country: "日本", population: 740000, taxRevenue: 370000000000, emoji: "🏯" },
  { name: "Okayama", nameJa: "岡山", country: "日本", population: 720000, taxRevenue: 360000000000, emoji: "🍑" },
  { name: "Sagamihara", nameJa: "相模原", country: "日本", population: 720000, taxRevenue: 355000000000, emoji: "🏔️" },
  
  { name: "London", nameJa: "ロンドン", country: "イギリス", population: 9000000, taxRevenue: 4500000000000, emoji: "🇬🇧" },
  { name: "Paris", nameJa: "パリ", country: "フランス", population: 2200000, taxRevenue: 1100000000000, emoji: "🇫🇷" },
  { name: "Berlin", nameJa: "ベルリン", country: "ドイツ", population: 3650000, taxRevenue: 1800000000000, emoji: "🇩🇪" },
  { name: "Madrid", nameJa: "マドリード", country: "スペイン", population: 3300000, taxRevenue: 1600000000000, emoji: "🇪🇸" },
  { name: "Rome", nameJa: "ローマ", country: "イタリア", population: 2870000, taxRevenue: 1400000000000, emoji: "🇮🇹" },
  { name: "Amsterdam", nameJa: "アムステルダム", country: "オランダ", population: 870000, taxRevenue: 430000000000, emoji: "🇳🇱" },
  { name: "Vienna", nameJa: "ウィーン", country: "オーストリア", population: 1900000, taxRevenue: 950000000000, emoji: "🇦🇹" },
  { name: "Stockholm", nameJa: "ストックホルム", country: "スウェーデン", population: 980000, taxRevenue: 490000000000, emoji: "🇸🇪" },
  
  { name: "New York", nameJa: "ニューヨーク", country: "アメリカ", population: 8800000, taxRevenue: 4400000000000, emoji: "🇺🇸" },
  { name: "Los Angeles", nameJa: "ロサンゼルス", country: "アメリカ", population: 4000000, taxRevenue: 2000000000000, emoji: "🎬" },
  { name: "Chicago", nameJa: "シカゴ", country: "アメリカ", population: 2700000, taxRevenue: 1350000000000, emoji: "🌆" },
  { name: "Houston", nameJa: "ヒューストン", country: "アメリカ", population: 2300000, taxRevenue: 1150000000000, emoji: "🚀" },
  { name: "San Francisco", nameJa: "サンフランシスコ", country: "アメリカ", population: 880000, taxRevenue: 440000000000, emoji: "🌉" },
  
  { name: "Shanghai", nameJa: "上海", country: "中国", population: 24000000, taxRevenue: 12000000000000, emoji: "🇨🇳" },
  { name: "Beijing", nameJa: "北京", country: "中国", population: 21500000, taxRevenue: 10750000000000, emoji: "🏮" },
  { name: "Seoul", nameJa: "ソウル", country: "韓国", population: 9700000, taxRevenue: 4850000000000, emoji: "🇰🇷" },
  { name: "Singapore", nameJa: "シンガポール", country: "シンガポール", population: 5700000, taxRevenue: 2850000000000, emoji: "🇸🇬" },
  { name: "Hong Kong", nameJa: "香港", country: "中国", population: 7500000, taxRevenue: 3750000000000, emoji: "🇭🇰" },
  { name: "Bangkok", nameJa: "バンコク", country: "タイ", population: 10500000, taxRevenue: 5250000000000, emoji: "🇹🇭" },
  { name: "Dubai", nameJa: "ドバイ", country: "UAE", population: 3400000, taxRevenue: 1700000000000, emoji: "🇦🇪" },
  
  { name: "Sydney", nameJa: "シドニー", country: "オーストラリア", population: 5300000, taxRevenue: 2650000000000, emoji: "🇦🇺" },
  { name: "Melbourne", nameJa: "メルボルン", country: "オーストラリア", population: 5100000, taxRevenue: 2550000000000, emoji: "🏏" },
];

export function findClosestCityByPopulation(population: number): ReferenceCity | null {
  if (REFERENCE_CITIES.length === 0) return null;
  
  return REFERENCE_CITIES.reduce((closest, city) => {
    const currentDiff = Math.abs(city.population - population);
    const closestDiff = Math.abs(closest.population - population);
    return currentDiff < closestDiff ? city : closest;
  });
}

export function findClosestCityByTaxRevenue(taxRevenue: number): ReferenceCity | null {
  if (REFERENCE_CITIES.length === 0) return null;
  
  return REFERENCE_CITIES.reduce((closest, city) => {
    const currentDiff = Math.abs(city.taxRevenue - taxRevenue);
    const closestDiff = Math.abs(closest.taxRevenue - taxRevenue);
    return currentDiff < closestDiff ? city : closest;
  });
}
