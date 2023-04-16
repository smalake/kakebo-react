import React from "react";

type CategoryProps = {
  catNum: number;
};

export const Category = ({ catNum }: CategoryProps): JSX.Element => {
  switch (catNum) {
    case 1:
      return (
        <>
          <span>icon</span>
          <span>食費</span>
        </>
      );
    case 2:
      return (
        <>
          <span>icon</span>
          <span>外食費</span>
        </>
      );
    case 3:
      return (
        <>
          <span>icon</span>
          <span>日用品</span>
        </>
      );
    case 4:
      return (
        <>
          <span>icon</span>
          <span>交通費</span>
        </>
      );
    case 5:
      return (
        <>
          <span>icon</span>
          <span>医療費</span>
        </>
      );
    case 6:
      return (
        <>
          <span>icon</span>
          <span>衣服</span>
        </>
      );
    case 7:
      return (
        <>
          <span>icon</span>
          <span>趣味</span>
        </>
      );
    case 8:
      return (
        <>
          <span>icon</span>
          <span>光熱費</span>
        </>
      );
    case 9:
      return (
        <>
          <span>icon</span>
          <span>通信費</span>
        </>
      );
    default:
      return (
        <>
          <span>icon</span>
          <span>その他</span>
        </>
      );
  }
};
