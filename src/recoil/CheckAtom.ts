import { atom } from "recoil";

export const checkAtom = atom({
  key: "Check",
  default: {
    calendar: 0,
    graph: 0,
    setup: 0,
  },
});
