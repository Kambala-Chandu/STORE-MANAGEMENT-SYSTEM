import React, { useState, useRef, useId } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Field } from './Input';

export const FileUpload = ({
  label = 'Upload File',
  hint,
  error,
  value,
  onChange,
  accept,
  maxSizeMB = 10,
  className,
  containerClassName,
  id,
}) => {
  const generated = useId();
  const inputId = id || generated;
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  const handleFile = (file) => {
    setFileError('');
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setFileError(`File size must be under ${maxSizeMB}MB.`);
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');
    onChange?.(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setFileName('');
    setFileSize('');
    onChange?.(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Field id={inputId} label={label} hint={hint} error={error || fileError} className={containerClassName}>
      <div className={cn('relative min-w-0', className)}>
        {fileName ? (
          <div className="rounded-xl border border-white/[0.12] bg-[#0b1329]/[0.6] p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary-soft">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-content truncate">{fileName}</p>
                <p className="text-[10px] text-content-subtle mt-0.5">{fileSize}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-content-subtle hover:text-content hover:bg-white/[0.05]"
              title="Remove file"
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
              <Upload className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-content">
              Click to select file or drag &amp; drop
            </p>
            <p className="text-[10px] text-content-subtle">
              {accept ? `Supports: ${accept}` : `Maximum file size: ${maxSizeMB}MB`}
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={accept}
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </div>
    </Field>
  );
};

export default FileUpload;

