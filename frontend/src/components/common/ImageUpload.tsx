import React, { useState, useRef } from 'react';
import { Upload, Link, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  required = false,
  className = ''
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Berkas harus berupa gambar.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 5MB.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const url = await api.uploadImage(file);
      onChange(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal mengunggah gambar.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (loading) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Berkas harus berupa gambar.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 5MB.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const url = await api.uploadImage(file);
      onChange(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal mengunggah gambar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {/* Label and Toggles */}
      <div className="flex justify-between items-center mb-0.5">
        {label && (
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-350">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              mode === 'upload'
                ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Upload size={10} />
            Unggah File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              mode === 'url'
                ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Link size={10} />
            URL Gambar
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Preview Panel */}
          {value ? (
            <div className="relative group w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-slate-50 flex-shrink-0 shadow-sm">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="bg-rose-500 text-white rounded-lg px-2 py-1 text-[10px] font-bold hover:bg-rose-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ) : (
            <div className="w-28 h-28 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 flex items-center justify-center text-slate-400 dark:text-slate-600 flex-shrink-0">
              <ImageIcon size={28} />
            </div>
          )}

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 w-full border border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
              loading
                ? 'bg-slate-50/55 border-slate-250 pointer-events-none'
                : 'border-slate-250 dark:border-slate-800/80 hover:bg-primary-50/10 hover:border-primary-400 dark:hover:border-primary-500/20'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
                <span className="text-xs text-slate-500">Mengunggah ke Supabase...</span>
              </div>
            ) : value ? (
              <div className="flex flex-col items-center gap-1.5">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Berhasil Diunggah!</span>
                <span className="text-[10px] text-slate-400">Klik untuk mengganti gambar</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="h-6 w-6 text-slate-400 group-hover:text-primary-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tarik & lepas gambar di sini, atau <span className="text-primary-500">pilih berkas</span>
                </span>
                <span className="text-[10px] text-slate-400">Mendukung JPG, PNG, GIF (Maksimal 5MB)</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* URL Input Mode */
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Contoh: https://images.unsplash.com/..."
            className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 py-2.5 pl-4 pr-4 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none focus:ring-4 transition-all duration-200"
          />
          {value && (
            <div className="mt-1 relative w-full h-32 rounded-xl overflow-hidden border border-slate-150 bg-slate-50">
              <img src={value} alt="Preview URL" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export default ImageUpload;
