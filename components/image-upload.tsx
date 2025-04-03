"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";

interface ImageUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
}

export default function ImageUpload({ onFileChange, selectedFile }: ImageUploadProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={onFileChange}
      />
      <Button
        variant="bordered"
        radius="sm"
        className="w-full"
        startContent={<Icon icon="mdi:image-plus" className="h-5 w-5" />}
        as="label"
        htmlFor="image-upload"
      >
        {selectedFile ? `${selectedFile.name} 선택됨 ✅` : "이미지 선택"}
      </Button>
    </div>
  );
} 