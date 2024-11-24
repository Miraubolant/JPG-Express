import React from 'react';
import { Download, Trash2, AlertCircle, Package, XCircle } from 'lucide-react';
import type { ConvertedImage } from './Converter';
import JSZip from 'jszip';

interface ImageListProps {
  images: ConvertedImage[];
  onClear: () => void;
  onCancel?: () => void;
  isConverting: boolean;
}

export function ImageList({ images, onClear, onCancel, isConverting }: ImageListProps) {
  if (images.length === 0) return null;

  const handleDownload = (image: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.originalName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const convertedImages = images.filter(img => img.status === 'done');
    const imgFolder = zip.folder('images');
    if (!imgFolder) return;

    const fetchPromises = convertedImages.map(async (image) => {
      try {
        const response = await fetch(image.url);
        const blob = await response.blob();
        imgFolder.file(`${image.originalName}.jpg`, blob);
      } catch (error) {
        console.error(`Error adding ${image.originalName} to zip:`, error);
      }
    });

    await Promise.all(fetchPromises);
    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = 'images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(zipUrl);
  };

  const convertedCount = images.filter(img => img.status === 'done').length;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Images ({images.length})
        </h2>
        <div className="flex gap-2">
          {isConverting && onCancel && (
            <button
              onClick={onCancel}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-900/50 dark:hover:bg-red-900/70"
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              Annuler
            </button>
          )}
          {convertedCount > 0 && (
            <button
              onClick={handleDownloadAll}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/50 dark:hover:bg-blue-900/70"
            >
              <Package className="w-4 h-4 mr-1.5" />
              Tout télécharger
            </button>
          )}
          <button
            onClick={onClear}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-900/50 dark:hover:bg-red-900/70"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Tout effacer
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map(image => (
          <div
            key={image.id}
            className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
          >
            {image.status === 'error' ? (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
            ) : (
              <>
                <img
                  src={image.url}
                  alt={image.originalName}
                  className="w-full h-full object-cover"
                />
                {image.status === 'done' && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDownload(image)}
                      className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Download className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                    </button>
                  </div>
                )}
                {image.status === 'converting' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white dark:border-gray-300 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}