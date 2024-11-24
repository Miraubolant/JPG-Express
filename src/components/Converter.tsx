import React, { useState, useCallback, useRef } from 'react';
import { FileUploader } from './FileUploader';
import { ImageList } from './ImageList';
import { ConversionProgress } from './ConversionProgress';
import { convertToJpg } from '../utils/imageConverter';

export interface ConvertedImage {
  id: string;
  originalName: string;
  url: string;
  status: 'pending' | 'converting' | 'done' | 'error';
}

export function Converter() {
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStartTime, setConversionStartTime] = useState<number>();
  const abortController = useRef<AbortController | null>(null);
  const activeConversions = useRef<Promise<any>[]>([]);

  const handleFiles = useCallback(async (files: FileList) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    const newImages = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      originalName: file.name.replace(/\.[^/.]+$/, ''),
      url: URL.createObjectURL(file),
      status: 'pending' as const
    }));

    setImages(prev => [...prev, ...newImages]);
    setIsConverting(true);
    setConversionStartTime(Date.now());

    abortController.current = new AbortController();
    activeConversions.current = [];

    try {
      const batchSize = 3;
      for (let i = 0; i < newImages.length; i += batchSize) {
        if (abortController.current?.signal.aborted) {
          break;
        }

        const batch = imageFiles.slice(i, i + batchSize);
        const batchImages = newImages.slice(i, i + batchSize);
        
        batchImages.forEach(image => {
          setImages(prev => 
            prev.map(img => 
              img.id === image.id 
                ? { ...img, status: 'converting' }
                : img
            )
          );
        });

        const batchPromises = batch.map(async (file, index) => {
          const image = batchImages[index];
          try {
            const jpgUrl = await convertToJpg(file, abortController.current?.signal);
            if (!abortController.current?.signal.aborted) {
              setImages(prev => 
                prev.map(img => 
                  img.id === image.id 
                    ? { ...img, url: jpgUrl, status: 'done' }
                    : img
                )
              );
            }
          } catch (error) {
            if ((error as Error).message === 'Conversion cancelled') {
              setImages(prev => 
                prev.map(img => 
                  img.id === image.id 
                    ? { ...img, status: 'pending' }
                    : img
                )
              );
              return;
            }
            setImages(prev => 
              prev.map(img => 
                img.id === image.id 
                  ? { ...img, status: 'error' }
                  : img
              )
            );
          }
        });

        activeConversions.current.push(...batchPromises);
        await Promise.all(batchPromises);
      }
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      if (!abortController.current?.signal.aborted) {
        setIsConverting(false);
        setConversionStartTime(undefined);
      }
      abortController.current = null;
      activeConversions.current = [];
    }
  }, []);

  const handleClear = useCallback(() => {
    images.forEach(image => URL.revokeObjectURL(image.url));
    setImages([]);
    setConversionStartTime(undefined);
  }, [images]);

  const handleCancel = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      Promise.all(activeConversions.current).finally(() => {
        setIsConverting(false);
        setConversionStartTime(undefined);
        abortController.current = null;
        activeConversions.current = [];
      });
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FileUploader onFiles={handleFiles} disabled={isConverting} />
      <ConversionProgress 
        total={images.length} 
        converted={images.filter(img => img.status === 'done').length}
        isConverting={isConverting}
        startTime={conversionStartTime}
      />
      <ImageList 
        images={images} 
        onClear={handleClear}
        onCancel={handleCancel}
        isConverting={isConverting}
      />
    </div>
  );
}