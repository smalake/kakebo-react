import React from "react";
import { Colors, GraphData, TotalData } from "../types";

type GraphContextType = {
  graphData: GraphData;
  colors: Colors;
  total: TotalData;
};

export const GraphDataContext = React.createContext<GraphContextType>({
  graphData: {},
  colors: [],
  total: {},
});
