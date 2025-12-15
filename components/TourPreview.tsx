
import React from 'react';
import { TourPackageData } from '../types';
import { 
  CalendarIcon, CheckIcon, MapPinIcon, TagIcon, UsersIcon, 
  SunIcon, MoonIcon, UtensilsIcon, CameraIcon, BedIcon, PlaneIcon 
} from './ui/Icons';

interface TourPreviewProps {
  data: TourPackageData;
}

const TourPreview: React.FC<TourPreviewProps> = ({ data }) => {
  // 미리보기(우측 결과창)에서는 업로드된 이미지가 없을 경우, 일반적인 '여행' 느낌의 이미지를 사용 (종전 방식)
  // 예: 열대 휴양지/바다 이미지
  const DEFAULT_TRAVEL_IMAGE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop";

  const displayImage = data.imageUrl || DEFAULT_TRAVEL_IMAGE;

  // Helper to determine icon and color based on time/activity content
  const getScheduleIcon = (time: string, activity: string) => {
    const t = time.toLowerCase();
    const a = activity.toLowerCase();
    
    // Meals
    if (a.includes('조식') || a.includes('중식') || a.includes('석식') || a.includes('식사') || a.includes('맛집')) {
      return { icon: UtensilsIcon, color: 'bg-green-500', textColor: 'text-green-600' };
    }
    
    // Hotel / Rest
    if (a.includes('호텔') || a.includes('체크인') || a.includes('휴식') || a.includes('취침')) {
      return { icon: BedIcon, color: 'bg-indigo-500', textColor: 'text-indigo-600' };
    }

    // Transport / Airport
    if (a.includes('공항') || a.includes('비행기') || a.includes('샌딩') || a.includes('미팅')) {
      return { icon: PlaneIcon, color: 'bg-gray-500', textColor: 'text-gray-600' };
    }

    // Night Life / Evening
    if (t.includes('저녁') || t.includes('밤') || t.includes('야간') || t.includes('18:') || t.includes('19:') || t.includes('20:') || t.includes('21:') || t.includes('22:') || a.includes('야시장')) {
      return { icon: MoonIcon, color: 'bg-purple-600', textColor: 'text-purple-700' };
    }

    // Morning / Day (Default)
    if (t.includes('오전') || t.includes('아침') || t.includes('07:') || t.includes('08:') || t.includes('09:') || t.includes('10:')) {
      return { icon: SunIcon, color: 'bg-orange-400', textColor: 'text-orange-600' };
    }

    // Sightseeing (Default fallback)
    return { icon: CameraIcon, color: 'bg-blue-500', textColor: 'text-blue-600' };
  };

  const handleKakaoConsultation = async () => {
    // 1. Construct the detailed text document
    const itineraryText = data.itinerary.map(day => {
      const scheduleDetails = day.schedule.map(s => `   - ${s.time}: ${s.activity}`).join('\n');
      return `[Day ${day.day}] ${day.title}\n${scheduleDetails}`;
    }).join('\n\n');

    const message = `
[여행 상품 상담 신청서]

✈️ 상품명: ${data.title}
📍 여행지: ${data.destination}
📅 기간: ${data.duration}박 ${data.duration + 1}일
👥 인원: ${data.peopleCount}명
🏨 숙소 등급: ${data.accommodation || '미지정'}
🚘 차량: ${data.carType || '선택 안함'}
🗣 가이드: ${data.guideType || '선택 안함'}
💰 1인 예상 견적: ${data.price} (항공기 이용료 제외)

✨ 핵심 포인트:
${data.points.map(p => `• ${p}`).join('\n')}

📅 상세 일정표:
${itineraryText}

--------------------------------
위 상품으로 상담을 신청합니다.
`.trim();

    // 2. Copy to clipboard
    try {
      await navigator.clipboard.writeText(message);
      // Alert the user
      alert("상품 상세 정보가 복사되었습니다.\n\n오픈채팅방이 열리면 입력창에 '붙여넣기' 하여 전송해주세요!");
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      alert("상담 연결을 진행합니다.");
    }

    // 3. Open KakaoTalk Open Chat
    window.open('https://open.kakao.com/o/gSfNsh3h', '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header Image Section */}
      <div className="relative h-72 md:h-96 overflow-hidden group">
        <img 
          src={displayImage} 
          alt={data.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 flex gap-2">
           <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
             <UsersIcon className="w-4 h-4 text-blue-600" />
             <span className="text-sm font-bold text-gray-800">{data.peopleCount}인 기준</span>
           </div>
           <div className="bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <span className="text-sm font-bold text-white">{data.duration}박 {data.duration + 1}일</span>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-500/80 text-white text-xs font-medium backdrop-blur-sm">
              <MapPinIcon className="w-3 h-3" />
              {data.destination}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-500/80 text-white text-xs font-medium backdrop-blur-sm">
              <TagIcon className="w-3 h-3" />
              {data.purpose}
            </span>
            {data.accommodation && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-500/80 text-white text-xs font-medium backdrop-blur-sm">
                <BedIcon className="w-3 h-3" />
                {data.accommodation}
              </span>
            )}
            {data.carType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-green-500/80 text-white text-xs font-medium backdrop-blur-sm">
                <PlaneIcon className="w-3 h-3" /> {/* Reusing PlaneIcon as Transport Icon */}
                {data.carType}
              </span>
            )}
            {data.guideType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-yellow-500/80 text-white text-xs font-medium backdrop-blur-sm">
                <UsersIcon className="w-3 h-3" />
                {data.guideType}
              </span>
            )}
          </div>
          <h2 className="text-white text-3xl font-bold leading-tight shadow-sm">
            {data.title}
          </h2>
        </div>
      </div>

      {/* Price Section */}
      <div className="px-8 py-6 bg-blue-50 flex flex-col sm:flex-row justify-between items-center border-b border-blue-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">1인 상품가</p>
            <p className="text-xs text-red-500 font-medium">항공기 이용료 제외 ({data.peopleCount}인 출발 기준)</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-gray-900">{data.price}</span>
          <span className="text-gray-500 text-sm font-medium ml-1">/ 1인</span>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Product Points */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
              ★
            </span>
            핵심 포인트
          </h3>
          <ul className="grid gap-3">
            {data.points.map((point, index) => (
              <li key={index} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 transition-colors hover:border-blue-200">
                <CheckIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Itinerary */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </span>
            상세 일정표
          </h3>
          
          <div className="relative border-l-2 border-blue-100 ml-3 space-y-8 pb-4">
            {data.itinerary.map((day) => (
              <div key={day.day} className="relative pl-8 group">
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-500 shadow-sm transition-colors group-hover:border-blue-600"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm">
                    Day {day.day}
                  </span>
                  <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                    {day.title}
                  </h4>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Day Summary */}
                  <div className="p-4 bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
                    {day.description}
                  </div>
                  
                  {/* Detailed Schedule Table */}
                  <div className="p-4">
                    {day.schedule && day.schedule.length > 0 ? (
                      <div className="space-y-4">
                        {day.schedule.map((item, idx) => {
                           const { icon: IconComponent, color, textColor } = getScheduleIcon(item.time, item.activity);
                           
                           return (
                            <div key={idx} className="flex items-start gap-4 group/item">
                               {/* Icon Time Column */}
                               <div className="flex flex-col items-center mr-2 min-w-[3.5rem]">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 shadow-sm transition-transform group-hover/item:scale-110 ${color}`}>
                                    <IconComponent className="w-5 h-5 text-white" />
                                 </div>
                                 <span className={`text-[11px] font-bold text-center leading-tight ${textColor}`}>
                                   {item.time}
                                 </span>
                               </div>
                               
                               {/* Activity Column */}
                               <div className="flex-1 pt-1.5 relative">
                                 <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 group-hover/item:bg-blue-50 group-hover/item:border-blue-100 transition-colors">
                                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                      {item.activity}
                                    </p>
                                 </div>
                               </div>
                            </div>
                           );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">상세 일정은 현지 사정에 따라 변경될 수 있습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
        <button 
          onClick={handleKakaoConsultation}
          className="bg-[#FAE100] hover:bg-[#FADB00] text-[#371D1E] font-bold py-4 px-8 rounded-xl w-full transition-all shadow-md hover:shadow-lg transform active:scale-[0.99] flex flex-col items-center justify-center"
        >
          <span className="text-lg">카카오톡 예약 상담 신청하기</span>
          <span className="text-sm font-normal opacity-80 mt-1">
            클릭 시 견적서 복사 및 오픈채팅 연결
          </span>
        </button>
      </div>
    </div>
  );
};

export default TourPreview;
