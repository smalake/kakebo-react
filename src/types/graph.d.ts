export interface Graph {
  name: string;
  value: number;
  category: number;
}

export interface GraphData {
  [date: string]: Graph[];
}

export type Colors = string[];
