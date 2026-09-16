export interface Prize {
  id: string;
  title: string;
  category: string;
  value: string;
  description: string;
  voucherCode: string;
  iconName: 'crown' | 'gem' | 'gift' | 'sparkles' | 'award';
  badgeColor: string;
  image?: string | null;
  imageUrl?: string | null;
}

export class Prizes {
  static readonly LIST: Prize[] = [
    {
      id: 'prize-ladies-analog-watch',
      title: 'Ladies Analog Watch',
      category: 'Regular Gift',
      value: '₹1,999',
      description: 'Elegant Ladies Analog Wrist Watch with premium dial and strap.',
      voucherCode: 'AKM-LWATCH-100',
      iconName: 'gift',
      badgeColor: 'from-amber-400 to-yellow-600',
      image: '/prizes/ladies-analog-watch.png'
    },
    {
      id: 'prize-gents-analog-watch',
      title: 'Gents Analog Watch',
      category: 'Regular Gift',
      value: '₹1,999',
      description: 'Classic Gents Analog Wrist Watch crafted for timeless elegance.',
      voucherCode: 'AKM-GWATCH-200',
      iconName: 'gift',
      badgeColor: 'from-amber-400 to-yellow-600',
      image: '/prizes/gents-analog-watch.png'
    },
    {
      id: 'prize-airpods',
      title: 'AirPods',
      category: 'Premium Prize',
      value: '₹4,999',
      description: 'High-fidelity true wireless stereo Bluetooth AirPods with charging case.',
      voucherCode: 'AKM-AIRPODS-300',
      iconName: 'sparkles',
      badgeColor: 'from-cyan-400 to-blue-600',
      image: '/prizes/airpods.png'
    },
    {
      id: 'prize-neckband',
      title: 'Neckband',
      category: 'Regular Gift',
      value: '₹1,499',
      description: 'Wireless Bluetooth sports neckband with deep bass and long battery life.',
      voucherCode: 'AKM-NECKBAND-400',
      iconName: 'gift',
      badgeColor: 'from-purple-400 to-indigo-600',
      image: '/prizes/neckband.png'
    },
    {
      id: 'prize-mens-wallet',
      title: "Men's Wallet",
      category: 'Regular Gift',
      value: '₹999',
      description: "Premium handcrafted men's bi-fold leather finish wallet.",
      voucherCode: 'AKM-MWALLET-500',
      iconName: 'gift',
      badgeColor: 'from-amber-400 to-yellow-600',
      image: '/prizes/mens-wallet.png'
    },
    {
      id: 'prize-ladies-wallet',
      title: 'Ladies Wallet',
      category: 'Regular Gift',
      value: '₹999',
      description: 'Chic designer ladies clutch wallet with multi-card organizers.',
      voucherCode: 'AKM-LWALLET-600',
      iconName: 'gift',
      badgeColor: 'from-pink-500 to-rose-600',
      image: '/prizes/ladies-wallet.png'
    },
    {
      id: 'prize-perfume',
      title: 'Perfume',
      category: 'Regular Gift',
      value: '₹1,299',
      description: 'Luxury long-lasting Eau De Parfum artisanal fragrance.',
      voucherCode: 'AKM-PERFUME-700',
      iconName: 'gift',
      badgeColor: 'from-emerald-400 to-teal-600',
      image: '/prizes/perfume.png'
    },
    {
      id: 'prize-belt',
      title: 'Belt',
      category: 'Regular Gift',
      value: '₹899',
      description: 'Classic formal and casual genuine finish adjustable belt.',
      voucherCode: 'AKM-BELT-800',
      iconName: 'gift',
      badgeColor: 'from-amber-400 to-yellow-600',
      image: '/prizes/belt.png'
    },
    {
      id: 'prize-chocolate',
      title: 'Chocolate',
      category: 'Regular Gift',
      value: '₹499',
      description: 'Delicious festive luxury gourmet chocolate celebration pack.',
      voucherCode: 'AKM-CHOC-900',
      iconName: 'gift',
      badgeColor: 'from-purple-400 to-indigo-600',
      image: '/prizes/chocolate.png'
    },
    {
      id: 'prize-teddy',
      title: 'Teddy',
      category: 'Regular Gift',
      value: '₹699',
      description: 'Adorable soft festive plush teddy bear gift.',
      voucherCode: 'AKM-TEDDY-1000',
      iconName: 'gift',
      badgeColor: 'from-rose-400 to-pink-600',
      image: '/prizes/teddy.png'
    }
  ];

  static getRandomPrize(): Prize {
    const index = Math.floor(Math.random() * Prizes.LIST.length);
    return Prizes.LIST[index];
  }

  static getAllPrizes(): Prize[] {
    return [...Prizes.LIST];
  }
}
