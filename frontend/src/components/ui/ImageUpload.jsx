import React, { useState, useRef, useId } from 'react';
import { Upload, X, Image as ImageIcon, Eye } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Field } from './Input';

export const ImageUpload = ({
  label = 'Product Image',
  hint,
  error,
  value,
  onChange,
  maxSizeMB = 5,
  className,
  containerClassName,
  id,
}) => {
  const generated = useId();
  const inputId = id || generated;
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const [preview, setPreview] = useState(value || '');

  const handleFile = (file) => {
    setFileError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setFileError(`Image size must be under ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      onChange?.(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreview('');
    onChange?.('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Field id={inputId} label={label} hint={hint} error={error || fileError} className={containerClassName}>
      <div className={cn('relative min-w-0', className)}>
        {preview ? (
          <div className="relative group rounded-xl overflow-hidden border border-white/[0.12] bg-[#0b1329]/[0.6] p-2 flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-elevated/50 flex-shrink-0 border border-border">
              <img src={preview} alt="Product Preview" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-content truncate">Image Uploaded</p>
              <p className="text-[10px] text-content-subtle mt-0.5">Ready for catalog display</p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-content-subtle hover:text-danger-soft hover:bg-danger/10 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-base flex flex-col items-center justify-center gap-1.5',
              dragOver
                ? 'border-primary-soft bg-primary/10'
                : 'border-border-strong hover:border-content-subtle bg-elevated/30'
            )}
          >
            <div className="p-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-content-subtle">
              <ImageIcon className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-content">
              Click to upload product image or drag &amp; drop
            </p>
            <p className="text-[10px] text-content-subtle">
              PNG, JPG, WEBP up to {maxSizeMB}MB
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </div>
    </Field>
  );
};

export default ImageUpload;

