
import { User, UserRole, Webinar, GalleryImage, MentorshipRequest, AlumniEvent, Announcement, FundraisingCampaign, Donor, CommunityPost, PrivateMessage } from '../types';

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
    id: 'p1',
    authorId: '1',
    authorName: 'Alice Johnson',
    authorRole: UserRole.ALUMNI,
    content: "Just finished my first year at Google! If any students want to know about the interview process, feel free to DM me.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 12
  },
  {
    id: 'p2',
    authorId: 's101',
    authorName: 'Emma Watson',
    authorRole: UserRole.STUDENT,
    content: "Is anyone planning to attend the Homecoming 2024 next month? Looking forward to meeting the seniors!",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: 5
  }
];

export const mockPrivateMessages: PrivateMessage[] = [
  {
    id: 'm1',
    senderId: '1',
    receiverId: 's100',
    text: "Hey James, I saw your mentorship request. Let's chat here.",
    timestamp: new Date(Date.now() - 7200000).toISOString()
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
    id: 'w1',
    title: 'Navigating Big Tech as a Junior Engineer',
    description: 'Learn how to handle your first year at a FAANG company.',
    date: '2024-11-15 18:00',
    link: 'https://zoom.us/j/example1',
    speaker: 'Alice Johnson',
    status: 'approved'
  },
  {
    id: 'w2',
    title: 'The Future of AI in Web Development',
    description: 'A deep dive into how LLMs are changing the way we build apps.',
    date: '2024-11-20 17:30',
    link: 'https://meet.google.com/abc-defg-hij',
    speaker: 'Charlie Davis',
    status: 'pending'
  }
];

export const mockGallery: GalleryImage[] = [
  { id: 'g1', url: 'https://picsum.photos/seed/event1/800/600', caption: 'Annual Alumni Meetup 2023', date: 'Dec 2023', status: 'approved', uploaderName: 'Alice Johnson' },
  { id: 'g2', url: 'https://picsum.photos/seed/event2/800/600', caption: 'Graduation Ceremony', date: 'May 2024', status: 'approved', uploaderName: 'Admin' },
  { id: 'g3', url: 'https://picsum.photos/seed/event3/800/600', caption: 'Workshop Draft', date: 'Oct 2024', status: 'pending', uploaderName: 'Bob Smith' },
];

export const mockMentorshipRequests: MentorshipRequest[] = [
  {
    id: 'mr1',
    studentId: 's100',
    studentName: 'James Wilson',
    alumniId: '1',
    alumniName: 'Alice Johnson',
    status: 'pending',
    message: 'I am interested in backend engineering at Google.'
  }
];

export const mockEvents: AlumniEvent[] = [
  { id: 'e1', title: 'Homecoming 2024', description: 'Annual reunion for all batches.', date: '2024-12-25', location: 'Main Campus', type: 'In-person', isVisible: true },
  { id: 'e2', title: 'Global Tech Meetup', description: 'Networking event for tech alumni.', date: '2024-11-30', location: 'Virtual', type: 'Online', isVisible: true },
];

export const mockAnnouncements: Announcement[] = [
  { id: 'a1', title: 'New CS Research Lab', content: 'We are opening a state-of-the-art AI lab.', category: 'news', date: 'Oct 01, 2024', targetAudience: 'all' },
  { id: 'a2', title: 'Placement Drive: Tesla', content: 'Tesla is visiting for campus recruitment.', category: 'placement', date: 'Oct 05, 2024', targetAudience: 'students' },
];

export const mockCampaigns: FundraisingCampaign[] = [
  {
    id: 'c1',
    title: 'Library Modernization Project',
    description: 'Help us upgrade our campus library with new digital resources and collaborative spaces.',
    targetAmount: 50000,
    raisedAmount: 32500,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active'
  },
  {
    id: 'c2',
    title: 'Alumni Scholarship Fund',
    description: 'Providing financial aid to deserving students from low-income backgrounds.',
    targetAmount: 20000,
    raisedAmount: 18000,
    startDate: '2024-05-01',
    endDate: '2025-05-01',
    status: 'active'
  }
];

export const mockDonors: Donor[] = [
  { id: 'd1', campaignId: 'c1', name: 'Alice Johnson', amount: 5000, date: '2024-02-10' },
  { id: 'd2', campaignId: 'c1', name: 'Bob Smith', amount: 2500, date: '2024-03-15' },
  { id: 'd3', campaignId: 'c2', name: 'Anonymous Alumni', amount: 10000, date: '2024-06-01' },
];
