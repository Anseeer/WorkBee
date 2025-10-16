import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { appRoutes } from "./routes";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useEffect } from "react";
import { fetchData } from "./utilities/fetchData";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchData(dispatch);
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {appRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
