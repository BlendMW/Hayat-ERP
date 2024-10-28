export interface NotificationData {
    userId: string;
    id: string;
    type: string;
    content: string;
    channelId: string;
    status: 'PENDING' | 'SENT' | 'FAILED'; // Define as a union of string literals
}
