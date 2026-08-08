export interface Prize {
  id: string;
  title: string;
  category: string;
  value: string;
  description: string;
  voucherCode: string;
  iconName: 'crown' | 'gem' | 'gift' | 'sparkles' | 'award';
  badgeColor: string;
}

export class Prizes {
  static readonly LIST: Prize[] = [
    {
      id: 'prize-1',
      title: 'Grand Gold Coin (24K 1 Gram)',
      category: 'Grand Festival Prize',
      value: '₹8,500',
      description: 'Exclusive 24K Pure Gold Diwali Coin redeemable at Anu Krishna Mall Jewelry Section.',
      voucherCode: 'AKM-GOLD-2026-X91',
      iconName: 'crown',
      badgeColor: 'from-amber-400 to-yellow-600'
    },
    {
      id: 'prize-2',
      title: 'Diamond Jewelry Voucher',
      category: 'Luxury Fashion Privilege',
      value: '₹10,000',
      description: 'Premium voucher valid on fine diamond & gold ornaments at Anu Krishna Mall.',
      voucherCode: 'AKM-DIAMOND-772',
      iconName: 'gem',
      badgeColor: 'from-cyan-400 to-blue-600'
    },
    {
      id: 'prize-3',
      title: 'Designer Silk Saree / Suit Gift',
      category: 'Apparel Privilege',
      value: '₹5,000',
      description: 'Exclusive luxury traditional ethnic attire voucher at AKM Fashion Pavilion.',
      voucherCode: 'AKM-SILK-3048',
      iconName: 'gift',
      badgeColor: 'from-pink-500 to-rose-600'
    },
    {
      id: 'prize-4',
      title: 'Smart Home Appliance Gift Box',
      category: 'Electronics Privilege',
      value: '₹3,500',
      description: 'Complimentary premium home appliance voucher redeemable at AKM Digital Hub.',
      voucherCode: 'AKM-HOME-9912',
      iconName: 'sparkles',
      badgeColor: 'from-purple-400 to-indigo-600'
    },
    {
      id: 'prize-5',
      title: 'Diwali Shopping Cash Voucher',
      category: 'Festive Privilege',
      value: '₹1,500',
      description: 'Instant shopping cash voucher applicable across all Anu Krishna Mall partner stores.',
      voucherCode: 'AKM-CASH-4410',
      iconName: 'award',
      badgeColor: 'from-emerald-400 to-teal-600'
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
