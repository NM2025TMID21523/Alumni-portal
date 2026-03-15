import { User, UserRole, Webinar, MentorshipRequest, GalleryImage, AlumniEvent, Announcement, FundraisingCampaign, Donor, CommunityPost, PrivateMessage, AppNotification } from '../types';

// use relative path; dev server proxies to backend
const API_BASE_URL = '/api';

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
    const users = await this.apiRequest<any[]>('/users');
    return users.map(user => ({
      ...user,
      id: user.id.toString(), // Convert to string for frontend compatibility
    }));
  }

  async addUser(user: User): Promise<User> {
    const dbUser = {
      name: user.name,
      email: user.email,
      role: user.role,
      graduation_year: user.graduation_year,
      department: user.department,
      profile_image: user.profile_image || null,
      bio: user.bio || null,
      linkedin_url: user.linkedin_url || null,
    };
    const createdUser = await this.apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(dbUser),
    });
    return {
      ...createdUser,
      id: createdUser.id.toString(),
    };
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    const dbUpdates = {
      name: updates.name,
      email: updates.email,
      role: updates.role,
      graduation_year: updates.graduation_year,
      department: updates.department,
      profile_image: updates.profile_image || null,
      bio: updates.bio || null,
      linkedin_url: updates.linkedin_url || null,
    };
    await this.apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dbUpdates),
    });
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // Notification Operations
  async getNotifications(userId: string): Promise<AppNotification[]> {
    const notifications = await this.apiRequest<any[]>(`/notifications/${userId}`);
    return notifications.map(notif => ({
      ...notif,
      id: notif.id.toString(),
      userId: notif.user_id.toString(),
      timestamp: notif.created_at,
      isRead: notif.read_status,
    }));
  }

  async addNotification(notif: AppNotification): Promise<void> {
    const dbNotif = {
      user_id: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
    };
    await this.apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(dbNotif),
    });
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async clearAllNotifications(userId: string): Promise<void> {
    // For now, we'll mark all as read
    const notifications = await this.getNotifications(userId);
    await Promise.all(
      notifications.map(notif => this.markNotificationRead(notif.id))
    );
  }

  // Community Feed
  async getPosts(): Promise<CommunityPost[]> {
    const posts = await this.apiRequest<any[]>('/posts');
    // Note: This would need to join with users table to get authorName and authorRole
    // For now, returning basic structure
    return posts.map(post => ({
      ...post,
      id: post.id.toString(),
      authorId: post.author_id.toString(),
      content: post.content,
      timestamp: post.created_at,
      likes: 0, // This field doesn't exist in current DB
    }));
  }

  async addPost(post: CommunityPost): Promise<void> {
    const dbPost = {
      title: post.title || null,
      content: post.content,
      author_id: parseInt(post.authorId),
    };
    await this.apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(dbPost),
    });
    // Create global notification for new posts
    const notif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'all',
      title: 'New Community Post',
      message: `${post.authorName || 'Someone'} shared an update.`,
      type: 'community',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    await this.addNotification(notif);
  }

  // Private Messages
  async getMessages(userId1: string, userId2: string): Promise<PrivateMessage[]> {
    const messages = await this.apiRequest<any[]>(`/messages/${userId1}/${userId2}`);
    return messages.map(msg => ({
      ...msg,
      id: msg.id.toString(),
      senderId: msg.sender_id.toString(),
      receiverId: msg.receiver_id.toString(),
      text: msg.content,
      timestamp: msg.created_at,
    }));
  }

  async sendMessage(msg: PrivateMessage): Promise<void> {
    const dbMsg = {
      sender_id: parseInt(msg.senderId),
      receiver_id: parseInt(msg.receiverId),
      subject: msg.subject || null,
      content: msg.text,
    };
    await this.apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(dbMsg),
    });
  }

  // Webinar Operations
  async getWebinars(): Promise<Webinar[]> {
    const webinars = await this.apiRequest<any[]>('/webinars');
    return webinars.map(webinar => ({
      ...webinar,
      id: webinar.id.toString(),
      link: webinar.registration_link,
    }));
  }

  async addWebinar(webinar: Webinar): Promise<void> {
    const dbWebinar = {
      title: webinar.title,
      description: webinar.description,
      date: webinar.date,
      speaker: webinar.speaker,
      speaker_bio: webinar.speaker_bio || null,
      registration_link: webinar.link,
    };
    await this.apiRequest('/webinars', {
      method: 'POST',
      body: JSON.stringify(dbWebinar),
    });
  }

  async updateWebinarStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    // Note: Status field doesn't exist in current DB schema
    // This would need to be added to the database
    console.warn('updateWebinarStatus not implemented - status field missing in DB');
  }

  // Mentorship Operations
  async getRequests(): Promise<MentorshipRequest[]> {
    const requests = await this.apiRequest<any[]>('/requests');
    return requests.map(req => ({
      ...req,
      id: req.id.toString(),
      studentId: req.student_id.toString(),
      alumniId: req.alumni_id.toString(),
      message: req.message,
    }));
  }

  async addRequest(req: MentorshipRequest): Promise<void> {
    const dbReq = {
      student_id: parseInt(req.studentId),
      alumni_id: parseInt(req.alumniId),
      topic: req.topic || null,
      message: req.message,
    };
    await this.apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify(dbReq),
    });
    // Trigger notification for the recipient
    const notif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: req.alumniId,
      title: 'New Mentorship Request',
      message: `${req.studentName || 'A student'} wants you to be their mentor.`,
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
        message: `${req.alumniName || 'Your mentor'} has ${status} your request.`,
        type: 'mentorship',
        timestamp: new Date().toISOString(),
        isRead: false
      };
      await this.addNotification(notif);
    }
  }

  // Gallery Operations
  async getGallery(): Promise<GalleryImage[]> {
    const images = await this.apiRequest<any[]>('/gallery');
    return images.map(img => ({
      ...img,
      id: img.id.toString(),
      url: img.image_url,
      caption: img.title,
      date: img.created_at,
    }));
  }

  async addImage(img: GalleryImage): Promise<void> {
    const dbImg = {
      title: img.caption,
      image_url: img.url,
      uploaded_by: img.uploaded_by ? parseInt(img.uploaded_by.toString()) : null,
      event_id: img.event_id ? parseInt(img.event_id.toString()) : null,
    };
    await this.apiRequest('/gallery', {
      method: 'POST',
      body: JSON.stringify(dbImg),
    });
  }

  async approveImage(id: string): Promise<void> {
    // Note: Status field doesn't exist in current DB schema
    console.warn('approveImage not implemented - status field missing in DB');
  }

  // Campaign Operations
  async getCampaigns(): Promise<FundraisingCampaign[]> {
    const campaigns = await this.apiRequest<any[]>('/campaigns');
    return campaigns.map(campaign => ({
      ...campaign,
      id: campaign.id.toString(),
      targetAmount: campaign.goal_amount,
      raisedAmount: campaign.current_amount || 0,
    }));
  }

  async addCampaign(campaign: FundraisingCampaign): Promise<void> {
    const dbCampaign = {
      title: campaign.title,
      description: campaign.description,
      goal_amount: campaign.targetAmount,
      organizer_id: campaign.organizer_id ? parseInt(campaign.organizer_id.toString()) : null,
    };
    await this.apiRequest('/campaigns', {
      method: 'POST',
      body: JSON.stringify(dbCampaign),
    });
  }

  // Event Operations
  async getEvents(): Promise<AlumniEvent[]> {
    const events = await this.apiRequest<any[]>('/events');
    return events.map(event => ({
      ...event,
      id: event.id.toString(),
    }));
  }

  async getAnnouncements(): Promise<Announcement[]> {
    const announcements = await this.apiRequest<any[]>('/announcements');
    return announcements.map(ann => ({
      ...ann,
      id: ann.id.toString(),
      date: ann.created_at,
    }));
  }

  async getDonors(): Promise<Donor[]> {
    const donors = await this.apiRequest<any[]>('/donors');
    return donors.map(donor => ({
      ...donor,
      id: donor.id.toString(),
      campaignId: donor.campaign_id.toString(),
      date: donor.created_at,
    }));
  }
}

export const db = new DatabaseService();
