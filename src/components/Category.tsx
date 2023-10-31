import React from "react";
import { ReactComponent as Unselected } from "../assets/unselected.svg";
import { ReactComponent as Food } from "../assets/food.svg";
import { ReactComponent as EatingOut } from "../assets/eating_out.svg";
import { ReactComponent as Lifework } from "../assets/lifework.svg";
import { ReactComponent as Traffic } from "../assets/traffic.svg";
import { ReactComponent as Medical } from "../assets/medical.svg";
import { ReactComponent as Clothing } from "../assets/clothing.svg";
import { ReactComponent as Hobby } from "../assets/hobby.svg";
import { ReactComponent as Utility } from "../assets/utility.svg";
import { ReactComponent as Connection } from "../assets/connection.svg";
import { useRecoilValue } from "recoil";
import { categoryAtom } from "../recoil/CategoryAtom";

type CategoryProps = {
  catNum: number;
};

// カテゴリー番号を取得
export const CategoryIcon = ({ catNum }: CategoryProps): JSX.Element => {
  const category = useRecoilValue(categoryAtom);
  const color = category[catNum].color;
  const style = { fill: color };
  switch (catNum) {
    case 0:
      return <Food style={style} />;
    case 1:
      return <EatingOut style={style} />;
    case 2:
      return <Lifework style={style} />;
    case 3:
      return <Traffic style={style} />;
    case 4:
      return <Medical style={style} />;
    case 5:
      return <Clothing style={style} />;
    case 6:
      return <Hobby style={style} />;
    case 7:
      return <Utility style={style} />;
    case 8:
      return <Connection style={style} />;
    default:
      return <Unselected style={style} />;
  }
};
