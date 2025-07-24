interface CompressionOptions {
  quality?: number; // 0.1 to 1.0, default 0.85
  convertPngToJpeg?: boolean; // Convert PNG photos to JPEG, default true
  maxFileSize?: number; // Max file size in bytes, will adjust quality if needed
}

export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const { quality = 0.85, convertPngToJpeg = true, maxFileSize } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      try {
        // Set canvas to original image dimensions
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw image at original size
        ctx?.drawImage(img, 0, 0);

        // Determine output format and quality
        let outputFormat = file.type;
        const outputQuality = quality;

        // Convert PNG photos to JPEG for better compression
        if (convertPngToJpeg && file.type === "image/png") {
          // Add white background for PNG to JPEG conversion
          const imageData = ctx?.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          if (imageData) {
            const data = imageData.data;
            // Check if image has transparency (alpha channel)
            let hasTransparency = false;
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] < 255) {
                hasTransparency = true;
                break;
              }
            }

            if (!hasTransparency && ctx) {
              // No transparency, safe to convert to JPEG
              outputFormat = "image/jpeg";
              // Fill background with white
              ctx.globalCompositeOperation = "destination-over";
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.globalCompositeOperation = "source-over";
            }
          }
        }

        // Function to create blob with specific quality
        const createBlob = (targetQuality: number) => {
          return new Promise<Blob>((resolveBlob, rejectBlob) => {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolveBlob(blob);
                } else {
                  rejectBlob(new Error("Failed to create blob"));
                }
              },
              outputFormat,
              outputFormat === "image/jpeg" ? targetQuality : undefined
            );
          });
        };

        // If maxFileSize is specified, adjust quality to meet it
        const processWithQuality = async (
          currentQuality: number
        ): Promise<Blob> => {
          const blob = await createBlob(currentQuality);

          if (maxFileSize && blob.size > maxFileSize && currentQuality > 0.1) {
            // Reduce quality and try again
            const newQuality = Math.max(0.1, currentQuality - 0.1);
            return processWithQuality(newQuality);
          }

          return blob;
        };

        processWithQuality(outputQuality)
          .then((blob) => {
            // Create new file with compressed data
            const compressedFile = new File([blob], file.name, {
              type: outputFormat,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Load image
    img.src = URL.createObjectURL(file);
  });
};

// Convenience function for batch compression
export const compressImages = async (
  files: File[],
  options: CompressionOptions = {}
): Promise<File[]> => {
  const compressionPromises = files.map((file) => compressImage(file, options));
  return Promise.all(compressionPromises);
};

// Preset compression options
export const COMPRESSION_PRESETS = {
  // High quality, moderate compression
  high: { quality: 0.9, convertPngToJpeg: true },

  // Balanced quality and size
  medium: { quality: 0.85, convertPngToJpeg: true },

  // Smaller files, acceptable quality
  web: { quality: 0.75, convertPngToJpeg: true },

  // Maximum compression while maintaining usability
  compact: { quality: 0.6, convertPngToJpeg: true, maxFileSize: 1024 * 1024 }, // 1MB max
} as const;
