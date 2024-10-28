export interface CommunicationChannel {
  id: string;
  userId: string;
  type: string;
  address: string;
  isActive: boolean;
  isDefault: boolean;
}

export default CommunicationChannel;
