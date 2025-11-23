
export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  schedule: ScheduleItem[];
}

export interface TourPackageData {
  title: string;
  destination: string;
  duration: number; // in days
  purpose: string; // e.g., "Honeymoon", "Family Trip"
  accommodation?: string; // e.g., "5 Star", "Pool Villa"
  peopleCount: number;
  price: string; // e.g., "1,500,000원"
  points: string[];
  itinerary: ItineraryDay[];
  imageUrl?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}