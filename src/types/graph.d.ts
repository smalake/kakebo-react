export interface Graph {
  name: string;
  value: number;
  category: number;
}

export interface GraphData {
  [date: string]: Graph[];
}

export interface TotalData {
  [date: string]: number;
}

export type Colors = string[];
