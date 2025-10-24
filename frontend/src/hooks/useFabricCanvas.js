import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

export const useFabricCanvas = (canvasRef) => {
  const [canvas, setCanvas] = useState(null);
  const [activeObject, setActiveObject] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    // Disable font loading to prevent issues
    fabricCanvas.skipTargetFind = false;
    fabricCanvas.skipOffscreen = false;

    // Event listeners
    fabricCanvas.on('selection:created', (e) => {
      setActiveObject(e.selected[0]);
    });

    fabricCanvas.on('selection:updated', (e) => {
      setActiveObject(e.selected[0]);
    });

    fabricCanvas.on('selection:cleared', () => {
      setActiveObject(null);
    });

    fabricCanvas.on('object:modified', () => {
      fabricCanvas.renderAll();
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [canvasRef]);

  const addText = (text = 'Double click to edit') => {
    if (!canvas) return;

    try {
      // Ensure text is a string
      const textContent = typeof text === 'string' ? text : 'Double click to edit';

      const textObj = new fabric.IText(textContent, {
        left: canvas.width / 2,
        top: canvas.height / 2,
        fontSize: 40,
        fill: '#000000',
        fontFamily: 'Arial',
        originX: 'center',
        originY: 'center',
      });

      canvas.add(textObj);
      canvas.setActiveObject(textObj);
      canvas.renderAll();
    } catch (error) {
      console.error('Error adding text to canvas:', error);
      // Fallback: try with a simple text object
      try {
        const fallbackText = new fabric.Text('Double click to edit', {
          left: canvas.width / 2,
          top: canvas.height / 2,
          fontSize: 40,
          fill: '#000000',
          fontFamily: 'Arial',
          originX: 'center',
          originY: 'center',
        });
        canvas.add(fallbackText);
        canvas.setActiveObject(fallbackText);
        canvas.renderAll();
      } catch (fallbackError) {
        console.error('Fallback text addition also failed:', fallbackError);
      }
    }
  };

  const addImage = (imageUrl) => {
    if (!canvas) return;

    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
        });

        // Scale image to fit canvas
        const scale = Math.min(
          (canvas.width * 0.5) / img.width,
          (canvas.height * 0.5) / img.height
        );
        img.scale(scale);

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      },
      { crossOrigin: 'anonymous' }
    );
  };

  const addShape = (shapeType) => {
    if (!canvas) return;

    let shape;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    switch (shapeType) {
      case 'rectangle':
        shape = new fabric.Rect({
          left: centerX,
          top: centerY,
          width: 200,
          height: 150,
          fill: '#3b82f6',
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: centerX,
          top: centerY,
          radius: 75,
          fill: '#10b981',
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          left: centerX,
          top: centerY,
          width: 150,
          height: 150,
          fill: '#f59e0b',
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'line':
        shape = new fabric.Line([50, 50, 200, 50], {
          left: centerX,
          top: centerY,
          stroke: '#000000',
          strokeWidth: 3,
          originX: 'center',
          originY: 'center',
        });
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas || !activeObject) return;
    canvas.remove(activeObject);
    canvas.renderAll();
  };

  const duplicateSelected = () => {
    if (!canvas || !activeObject) return;

    activeObject.clone((cloned) => {
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };

  const bringToFront = () => {
    if (!canvas || !activeObject) return;
    canvas.bringToFront(activeObject);
    canvas.renderAll();
  };

  const sendToBack = () => {
    if (!canvas || !activeObject) return;
    canvas.sendToBack(activeObject);
    canvas.renderAll();
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
  };

  const updateActiveObject = (property, value) => {
    if (!canvas || !activeObject) return;

    activeObject.set(property, value);
    canvas.renderAll();
  };

  const exportToJSON = () => {
    if (!canvas) return null;
    return JSON.stringify(canvas.toJSON());
  };

  const loadFromJSON = (jsonData) => {
    if (!canvas) return;

    canvas.loadFromJSON(jsonData, () => {
      canvas.renderAll();
    });
  };

  const exportToImage = (format = 'png', quality = 1) => {
    if (!canvas) return null;

    return canvas.toDataURL({
      format,
      quality,
      multiplier: 2, // Higher resolution
    });
  };

  return {
    canvas,
    activeObject,
    addText,
    addImage,
    addShape,
    deleteSelected,
    duplicateSelected,
    bringToFront,
    sendToBack,
    clearCanvas,
    updateActiveObject,
    exportToJSON,
    loadFromJSON,
    exportToImage,
  };
};
