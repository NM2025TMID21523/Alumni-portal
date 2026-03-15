import { User, UserRole, Webinar, MentorshipRequest, GalleryImage, AlumniEvent, Announcement, FundraisingCampaign, Donor, CommunityPost, PrivateMessage, AppNotification } from './types';

// use relative path; dev server proxies to backend
const API_BASE_URL = '/api';
const REQUEST_TIMEOUT_MS = 8000;

class DatabaseService {
  private async apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timed out for ${endpoint}`);
      }
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
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
      user_id: notif.user_id,
      title: notif.title,
      message: notif.message,
      type: notif.type,
    };
    await this.apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(dbNotif),
    });
  }

  async markNotificationRead(id: number): Promise<void> {
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
    const [posts, users] = await Promise.all([
      this.apiRequest<any[]>('/posts'),
      this.getUsers().catch(() => []),
    ]);

    const usersById = new Map(users.map(user => [String(user.id), user]));
    return posts.map(post => ({
      ...post,
      id: Number(post.id),
      author_id: Number(post.author_id),
      authorId: String(post.author_id),
      authorName: usersById.get(String(post.author_id))?.name || 'Community Member',
      authorRole: usersById.get(String(post.author_id))?.role || UserRole.ALUMNI,
      content: post.content || '',
      created_at: post.created_at,
      timestamp: post.created_at,
      likes: Number(post.likes || 0),
    }));
  }

  async addPost(post: CommunityPost): Promise<CommunityPost> {
    const dbPost = {
      title: post.title || null,
      content: post.content,
      author_id: post.author_id,
    };
    const createdPost = await this.apiRequest<any>('/posts', {
      method: 'POST',
      body: JSON.stringify(dbPost),
    });
    // Create global notification for new posts
    const notif: AppNotification = {
      id: Date.now(),
      user_id: 'all',
      title: 'New Community Post',
      message: `${post.authorName || 'Someone'} shared an update.`,
      type: 'community',
      created_at: new Date().toISOString(),
      read_status: false
    };
    await this.addNotification(notif);

    return {
      ...createdPost,
      id: Number(createdPost.id),
      author_id: Number(createdPost.author_id ?? post.author_id),
      authorName: post.authorName || 'Community Member',
      authorRole: post.authorRole || UserRole.ALUMNI,
      content: createdPost.content || post.content,
      created_at: createdPost.created_at || new Date().toISOString(),
      timestamp: createdPost.created_at || new Date().toISOString(),
      likes: 0,
    };
  }

  // Private Messages
  async getMessages(userId1: string, userId2: string): Promise<PrivateMessage[]> {
    const messages = await this.apiRequest<any[]>(`/messages/${userId1}/${userId2}`);
    return messages.map(msg => ({
      ...msg,
      id: Number(msg.id),
      sender_id: Number(msg.sender_id),
      receiver_id: Number(msg.receiver_id),
      senderId: String(msg.sender_id),
      receiverId: String(msg.receiver_id),
      text: msg.content,
      timestamp: msg.created_at,
    }));
  }

  async sendMessage(msg: PrivateMessage): Promise<PrivateMessage> {
    const dbMsg = {
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      subject: msg.subject || null,
      content: msg.content,
    };
    const createdMessage = await this.apiRequest<any>('/messages', {
      method: 'POST',
      body: JSON.stringify(dbMsg),
    });

    return {
      ...createdMessage,
      id: Number(createdMessage.id),
      sender_id: Number(createdMessage.sender_id ?? msg.sender_id),
      receiver_id: Number(createdMessage.receiver_id ?? msg.receiver_id),
      text: createdMessage.content || msg.content,
      timestamp: createdMessage.created_at || new Date().toISOString(),
      read_status: Boolean(createdMessage.read_status),
    };
  }

  // Webinar Operations
  async getWebinars(): Promise<Webinar[]> {
    const webinars = await this.apiRequest<any[]>('/webinars');
    return webinars.map(webinar => ({
      ...webinar,
      id: Number(webinar.id),
      link: webinar.registration_link,
      status: webinar.status || 'approved',
    }));
  }

  async addWebinar(webinar: Webinar): Promise<Webinar> {
    const dbWebinar = {
      title: webinar.title,
      description: webinar.description,
      date: webinar.date,
      speaker: webinar.speaker,
      speaker_bio: webinar.speaker_bio || null,
      registration_link: webinar.link,
      status: webinar.status || 'pending',
    };
    const createdWebinar = await this.apiRequest<any>('/webinars', {
      method: 'POST',
      body: JSON.stringify(dbWebinar),
    });

    return {
      ...createdWebinar,
      id: Number(createdWebinar.id),
      link: createdWebinar.registration_link || webinar.link,
      status: createdWebinar.status || webinar.status || 'pending',
    };
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
      id: Number(req.id),
      student_id: Number(req.student_id),
      alumni_id: Number(req.alumni_id),
      studentId: String(req.student_id),
      alumniId: String(req.alumni_id),
      message: req.message,
      status: req.status || 'pending',
    }));
  }

  async addRequest(req: MentorshipRequest): Promise<void> {
    const dbReq = {
      student_id: req.student_id,
      alumni_id: req.alumni_id,
      topic: req.topic || null,
      message: req.message,
    };
    await this.apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify(dbReq),
    });
    // Trigger notification for the recipient
    const notif: AppNotification = {
      id: Date.now(),
      user_id: req.alumni_id,
      title: 'New Mentorship Request',
      message: `${req.studentName || 'A student'} wants you to be their mentor.`,
      type: 'mentorship',
      created_at: new Date().toISOString(),
      read_status: false
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
    const req = requests.find(r => r.id === Number(id));
    if (req) {
      const notif: AppNotification = {
        id: Date.now(),
        user_id: req.student_id,
        title: `Mentorship ${status}`,
        message: `${req.alumniName || 'Your mentor'} has ${status} your request.`,
        type: 'mentorship',
        created_at: new Date().toISOString(),
        read_status: false
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
