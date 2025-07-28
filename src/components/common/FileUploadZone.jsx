import { memo, useCallback, useRef } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';

const FileUploadZone = memo(({ 
  onFilesChange, 
  maxFiles = 5, 
  className = '',
  disabled = false,
  children 
}) => {
  const fileInputRef = useRef(null);
  
  const {
    uploadedFiles,
    isCompressing,
    compressionProgress,
    previewUrls,
    addFiles,
    removeFile,
    clearFiles,
    canAddMore,
    remainingSlots
  } = useFileUpload({
    maxFiles,
    autoCompress: true,
    compressionOptions: {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      quality: 0.85
    }
  });

  // Update parent component when files change
  React.useEffect(() => {
    onFilesChange?.(uploadedFiles);
  }, [uploadedFiles, onFilesChange]);

  const handleFileInput = useCallback((event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  }, [addFiles]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled || !canAddMore) return;
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
  }, [disabled, canAddMore, addFiles]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const triggerFileInput = useCallback(() => {
    if (!disabled && canAddMore) {
      fileInputRef.current?.click();
    }
  }, [disabled, canAddMore]);

  if (children) {
    // Render custom children with upload functionality
    return (
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.doc,.docx"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={disabled || !canAddMore}
        />
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={triggerFileInput}
        >
          {children}
        </div>

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <FileList 
            files={uploadedFiles}
            previewUrls={previewUrls}
            onRemove={removeFile}
            onClear={clearFiles}
            isCompressing={isCompressing}
            compressionProgress={compressionProgress}
          />
        )}
      </div>
    );
  }

  // Default upload zone UI
  return (
    <div className={`file-upload-zone ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.txt,.doc,.docx"
        onChange={handleFileInput}
        style={{ display: 'none' }}
        disabled={disabled || !canAddMore}
      />
      
      <div
        className={`upload-area ${disabled ? 'disabled' : ''} ${!canAddMore ? 'full' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={triggerFileInput}
      >
        <div className="upload-content">
          {isCompressing ? (
            <div className="compression-status">
              <div className="spinner"></div>
              <p>Compressing images...</p>
              {compressionProgress && (
                <p className="progress-text">
                  {compressionProgress.current}/{compressionProgress.total} - {compressionProgress.fileName}
                </p>
              )}
            </div>
          ) : (
            <>
              <svg 
                className="upload-icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              <p className="upload-text">
                {canAddMore 
                  ? `Drop files here or click to browse (${remainingSlots} slots remaining)`
                  : 'Maximum files reached'
                }
              </p>
              <p className="upload-subtext">
                Supports: Images, PDF, Word docs, Text files (Max 10MB each)
              </p>
            </>
          )}
        </div>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <FileList 
          files={uploadedFiles}
          previewUrls={previewUrls}
          onRemove={removeFile}
          onClear={clearFiles}
          isCompressing={isCompressing}
          compressionProgress={compressionProgress}
        />
      )}
    </div>
  );
});

// File list component
const FileList = memo(({ 
  files, 
  previewUrls, 
  onRemove, 
  onClear, 
  isCompressing, 
  compressionProgress 
}) => {
  return (
    <div className="file-list">
      <div className="file-list-header">
        <h4>Uploaded Files ({files.length})</h4>
        <button 
          onClick={onClear} 
          className="clear-all-btn"
          disabled={isCompressing}
        >
          Clear All
        </button>
      </div>
      
      <div className="file-items">
        {files.map((file, index) => (
          <FileItem
            key={`${file.name}-${index}`}
            file={file}
            index={index}
            previewUrl={file.type.startsWith('image/') ? previewUrls[index] : null}
            onRemove={onRemove}
            disabled={isCompressing}
          />
        ))}
      </div>
    </div>
  );
});

// Individual file item component
const FileItem = memo(({ file, index, previewUrl, onRemove, disabled }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-item">
      {previewUrl && (
        <div className="file-preview">
          <img src={previewUrl} alt={file.name} />
        </div>
      )}
      
      <div className="file-info">
        <p className="file-name" title={file.name}>
          {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
        </p>
        <p className="file-size">{formatFileSize(file.size)}</p>
        <p className="file-type">{file.type}</p>
      </div>
      
      <button
        onClick={() => onRemove(index)}
        className="remove-btn"
        disabled={disabled}
        title="Remove file"
      >
        ×
      </button>
    </div>
  );
});

FileUploadZone.displayName = 'FileUploadZone';
FileList.displayName = 'FileList';
FileItem.displayName = 'FileItem';

export default FileUploadZone;