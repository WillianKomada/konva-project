import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { EllipsesComponent } from "./EllipsesComponent";
import { ImageComponent } from "./ImageComponent";
import { RectComponent } from "./RectComponent";
import "./styles.css";

const options = [
  {
    id: 1,
    value: "area a",
    label: "Area A",
  },
  {
    id: 2,
    value: "area b",
    label: "Area B",
  },
  {
    id: 3,
    value: "area c",
    label: "Area C",
  },
  {
    id: 4,
    value: "area d",
    label: "Area D",
  },
  {
    id: 5,
    value: "area e",
    label: "Area E",
  },
  {
    id: 6,
    value: "area f",
    label: "Area F",
  },
  {
    id: 7,
    value: "area g",
    label: "Area G",
  },
];

export function BoardDraw() {
  const [rectangles, setRectangles] = useState([]);
  const [ellipses, setEllipses] = useState([]);
  const [selectedId, selectShape] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [, updateState] = useState();
  const [layerScale, setLayerScale] = useState(1);
  const [layerX, setLayerX] = useState(0);
  const [layerY, setLayerY] = useState(0);
  const [area, setArea] = useState("area a");
  const [selectedShape, setSelectedShape] = useState(false);

  const stageEl = useRef();
  const layerEl = useRef();

  function addRectangles() {
    const rect = {
      x: 100,
      y: 100,
      width: 140,
      height: 140,
      fill: Konva.Util.getRandomColor(),
      id: `rect${rectangles.length + 1}`,
      area: area,
    };
    const rects = rectangles.concat([rect]);
    setRectangles(rects);
    const shs = shapes.concat([`rect${rectangles.length + 1}`]);
    setShapes(shs);
  }

  function addEllipses() {
    const ell = {
      x: 100,
      y: 100,
      width: 140,
      height: 140,
      fill: Konva.Util.getRandomColor(),
      id: `ell${ellipses.length + 1}`,
      // id: UUID.v4(),
      area: area,
    };
    const ells = ellipses.concat([ell]);
    setEllipses(ells);
    const shs = shapes.concat([`ell${ellipses.length + 1}`]);
    setShapes(shs);
  }

  const forceUpdate = React.useCallback(() => updateState({}), []);

  document.addEventListener("keydown", (ev) => {
    if (ev.code === "Delete") {
      let index = ellipses.findIndex((c) => c.id === selectedId);
      if (index !== -1) {
        ellipses.splice(index, 1);
        setEllipses(ellipses);
      }

      index = rectangles.findIndex((r) => r.id === selectedId);
      if (index !== -1) {
        rectangles.splice(index, 1);
        setRectangles(rectangles);
      }
      forceUpdate();
    }
  });

  function handleWheel(e) {
    e.evt.preventDefault();

    const scaleBy = 1.2;
    const stage = stageEl.current;
    const layer = layerEl.current;
    const oldScaleLayer = layer.scaleX();

    const mousePointToLayer = {
      x:
        stage.getPointerPosition().x / oldScaleLayer -
        layer.x() / oldScaleLayer,
      y:
        stage.getPointerPosition().y / oldScaleLayer -
        layer.y() / oldScaleLayer,
    };

    const newScale =
      e.evt.deltaY > 0
        ? oldScaleLayer > 5
          ? oldScaleLayer
          : oldScaleLayer * scaleBy
        : oldScaleLayer < 0.4
        ? oldScaleLayer
        : oldScaleLayer / scaleBy;

    setLayerScale(newScale);
    setLayerX(
      -(mousePointToLayer.x - stage.getPointerPosition().x / newScale) *
        newScale
    );
    setLayerY(
      -(mousePointToLayer.y - stage.getPointerPosition().y / newScale) *
        newScale
    );
  }

  useEffect(() => {
    const localRectData = localStorage.getItem("rectangles");
    if (localRectData) {
      setRectangles(JSON.parse(localRectData));
    }
    const localEllData = localStorage.getItem("ellipses");
    if (localEllData) {
      setEllipses(JSON.parse(localEllData));
    }
  }, []);

  function saveShapes() {
    localStorage.setItem("rectangles", JSON.stringify(rectangles));
    localStorage.setItem("ellipses", JSON.stringify(ellipses));
  }

  return (
    <div className="initial-css">
      <div className="home-page">
        <div className="select-content-area">
          <span className="text-span">Selecione antes de criar uma área:</span>
          <select
            className="containerOption"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            {options.map((option, i) => (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="button-container">
          <button onClick={addRectangles} className="button-content">
            <span role="img" aria-label="Square">
              ⬜
            </span>
          </button>
          <button onClick={addEllipses} className="button-content">
            <span role="img" aria-label="Circle">
              ⚪
            </span>
          </button>
          <button onClick={saveShapes} className="button-content">
            Save
          </button>
        </div>

        <Stage
          className="stage-container"
          width={998}
          height={678}
          ref={stageEl}
          onMouseDown={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) {
              selectShape(null);
            }
          }}
          onWheel={handleWheel}
        >
          <Layer
            scaleX={layerScale}
            scaleY={layerScale}
            x={layerX}
            y={layerY}
            draggable
            onDragEnd={() => {
              setLayerX(layerEl.current.x());
              setLayerY(layerEl.current.y());
            }}
            ref={layerEl}
          >
            <ImageComponent />
            {rectangles.map((rect, i) => {
              return (
                <RectComponent
                  key={i}
                  shapeProps={rect}
                  isSelected={rect.id === selectedId}
                  onSelect={() => {
                    selectShape(rect.id);
                    setSelectedShape(true);
                  }}
                  onChange={(newAttrs) => {
                    const rects = rectangles.slice();
                    rects[i] = newAttrs;
                    setRectangles(rects);
                  }}
                />
              );
            })}
            {ellipses.map((ellipse, i) => {
              console.log("Ellipses: ", ellipses);
              return (
                <EllipsesComponent
                  key={i}
                  shapeProps={ellipse}
                  isSelected={ellipse.id === selectedId}
                  onSelect={() => {
                    selectShape(ellipse.id);
                    setSelectedShape(true);
                  }}
                  onChange={(newAttrs) => {
                    const ells = ellipses.slice();
                    ells[i] = newAttrs;
                    setEllipses(ells);
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      <div className="show-properties">
        <span className="title-properties">Propriedades</span>
        {selectedShape
          ? rectangles.map((rect, i) => {
              return rect.id === selectedId ? (
                <div key={i} className="texts-properties">
                  <span className="text-title">Largura</span>
                  <span className="title-description">{rect.width}</span>
                  <span className="text-title">Altura</span>
                  <span className="title-description">{rect.height}</span>
                  <span className="text-title">Posição X</span>
                  <span className="title-description">{rect.x}</span>
                  <span className="text-title">Posição Y</span>
                  <span className="title-description">{rect.y}</span>
                  <span className="text-title">Area</span>
                  <span className="title-description">{rect.area}</span>
                </div>
              ) : null;
            })
          : null}

        {selectedShape
          ? ellipses.map((ell, i) => {
              return ell.id === selectedId ? (
                <div key={i} className="texts-properties">
                  <span className="text-title">Largura</span>
                  <span className="title-description">{ell.width}</span>
                  <span className="text-title">Altura</span>
                  <span className="title-description">{ell.height}</span>
                  <span className="text-title">Posição X</span>
                  <span className="title-description">{ell.x}</span>
                  <span className="text-title">Posição Y</span>
                  <span className="title-description">{ell.y}</span>
                  <span className="text-title">Area</span>
                  <span className="title-description">{ell.area}</span>
                </div>
              ) : null;
            })
          : null}
      </div>
    </div>
  );
}
