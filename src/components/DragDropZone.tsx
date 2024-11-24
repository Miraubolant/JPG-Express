import React from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface DragDropZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  hasImage: boolean;
  children: React.ReactNode;
}

export function DragDropZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  hasImage,
  children
}: DragDropZoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'border border-dashed rounded-lg p-4 transition-all duration-200',
        isDragging ? 'border-blue-400 bg-blue-50/50' : 'border-gray-200 bg-white',
        hasImage && 'border-green-400/50'
      )}
    >
      {children}
    </div>
  );
}

export function DragDropPlaceholder({ isDragging }: { isDragging: boolean }) {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-3">
        {isDragging ? (
          <ImageIcon className="w-8 h-8 text-blue-500" />
        ) : (
          <Upload className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <p className="text-sm font-medium text-gray-700">
        {isDragging ? 'Déposez ici' : 'Déposez votre image ici'}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        PNG, JPEG, WebP acceptés
      </p>
    </div>
  );
}