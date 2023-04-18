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
import styles from "./category.module.css";

type CategoryProps = {
  catNum: number;
};

export const Category = ({ catNum }: CategoryProps): JSX.Element => {
  const category = useRecoilValue(categoryAtom);
  const color = category[catNum].color;
  const style = { fill: color };
  switch (catNum) {
    case 0:
      return (
        <>
          <Unselected style={style} className={styles.icon} />
          <span className={styles.name}>{category[catNum].name}</span>
        </>
      );
    case 1:
      return (
        <>
          <Food style={style} className={styles.icon} />
          <span className={styles.name}>{category[catNum].name}</span>
        </>
      );
    case 2:
      return (
        <>
          <EatingOut style={style} className={styles.icon} />
          <span className={styles.name}>{category[catNum].name}</span>
        </>
      );
    case 3:
      return (
        <>
          <Lifework style={style} className={styles.icon} />
          <span className={styles.name}>{category[catNum].name}</span>
        </>
      );
    case 4:
      return (
        <>
          <Traffic style={style} className={styles.icon} />
          <span className={styles.name}>{category[catNum].name}</span>
        </>
      );
    case 5:
      return (
        <>
          <Medical style={style} className={styles.icon} />
          <span className={styles.name}>{category[catNum].name}</span>
        </>
      );
    case 6:
      return (
        <>
          <Clothing style={style} className={styles.icon} />
          <span className={styles.name}>{category[catNum].name}</span>
        </>
      );
    case 7:
      return (
        <>
          <Hobby style={style} className={styles.icon} />
          <span className={styles.name}>{category[catNum].name}</span>
        </>
      );
    case 8:
      return (
        <>
          <Utility style={style} className={styles.icon} />
          <span className={styles.name}>{category[catNum].name}</span>
        </>
      );
    case 9:
      return (
        <>
          <Connection style={style} className={styles.icon} />
          <span className={styles.name}>{category[catNum].name}</span>
        </>
      );
    default:
      return (
        <>
          <Unselected style={style} className={styles.icon} />
          <span className={styles.name}>{category[catNum].name}</span>
        </>
      );
  }
};
