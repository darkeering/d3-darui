import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import SiderMenu from "./components/SiderMenu";
import SimpleBar from "./components/SimpleBar";
import SimpleLine from './components/SimpleLine';
import SimpleLineii from "./components/SimpleLineii";
import GroupBar from "./components/GroupBar";
import ChinaMap from "./components/ChinaMap";

function App() {
  return (
    <div style={{ height: "100%", display: "flex" }}>
      <div>
        <SiderMenu></SiderMenu>
      </div>
      <div style={{width: '90%'}}>
        <Routes>
          <Route path="/" element={<SimpleBar></SimpleBar>}></Route>
          <Route path="/SimpleLine" element={<SimpleLine></SimpleLine>}></Route>
          <Route path="/SimpleLineii" element={<SimpleLineii></SimpleLineii>}></Route>
          <Route path="/GroupBar" element={<GroupBar></GroupBar>}></Route>
          <Route path="/ChinaMap" element={<ChinaMap></ChinaMap>}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
