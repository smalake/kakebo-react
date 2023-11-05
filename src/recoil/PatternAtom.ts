import { atom, selector } from "recoil";
import { patternApi } from "../api/patternApi";

export const patternAtom = atom({
  key: "PatternAtom",
  default: 0,
});

export const PatternSelector = selector({
  key: "PatternSelector",
  get: async ({ get }) => {
    const flag = get(patternAtom);
    // Linter対応
    if (false) {
      console.log(flag);
    }
    const res = await patternApi.get();
    return res.data;
  },
});
