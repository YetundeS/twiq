import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { 
  compressImages, 
  shouldCompressFile, 
  getCompressionEstimate,
  createPreviewUrl,
  cleanupPreviewUrls
} from '@/utils/imageCompression';

export const useFileUpload = (options = {}) => {
  const {
    maxFiles = 5,
    maxFileSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    autoCompress = true,
    compressionOptions = {}
  } = options;

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Validate a single file
  const validateFile = useCallback((file) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }

    // Check file size
    if (file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / 1024 / 1024).toFixed(1);
      return `File size exceeds ${maxSizeMB}MB limit`;
    }

    return null; // No error
  }, [allowedTypes, maxFileSize]);

  // Add files with optional compression
  const addFiles = useCallback(async (newFiles) => {
    const fileArray = Array.from(newFiles);
    
    // Check if adding these files would exceed the limit
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`, {
        style: { border: "none", color: "red" }
      });
      return;
    }

    // Validate all files first
    const validationErrors = [];
    fileArray.forEach((file, index) => {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(`${file.name}: ${error}`);
      }
    });

    if (validationErrors.length > 0) {
      toast.error('File validation failed', {
        description: validationErrors.join('\n'),
        style: { border: "none", color: "red" }
      });
      return;
    }

    let filesToAdd = fileArray;

    // Compress images if auto-compression is enabled
    if (autoCompress) {
      const imagesToCompress = fileArray.filter(shouldCompressFile);
      
      if (imagesToCompress.length > 0) {
        setIsCompressing(true);
        
        try {
          const compressedImages = await compressImages(
            imagesToCompress,
            compressionOptions,
            (progress) => {
              setCompressionProgress(progress);
            }
          );

          // Replace original images with compressed ones
          filesToAdd = fileArray.map(file => {
            const compressedIndex = imagesToCompress.findIndex(img => img === file);
            return compressedIndex !== -1 ? compressedImages[compressedIndex] : file;
          });

          toast.success(`Compressed ${imagesToCompress.length} image(s)`, {
            style: { border: "none", color: "green" }
          });
        } catch (error) {
          console.error('Compression failed:', error);
          toast.warning('Image compression failed, using original files', {
            style: { border: "none", color: "orange" }
          });
        } finally {
          setIsCompressing(false);
          setCompressionProgress(null);
        }
      }
    }

    // Create preview URLs for image files
    const newPreviewUrls = filesToAdd
      .filter(file => file.type.startsWith('image/'))
      .map(createPreviewUrl);

    // Update state
    setUploadedFiles(prev => [...prev, ...filesToAdd]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

    toast.success(`Added ${filesToAdd.length} file(s)`, {
      style: { border: "none", color: "green" }
    });
  }, [uploadedFiles.length, maxFiles, validateFile, autoCompress, compressionOptions]);

  // Remove a file by index
  const removeFile = useCallback((index) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setPreviewUrls(prev => {
      const newUrls = [...prev];
      const removedUrl = newUrls.splice(index, 1)[0];
      if (removedUrl) {
        cleanupPreviewUrls([removedUrl]);
      }
      return newUrls;
    });

    toast.success('File removed', {
      style: { border: "none", color: "green" }
    });
  }, []);

  // Clear all files
  const clearFiles = useCallback(() => {
    // Cleanup preview URLs
    cleanupPreviewUrls(previewUrls);
    
    setUploadedFiles([]);
    setPreviewUrls([]);
    
    toast.success('All files cleared', {
      style: { border: "none", color: "green" }
    });
  }, [previewUrls]);

  // Get compression estimates for files
  const getCompressionEstimates = useCallback(() => {
    return uploadedFiles.map(file => ({
      file,
      estimate: getCompressionEstimate(file)
    }));
  }, [uploadedFiles]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    cleanupPreviewUrls(previewUrls);
  }, [previewUrls]);

  return {
    // State
    uploadedFiles,
    isCompressing,
    compressionProgress,
    previewUrls,
    
    // Actions
    addFiles,
    removeFile,
    clearFiles,
    cleanup,
    
    // Utilities
    validateFile,
    getCompressionEstimates,
    
    // Info
    canAddMore: uploadedFiles.length < maxFiles,
    remainingSlots: maxFiles - uploadedFiles.length,
  };
};