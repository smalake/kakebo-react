import Dexie, { Table } from 'dexie';

export interface EventTable {
  id: number;
  date: string;
  amount: number;
  category: number;
  store_name: string;
}

export class EventDB extends Dexie {
  event!: Table<EventTable>;
  private!: Table<EventTable>;

  constructor() {
    super('eventDB');
    this.version(1).stores({ event: 'id, amount, category, store_name, date', private: 'id, amount, category, store_name, date' });
  }
}

export const db = new EventDB();
