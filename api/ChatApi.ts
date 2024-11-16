const API_BASE = 'http://dummy-chat-server.tribechat.pro/api';

export const chatApi = {
  getInfo: async () => {
    const response = await fetch(`${API_BASE}/info`);
    return response.json();
  },

  getAllMessages: async () => {
    const response = await fetch(`${API_BASE}/messages/all`);
    return response.json();
  },

  getLatestMessages: async () => {
    const response = await fetch(`${API_BASE}/messages/latest`);
    return response.json();
  },

  getOlderMessages: async (refMessageUuid: string) => {
    const response = await fetch(`${API_BASE}/messages/older/${refMessageUuid}`);
    return response.json();
  },

  getMessageUpdates: async (time: number) => {
    const response = await fetch(`${API_BASE}/messages/updates/${time}`);
    return response.json();
  },

  sendNewMessage: async (text: string) => {
    const response = await fetch(`${API_BASE}/messages/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    return response.json();
  },

  getAllParticipants: async () => {
    const response = await fetch(`${API_BASE}/participants/all`);
    return response.json();
  },

  getParticipantUpdates: async (time: number) => {
    const response = await fetch(`${API_BASE}/participants/updates/${time}`);
    return response.json();
  },
};
