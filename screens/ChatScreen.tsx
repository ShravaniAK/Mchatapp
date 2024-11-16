import React, { useEffect, useCallback, useRef } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { MessageItem } from '../components/MessageItem';
import { MessageInput } from '../components/MessageInput';
import { useChatStore } from '../store/chatStore';
import { chatApi } from '../api/ChatApi';
import { TMessage } from '../store/type';

export default function ChatScreen() {
  const {
    messages,
    participants,
    sessionUuid,
    lastUpdate,
    setMessages,
    setParticipants,
    setSessionUuid,
    updateLastUpdate,
  } = useChatStore();

  const updateInterval = useRef<NodeJS.Timeout>();

  const initializeChat = async () => {
    try {
      const info = await chatApi.getInfo();
      
      if (info.sessionUuid !== sessionUuid) {
        const [messages, participants] = await Promise.all([
          chatApi.getAllMessages(),
          chatApi.getAllParticipants(),
        ]);
        
        setSessionUuid(info.sessionUuid);
        setMessages(messages);
        setParticipants(participants);
        updateLastUpdate();
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  };

  const checkUpdates = async () => {
    try {
      const [messageUpdates, participantUpdates] = await Promise.all([
        chatApi.getMessageUpdates(lastUpdate),
        chatApi.getParticipantUpdates(lastUpdate),
      ]);

      if (messageUpdates.length > 0 || participantUpdates.length > 0) {
        if (messageUpdates.length > 0) {
          setMessages([...messages, ...messageUpdates]);
        }
        if (participantUpdates.length > 0) {
          setParticipants([...participants, ...participantUpdates]);
        }
        updateLastUpdate();
      }
    } catch (error) {
      console.error('Failed to check updates:', error);
    }
  };

  useEffect(() => {
    initializeChat();

    updateInterval.current = setInterval(checkUpdates, 5000);

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, []);

  const renderMessage = useCallback(({ item, index }: { item: TMessage; index: number }) => {
    const participant = participants.find(p => p.uuid === item.authorUuid);
    if (!participant) return null;

    const showHeader = index === 0 || 
      messages[index - 1].authorUuid !== item.authorUuid;

    return (
      <MessageItem
        message={item}
        participant={participant}
        showHeader={showHeader}
      />
    );
  }, [participants, messages]);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.uuid}
        inverted
      />
      <MessageInput />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
