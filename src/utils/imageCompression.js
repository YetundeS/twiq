import imageCompression from 'browser-image-compression';

// Default compression options
const DEFAULT_OPTIONS = {
  maxSizeMB: 2, // Maximum file size in MB
  maxWidthOrHeight: 2048, // Maximum width or height
  useWebWorker: true, // Use web worker for better performance
  quality: 0.85, // Image quality (0-1)
  initialQuality: 0.85, // Initial quality
  preserveExif: false, // Remove EXIF data to reduce size
};

/**
 * Compress a single image file
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, options = {}) => {
  try {
    // Skip compression for files that are already small
    if (file.size <= 500 * 1024) { // 500KB
      return file;
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      return file;
    }

    const compressionOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    // Adjust compression based on file size
    if (file.size > 10 * 1024 * 1024) { // > 10MB
      compressionOptions.maxSizeMB = 1;
      compressionOptions.maxWidthOrHeight = 1920;
      compressionOptions.quality = 0.8;
    } else if (file.size > 5 * 1024 * 1024) { // > 5MB
      compressionOptions.maxSizeMB = 1.5;
      compressionOptions.maxWidthOrHeight = 2048;
      compressionOptions.quality = 0.82;
    }

    console.log(`🖼️ Compressing image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    const compressedFile = await imageCompression(file, compressionOptions);
    
    const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
    console.log(
      `✅ Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB (${compressionRatio}% reduction)`
    );

    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original file if compression fails
    return file;
  }
};

/**
 * Compress multiple image files
 * @param {File[]} files - Array of files to compress
 * @param {Object} options - Compression options
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<File[]>} - Array of compressed files
 */
export const compressImages = async (files, options = {}, onProgress = null) => {
  const compressedFiles = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      const compressedFile = await compressImage(file, options);
      compressedFiles.push(compressedFile);
      
      if (onProgress) {
        onProgress({
          current: i + 1,
          total,
          fileName: file.name,
          originalSize: file.size,
          compressedSize: compressedFile.size,
        });
      }
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error);
      compressedFiles.push(file); // Use original file if compression fails
    }
  }

  return compressedFiles;
};

/**
 * Check if a file should be compressed
 * @param {File} file - File to check
 * @returns {boolean} - Whether the file should be compressed
 */
export const shouldCompressFile = (file) => {
  // Only compress images
  if (!file.type.startsWith('image/')) {
    return false;
  }

  // Skip compression for small files
  if (file.size <= 500 * 1024) { // 500KB
    return false;
  }

  // Skip compression for GIFs to preserve animation
  if (file.type === 'image/gif') {
    return false;
  }

  return true;
};

/**
 * Get estimated compression info without actually compressing
 * @param {File} file - File to analyze
 * @returns {Object} - Estimated compression info
 */
export const getCompressionEstimate = (file) => {
  if (!shouldCompressFile(file)) {
    return {
      willCompress: false,
      estimatedSize: file.size,
      estimatedReduction: 0,
    };
  }

  // Rough estimation based on file size and type
  let estimatedReduction = 0.3; // 30% default reduction

  if (file.type === 'image/png') {
    estimatedReduction = 0.5; // PNG usually compresses more
  } else if (file.type === 'image/jpeg') {
    estimatedReduction = 0.2; // JPEG is already compressed
  } else if (file.type === 'image/webp') {
    estimatedReduction = 0.1; // WebP is already efficient
  }

  const estimatedSize = Math.round(file.size * (1 - estimatedReduction));

  return {
    willCompress: true,
    estimatedSize,
    estimatedReduction: Math.round(estimatedReduction * 100),
  };
};

/**
 * Create a preview URL for a file (works with both original and compressed)
 * @param {File} file - File to create preview for
 * @returns {string} - Preview URL
 */
export const createPreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Clean up preview URLs to prevent memory leaks
 * @param {string[]} urls - Array of URLs to revoke
 */
export const cleanupPreviewUrls = (urls) => {
  urls.forEach(url => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
};