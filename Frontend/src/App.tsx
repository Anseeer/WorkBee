import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { appRoutes } from "./routes";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useEffect } from "react";
import { fetchData } from "./utilities/fetchData";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/common/ErrorFallback";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchData(dispatch);
  }, [dispatch]);

  return (
    <Router>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <Routes>
          {appRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
