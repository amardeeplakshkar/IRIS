"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  Loader2,
  AlertCircle,
  Copy,
  File,
  CheckCircle,
} from "lucide-react";

// Types
export interface FileWithPreview {
  id: string;
  file: File;
  preview?: string;
  type: string;
  uploadStatus: "pending" | "uploading" | "complete" | "error";
  uploadProgress?: number;
  textContent?: string;
  error?: string;
}

export interface FileInputProps {
  // File constraints
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  
  // Behavior
  allowMultiple?: boolean;
  allowPaste?: boolean;
  allowDragDrop?: boolean;
  
  // Text handling
  enableTextPreview?: boolean;
  textPreviewLength?: number;
  
  // Callbacks
  onFilesChange?: (files: FileWithPreview[]) => void;
  onError?: (error: string) => void;
  onUploadProgress?: (fileId: string, progress: number) => void;
  
  // Styling
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showFileInfo?: boolean;
  
  // Initial state
  initialFiles?: FileWithPreview[];
  disabled?: boolean;
}

// Constants
const DEFAULT_MAX_FILES = 10;
const DEFAULT_MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const DEFAULT_TEXT_PREVIEW_LENGTH = 150;

// Utility functions
const getFileIcon = (type: string) => {
  if (type.startsWith("image/"))
    return <ImageIcon className="h-5 w-5 text-zinc-400" />;
  if (type.startsWith("video/"))
    return <Video className="h-5 w-5 text-zinc-400" />;
  if (type.startsWith("audio/"))
    return <Music className="h-5 w-5 text-zinc-400" />;
  if (type.includes("zip") || type.includes("rar") || type.includes("tar"))
    return <Archive className="h-5 w-5 text-zinc-400" />;
  return <FileText className="h-5 w-5 text-zinc-400" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

const getFileExtension = (filename: string): string => {
  const extension = filename.split(".").pop()?.toUpperCase() || "FILE";
  return extension.length > 8 ? extension.substring(0, 8) + "..." : extension;
};

// Helper function to check if a file is textual
const isTextualFile = (file: File): boolean => {
  const textualTypes = [
    "text/",
    "application/json",
    "application/xml",
    "application/javascript",
    "application/typescript",
  ];

  const textualExtensions = [
    "txt", "md", "py", "js", "ts", "jsx", "tsx", "html", "htm", "css", "scss", 
    "sass", "json", "xml", "yaml", "yml", "csv", "sql", "sh", "bash", "php", 
    "rb", "go", "java", "c", "cpp", "h", "hpp", "cs", "rs", "swift", "kt", 
    "scala", "r", "vue", "svelte", "astro", "config", "conf", "ini", "toml", 
    "log", "gitignore", "dockerfile", "makefile", "readme", "env", "lock",
  ];

  const isTextualMimeType = textualTypes.some((type) =>
    file.type.toLowerCase().startsWith(type)
  );

  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const isTextualExtension =
    textualExtensions.includes(extension) ||
    file.name.toLowerCase().includes("readme") ||
    file.name.toLowerCase().includes("dockerfile") ||
    file.name.toLowerCase().includes("makefile");

  return isTextualMimeType || isTextualExtension;
};

// Helper function to read file content as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "");
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// File Preview Components
const ImageFilePreview: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
  showFileInfo?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}> = ({ file, onRemove, showFileInfo = true, variant = 'default' }) => {
  const cardSize = variant === 'compact' ? 'size-20' : variant === 'minimal' ? 'size-16' : 'size-[125px]';
  
  return (
    <div className={cn(
      "relative group bg-zinc-700 border border-zinc-600 rounded-lg shadow-md flex-shrink-0 overflow-hidden",
      cardSize,
      "p-0"
    )}>
      <div className={cn("flex items-start gap-3 overflow-hidden", cardSize)}>
        {file.preview ? (
          <div className="relative size-full rounded-md overflow-hidden bg-zinc-600">
            <img
              src={file.preview}
              alt={file.file.name}
              className="w-full h-full object-cover"
            />
            {file.uploadStatus === "uploading" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
            {file.uploadStatus === "complete" && (
              <div className="absolute top-1 left-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
            )}
            {file.uploadStatus === "error" && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
            )}
          </div>
        ) : (
          <div className="size-full bg-zinc-600 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-zinc-400" />
          </div>
        )}
      </div>
      
      {showFileInfo && variant !== 'minimal' && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <p className="text-xs text-white truncate" title={file.file.name}>
            {file.file.name}
          </p>
          <p className="text-[10px] text-zinc-300">
            {formatFileSize(file.file.size)}
          </p>
        </div>
      )}
      
      <Button
        size="icon"
        variant="outline"
        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(file.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const TextFilePreview: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
  showFileInfo?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  textPreviewLength?: number;
}> = ({ file, onRemove, showFileInfo = true, variant = 'default', textPreviewLength = DEFAULT_TEXT_PREVIEW_LENGTH }) => {
  const previewText = file.textContent?.slice(0, textPreviewLength) || "";
  const needsTruncation = (file.textContent?.length || 0) > textPreviewLength;
  const fileExtension = getFileExtension(file.file.name);
  const cardSize = variant === 'compact' ? 'size-20' : variant === 'minimal' ? 'size-16' : 'size-[125px]';

  return (
    <div className={cn(
      "bg-zinc-700 border border-zinc-600 relative rounded-lg shadow-md flex-shrink-0 overflow-hidden",
      cardSize,
      "p-3"
    )}>
      <div className={cn(
        "text-zinc-300 whitespace-pre-wrap break-words overflow-y-auto custom-scrollbar",
        variant === 'compact' ? "text-[6px] max-h-12" : variant === 'minimal' ? "text-[5px] max-h-8" : "text-[8px] max-h-24"
      )}>
        {file.textContent ? (
          <>
            {previewText}
            {needsTruncation && "..."}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      
      <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-[#30302E] from-transparent overflow-hidden">
        {showFileInfo && (
          <p className="capitalize text-white text-xs bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-md">
            {fileExtension}
          </p>
        )}
        
        {file.uploadStatus === "uploading" && (
          <div className="absolute top-2 left-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
          </div>
        )}
        {file.uploadStatus === "complete" && (
          <div className="absolute top-2 left-2">
            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
          </div>
        )}
        {file.uploadStatus === "error" && (
          <div className="absolute top-2 left-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-400" />
          </div>
        )}
        
        <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-0.5 absolute top-2 right-2">
          {file.textContent && variant !== 'minimal' && (
            <Button
              size="icon"
              variant="outline"
              className="size-6"
              onClick={() => navigator.clipboard.writeText(file.textContent || "")}
              title="Copy content"
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            className="size-6"
            onClick={() => onRemove(file.id)}
            title="Remove file"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const GenericFilePreview: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
  showFileInfo?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}> = ({ file, onRemove, showFileInfo = true, variant = 'default' }) => {
  const cardSize = variant === 'compact' ? 'size-20' : variant === 'minimal' ? 'size-16' : 'size-[125px]';
  
  return (
    <div className={cn(
      "relative group bg-zinc-700 border border-zinc-600 rounded-lg shadow-md flex-shrink-0 overflow-hidden",
      cardSize,
      "p-3"
    )}>
      <div className={cn("flex items-start gap-3 overflow-hidden", cardSize)}>
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center justify-center h-full">
            {getFileIcon(file.type)}
          </div>
          
          {showFileInfo && variant !== 'minimal' && (
            <>
              <p className="max-w-[90%] text-xs font-medium text-zinc-100 truncate mt-2" title={file.file.name}>
                {file.file.name}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">
                {formatFileSize(file.file.size)}
              </p>
            </>
          )}
        </div>
      </div>
      
      <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-[#30302E] from-transparent overflow-hidden">
        {showFileInfo && (
          <p className="capitalize text-white text-xs bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-md">
            {file.type.split("/")[1]?.toUpperCase() || "FILE"}
          </p>
        )}
        
        {file.uploadStatus === "uploading" && (
          <div className="absolute top-2 left-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
          </div>
        )}
        {file.uploadStatus === "complete" && (
          <div className="absolute top-2 left-2">
            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
          </div>
        )}
        {file.uploadStatus === "error" && (
          <div className="absolute top-2 left-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-400" />
          </div>
        )}
      </div>
      
      <Button
        size="icon"
        variant="outline"
        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(file.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const FilePreviewCard: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
  showFileInfo?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  textPreviewLength?: number;
}> = ({ file, onRemove, showFileInfo, variant, textPreviewLength }) => {
  const isImage = file.type.startsWith("image/");
  const isTextual = isTextualFile(file.file);

  if (isImage) {
    return (
      <ImageFilePreview
        file={file}
        onRemove={onRemove}
        showFileInfo={showFileInfo}
        variant={variant}
      />
    );
  }

  if (isTextual) {
    return (
      <TextFilePreview
        file={file}
        onRemove={onRemove}
        showFileInfo={showFileInfo}
        variant={variant}
        textPreviewLength={textPreviewLength}
      />
    );
  }

  return (
    <GenericFilePreview
      file={file}
      onRemove={onRemove}
      showFileInfo={showFileInfo}
      variant={variant}
    />
  );
};

// Main FileInput Component
export const FileInput: React.FC<FileInputProps> = ({
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedFileTypes,
  allowMultiple = true,
  allowPaste = true,
  allowDragDrop = true,
  enableTextPreview = true,
  textPreviewLength = DEFAULT_TEXT_PREVIEW_LENGTH,
  onFilesChange,
  onError,
  onUploadProgress,
  className,
  variant = 'default',
  showFileInfo = true,
  initialFiles = [],
  disabled = false,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles || disabled) return;

      const currentFileCount = files.length;
      if (currentFileCount >= maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed. Please remove some files to add new ones.`);
        return;
      }

      const availableSlots = maxFiles - currentFileCount;
      const filesToAdd = Array.from(selectedFiles).slice(0, availableSlots);

      if (selectedFiles.length > availableSlots) {
        onError?.(`You can only add ${availableSlots} more file(s).`);
      }

      const newFiles = filesToAdd
        .filter((file) => {
          if (file.size > maxFileSize) {
            onError?.(`File ${file.name} exceeds size limit of ${formatFileSize(maxFileSize)}.`);
            return false;
          }
          
          if (acceptedFileTypes && acceptedFileTypes.length > 0) {
            const isAccepted = acceptedFileTypes.some(type => {
              if (type.includes('*')) {
                return file.type.startsWith(type.replace('*', ''));
              }
              return file.type === type || file.name.toLowerCase().endsWith(type.toLowerCase());
            });
            
            if (!isAccepted) {
              onError?.(`File ${file.name} is not an accepted file type.`);
              return false;
            }
          }
          
          return true;
        })
        .map((file) => ({
          id: Math.random().toString(),
          file,
          preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
          type: file.type || "application/octet-stream",
          uploadStatus: "pending" as const,
          uploadProgress: 0,
        }));

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);

      // Read textual files if enabled
      if (enableTextPreview) {
        newFiles.forEach((fileToUpload) => {
          if (isTextualFile(fileToUpload.file)) {
            readFileAsText(fileToUpload.file)
              .then((textContent) => {
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === fileToUpload.id ? { ...f, textContent } : f
                  )
                );
              })
              .catch((error) => {
                console.error("Error reading file content:", error);
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === fileToUpload.id
                      ? { ...f, textContent: "Error reading file content", error: error.message }
                      : f
                  )
                );
              });
          }

          // Simulate upload progress
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileToUpload.id ? { ...f, uploadStatus: "uploading" } : f
            )
          );

          // Simulate upload completion
          setTimeout(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileToUpload.id
                  ? { ...f, uploadStatus: "complete", uploadProgress: 100 }
                  : f
              )
            );
          }, 1000);
        });
      }
    },
    [files, maxFiles, maxFileSize, acceptedFileTypes, onFilesChange, onError, enableTextPreview, disabled]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      const updatedFiles = prev.filter((f) => f.id !== id);
      onFilesChange?.(updatedFiles);
      return updatedFiles;
    });
  }, [onFilesChange]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (!allowPaste || disabled) return;
      
      const clipboardData = e.clipboardData;
      const items = clipboardData.items;

      const fileItems = Array.from(items).filter((item) => item.kind === "file");
      if (fileItems.length > 0 && files.length < maxFiles) {
        e.preventDefault();
        const pastedFiles = fileItems.map((item) => item.getAsFile()).filter(Boolean) as File[];
        const dataTransfer = new DataTransfer();
        pastedFiles.forEach((file) => dataTransfer.items.add(file));
        handleFileSelect(dataTransfer.files);
      }
    },
    [allowPaste, handleFileSelect, files.length, maxFiles, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!allowDragDrop || disabled) return;
    e.preventDefault();
    setIsDragging(true);
  }, [allowDragDrop, disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!allowDragDrop || disabled) return;
    e.preventDefault();
    setIsDragging(false);
  }, [allowDragDrop, disabled]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (!allowDragDrop || disabled) return;
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [allowDragDrop, handleFileSelect, disabled]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
    if (event.target) event.target.value = "";
  };

  const dropZoneHeight = variant === 'compact' ? 'h-24' : variant === 'minimal' ? 'h-16' : 'h-32';

  return (
    <div
      className={cn("relative w-full", className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={0}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={acceptedFileTypes?.join(",")}
        multiple={allowMultiple}
        disabled={disabled}
      />

      {/* Drop zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-border hover:border-blue-400 hover:bg-blue-500/5",
          disabled && "opacity-50 cursor-not-allowed",
          dropZoneHeight
        )}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center h-full p-4">
          <Upload className={cn(
            "text-muted-foreground mb-2",
            variant === 'compact' ? "h-6 w-6" : variant === 'minimal' ? "h-4 w-4" : "h-8 w-8"
          )} />
          <p className={cn(
            "text-muted-foreground text-center",
            variant === 'compact' ? "text-sm" : variant === 'minimal' ? "text-xs" : "text-base"
          )}>
            {allowDragDrop ? "Drop files here or click to upload" : "Click to upload files"}
          </p>
          {variant !== 'minimal' && (
            <p className="text-xs text-muted-foreground/70 mt-1">
              Max {maxFiles} files, {formatFileSize(maxFileSize)} each
            </p>
          )}
        </div>

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-lg flex items-center justify-center pointer-events-none"
            >
              <p className="text-blue-600 font-medium">Drop files here</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File previews */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className={cn(
              "flex gap-3 overflow-x-auto pb-2",
              variant === 'compact' ? "gap-2" : variant === 'minimal' ? "gap-1" : "gap-3"
            )}>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <FilePreviewCard
                    file={file}
                    onRemove={removeFile}
                    showFileInfo={showFileInfo}
                    variant={variant}
                    textPreviewLength={textPreviewLength}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

FileInput.displayName = "FileInput";