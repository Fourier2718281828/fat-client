import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Auth } from "./Components/Auth";

export const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<div>NachaloRumyn</div>}
        />
        <Route
          path="/auth"
          element={ <Auth/> }
        />
        <Route
          path="/table"
          element={<div>Nachalo</div>}
        />
      </Routes>
    </div>
  );
};
