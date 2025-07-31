import type { WorkerState } from "../../slice/workerSlice";
import { createDetailsContext } from "./DetailContext";

export const { DetailsProvider: WorkerDetailsProvider, useDetails: useWorkerDetails } =
  createDetailsContext<WorkerState>();
