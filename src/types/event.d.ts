export interface EventRegisterForm {
  amount1: number;
  amount2: number;
  category1: number;
  category2: number;
  storeName: string;
  date: Date;
}

export interface EventEditForm {
  amount: number;
  category: number;
  storeName: string;
  date: Date;
}

export interface EventID {
  id: number;
}

export interface TotalData {
  [date: string]: number;
}
