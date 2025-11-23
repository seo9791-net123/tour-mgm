import React, { useRef } from 'react';
import { UploadIcon } from './ui/Icons';

interface ImageUploadProps {
  currentImage: string | undefined;
  onImageChange: (file: File | null, previewUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 요청하신 스팀펑크 나비/기어 스타일의 로고 이미지 URL (입력 폼 기본값)
  const DEFAULT_LOGO = "https://images.unsplash.com/photo-1533230689405-b0f3e69bb37d?w=800&auto=format&fit=crop&q=60";

  // 현재 이미지가 있으면 그것을, 없으면 기본 로고를 표시
  const displayImage = currentImage || DEFAULT_LOGO;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onImageChange(file, objectUrl);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onImageChange(file, objectUrl);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        상품 대표 이미지
      </label>
      
      <div 
        className="relative group cursor-pointer w-full h-64 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-colors overflow-hidden bg-gray-50 shadow-sm"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* 항상 이미지가 꽉 차게 표시됨 (기본 로고 또는 업로드한 이미지) */}
        <img 
          src={displayImage} 
          alt="Representative" 
          className="w-full h-full object-cover"
        />
        
        {/* 호버 시 또는 이미지가 없을 때(기본 로고 상태일 때) 업로드 안내 오버레이 표시 */}
        <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-opacity duration-300 ${currentImage ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100 sm:opacity-60'}`}>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center mb-3 border border-white/30">
            <UploadIcon className="w-6 h-6" />
          </div>
          <p className="text-white font-medium text-lg shadow-sm">
            {currentImage ? "이미지 변경하기" : "이미지 업로드"}
          </p>
          <p className="text-white/80 text-xs mt-1">
            클릭 또는 드래그 앤 드롭
          </p>
        </div>

        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUpload;