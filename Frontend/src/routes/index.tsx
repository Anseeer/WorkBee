import { userRoutes } from "./userRoutes";
import { workerRoutes } from "./workerRoutes";
import { adminRoutes } from "./adminRoutes";
import NotFoundPage from "../components/common/NotFoundPAge";

export const appRoutes = [
  ...userRoutes,
  ...workerRoutes,
  ...adminRoutes,
  { path: "*", element: <NotFoundPage /> },
];
