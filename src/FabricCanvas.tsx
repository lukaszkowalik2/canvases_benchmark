import { Canvas, CanvasEvents, FabricObject, Point, Rect } from "fabric";
import { useEffect, useRef } from "react";

export const FabricCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = new Canvas(canvasRef.current!, {
      width: window.innerWidth,
      height: window.innerHeight,
      renderOnAddRemove: false,
      selection: false,
    });

    function addObjects() {
      const objects: FabricObject[] = [];
      for (let i = 0; i < 5000; i++) {
        const rect = new Rect({
          left: Math.random() * window.innerWidth,
          top: Math.random() * window.innerHeight,
          fill: "blue",
          width: 10,
          height: 10,
          selectable: false,
        });
        objects.push(rect);
      }
      canvas.add(...objects);
      canvas.requestRenderAll();
    }

    for (let z = 0; z < 2; z++) {
      setTimeout(() => addObjects(), z * 1000); // 1000ms delay between each iteration
    }

    const handleWheel = (opt: CanvasEvents["mouse:wheel"]) => {
      const { e } = opt;
      const delta = e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint(new Point(e.offsetX, e.offsetY), zoom);
      canvas.requestRenderAll();
    };

    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    function handleMouseDown(opt: CanvasEvents["mouse:down"]) {
      const evt = opt.e as MouseEvent;
      isDragging = true;
      canvas.selection = false;
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
    }

    function handleMouseMove(opt: CanvasEvents["mouse:move"]) {
      if (isDragging) {
        const e = opt.e as MouseEvent;
        const vpt = canvas.viewportTransform!;
        vpt[4] += e.clientX - lastPosX;
        vpt[5] += e.clientY - lastPosY;
        canvas.requestRenderAll();
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      }
    }

    function handleMouseUp() {
      canvas.setViewportTransform(canvas.viewportTransform);
      isDragging = false;
      canvas.selection = true;
    }

    const canvasEvents = {
      "mouse:down": handleMouseDown,
      "mouse:move": handleMouseMove,
      "mouse:up": handleMouseUp,
      "mouse:wheel": handleWheel,
    };
    canvas.on(canvasEvents);

    return () => {
      canvas.off(canvasEvents);
      canvas.dispose();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};
