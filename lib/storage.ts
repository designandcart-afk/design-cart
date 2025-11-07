export type ChatMessage = {
  id: string;
  projectId: string;
  sender: "designer" | "agent";
  text: string;
  ts: number;
  attachments?: {
    type: "image" | "file";
    url: string;
    name: string;
    size?: number;
    thumbnailUrl?: string;
  }[];
  meetingInfo?: {
    id: string;
    date: string;
    time: string;
    duration: number;
    link: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    participants?: string[];
  };
};

export type Meeting = {
  id: string;
  projectId: string;
  date: string;
  time: string;
  duration: number;
  link: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  participants?: string[];
  title?: string;
  description?: string;
};

// In-memory storage (replace with real database in production)
class Storage {
  private messages: Map<string, ChatMessage[]> = new Map();
  private meetings: Map<string, Meeting[]> = new Map();

  // Message methods
  async getMessages(projectId: string): Promise<ChatMessage[]> {
    // In production: Get from database
    const stored = localStorage.getItem(`chat:${projectId}`);
    if (stored) {
      this.messages.set(projectId, JSON.parse(stored));
    }
    return this.messages.get(projectId) || [];
  }

  async saveMessage(message: ChatMessage): Promise<void> {
    // In production: Save to database
    const messages = await this.getMessages(message.projectId);
    messages.push(message);
    this.messages.set(message.projectId, messages);
    localStorage.setItem(`chat:${message.projectId}`, JSON.stringify(messages));
  }

  async updateMessage(projectId: string, messageId: string, updates: Partial<ChatMessage>): Promise<void> {
    // In production: Update in database
    const messages = await this.getMessages(projectId);
    const index = messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      messages[index] = { ...messages[index], ...updates };
      this.messages.set(projectId, messages);
      localStorage.setItem(`chat:${projectId}`, JSON.stringify(messages));
    }
  }

  // Meeting methods
  async createMeeting(meeting: Meeting): Promise<Meeting> {
    // In production: Create in database and integrate with calendar service
    const meetings = await this.getMeetings(meeting.projectId);
    meetings.push(meeting);
    this.meetings.set(meeting.projectId, meetings);
    localStorage.setItem(`meetings:${meeting.projectId}`, JSON.stringify(meetings));
    return meeting;
  }

  async getMeetings(projectId: string): Promise<Meeting[]> {
    // In production: Get from database
    const stored = localStorage.getItem(`meetings:${projectId}`);
    if (stored) {
      this.meetings.set(projectId, JSON.parse(stored));
    }
    return this.meetings.get(projectId) || [];
  }

  async updateMeeting(projectId: string, meetingId: string, updates: Partial<Meeting>): Promise<Meeting | null> {
    // In production: Update in database and calendar service
    const meetings = await this.getMeetings(projectId);
    const index = meetings.findIndex(m => m.id === meetingId);
    if (index !== -1) {
      meetings[index] = { ...meetings[index], ...updates };
      this.meetings.set(projectId, meetings);
      localStorage.setItem(`meetings:${projectId}`, JSON.stringify(meetings));
      return meetings[index];
    }
    return null;
  }

  async deleteMeeting(projectId: string, meetingId: string): Promise<boolean> {
    // In production: Delete from database and calendar service
    const meetings = await this.getMeetings(projectId);
    const index = meetings.findIndex(m => m.id === meetingId);
    if (index !== -1) {
      meetings.splice(index, 1);
      this.meetings.set(projectId, meetings);
      localStorage.setItem(`meetings:${projectId}`, JSON.stringify(meetings));
      return true;
    }
    return false;
  }
}

export const storage = new Storage();