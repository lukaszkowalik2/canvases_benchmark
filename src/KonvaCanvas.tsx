/* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from "konva";
import { useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";

export const KonvaCanvas = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (layer) {
      const shapes: Konva.Rect[] = [];
      for (let i = 0; i < 50000; i++) {
        const rect = new Konva.Rect({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          width: 10,
          height: 10,
          fill: "red",
        });
        shapes.push(rect);
      }
      layer.add(...shapes);
      layer.batchDraw();
    }
  }, []);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.05;
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition()!.x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition()!.y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition()!.x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition()!.y / newScale) * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} draggable ref={stageRef} onWheel={handleWheel}>
      <Layer ref={layerRef} />
    </Stage>
  );
};
