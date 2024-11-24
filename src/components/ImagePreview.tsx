import React, { useState } from 'react';
import { Download, Pencil, Check, X } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  onDownload: (customFilename?: string) => void;
  filename: string;
}

export function ImagePreview({ imageUrl, onDownload, filename }: ImagePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newFilename, setNewFilename] = useState(filename);

  const handleRename = () => {
    if (isEditing) {
      onDownload(newFilename);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setNewFilename(filename);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative group">
        <img
          src={imageUrl}
          alt="Aperçu"
          className="rounded-lg w-full max-h-[300px] object-contain bg-gray-50"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <button
            onClick={() => onDownload()}
            className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transform hover:scale-105 transition-all duration-200"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-2">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <input
                type="text"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <span className="text-gray-400 text-sm">.jpg</span>
              <button
                onClick={handleRename}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
                title="Enregistrer"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Annuler"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <span className="flex-1 text-sm text-gray-700 px-2 py-1">
                {newFilename}.jpg
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                title="Renommer"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDownload()}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                title="Télécharger"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}