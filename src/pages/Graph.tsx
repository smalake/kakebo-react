import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import { PieChart, ResponsiveContainer, Pie, Cell } from "recharts";
import styles from "./Graph.module.css";
import { GraphDataContext } from "../util/context";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Category } from "../components/Category";

export const Graph = () => {
  const { graphData, colors, total } = React.useContext(GraphDataContext);
  const date = new Date();
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [yearMonth, setYearMonth] = useState(`${date.getFullYear().toString()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`);

  // ラベル名
  // const renderCustomizedLabel = ({ name }: any) => {
  //   return name;
  // };

  const handleDown = () => {
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth === 0) {
      newYear--;
      newMonth = 12;
    }
    setYear(newYear);
    setMonth(newMonth);
    setYearMonth(`${newYear.toString()}-${newMonth.toString().padStart(2, "0")}`);
  };

  const handleUp = () => {
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth === 13) {
      newYear++;
      newMonth = 1;
    }
    setYear(newYear);
    setMonth(newMonth);
    setYearMonth(`${newYear.toString()}-${newMonth.toString().padStart(2, "0")}`);
  };

  return (
    <div>
      <div className={styles.container}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <div onClick={handleDown}>
            <KeyboardArrowLeftIcon
              sx={{
                fontSize: "1.5em",
                backgroundColor: "#2c3e50",
                color: "#fff",
                borderRadius: "0.2em",
                padding: "6.4px 10.4px",
                height: "1.1em",
                width: "1.1em",
              }}
            />
          </div>
          <div className={styles.selector}>
            {year}年{month.toString()}月
          </div>
          <div onClick={handleUp}>
            <KeyboardArrowRightIcon
              sx={{
                fontSize: "1.5em",
                backgroundColor: "#2c3e50",
                color: "#fff",
                borderRadius: "0.2em",
                padding: "6.4px 10.4px",
                height: "1.1em",
                width: "1.1em",
              }}
            />
          </div>
        </Box>
        <Stack spacing={3} style={{ width: "100%", height: "250px" }}>
          <ResponsiveContainer>
            {graphData[yearMonth] ? (
              <PieChart>
                <Pie
                  startAngle={90}
                  endAngle={-270}
                  data={graphData[yearMonth]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  nameKey="name"
                  dataKey="value"
                  // label={renderCustomizedLabel}
                  style={{ fontSize: "11px" }}
                >
                  {graphData[yearMonth].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <p className={styles.noData}>データがありません</p>
            )}
          </ResponsiveContainer>
        </Stack>
      </div>
      <div className={styles.total}>
        <p className={styles.totalTitle}>1ヶ月の支出合計</p>
        <p className={styles.totalContents}>{total[yearMonth] ?? 0}円</p>
      </div>
      <div>
        <ul className={styles.eventList}>
          {graphData[yearMonth] ? (
            graphData[yearMonth].map((item, index) => (
              <li key={index} className={item.value ? styles.listDisplay : styles.listHidden}>
                <div className={styles.listItem}>
                  <span className={styles.itemName}>
                    <Category catNum={item.category} />
                  </span>
                  <span className={styles.itemValue}>{item.value}円</span>
                </div>
              </li>
            ))
          ) : (
            <p></p>
          )}
        </ul>
      </div>
    </div>
  );
};
