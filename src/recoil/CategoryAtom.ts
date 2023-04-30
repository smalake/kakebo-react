import { atom } from "recoil";

export const categoryAtom = atom({
  key: "Category",
  default: [
    {
      name: "食費",
      color: "red",
    },
    {
      name: "外食費",
      color: "orange",
    },
    {
      name: "日用品",
      color: "green",
    },
    {
      name: "交通費",
      color: "gray",
    },
    {
      name: "医療費",
      color: "blue",
    },
    {
      name: "衣服",
      color: "pink",
    },
    {
      name: "趣味",
      color: "purple",
    },
    {
      name: "光熱費",
      color: "yellow",
    },
    {
      name: "通信費",
      color: "brown",
    },
    {
      name: "その他",
      color: "black",
    },
  ],
});
