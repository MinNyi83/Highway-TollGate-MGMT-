// IndexedDB wrapper for offline toll event storage
const DB_NAME = 'tollgate-plaza';
const DB_VERSION = 1;
const STORE_NAME = 'pending-events';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface PendingEvent {
  id?: number;
  type: 'entry' | 'exit';
  plateNumber: string;
  vehicleClass: string;
  plazaId: string;
  timestamp: string;
  amount?: number;
  synced: boolean;
}

export async function savePendingEvent(event: Omit<PendingEvent, 'id' | 'synced'>): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add({ ...event, synced: false });
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getPendingEvents(): Promise<PendingEvent[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getUnsyncedCount(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const events = request.result as PendingEvent[];
      resolve(events.filter(e => !e.synced).length);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function markSynced(ids: number[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  for (const id of ids) {
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const event = getReq.result;
      if (event) {
        event.synced = true;
        store.put(event);
      }
    };
  }
}

export async function clearSynced(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();
  request.onsuccess = () => {
    const events = request.result as PendingEvent[];
    events.filter(e => e.synced).forEach(e => store.delete(e.id!));
  };
}
