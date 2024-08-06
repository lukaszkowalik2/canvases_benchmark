import React, { useState } from "react";
import { KonvaCanvas } from "./KonvaCanvas";
import { FabricCanvas } from "./FabricCanvas";
import { PixiCanvas } from "./PixiCanvas";

const App: React.FC = () => {
  const [selectedCanvas, setSelectedCanvas] = useState<"konva" | "fabric" | "pixi">("konva");

  return (
    <div>
      <div style={{ position: "absolute", zIndex: 10000 }}>
        <button onClick={() => setSelectedCanvas("konva")}>Konva</button>
        <button onClick={() => setSelectedCanvas("fabric")}>Fabric</button>
        <button onClick={() => setSelectedCanvas("pixi")}>PixiJS</button>
      </div>
      <div>
        {selectedCanvas === "konva" && <KonvaCanvas />}
        {selectedCanvas === "fabric" && <FabricCanvas />}
        {selectedCanvas === "pixi" && <PixiCanvas />}
      </div>
    </div>
  );
};

export default App;
