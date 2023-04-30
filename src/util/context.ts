import React from "react";
import { Colors, GraphData } from "../types";

type GraphContextType = {
  graphData: GraphData;
  colors: Colors;
};

export const GraphDataContext = React.createContext<GraphContextType>({
  graphData: {},
  colors: [],
});
