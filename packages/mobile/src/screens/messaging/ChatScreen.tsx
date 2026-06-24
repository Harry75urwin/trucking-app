import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api/client';
import type { Message, Conversation } from '../../types';

import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { conversationId } = route.params;
  const { user, token, loads } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [chatError, setChatError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const loadMessages = async () => {
    if (!token || !conversationId) return;
    try {
      const msgs = await apiClient.get<Message[]>(`/messaging/conversations/${conversationId}/messages?limit=50`, token);
      setMessages(msgs);
    } catch (e) {
      console.error('Failed to load messages', e);
    }
  };

  const loadConversation = async () => {
    if (!token || !conversationId || !user) return;
    try {
      const conv = await apiClient.get<Conversation>(`/messaging/conversations/${conversationId}?userId=${user.id}`, token);
      setConversation(conv);
    } catch (e) {
      console.error('Failed to load conversation', e);
    }
  };

  useEffect(() => {
    if (token && conversationId && user) {
      Promise.all([loadMessages(), loadConversation()])
        .then(() => setLoading(false))
        .catch((e) => {
          const message = e instanceof Error ? e.message : 'Failed to load chat';
          setChatError(message);
          setLoading(false);
        });
    }
  }, [conversationId, token, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    setChatError(null);
    if (token && conversationId && user) {
      try {
        await Promise.all([loadMessages(), loadConversation()]);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to refresh chat';
        Alert.alert('Error', message);
      }
    }
    setRefreshing(false);
  };

  const handleSend = async () => {
    if (!messageBody.trim() || !token || !conversationId || !user || !conversation) return;
    setSendError(null);

    try {
      const saved: Message = await apiClient.post<Message>(
        '/messaging/messages',
        {
          conversationId,
          senderId: user.id,
          receiverId: conversation.receiverId ?? conversation.createdBy,
          body: messageBody.trim(),
        },
        token,
      );

      setMessages((prev) => [...prev, saved]);
      setMessageBody('');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to send message';
      setSendError(message);
      Alert.alert('Error', message);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === user?.id;
    return (
      <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.otherMessage]}>
        <Text style={[styles.messageText, isMine && styles.myMessageText]}>
          {item.body}
        </Text>
        <Text style={[styles.messageTime, isMine && styles.myMessageTime]}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chat</Text>
        </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          chatError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{chatError}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => {
                setChatError(null);
                setLoading(true);
                if (token && conversationId && user) {
                  Promise.all([loadMessages(), loadConversation()])
                    .then(() => setLoading(false))
                    .catch((e) => {
                      const message = e instanceof Error ? e.message : 'Failed to load chat';
                      setChatError(message);
                      setLoading(false);
                    });
                }
              }}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
            </View>
          )
        }
      />

      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {sendError && <Text style={styles.sendErrorText}>{sendError}</Text>}
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={messageBody}
          onChangeText={setMessageBody}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !messageBody.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!messageBody.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 16,
    color: '#4f46e5',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  myMessage: {
    backgroundColor: '#4f46e5',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
  },
  myMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  sendErrorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 4,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});