import { Meeting } from './storage';

export class MeetingService {
  // In production: Replace with actual video conferencing service (Google Meet, Zoom, etc.)
  private generateMeetingLink(): string {
    const id = Math.random().toString(36).substring(7);
    return `https://meet.designncart.com/${id}`;
  }

  // Generate calendar event
  private generateCalendarEvent(meeting: Meeting): string {
    const startDate = new Date(`${meeting.date}T${meeting.time}`);
    const endDate = new Date(startDate.getTime() + meeting.duration * 60000);

    const event = {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      title: meeting.title || 'Design Consultation',
      description: `
Meeting Link: ${meeting.link}
${meeting.description || ''}
      `.trim(),
      location: meeting.link,
    };

    // Generate .ics file content
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${event.start.replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
      `DTEND:${event.end.replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    // Create blob and return URL
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
  }

  // Create a new meeting
  async createMeeting(params: Omit<Meeting, 'id' | 'link' | 'status'>): Promise<Meeting> {
    const meeting: Meeting = {
      ...params,
      id: `meet_${Date.now()}`,
      link: this.generateMeetingLink(),
      status: 'scheduled'
    };

    // In production: Create meeting in video conferencing service
    // For demo: Just generate a link

    return meeting;
  }

  // Get calendar event file for a meeting
  getCalendarEvent(meeting: Meeting): string {
    return this.generateCalendarEvent(meeting);
  }

  // Send meeting reminder (in production)
  async sendReminder(meeting: Meeting): Promise<void> {
    // In production: Send email/notification to participants
    console.log('Sending reminder for meeting:', meeting.id);
  }

  // Join meeting
  async joinMeeting(meetingId: string): Promise<void> {
    // In production: Handle meeting join logic
    window.open(`/meeting/${meetingId}`, '_blank');
  }
}

export const meetingService = new MeetingService();