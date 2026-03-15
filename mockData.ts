
import { User, UserRole, Webinar, GalleryImage, MentorshipRequest, AlumniEvent, Announcement, FundraisingCampaign, Donor, CommunityPost, PrivateMessage } from './types';

export const mockAlumni: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@google.com', role: UserRole.ALUMNI, batch: '2020', company: 'Google', department: 'Computer Science', status: 'approved', joinDate: '2023-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@meta.com', role: UserRole.ALUMNI, batch: '2019', company: 'Meta', department: 'Information Technology', status: 'approved', joinDate: '2023-02-20' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@microsoft.com', role: UserRole.ALUMNI, batch: '2021', company: 'Microsoft', department: 'Electrical Engineering', status: 'approved', joinDate: '2023-03-10' },
];

export const mockStudents: User[] = [
  { id: 's100', name: 'James Wilson', email: 'james@uni.edu', role: UserRole.STUDENT, department: 'Computer Science', status: 'approved', joinDate: '2024-01-10' },
  { id: 's101', name: 'Emma Watson', email: 'emma@uni.edu', role: UserRole.STUDENT, department: 'Data Science', status: 'approved', joinDate: '2024-02-15' },
];

// Added mockPendingUsers to resolve the reference error in services/db.ts
export const mockPendingUsers: User[] = [
  { id: 'p1', name: 'Robert Fox', email: 'robert@startup.io', role: UserRole.ALUMNI, batch: '2022', company: 'Startup Inc', department: 'Computer Science', status: 'pending', joinDate: '2024-03-01' },
  { id: 'p2', name: 'Sarah Jenkins', email: 'sarah@design.co', role: UserRole.ALUMNI, batch: '2017', company: 'Design Co', department: 'Information Technology', status: 'pending', joinDate: '2024-03-02' },
];

export const mockPosts: CommunityPost[] = [
  {
    id: 1,
    author_id: 1,
    authorName: 'Alice Johnson',
    authorRole: UserRole.ALUMNI,
    content: "Just finished my first year at Google! If any students want to know about the interview process, feel free to DM me.",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    likes: 12
  },
  {
    id: 2,
    author_id: 101,
    authorName: 'Emma Watson',
    authorRole: UserRole.STUDENT,
    content: "Is anyone planning to attend the Homecoming 2024 next month? Looking forward to meeting the seniors!",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    likes: 5
  }
];

export const mockPrivateMessages: PrivateMessage[] = [
  {
    id: 1,
    sender_id: 1,
    receiver_id: 100,
    content: "Hey James, I saw your mentorship request. Let's chat here.",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    read_status: false
  }
];

export const departments = [
  'Computer Science',
  'Information Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Data Science'
];

export const mockWebinars: Webinar[] = [
  {
    id: 1,
    title: 'Navigating Big Tech as a Junior Engineer',
    description: 'Learn how to handle your first year at a FAANG company.',
    date: '2024-11-15 18:00',
    registration_link: 'https://zoom.us/j/example1',
    speaker: 'Alice Johnson',
    status: 'approved'
  },
  {
    id: 2,
    title: 'The Future of AI in Web Development',
    description: 'A deep dive into how LLMs are changing the way we build apps.',
    date: '2024-11-20 17:30',
    registration_link: 'https://meet.google.com/abc-defg-hij',
    speaker: 'Charlie Davis',
    status: 'pending'
  }
];

export const mockGallery: GalleryImage[] = [
  { id: 1, image_url: 'https://picsum.photos/seed/event1/800/600', title: 'Annual Alumni Meetup 2023', created_at: '2023-12-01', status: 'approved', uploaderName: 'Alice Johnson' },
  { id: 2, image_url: 'https://picsum.photos/seed/event2/800/600', title: 'Graduation Ceremony', created_at: '2024-05-01', status: 'approved', uploaderName: 'Admin' },
  { id: 3, image_url: 'https://picsum.photos/seed/event3/800/600', title: 'Workshop Draft', created_at: '2024-10-01', status: 'pending', uploaderName: 'Bob Smith' },
];

export const mockMentorshipRequests: MentorshipRequest[] = [
  {
    id: 1,
    student_id: 100,
    alumni_id: 1,
    status: 'pending',
    message: 'I am interested in backend engineering at Google.',
    created_at: new Date().toISOString(),
    studentName: 'James Wilson',
    alumniName: 'Alice Johnson'
  }
];

export const mockEvents: AlumniEvent[] = [
  { id: 1, title: 'Homecoming 2024', description: 'Annual reunion for all batches.', date: '2024-12-25', location: 'Main Campus', type: 'In-person', created_at: '2024-01-01', isVisible: true },
  { id: 2, title: 'Global Tech Meetup', description: 'Networking event for tech alumni.', date: '2024-11-30', location: 'Virtual', type: 'Online', created_at: '2024-01-01', isVisible: true },
];

export const mockAnnouncements: Announcement[] = [
  { id: 1, title: 'New CS Research Lab', content: 'We are opening a state-of-the-art AI lab.', created_at: '2024-10-01', category: 'news', targetAudience: 'all' },
  { id: 2, title: 'Placement Drive: Tesla', content: 'Tesla is visiting for campus recruitment.', created_at: '2024-10-05', category: 'placement', targetAudience: 'students' },
];

export const mockCampaigns: FundraisingCampaign[] = [
  {
    id: 1,
    title: 'Library Modernization Project',
    description: 'Help us upgrade our campus library with new digital resources and collaborative spaces.',
    goal_amount: 50000,
    current_amount: 32500,
    created_at: '2024-01-01',
    status: 'active'
  },
  {
    id: 2,
    title: 'Alumni Scholarship Fund',
    description: 'Providing financial aid to deserving students from low-income backgrounds.',
    goal_amount: 20000,
    current_amount: 18000,
    created_at: '2024-05-01',
    status: 'active'
  }
];

export const mockDonors: Donor[] = [
  { id: 1, campaign_id: 1, name: 'Alice Johnson', amount: 5000, anonymous: false, created_at: '2024-02-10' },
  { id: 2, campaign_id: 1, name: 'Bob Smith', amount: 2500, anonymous: false, created_at: '2024-03-15' },
  { id: 3, campaign_id: 2, name: 'Anonymous Alumni', amount: 10000, anonymous: true, created_at: '2024-06-01' },
];
