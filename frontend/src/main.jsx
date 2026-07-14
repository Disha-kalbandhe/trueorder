import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import RepairChat from "./pages/RepairChat.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/repair/:id" element={<RepairChat />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
