import type { IWorker } from "../../types/IWorker";
import { createDetailsContext } from "./DetailContext";

export const { DetailsProvider: WorkerDetailsProvider, useDetails: useWorkerDetails } =
  createDetailsContext<IWorker>();
