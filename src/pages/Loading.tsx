import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventAtom } from "../recoil/EventAtom";
import { useRecoilState } from "recoil";
import { eventApi } from "../api/eventApi";
import { checkAtom } from "../recoil/CheckAtom";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { graphAtom } from "../recoil/GraphAtom";
import { totalAtom } from "../recoil/TotalAtom";

export const Loading = () => {
  const { base } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useRecoilState(eventAtom);
  const [graphs, setGraphs] = useRecoilState(graphAtom);
  const [total, setTotal] = useRecoilState(totalAtom);
  const [check, setCheck] = useRecoilState(checkAtom);
  const [loading, setLoading] = useState(true);

  // 待機するための関数
  const sleep = (waitTime: number) => new Promise((resolve) => setTimeout(resolve, waitTime));

  // イベント一覧を取得してAtomに保存
  const getEvents = async () => {
    try {
      const res = await eventApi.getAll();
      setEvents(res.data.event);
      setTotal(res.data.total);
      setGraphs(res.data.graph);
      setCheck({
        ...check,
        calendar: 1,
      });
    } catch (err: any) {
      if (err.status === 401) {
        alert("認証エラー\n再ログインしてください");
        navigate("/login");
      } else {
        alert("一覧の取得に失敗しました");
        console.log(err);
      }
    }
  };
  // イベント一覧を取得
  useEffect(() => {
    (async () => {
      await getEvents();
      await sleep(1000);
      setLoading(false);
      navigate(`/${base}`);
    })();
  }, []);
  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "330px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}
    </Box>
  );
};
