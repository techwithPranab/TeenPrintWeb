import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import EditorToolbar from '../components/editor/EditorToolbar';
import PropertiesSidebar from '../components/editor/PropertiesSidebar';
import CanvasArea from '../components/editor/CanvasArea';

const DesignEditor = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [designName, setDesignName] = useState('Untitled Design');
  const [isSaving, setIsSaving] = useState(false);

  const {
    canvas,
    activeObject,
    initCanvas,
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
  } = useFabricCanvas(canvasRef);

  const handleCanvasInit = () => {
    initCanvas();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a local URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        addImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDesign = async () => {
    if (!canvas) return;

    try {
      setIsSaving(true);
      const designData = exportToJSON();
      const thumbnail = await exportToImage('png', 0.5);

      // Create a design object
      const design = {
        name: designName,
        productId: productId || null,
        canvasData: designData,
        thumbnail,
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(design),
      });

      if (response.ok) {
        const savedDesign = await response.json();
        alert(`Design "${designName}" saved successfully!`);
        console.log('Saved design:', savedDesign);
      } else {
        throw new Error('Failed to save design');
      }
    } catch (error) {
      console.error('Error saving design:', error);
      alert('Failed to save design. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportImage = async () => {
    if (!canvas) return;

    try {
      const dataURL = await exportToImage('png', 1.0);
      
      // Create a download link
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${designName.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Failed to export image. Please try again.');
    }
  };

  const handleLoadDesign = async (designId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/designs/${designId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const design = await response.json();
        setDesignName(design.name);
        loadFromJSON(design.canvasData);
      } else {
        throw new Error('Failed to load design');
      }
    } catch (error) {
      console.error('Error loading design:', error);
      alert('Failed to load design. Please try again.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back
          </button>
          <div>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="text-xl font-semibold text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded"
              placeholder="Design Name"
            />
            <p className="text-sm text-gray-500 mt-1">
              {productId ? `Product ID: ${productId}` : 'Custom Design'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDesign}
            disabled={isSaving}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Design'}
          </button>
          <button
            onClick={handleExportImage}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Export PNG
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <EditorToolbar
          onAddText={addText}
          onAddShape={addShape}
          onImageUpload={handleImageUpload}
          onDelete={deleteSelected}
          onDuplicate={duplicateSelected}
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
          onClear={clearCanvas}
          onSave={handleSaveDesign}
          onExport={handleExportImage}
          hasActiveObject={!!activeObject}
        />

        {/* Canvas Area */}
        <CanvasArea canvasRef={canvasRef} onCanvasInit={handleCanvasInit} />

        {/* Properties Sidebar */}
        <PropertiesSidebar activeObject={activeObject} onUpdate={updateActiveObject} />
      </div>
    </div>
  );
};

export default DesignEditor;
