import { useEffect, useRef } from 'react';

const CanvasArea = ({ canvasRef, onCanvasInit }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && onCanvasInit) {
      onCanvasInit();
    }
  }, [canvasRef, onCanvasInit]);

  return (
    <div className="flex-1 bg-gray-100 overflow-auto">
      <div className="flex items-center justify-center min-h-full p-8">
        <div 
          ref={containerRef}
          className="bg-white shadow-2xl rounded-lg p-4"
        >
          <canvas 
            ref={canvasRef} 
            id="canvas"
            className="border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasArea;
