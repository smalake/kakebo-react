import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { PieChart, ResponsiveContainer, Pie, Cell } from "recharts";
import styles from "./Graph.module.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Category } from "../components/Category";
import { useNavigate } from "react-router-dom";
import { checkAtom } from "../recoil/CheckAtom";
import { useRecoilValue } from "recoil";
import { graphAtom } from "../recoil/GraphAtom";
import { totalAtom } from "../recoil/TotalAtom";
import { categoryAtom } from "../recoil/CategoryAtom";

export const Graph = () => {
  const navigate = useNavigate();
  const check = useRecoilValue(checkAtom);
  const graphData = useRecoilValue(graphAtom);
  const total = useRecoilValue(totalAtom);
  const category = useRecoilValue(categoryAtom);
  const date = new Date();
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [yearMonth, setYearMonth] = useState(`${date.getFullYear().toString()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`);

  useEffect(() => {
    // イベントを取得しているかチェック
    if (check.calendar === 0) {
      navigate("/loading/graph");
    }
  }, []);

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
                  data={graphData[yearMonth].map((value, cat) => ({
                    name: category[cat]["name"],
                    value: value,
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  nameKey="name"
                  dataKey="value"
                  style={{ fontSize: "11px" }}
                >
                  {graphData[yearMonth].map((entry, cat) => (
                    <Cell key={`cell-${cat}`} fill={category[cat]["color"]} />
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
            graphData[yearMonth].map((value, cat) => (
              <li key={cat} className={value ? styles.listDisplay : styles.listHidden}>
                <div className={styles.listItem}>
                  <span className={styles.itemName}>
                    <Category catNum={cat} />
                  </span>
                  <span className={styles.itemValue}>{value}円</span>
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
