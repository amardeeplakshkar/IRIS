"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  aspectRatio?: "auto" | "square" | "video" | "portrait";
  fill?: boolean;
}

export const Img: React.FC<ImageProps> = ({ 
  className, 
  alt, 
  aspectRatio = "auto", 
  fill = false,
  ...props 
}) => {
  return (
    <div className={cn(
      "overflow-hidden rounded-md",
      aspectRatio === "square" && "aspect-square",
      aspectRatio === "video" && "aspect-video",
      aspectRatio === "portrait" && "aspect-[3/4]",
      fill && "h-full w-full",
      className
    )}>
      <img
        className={cn(
          "h-auto w-full object-cover transition-all",
          fill && "h-full w-full"
        )}
        alt={alt || "Image"}
        {...props}
      />
    </div>
  );
};

export default Img;