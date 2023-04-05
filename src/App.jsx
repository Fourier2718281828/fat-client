import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Auth } from "./Components/Auth";
import { Table } from "./Components/Table";

export const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Table/>}
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
