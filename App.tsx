
import React, { useState, useCallback } from 'react';
import { generatePackageDetails } from './services/geminiService';
import { TourPackageData, AppStatus } from './types';
import ImageUpload from './components/ImageUpload';
import TourPreview from './components/TourPreview';
import { SparklesIcon, UsersIcon, ChevronDownIcon } from './components/ui/Icons';

// Define restricted lists
const DESTINATIONS = [
  "호치민",
  "달랏",
  "나트랑",
  "붕따우",
  "무이네",
  "푸꾸옥"
];

const THEMES = [
  "가족여행",
  "단체여행",
  "골프 투어"
];

const ACCOMMODATION_TYPES = [
  "3성급 호텔",
  "4성급 호텔",
  "5성급 호텔",
  "풀빌라"
];

const App: React.FC = () => {
  // Input State
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [duration, setDuration] = useState(3);
  const [peopleCount, setPeopleCount] = useState(2);
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);

  // App Logic State
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [packageData, setPackageData] = useState<TourPackageData | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !purpose || !accommodation) return;

    setStatus(AppStatus.GENERATING);
    try {
      const data = await generatePackageDetails(destination, duration, purpose, accommodation, peopleCount);
      // Preserve uploaded image if exists
      setPackageData({ ...data, imageUrl: uploadedImage });
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleImageChange = useCallback((file: File | null, previewUrl: string) => {
    setUploadedImage(previewUrl);
    // If we already have data, update its image url immediately for live preview
    if (packageData) {
      setPackageData(prev => prev ? { ...prev, imageUrl: previewUrl } : null);
    }
  }, [packageData]);

  return (
    <div className="min-h-screen bg-gray-100/50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              AI 투어 패키지 빌더
            </h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
             Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">상품 구성하기</h2>
              
              <form onSubmit={handleGenerate} className="space-y-5">
                {/* Destination Input - Select Box */}
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                    여행지
                  </label>
                  <div className="relative">
                    <select
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                      required
                    >
                      <option value="" disabled>여행지를 선택하세요</option>
                      {DESTINATIONS.map((dest) => (
                        <option key={dest} value={dest}>
                          {dest}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <ChevronDownIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Purpose Input (Theme) - Select Box */}
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                    여행 테마
                  </label>
                  <div className="relative">
                    <select
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                      required
                    >
                      <option value="" disabled>테마를 선택하세요</option>
                      {THEMES.map((theme) => (
                        <option key={theme} value={theme}>
                          {theme}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <ChevronDownIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Accommodation Input - Select Box */}
                <div>
                  <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700 mb-1">
                    숙소 등급
                  </label>
                  <div className="relative">
                    <select
                      id="accommodation"
                      value={accommodation}
                      onChange={(e) => setAccommodation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                      required
                    >
                      <option value="" disabled>숙소 등급을 선택하세요</option>
                      {ACCOMMODATION_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <ChevronDownIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Duration & People Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* People Count */}
                  <div>
                    <label htmlFor="peopleCount" className="block text-sm font-medium text-gray-700 mb-1">
                      인원수
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UsersIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="peopleCount"
                        min="1"
                        max="100"
                        value={peopleCount}
                        onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                        className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Duration Display */}
                  <div className="flex flex-col justify-center">
                     <span className="block text-sm font-medium text-gray-700 mb-1">여행 기간</span>
                     <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 font-medium text-center">
                       {duration}박 {duration + 1}일
                     </div>
                  </div>
                </div>

                {/* Duration Slider */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    일정 조절 ({duration}박)
                  </label>
                  <input
                    type="range"
                    id="duration"
                    min="1"
                    max="14"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1박</span>
                    <span>7박</span>
                    <span>14박</span>
                  </div>
                </div>

                {/* Image Upload */}
                <ImageUpload 
                  currentImage={uploadedImage} 
                  onImageChange={handleImageChange} 
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === AppStatus.GENERATING || !destination || !purpose || !accommodation}
                  className={`w-full py-3.5 px-6 rounded-xl text-white font-semibold shadow-md transition-all flex items-center justify-center gap-2
                    ${status === AppStatus.GENERATING 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                >
                  {status === AppStatus.GENERATING ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI가 일정 생성 중...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      AI 일정 생성하기
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Helper Info */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2 text-sm">💡 사용 팁</h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                원하는 베트남 여행지와 여행 테마, 숙소 등급을 선택하세요. AI가 선택하신 조건에 맞춰 최적의 상품가와 일정을 제안합니다.
              </p>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-8">
             {packageData ? (
               <div className="animate-fade-in">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">미리보기</h2>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      생성 완료
                    </span>
                 </div>
                 <TourPreview data={packageData} />
               </div>
             ) : (
               <div className="h-full min-h-[500px] bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 flex flex-col items-center justify-center p-8 text-center">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <SparklesIcon className="w-10 h-10 text-gray-300" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-400 mb-2">
                   아직 생성된 상품이 없습니다
                 </h3>
                 <p className="text-gray-400 max-w-md mx-auto">
                   왼쪽 패널에서 여행 정보를 선택하고 'AI 일정 생성하기' 버튼을 눌러주세요.
                 </p>
               </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;