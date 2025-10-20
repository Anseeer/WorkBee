import { userRoutes } from "./userRoutes";
import { workerRoutes } from "./workerRoutes";
import { adminRoutes } from "./adminRoutes";
import NotFoundPage from "../components/common/NotFoundPAge";
import { About } from "../pages/user/about";
import { TermsAndConditions } from "../pages/user/terms&conditions";

export const appRoutes = [
  ...userRoutes,
  ...workerRoutes,
  ...adminRoutes,
  { path: "*", element: <NotFoundPage /> },
  { path: "/about", element: <About /> },
  { path: "/terms", element: <TermsAndConditions /> },
];
