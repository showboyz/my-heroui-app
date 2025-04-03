"use client";

import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ImageUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
}

export default function ImageUpload({ onFileChange, selectedFile }: ImageUploadProps) {
  return (
    <div className="flex flex-col gap-2">
      <Input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        id="image-upload"
      />
      <Button
        as="label"
        htmlFor="image-upload"
        variant="bordered"
        className="w-full h-32 flex flex-col items-center justify-center gap-2 cursor-pointer"
        startContent={<Icon icon="mdi:image-plus" className="h-8 w-8" />}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center gap-1">
            <Icon icon="mdi:check-circle" className="h-6 w-6 text-success" />
            <span className="text-sm">{selectedFile.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm">이미지를 선택하세요</span>
            <span className="text-xs text-default-500">JPG, PNG, GIF (최대 5MB)</span>
          </div>
        )}
      </Button>
    </div>
  );
} 