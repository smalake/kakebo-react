export interface Transaction {
  id: number;
  amount: number;
  category: number;
  storeName: string;
}

export interface Events {
  [date: string]: Transaction[];
}
