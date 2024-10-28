export interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt?: string;
  channelId: string;
}

export default Notification;
