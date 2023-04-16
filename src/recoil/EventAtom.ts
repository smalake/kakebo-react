import { atom } from "recoil";

interface Transaction {
  id: number;
  amount: number;
  category: number;
  storeName: string;
}

interface Events {
  [date: string]: Transaction[];
}

export const eventAtom = atom<Events>({
  key: "Event",
  default: {},
});
