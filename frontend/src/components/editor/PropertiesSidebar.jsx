import { useState, useEffect } from 'react';
import { Palette, Type as TypeIcon, Maximize2 } from 'lucide-react';

const PropertiesSidebar = ({ activeObject, onUpdate }) => {
  const [properties, setProperties] = useState({
    fill: '#000000',
    stroke: '#000000',
    strokeWidth: 1,
    opacity: 1,
    fontSize: 40,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
  });

  useEffect(() => {
    if (activeObject) {
      setProperties({
        fill: activeObject.fill || '#000000',
        stroke: activeObject.stroke || '#000000',
        strokeWidth: activeObject.strokeWidth || 1,
        opacity: activeObject.opacity || 1,
        fontSize: activeObject.fontSize || 40,
        fontFamily: activeObject.fontFamily || 'Arial',
        fontWeight: activeObject.fontWeight || 'normal',
        fontStyle: activeObject.fontStyle || 'normal',
        textAlign: activeObject.textAlign || 'left',
      });
    }
  }, [activeObject]);

  const handleChange = (property, value) => {
    setProperties((prev) => ({ ...prev, [property]: value }));
    onUpdate(property, value);
  };

  if (!activeObject) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Palette className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">Select an object to edit properties</p>
        </div>
      </div>
    );
  }

  const isText = activeObject.type === 'i-text' || activeObject.type === 'text';

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Properties
        </h3>

        {/* Fill Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fill Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.fill}
              onChange={(e) => handleChange('fill', e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={properties.fill}
              onChange={(e) => handleChange('fill', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Stroke Color */}
        {activeObject.type !== 'i-text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stroke Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={properties.stroke}
                onChange={(e) => handleChange('stroke', e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={properties.stroke}
                onChange={(e) => handleChange('stroke', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        )}

        {/* Stroke Width */}
        {activeObject.type !== 'i-text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stroke Width: {properties.strokeWidth}px
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={properties.strokeWidth}
              onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* Opacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opacity: {Math.round(properties.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={properties.opacity}
            onChange={(e) => handleChange('opacity', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Text Properties */}
        {isText && (
          <>
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TypeIcon className="w-4 h-4" />
                Text Properties
              </h4>

              {/* Font Size */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size: {properties.fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={properties.fontSize}
                  onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Font Family */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select
                  value={properties.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Impact">Impact</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                </select>
              </div>

              {/* Font Weight */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
                <select
                  value={properties.fontWeight}
                  onChange={(e) => handleChange('fontWeight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </div>

              {/* Font Style */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                <select
                  value={properties.fontStyle}
                  onChange={(e) => handleChange('fontStyle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </div>

              {/* Text Align */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Align</label>
                <div className="grid grid-cols-3 gap-2">
                  {['left', 'center', 'right'].map((align) => (
                    <button
                      key={align}
                      onClick={() => handleChange('textAlign', align)}
                      className={`px-3 py-2 border rounded-lg text-sm capitalize ${
                        properties.textAlign === align
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Size & Position */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            Transform
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">X Position</label>
              <input
                type="number"
                value={Math.round(activeObject.left || 0)}
                onChange={(e) => handleChange('left', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Y Position</label>
              <input
                type="number"
                value={Math.round(activeObject.top || 0)}
                onChange={(e) => handleChange('top', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
              <input
                type="number"
                value={Math.round((activeObject.width * activeObject.scaleX) || 0)}
                onChange={(e) => {
                  const newWidth = Number(e.target.value);
                  handleChange('scaleX', newWidth / activeObject.width);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <input
                type="number"
                value={Math.round((activeObject.height * activeObject.scaleY) || 0)}
                onChange={(e) => {
                  const newHeight = Number(e.target.value);
                  handleChange('scaleY', newHeight / activeObject.height);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation: {Math.round(activeObject.angle || 0)}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={activeObject.angle || 0}
                onChange={(e) => handleChange('angle', Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesSidebar;
