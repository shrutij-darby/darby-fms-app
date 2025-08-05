"use client";

import * as React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { cn } from "@/lib/utils";
import { X, Image as ImageIcon, Trash2 } from "lucide-react";

export interface ImageUploadProps {
  /**
   * Callback function that is called when images are selected
   */
  onImageSelect?: (images: File | File[]) => void;
  
  /**
   * Allow multiple image selection
   */
  multiple?: boolean;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Maximum file size in bytes (default: 5MB)
   */
  maxSize?: number;
  
  /**
   * Custom placeholder text
   */
  placeholder?: string;

  /**
   * Maximum number of images allowed (only applicable when multiple is true)
   */
  maxImages?: number;

  /**
   * Maximum width for image preview (in pixels)
   */
  previewWidth?: number;

  /**
   * Maximum height for image preview (in pixels)
   */
  previewHeight?: number;
}

export function ImageUpload({
  onImageSelect,
  multiple = false,
  className,
  maxSize = 5 * 1024 * 1024, // 5MB default
  placeholder = "Drag & drop images here or click to browse",
  maxImages = 10,
  previewWidth = 150,
  previewHeight = 150,
}: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to generate image previews
  const generatePreviews = (files: File[]) => {
    return files.map(file => URL.createObjectURL(file));
  };

  const handleImageChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setError(null);
    const newImages: File[] = [];
    
    // Convert FileList to array and validate
    Array.from(selectedFiles).forEach(file => {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError(`File "${file.name}" is not an image`);
        return;
      }
      
      // Check file size
      if (file.size > maxSize) {
        setError(`Image "${file.name}" exceeds the maximum size of ${formatFileSize(maxSize)}`);
        return;
      }
      
      newImages.push(file);
    });
    
    if (newImages.length > 0) {
      // Check if adding these images would exceed the maximum
      if (multiple && (images.length + newImages.length) > maxImages) {
        setError(`You can only upload a maximum of ${maxImages} images`);
        return;
      }

      const updatedImages = multiple ? [...images, ...newImages] : newImages;
      const newPreviews = generatePreviews(newImages);
      
      setImages(updatedImages);
      setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews);
      
      // Call the callback with the selected images
      if (onImageSelect) {
        onImageSelect(multiple ? updatedImages : updatedImages[0]);
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
    handleImageChange(droppedFiles);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    const updatedImages = [...images];
    const updatedPreviews = [...previews];
    
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setImages(updatedImages);
    setPreviews(updatedPreviews);
    
    // Call the callback with the updated images
    if (onImageSelect) {
      if (updatedImages.length === 0) {
        onImageSelect(multiple ? [] : undefined as unknown as File);
      } else {
        onImageSelect(multiple ? updatedImages : updatedImages[0]);
      }
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (images.length === 0) {
      setError("Please select at least one image");
    } else {
      setError(null);
      // In a real application, you might want to handle the submission here
      console.log("Images ready for submission:", images);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

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
              onChange={(e) => handleImageChange(e.target.files)}
              multiple={multiple}
              accept="image/*"
            />
            
            {images.length === 0 ? (
              <>
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">{placeholder}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supported formats: JPEG, PNG, GIF, WebP, etc.
                  <br />
                  Max size: {formatFileSize(maxSize)}
                </p>
                <Button 
                  variant="secondary" 
                  onClick={handleBrowseClick}
                  type="button"
                >
                  Browse Images
                </Button>
              </>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Selected Images</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Clean up object URLs
                      previews.forEach(preview => URL.revokeObjectURL(preview));
                      setImages([]);
                      setPreviews([]);
                    }}
                    className="h-8 text-xs"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2">
                  {previews.map((preview, index) => (
                    <div 
                      key={`${images[index].name}-${index}`}
                      className="relative group"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                        <Image 
                          src={preview} 
                          alt={`Preview ${index + 1}`}
                          className="object-cover w-full h-full transition-all"
                          width={previewWidth}
                          height={previewHeight}
                          style={{ objectFit: 'cover' }}
                          unoptimized // Using unoptimized for blob URLs
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveImage(index)}
                            className="h-8 w-8 rounded-full"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove image</span>
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs truncate mt-1 text-muted-foreground">
                        {images[index].name.length > 20 
                          ? `${images[index].name.substring(0, 20)}...` 
                          : images[index].name}
                      </p>
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
          Upload {images.length > 0 ? `(${images.length} ${images.length === 1 ? 'image' : 'images'})` : ''}
        </Button>
      </div>
    </div>
  );
}
