import { Application, Container, Graphics } from "pixi.js";
import { useEffect, useRef } from "react";

export const PixiCanvas = () => {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      // Create a new application
      const app = new Application();

      // Initialize the application
      await app.init({ resizeTo: window });

      // Append the application canvas to the document body
      canvasWrapperRef.current!.appendChild(app.canvas);

      // Create and add a container to the stage
      const container = new Container();

      app.stage.addChild(container);
      for (let i = 0; i < 150000; i++) {
        const rect = new Graphics().rect(0, 0, 10, 10).fill(0xffff00);
        rect.x = Math.random() * window.innerWidth * 5;
        rect.y = Math.random() * window.innerHeight * 5;
        app.stage.addChild(rect);
      }

      let isDragging = false;
      let lastPosX: number;
      let lastPosY: number;

      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          const newPosX = e.clientX;
          const newPosY = e.clientY;
          const dx = newPosX - lastPosX;
          const dy = newPosY - lastPosY;
          app.stage.x += dx;
          app.stage.y += dy;
          lastPosX = newPosX;
          lastPosY = newPosY;
        }
      };

      const handleMouseDown = (e: MouseEvent) => {
        isDragging = true;
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      };

      const handleMouseUp = () => {
        isDragging = false;
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const scaleBy = 1.05;
        const direction = e.deltaY > 0 ? 1 : -1;
        const newScale = direction > 0 ? app.stage.scale.x * scaleBy : app.stage.scale.x / scaleBy;
        app.stage.scale.set(newScale);
      };

      app.canvas.addEventListener("mousedown", handleMouseDown);
      app.canvas.addEventListener("mouseup", handleMouseUp);
      app.canvas.addEventListener("mousemove", handleMouseMove);
      app.canvas.addEventListener("wheel", handleWheel);

      return () => {
        app.canvas.removeEventListener("mousedown", handleMouseDown);
        app.canvas.removeEventListener("mouseup", handleMouseUp);
        app.canvas.removeEventListener("mousemove", handleMouseMove);
        app.canvas.removeEventListener("wheel", handleWheel);
        app.destroy(true, { children: true, texture: true });
      };
    })();
  }, []);

  return <div ref={canvasWrapperRef} />;
};
