
export enum UserRole {
  STUDENT = 'student',
  ALUMNI = 'alumni',
  ADMIN = 'admin',
  PENDING = 'pending'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  graduation_year?: number;
  department?: string;
  profile_image?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface CommunityPost {
  id: number;
  title?: string;
  content: string;
  author_id: number;
  authorName?: string; // This might need to be computed from join
  authorRole?: UserRole; // This might need to be computed from join
  created_at: string;
  likes?: number; // This field doesn't exist in DB, might need to add
}

export interface PrivateMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  subject?: string;
  content: string;
  read_status: boolean;
  created_at: string;
  senderName?: string; // Computed field
  receiverName?: string; // Computed field
}

export interface AppNotification {
  id: number;
  user_id: number | string; // Allow 'all' for global notifications
  title: string;
  message: string;
  type: string;
  read_status: boolean;
  created_at: string;
  timestamp?: string; // Alias for created_at
  isRead?: boolean; // Alias for read_status
  link?: string;
}

export interface Webinar {
  id: number;
  title: string;
  description: string;
  date: string;
  speaker: string;
  speaker_bio?: string;
  registration_link?: string;
  created_at?: string;
  status?: 'pending' | 'approved' | 'rejected'; // This field doesn't exist in DB
  link?: string; // Alias for registration_link
}

export interface MentorshipRequest {
  id: number;
  student_id: number;
  alumni_id: number;
  topic?: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  studentName?: string; // Computed field
  alumniName?: string; // Computed field
}

export interface GalleryImage {
  id: number;
  title?: string;
  image_url: string;
  uploaded_by?: number;
  event_id?: number;
  created_at: string;
  url?: string; // Alias for image_url
  caption?: string; // Alias for title
  date?: string; // Alias for created_at
  status?: 'pending' | 'approved' | 'rejected'; // This field doesn't exist in DB
  uploaderName?: string; // Computed field
}

export interface AlumniEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer_id?: number;
  created_at: string;
  type?: string; // This field doesn't exist in DB
  isVisible?: boolean; // This field doesn't exist in DB
}

export interface SuccessStory {
  id: string;
  alumniName: string;
  title: string;
  content: string;
  imageUrl: string;
  batch: string;
  category: 'entrepreneur' | 'corporate' | 'academia';
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  author_id?: number;
  created_at: string;
  category?: 'news' | 'placement' | 'general'; // This field doesn't exist in DB
  date?: string; // Alias for created_at
  targetAudience?: 'all' | 'alumni' | 'students'; // This field doesn't exist in DB
}

export interface FundraisingCampaign {
  id: number;
  title: string;
  description: string;
  goal_amount: number;
  current_amount?: number;
  organizer_id?: number;
  created_at: string;
  targetAmount?: number; // Alias for goal_amount
  raisedAmount?: number; // Alias for current_amount
  startDate?: string; // This field doesn't exist in DB
  endDate?: string; // This field doesn't exist in DB
  status?: 'active' | 'completed' | 'paused'; // This field doesn't exist in DB
}

export interface Donor {
  id: number;
  campaign_id: number;
  name: string;
  email?: string;
  amount: number;
  anonymous: boolean;
  created_at: string;
  campaignId?: number; // Alias for campaign_id
  date?: string; // Alias for created_at
}
