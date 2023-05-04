export interface OneEvent {
  id: number;
  amount: number;
  category: number;
  storeName: string;
}

export interface Events {
  [date: string]: OneEvent[];
}
