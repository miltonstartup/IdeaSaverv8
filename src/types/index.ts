/**
 * Global type definitions for the Idea Saver application
 */

/**
 * Audio recording related types
 */
export interface AudioRecording {
    id: string; // Unique ID for the recording
    name: string; // Title (can be default or AI-generated)
    transcription: string | null; // Full text transcription
    audioDataUri: string; // Base64 encoded audio data (critical for local storage)
    duration: number; // Duration in seconds
    date: string; // ISO date string of creation (e.g., new Date().toISOString())
    summary: string | null; // AI-generated summary
    expandedTranscription: string | null; // AI-expanded text
    projectPlan: string | null; // AI-generated project plan
    actionItems: string | null; // AI-extracted action items
    tags?: string[]; // Optional array of tags (for future use/local filtering)
    isArchived: boolean; // Default to false
    priority: 'low' | 'medium' | 'high'; // Default to 'medium'
}

/**
 * Note/Idea data structure
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  audioRecording?: AudioRecording;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high';
}

/**
 * User profile information
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  subscription: 'free' | 'premium' | 'enterprise';
  credits: number;
  settings: UserSettings;
}

/**
 * User settings and preferences
 */
export interface UserSettings {
  language: 'en' | 'es';
  theme: 'light' | 'dark' | 'auto';
  cloudSyncEnabled: boolean;
  autoCloudSync: boolean;
  deletionPolicyDays: number;
  autoTranscribe: boolean;
  autoSummarize: boolean;
  defaultTags?: string[];
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

/**
 * Recording state for the audio recorder
 */
export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob?: Blob;
  error?: string;
}

/**
 * Search and filter options
 */
export interface SearchFilters {
  query: string;
  tags: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  priority?: 'low' | 'medium' | 'high';
  hasAudio?: boolean;
  isArchived?: boolean;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Component props for common UI elements
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}