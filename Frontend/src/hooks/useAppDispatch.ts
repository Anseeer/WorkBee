import { useDispatch } from "react-redux";
import type { AppDispatch } from "../Store";

export const useAppDispatch = () => useDispatch<AppDispatch>();