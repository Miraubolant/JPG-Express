import React, { useState, useCallback } from 'react';
import { Upload, FolderUp, Image } from 'lucide-react';
import { cn } from '../utils/cn';

interface FileUploaderProps {
  onFiles: (files: FileList) => void;
  disabled?: boolean;
}

const ACCEPTED_FORMATS = "image/png, image/jpeg, image/jpg, image/webp, image/gif, image/bmp, image/tiff, image/heic";

export function FileUploader({ onFiles, disabled }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processDirectoryEntry = async (entry: FileSystemEntry): Promise<File[]> => {
    if (!entry.isDirectory) {
      return entry.isFile ? [await new Promise((resolve, reject) => {
        (entry as FileSystemFileEntry).file(resolve, reject);
      })] : [];
    }

    const dirReader = (entry as FileSystemDirectoryEntry).createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
      dirReader.readEntries(resolve, reject);
    });

    const files = await Promise.all(entries.map(processDirectoryEntry));
    return files.flat();
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const items = Array.from(e.dataTransfer.items);
    const files: File[] = [];

    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        const entryFiles = await processDirectoryEntry(entry);
        files.push(...entryFiles);
      }
    }

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const fileList = new DataTransfer();
    imageFiles.forEach(file => fileList.items.add(file));
    
    if (fileList.files.length > 0) {
      onFiles(fileList.files);
    }
  }, [disabled, onFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !disabled) {
      onFiles(e.target.files);
      e.target.value = '';
    }
  }, [disabled, onFiles]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center',
        isDragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700',
        'dark:bg-gray-800/50',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-4">
          <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <FolderUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Déposez vos fichiers ou dossiers ici
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ou
          </p>
          <div className="flex gap-2 justify-center mt-2">
            <label className="relative">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                <Image className="w-4 h-4 mr-2" />
                Une image
              </span>
              <input
                type="file"
                className="sr-only"
                accept={ACCEPTED_FORMATS}
                onChange={handleFileInput}
                disabled={disabled}
              />
            </label>
            <label className="relative">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                <FolderUp className="w-4 h-4 mr-2" />
                Des fichiers
              </span>
              <input
                type="file"
                className="sr-only"
                multiple
                accept={ACCEPTED_FORMATS}
                onChange={handleFileInput}
                disabled={disabled}
                webkitdirectory=""
                directory=""
              />
            </label>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Formats acceptés : PNG, JPEG, WebP, GIF, BMP, TIFF, HEIC
        </p>
      </div>
    </div>
  );
}