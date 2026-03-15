
import { User, UserRole, Webinar, MentorshipRequest, GalleryImage, AlumniEvent, Announcement, FundraisingCampaign, Donor, CommunityPost, PrivateMessage, AppNotification } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

class DatabaseService {
  private async apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // User Operations
  async getUsers(): Promise<User[]> {
    return this.apiRequest<User[]>('/users');
  }

  async addUser(user: User): Promise<void> {
    await this.apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    await this.apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // Notification Operations
  async getNotifications(userId: string): Promise<AppNotification[]> {
    return this.apiRequest<AppNotification[]>(`/notifications/${userId}`);
  }

  async addNotification(notif: AppNotification): Promise<void> {
    await this.apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(notif),
    });
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async clearAllNotifications(userId: string): Promise<void> {
    // This would need a backend endpoint to delete notifications for a user
    // For now, we'll mark all as read
    const notifications = await this.getNotifications(userId);
    await Promise.all(
      notifications.map(notif => this.markNotificationRead(notif.id))
    );
  }

  // Community Feed
  async getPosts(): Promise<CommunityPost[]> {
    return this.apiRequest<CommunityPost[]>('/posts');
  }

  async addPost(post: CommunityPost): Promise<void> {
    await this.apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
    // Create global notification for new posts
    const notif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'all',
      title: 'New Community Post',
      message: `${post.authorName} shared an update.`,
      type: 'community',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    await this.addNotification(notif);
  }

  // Private Messages
  async getMessages(userId1: string, userId2: string): Promise<PrivateMessage[]> {
    return this.apiRequest<PrivateMessage[]>(`/messages/${userId1}/${userId2}`);
  }

  async sendMessage(msg: PrivateMessage): Promise<void> {
    await this.apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(msg),
    });
  }

  // Webinar Operations
  async getWebinars(): Promise<Webinar[]> {
    return this.apiRequest<Webinar[]>('/webinars');
  }

  async addWebinar(webinar: Webinar): Promise<void> {
    await this.apiRequest('/webinars', {
      method: 'POST',
      body: JSON.stringify(webinar),
    });
  }

  async updateWebinarStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    // This would need a backend endpoint to update webinar status
    // For now, we'll assume the webinar object has a status field
    await this.apiRequest(`/webinars/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Mentorship Operations
  async getRequests(): Promise<MentorshipRequest[]> {
    return this.apiRequest<MentorshipRequest[]>('/requests');
  }

  async addRequest(req: MentorshipRequest): Promise<void> {
    await this.apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify(req),
    });
    // Trigger notification for the recipient
    const notif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: req.alumniId,
      title: 'New Mentorship Request',
      message: `${req.studentName} wants you to be their mentor.`,
      type: 'mentorship',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    await this.addNotification(notif);
  }

  async updateRequestStatus(id: string, status: 'accepted' | 'declined'): Promise<void> {
    await this.apiRequest(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });

    // Create notification for the student
    const requests = await this.getRequests();
    const req = requests.find(r => r.id === id);
    if (req) {
      const notif: AppNotification = {
        id: Math.random().toString(36).substr(2, 9),
        userId: req.studentId,
        title: `Mentorship ${status}`,
        message: `${req.alumniName} has ${status} your request.`,
        type: 'mentorship',
        timestamp: new Date().toISOString(),
        isRead: false
      };
      await this.addNotification(notif);
    }
  }

  // Gallery Operations
  async getGallery(): Promise<GalleryImage[]> {
    return this.apiRequest<GalleryImage[]>('/gallery');
  }

  async addImage(img: GalleryImage): Promise<void> {
    await this.apiRequest('/gallery', {
      method: 'POST',
      body: JSON.stringify(img),
    });
  }

  async approveImage(id: string): Promise<void> {
    // This would need a backend endpoint to update image status
    await this.apiRequest(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'approved' }),
    });
  }

  // Campaign Operations
  async getCampaigns(): Promise<FundraisingCampaign[]> {
    return this.apiRequest<FundraisingCampaign[]>('/campaigns');
  }

  async addCampaign(campaign: FundraisingCampaign): Promise<void> {
    await this.apiRequest('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  }

  // Event Operations
  async getEvents(): Promise<AlumniEvent[]> {
    return this.apiRequest<AlumniEvent[]>('/events');
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return this.apiRequest<Announcement[]>('/announcements');
  }

  async getDonors(): Promise<Donor[]> {
    return this.apiRequest<Donor[]>('/donors');
  }
}

export const db = new DatabaseService();
