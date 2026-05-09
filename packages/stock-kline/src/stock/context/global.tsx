import type { F } from "@block-kit/utils/dist/es/types";
import { createContext, useContext } from "react";

export type GlobalContextType = {
  updateIndex: number;
  forceUpdate: F.Plain;
};

export const GlobalContext = createContext<GlobalContextType>({
  updateIndex: 0,
  forceUpdate: () => void 0,
});

export const useGlobalContext = () => useContext(GlobalContext);
