
export type UserRole = 'teacher' | 'student' | 'visitor' | null;

export interface ArtWork {
  id: string;
  title: string;
  artist: string;
  period: string;
  year: string;
  imageUrl: string;
  description: string; // Used for Student/General
  simpleDescription: string; // For Easy Reading mode
  teacherDescription?: string; // Curricular context for Teachers
  tags: string[]; // Keywords for filtering
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GeminiConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
}

export interface TeacherCollection {
  id: string;
  title: string;
  subject: string;
  level: string;
  artworkCount: number;
  date: string;
  coverImage: string;
}

export interface TeacherResource {
  id: string;
  author: string;
  authorRole: string; // 'MNAC Educator' | 'Docente Certificado'
  title: string;
  description: string;
  tags: string[];
  likes: number;
  downloads: number;
  type: 'PDF' | 'Activity' | 'Video';
  date: string;
}

export interface Itinerary {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'Baja' | 'Media' | 'Alta';
  tags: string[];
  stops: string[]; // Array of ArtWork IDs
  coverImage: string;
  type: 'Curated' | 'AI-Generated';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string; // We'll map string to Lucide icon
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  isUnlocked: boolean;
  unlockedDate?: string;
  xpReward: number;
  category: 'exploration' | 'collection' | 'social' | 'mastery';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// --- GAMIFICATION & USER TYPES ---

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardXP: number;
  completed: boolean;
  iconName: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarId: string;
  xp: number;
  level: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastVisit: string; // ISO Date
  avatarId: string; // Icon ID for the avatar
  unlockedBadges: string[]; // IDs of unlocked badges
  readArtworks: string[]; // IDs of visited artwork details
  savedCount: number;
  quizScoreTotal: number;
  challenges: Challenge[];
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'achievement' | 'error';
  message: string;
  subMessage?: string;
}

// --- HOME CONTENT TYPES ---

export interface HomeSectionContent {
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  image?: string; // Optional override image per role
}

export interface HeroContent {
  titleItalic: string;
  titleNormal: string;
  ctaPrimary: string;
  linkPrimary: string;
  ctaSecondary: string;
  linkSecondary: string;
  backgroundImage: string;
}

export interface ActionContent {
  tag: string;
  titleItalic: string;
  titleNormal: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  quoteText: string;
}

export interface HomeContentConfig {
  hero: HeroContent;
  romanesque: HomeSectionContent;
  modernism: HomeSectionContent;
  casas: HomeSectionContent;
  action: ActionContent;
}