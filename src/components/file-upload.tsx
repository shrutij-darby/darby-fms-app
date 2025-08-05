"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UploadCloud, X, File as FileIcon } from "lucide-react";

export interface FileUploadProps {
  /**
   * Callback function that is called when files are selected
   */
  onFileSelect?: (files: File | File[]) => void;
  
  /**
   * Allow multiple file selection
   */
  multiple?: boolean;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Accepted file types (e.g., ".pdf,.docx" or "image/*")
   */
  accept?: string;
  
  /**
   * Maximum file size in bytes
   */
  maxSize?: number;
  
  /**
   * Custom placeholder text
   */
  placeholder?: string;
}

export function FileUpload({
  onFileSelect,
  multiple = false,
  className,
  accept,
  maxSize,
  placeholder = "Drag & drop files here or click to browse",
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setError(null);
    const newFiles: File[] = [];
    
    // Convert FileList to array and validate
    Array.from(selectedFiles).forEach(file => {
      // Check file size if maxSize is provided
      if (maxSize && file.size > maxSize) {
        setError(`File "${file.name}" exceeds the maximum size of ${formatFileSize(maxSize)}`);
        return;
      }
      
      newFiles.push(file);
    });
    
    if (newFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);
      
      // Call the callback with the selected files
      if (onFileSelect) {
        onFileSelect(multiple ? updatedFiles : updatedFiles[0]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFileChange(droppedFiles);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    
    // Call the callback with the updated files
    if (onFileSelect) {
      if (updatedFiles.length === 0) {
        onFileSelect(multiple ? [] : undefined as unknown as File);
      } else {
        onFileSelect(multiple ? updatedFiles : updatedFiles[0]);
      }
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (files.length === 0) {
      setError("Please select a file");
    } else {
      setError(null);
      // In a real application, you might want to handle the submission here
      console.log("Files ready for submission:", files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("w-[50%]", className)}>
      <Card className={cn(
        "border-2 border-dashed rounded-lg",
        isDragging ? "border-primary bg-muted/50" : "border-muted-foreground/25",
        error && isSubmitted ? "border-destructive" : ""
      )}>
        <CardContent className="p-0">
          <div
            className="flex flex-col items-center justify-center p-6 text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files)}
              multiple={multiple}
              accept={accept}
            />
            
            {files.length === 0 ? (
              <>
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">{placeholder}</p>
                <Button 
                  variant="secondary" 
                  onClick={handleBrowseClick}
                  type="button"
                >
                  Browse Files
                </Button>
              </>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Selected Files</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiles([])}
                    className="h-8 text-xs"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {files.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="h-6 w-6 p-0 rounded-full"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBrowseClick}
                    className="mr-2"
                  >
                    Add More
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {error && isSubmitted && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
      
      <div className="mt-4">
        <Button onClick={handleSubmit} className="w-full flex justify-center items-center">
          Upload {files.length > 0 ? `(${files.length} ${files.length === 1 ? 'file' : 'files'})` : ''}
        </Button>
      </div>
    </div>
  );
}
