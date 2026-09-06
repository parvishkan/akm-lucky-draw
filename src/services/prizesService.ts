import { db, collections } from './firebase';
import { 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { Prize, Prizes } from '../data/prizes';

export interface PrizeDocument extends Prize {
  name: string;
  code: string;
  totalQuantity: number;
  availableQuantity: number;
  quantity: number;
  remainingStock: number;
  enabled: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  priority: number;
  displayOrder: number;
  slotId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export class PrizesService {
  /**
   * Seed default prizes into Firestore if collection is empty
   */
  static async ensureDefaultPrizes(): Promise<PrizeDocument[]> {
    try {
      const snapshot = await getDocs(collection(db, collections.PRIZES));
      if (!snapshot.empty) {
        return snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || data.title || 'Diwali Gift',
            code: data.code || data.voucherCode || `PRZ-${d.id.substring(0, 4).toUpperCase()}`,
            totalQuantity: data.totalQuantity ?? data.quantity ?? 100,
            availableQuantity: data.availableQuantity ?? data.remainingStock ?? 100,
            quantity: data.totalQuantity ?? data.quantity ?? 100,
            remainingStock: data.availableQuantity ?? data.remainingStock ?? 100,
            enabled: data.enabled ?? (data.status === 'ACTIVE'),
            status: data.status || (data.enabled ? 'ACTIVE' : 'INACTIVE'),
            title: data.title || data.name || 'Diwali Gift',
            category: data.category || 'Diwali Privilege',
            value: data.value || '₹5,000',
            description: data.description || 'Festive Diwali Prize',
            voucherCode: data.voucherCode || data.code || 'AKM-VOUCHER',
            iconName: data.iconName || 'gift',
            badgeColor: data.badgeColor || 'from-amber-400 to-yellow-600',
            priority: data.priority || 1,
            displayOrder: data.displayOrder || 1
          } as PrizeDocument;
        });
      }

      // Seed initial default prize catalog into Firestore
      const defaultPrizes = Prizes.getAllPrizes();
      const createdList: PrizeDocument[] = [];

      for (let idx = 0; idx < defaultPrizes.length; idx++) {
        const p = defaultPrizes[idx];
        const docRef = doc(collection(db, collections.PRIZES));
        const payload: Omit<PrizeDocument, 'id'> = {
          ...p,
          name: p.title,
          code: `PRZ-00${idx + 1}`,
          totalQuantity: 100,
          availableQuantity: 100,
          quantity: 100,
          remainingStock: 100,
          enabled: true,
          status: 'ACTIVE',
          priority: idx + 1,
          displayOrder: idx + 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await setDoc(docRef, payload);
        createdList.push({ id: docRef.id, ...payload });
      }

      return createdList;
    } catch (err) {
      console.warn('Firestore ensureDefaultPrizes error:', err);
      return Prizes.getAllPrizes().map((p, idx) => ({
        ...p,
        name: p.title,
        code: `PRZ-00${idx + 1}`,
        totalQuantity: 100,
        availableQuantity: 100,
        quantity: 100,
        remainingStock: 100,
        enabled: true,
        status: 'ACTIVE',
        priority: idx + 1,
        displayOrder: idx + 1
      }));
    }
  }

  /**
   * Get all active prizes from Firestore /prizes
   */
  static async getActivePrizes(): Promise<PrizeDocument[]> {
    return this.ensureDefaultPrizes();
  }

  /**
   * Add a new prize to Firestore /prizes
   */
  static async addPrize(prizeData: Partial<PrizeDocument>): Promise<string> {
    const docRef = doc(collection(db, collections.PRIZES));
    const totalQty = prizeData.totalQuantity ?? prizeData.quantity ?? 50;
    const availQty = prizeData.availableQuantity ?? prizeData.remainingStock ?? totalQty;

    const payload = {
      name: prizeData.title || prizeData.name || 'New Diwali Gift',
      title: prizeData.title || prizeData.name || 'New Diwali Gift',
      code: prizeData.code || `PRZ-${Math.floor(100 + Math.random() * 900)}`,
      category: prizeData.category || 'Festive Gift',
      value: prizeData.value || '₹2,500',
      description: prizeData.description || 'Diwali Lucky Draw Gift',
      voucherCode: prizeData.voucherCode || `AKM-VCH-${Math.floor(1000 + Math.random() * 9000)}`,
      iconName: prizeData.iconName || 'gift',
      badgeColor: prizeData.badgeColor || 'from-amber-400 to-yellow-600',
      totalQuantity: totalQty,
      availableQuantity: availQty,
      quantity: totalQty,
      remainingStock: availQty,
      enabled: prizeData.enabled ?? true,
      status: prizeData.status || 'ACTIVE',
      priority: prizeData.priority || 1,
      displayOrder: prizeData.displayOrder || 1,
      slotId: prizeData.slotId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(docRef, payload);
    return docRef.id;
  }

  /**
   * Update prize details in Firestore
   */
  static async updatePrize(prizeId: string, updates: Partial<PrizeDocument>): Promise<void> {
    const docRef = doc(db, collections.PRIZES, prizeId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Toggle active/inactive status of a prize
   */
  static async toggleStatus(prizeId: string, currentEnabled: boolean): Promise<void> {
    const docRef = doc(db, collections.PRIZES, prizeId);
    await updateDoc(docRef, {
      enabled: !currentEnabled,
      status: !currentEnabled ? 'ACTIVE' : 'INACTIVE',
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Delete prize document from Firestore
   */
  static async deletePrize(prizeId: string): Promise<void> {
    const docRef = doc(db, collections.PRIZES, prizeId);
    await deleteDoc(docRef);
  }
}

export default PrizesService;
