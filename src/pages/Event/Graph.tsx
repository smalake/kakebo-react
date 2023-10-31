import { Box, CircularProgress, FormControl, MenuItem, Select, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { PieChart, ResponsiveContainer, Pie, Cell } from "recharts";
import styles from "./Graph.module.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { CategoryIcon } from "../../components/Category";
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryAtom } from "../../recoil/CategoryAtom";
import { eventFlagAtom, eventSelector } from "../../recoil/EventAtom";
import { useNavigate } from "react-router-dom";
import { eventApi } from "../../api/eventApi";
import { db } from "../../db/db";

export const Graph = () => {
  const navigate = useNavigate();
  const graphData = useRecoilValue(eventSelector).graph;
  const total = useRecoilValue(eventSelector).total;
  const category = useRecoilValue(categoryAtom);
  const revision = localStorage.getItem("revision");
  const [eventFlag, setEventFlag] = useRecoilState(eventFlagAtom);
  const [loading, setLoading] = useState(true);
  const date = new Date();
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [yearMonth, setYearMonth] = useState(`${date.getFullYear().toString()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`);

  useEffect(() => {
    const checkRevision = async () => {
      try {
        const res = await eventApi.revision();
        if (res.data.revision !== Number(revision)) {
          const eventData = await eventApi.getAll();
          const revision = await eventApi.revision();
          db.transaction("rw", db.event, () => {
            db.event.clear();
            db.event.bulkAdd(eventData.data.events);
          })
            .then(() => {
              const flag = eventFlag + 1;
              setEventFlag(flag);
              // リビジョンを保存
              localStorage.setItem("revision", revision.data.revision);
            })
            .catch((error) => {
              console.log(error);
              alert("エラーが発生しました");
            });
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    checkRevision();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleChange = (event: any) => {
    if (event.target.value === 1) {
      navigate("/graph-private");
    }
  };

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "330px",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className={styles.container}>
            <Box sx={{ textAlign: "right", marginBottom: "10px" }}>
              <FormControl variant="standard" sx={{ width: "50%", textAlign: "center" }}>
                <Select labelId="select-label" id="select-kakebo" value={0} label="家計簿選択" onChange={handleChange}>
                  <MenuItem value={0}>共有家計簿</MenuItem>
                  <MenuItem value={1}>プライベート家計簿</MenuItem>
                </Select>
              </FormControl>
            </Box>
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
            <div className={styles.total}>
              <p className={styles.totalTitle}>1ヶ月の支出合計</p>
              <p className={styles.totalContents}>{total[yearMonth] ?? 0}円</p>
            </div>
          </div>
          <div className={styles.list}>
            <ul className={styles.eventList}>
              {graphData[yearMonth] ? (
                graphData[yearMonth].map((value, cat) => (
                  <li key={cat} className={value ? styles.listDisplay : styles.listHidden}>
                    <div className={styles.listItem}>
                      <span className={styles.itemName}>
                        <span className={styles.icon}>
                          <CategoryIcon catNum={cat} />
                        </span>
                        {category[cat].name}
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
        </Box>
      )}
    </div>
  );
};
