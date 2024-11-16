import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TMessage, TParticipant } from './type';

interface ChatState {
  messages: TMessage[];
  participants: TParticipant[];
  sessionUuid: string | null;
  lastUpdate: number;
  setMessages: (messages: TMessage[]) => void;
  addMessage: (message: TMessage) => void;
  updateMessage: (message: TMessage) => void;
  setParticipants: (participants: TParticipant[]) => void;
  setSessionUuid: (uuid: string) => void;
  updateLastUpdate: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      participants: [],
      sessionUuid: null,
      lastUpdate: Date.now(),
      setMessages: (messages) => set({ messages }),
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
      })),
      updateMessage: (message) => set((state) => ({
        messages: state.messages.map((m) => 
          m.uuid === message.uuid ? message : m
        ),
      })),
      setParticipants: (participants) => set({ participants }),
      setSessionUuid: (uuid) => set({ sessionUuid: uuid }),
      updateLastUpdate: () => set({ lastUpdate: Date.now() }),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);