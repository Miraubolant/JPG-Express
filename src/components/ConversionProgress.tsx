import React from 'react';
import { Clock } from 'lucide-react';

interface ConversionProgressProps {
  total: number;
  converted: number;
  isConverting: boolean;
  startTime?: number;
}

export function ConversionProgress({ total, converted, isConverting, startTime }: ConversionProgressProps) {
  if (total === 0) return null;

  const progress = Math.round((converted / total) * 100);
  
  const getTimeEstimate = () => {
    if (!startTime || converted === 0) return null;
    
    const elapsed = Date.now() - startTime;
    const averageTimePerImage = elapsed / converted;
    const remainingImages = total - converted;
    const estimatedRemainingTime = averageTimePerImage * remainingImages;
    
    if (estimatedRemainingTime < 1000) return 'Moins d\'une seconde';
    if (estimatedRemainingTime < 60000) return `${Math.ceil(estimatedRemainingTime / 1000)} secondes`;
    return `${Math.ceil(estimatedRemainingTime / 60000)} minutes`;
  };

  const timeEstimate = getTimeEstimate();

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isConverting ? 'Conversion en cours...' : 'Conversion terminée'}
          </span>
          {isConverting && timeEstimate && (
            <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              Temps restant estimé : {timeEstimate}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {converted}/{total} images
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}