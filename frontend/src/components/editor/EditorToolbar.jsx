import { 
  Type, 
  Image, 
  Square, 
  Circle, 
  Triangle, 
  Minus,
  Trash2, 
  Copy, 
  Layers, 
  RotateCw,
  Download,
  Save
} from 'lucide-react';

const EditorToolbar = ({ 
  onAddText, 
  onAddShape, 
  onImageUpload, 
  onDelete, 
  onDuplicate,
  onBringToFront,
  onSendToBack,
  onClear,
  onSave,
  onExport,
  hasActiveObject 
}) => {
  const tools = [
    { 
      icon: Type, 
      label: 'Add Text', 
      action: onAddText, 
      color: 'blue' 
    },
    { 
      icon: Image, 
      label: 'Add Image', 
      action: () => document.getElementById('image-upload').click(), 
      color: 'green' 
    },
  ];

  const shapes = [
    { icon: Square, type: 'rectangle', label: 'Rectangle' },
    { icon: Circle, type: 'circle', label: 'Circle' },
    { icon: Triangle, type: 'triangle', label: 'Triangle' },
    { icon: Minus, type: 'line', label: 'Line' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left: Main Tools */}
          <div className="flex items-center gap-2">
            {/* Text and Image */}
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <button
                  key={index}
                  onClick={tool.action}
                  className={`flex items-center gap-2 px-4 py-2 bg-${tool.color}-50 hover:bg-${tool.color}-100 text-${tool.color}-700 rounded-lg transition-colors`}
                  title={tool.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">{tool.label}</span>
                </button>
              );
            })}

            {/* Shapes Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
                <Square className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Shapes</span>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 hidden group-hover:block z-10 min-w-[150px]">
                {shapes.map((shape, index) => {
                  const Icon = shape.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => onAddShape(shape.type)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{shape.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </div>

          {/* Middle: Object Controls */}
          {hasActiveObject && (
            <div className="flex items-center gap-2">
              <button
                onClick={onDuplicate}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Duplicate"
              >
                <Copy className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={onBringToFront}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Bring to Front"
              >
                <Layers className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={onSendToBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors rotate-180"
                title="Send to Back"
              >
                <Layers className="w-5 h-5 text-gray-700" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={onDelete}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
            >
              Clear All
            </button>
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Save Design</span>
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
