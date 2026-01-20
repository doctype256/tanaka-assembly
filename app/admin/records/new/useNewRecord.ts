// app/admin/records/new/useNewRecord.ts
"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createRecord } from '@/app/admin/records/actions';

export function useNewRecord() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
      if (fileInputRef.current) {
        // DataTransferを使ってinputのfilesを同期
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      
      // 🟢 ポイント：ファイルオブジェクトの代わりに、Base64文字列をセットする
      if (previewUrl) {
        formData.set('image', previewUrl); 
      }

      const result = await createRecord(null, formData);
      if (!result.success) throw new Error(result.message);
      
      router.push('/admin/records');
      router.refresh();
    } catch (error) {
      alert('エラー: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    dragActive,
    previewUrl,
    fileInputRef,
    onDrag,
    onDrop,
    onFileChange,
    removeImage,
    handleSubmit,
  };
}