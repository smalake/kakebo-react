import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { eventAtom } from "../../recoil/EventAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { eventApi } from "../../api/eventApi";
import { checkAtom } from "../../recoil/CheckAtom";
import { categoryAtom } from "../../recoil/CategoryAtom";
import { Colors, Graph, GraphData, OneEvent, TotalData } from "../../types";
import { GraphDataContext } from "../../util/context";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

export const EventLayout = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useRecoilState(eventAtom);
  const [check, setCheck] = useRecoilState(checkAtom);
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<GraphData>({});
  const [colors, setColors] = useState<Colors>([]);
  const [total, setTotal] = useState<TotalData>({});
  const category = useRecoilValue(categoryAtom);
  var color: string[] = [];
  var template: Graph[] = [];
  var graph: GraphData = {};
  var totalData: TotalData = {};

  // イベント一覧を取得してAtomに保存
  const getEvents = async () => {
    try {
      const res = await eventApi.getAll();
      setEvents(res.data);
      setCheck({
        ...check,
        calendar: 1,
      });

      // カテゴリー名と色を設定
      category.forEach((value, index) => {
        color[index] = value.color;
        template[index] = { name: value.name, value: 0, category: 9 };
      });

      for (var date in res.data) {
        const transactions = res.data[date];
        date = date.slice(0, -3);
        let sum = 0;
        transactions.forEach((transaction: OneEvent) => {
          template[transaction.category].value += transaction.amount;
          template[transaction.category].category = transaction.category;
          sum += transaction.amount;
        });
        graph[date] = template;
        if (totalData[date]) {
          totalData[date] += sum;
        } else {
          totalData[date] = sum;
        }
      }
      setGraphData(graph);
      setColors(color);
      setTotal(totalData);
    } catch (err: any) {
      if (err.status === 401) {
        alert("認証エラー\n再ログインしてください");
        navigate("/login");
      } else {
        alert("登録に失敗しました");
        console.log(err);
      }
    }
  };
  // イベント一覧を取得
  useEffect(() => {
    (async () => {
      await getEvents();
      setLoading(false);
    })();
  }, [loading]);
  return (
    <GraphDataContext.Provider value={{ graphData, colors, total }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "330px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Outlet />
      )}
    </GraphDataContext.Provider>
  );
};
