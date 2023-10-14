export interface EventRegisterForm {
  amount1: number;
  amount2: number;
  category1: number;
  category2: number;
  storeName: string;
  date: Date;
  isPrivate: number;
}

export interface EventEditForm {
  amount: number;
  category: number;
  storeName: string;
  date: Date;
}

// Atom用
export interface OneEvent {
  id: number;
  amount: number;
  category: number;
  store_name: string;
}

export interface Event {
  [date: string]: OneEvent[];
}

export interface Graph {
  [date: string]: number[];
}

export interface Total {
  [date: string]: number;
}

export interface FormatAmount {
  [date: string]: number;
}

export interface Events {
  event: Event;
  graph: Graph;
  total: Total;
}
