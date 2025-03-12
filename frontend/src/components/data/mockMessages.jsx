export const mockConversations = [
    {
      id: 1,
      user: {
        id: 101,
        name: 'Alice',
        profilePicture: 'https://via.placeholder.com/150',
      },
      messages: [
        {
          id: 1,
          senderId: 101,
          content: 'Salut, comment ça va ?',
          timestamp: '2023-10-01T10:00:00Z',
          emotion: 'neutral',
        },
        {
          id: 2,
          senderId: 102,
          content: 'Ça va bien, merci ! Et toi ?',
          timestamp: '2023-10-01T10:05:00Z',
          emotion: 'happy',
        },
      ],
    },
    {
      id: 2,
      user: {
        id: 102,
        name: 'Bob',
        profilePicture: 'https://via.placeholder.com/150',
      },
      messages: [
        {
          id: 3,
          senderId: 102,
          content: 'Tu as vu le dernier film ?',
          timestamp: '2023-10-02T12:00:00Z',
          emotion: 'excited',
        },
        {
          id: 4,
          senderId: 101,
          content: 'Oui, il était génial !',
          timestamp: '2023-10-02T12:05:00Z',
          emotion: 'happy',
        },
      ],
    },
  ];