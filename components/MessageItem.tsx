import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TMessage, TParticipant } from '../store/type';

interface MessageItemProps {
  message: TMessage;
  participant: TParticipant;
  showHeader: boolean;
}

export const MessageItem = ({ message, participant, showHeader }: MessageItemProps) => {
  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          {participant.avatarUrl && (
            <Image
              source={{ uri: participant.avatarUrl }}
              style={styles.avatar}
            />
          )}
          <Text style={styles.name}>{participant.name}</Text>
          <Text style={styles.time}>
            {new Date(message.sentAt).toLocaleTimeString()}
          </Text>
        </View>
      )}
      <View style={styles.messageContent}>
        <Text style={styles.text}>{message.text}</Text>
        {message.attachments.map((attachment) => (
          attachment.type === 'image' && (
            <Image
              key={attachment.uuid}
              source={{ uri: attachment.url }}
              style={{
                width: '100%',
                height: undefined,
                aspectRatio: attachment.width / attachment.height,
              }}
            />
          )
        ))}
        {message.reactions.length > 0 && (
          <View style={styles.reactions}>
            {message.reactions.map((reaction) => (
              <Text key={reaction.uuid} style={styles.reaction}>
                {reaction.value}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  messageContent: {
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: 8,
    marginLeft: 32,
  },
  text: {
    fontSize: 16,
  },
  reactions: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  reaction: {
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
});