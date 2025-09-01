import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../utils/firebase/config';

interface FirebaseImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
  folder?: string;
}

export const FirebaseImageUpload: React.FC<FirebaseImageUploadProps> = ({
  onImageUpload,
  currentImage,
  className = '',
  folder = 'menu-images'
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Sila pilih fail gambar sahaja');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Saiz gambar tidak boleh melebihi 5MB');
      return;
    }

    setUploading(true);
    setProgress(0);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Create unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomId}.${fileExt}`;
      
      // Create storage reference
      const storageRef = ref(storage, `${folder}/${fileName}`);

      // Upload file with progress tracking
      const uploadTask = uploadBytes(storageRef, file);
      
      // Listen for upload progress
      uploadTask.then((snapshot) => {
        setProgress(100);
        
        // Get download URL
        getDownloadURL(storageRef).then((downloadURL) => {
          onImageUpload(downloadURL);
          setUploading(false);
          setProgress(0);
        });
      }).catch((error) => {
        console.error('Upload error:', error);
        throw error;
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal muat naik gambar. Sila cuba lagi.');
      setPreview(currentImage || '');
      setUploading(false);
      setProgress(0);
    }
  };

  const removeImage = () => {
    setPreview('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      <div className="space-y-3">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors"
        >
          {uploading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-2"></div>
                <p className="text-sm text-gray-400 mb-2">Memuat naik...</p>
                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{progress}%</p>
              </div>
            </div>
          ) : preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                <span className="text-white text-sm">Klik untuk tukar gambar</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <span className="material-icons text-4xl text-gray-500 mb-2">add_photo_alternate</span>
                <p className="text-sm text-gray-400">Klik untuk muat naik gambar</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG max 5MB</p>
              </div>
            </div>
          )}
        </div>

        {preview && !uploading && (
          <button
            onClick={removeImage}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-icons text-base">delete</span>
            Buang Gambar
          </button>
        )}
      </div>
    </div>
  );
};
