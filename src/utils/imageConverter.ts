export async function convertToJpg(file: File, signal?: AbortSignal): Promise<string> {
  if (signal?.aborted) {
    throw new Error('Conversion cancelled');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let isAborted = false;

    const cleanup = () => {
      signal?.removeEventListener('abort', handleAbort);
      if (img) {
        img.onload = null;
        img.onerror = null;
      }
    };

    const handleAbort = () => {
      isAborted = true;
      cleanup();
      reject(new Error('Conversion cancelled'));
    };

    signal?.addEventListener('abort', handleAbort);

    const img = new Image();
    reader.onload = (e) => {
      if (isAborted) return;

      img.onload = () => {
        if (isAborted) return;

        const maxWidth = 2048;
        const maxHeight = 2048;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          cleanup();
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        if (isAborted) {
          cleanup();
          return;
        }

        canvas.toBlob(
          (blob) => {
            if (isAborted) {
              cleanup();
              return;
            }
            if (blob) {
              cleanup();
              resolve(URL.createObjectURL(blob));
            } else {
              cleanup();
              reject(new Error('Could not convert image'));
            }
          },
          'image/jpeg',
          0.85
        );
      };

      img.onerror = () => {
        cleanup();
        reject(new Error('Invalid image file'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      cleanup();
      reject(new Error('Could not read file'));
    };

    reader.readAsDataURL(file);
  });
}