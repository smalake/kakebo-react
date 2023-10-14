import Dexie, { Table } from "dexie";

export interface Data {
  date: string;
  data: EventTable[];
}
export interface EventTable {
  id: number;
  date: string;
  amount: number;
  category: number;
  store: string;
}

export class EventDB extends Dexie {
  event!: Table<EventTable>;
  private!: Table<EventTable>;

  constructor() {
    super("eventDB");
    this.version(1).stores({ event: "id, amount, category, store, date", private: "id, amount, category, store, date" });
  }
}

export const db = new EventDB();
