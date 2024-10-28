import { ApiGatewayManagementApi } from 'aws-sdk';

const apiGateway = new ApiGatewayManagementApi({
  endpoint: process.env.WEBSOCKET_API_ENDPOINT,
});

export const sendMessageToClient = async (connectionId: string, message: any) => {
  try {
    await apiGateway.postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(message),
    }).promise();
  } catch (error) {
    console.error('Error sending message to WebSocket client:', error);
  }
};

export const broadcastMessage = async (connections: string[], message: any) => {
  await Promise.all(connections.map(connectionId => sendMessageToClient(connectionId, message)));
};
