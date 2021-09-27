import React from "react";
import "./App.css";
import { BoardDraw } from "./components/BoardDraw";

export function App() {
  return (
    <div className="konva-home">
      <h1 className="title-home">
        Konva Component{" "}
        <span role="img" aria-label="Direct Hit">
          🎯
        </span>
      </h1>
      <BoardDraw />
    </div>
  );
}
