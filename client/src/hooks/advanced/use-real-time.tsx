import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url?: string;
  protocols?: string | string[];
  onOpen?: (event: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onClose?: (event: CloseEvent) => void;
  shouldReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`,
    protocols,
    onOpen,
    onMessage,
    onError,
    onClose,
    shouldReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;

  const { user } = useAuth();
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef<number>(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(url, protocols);
      wsRef.current = ws;

      ws.onopen = (event) => {
        setReadyState(WebSocket.OPEN);
        reconnectAttemptsRef.current = 0;
        
        // Send authentication message
        if (user) {
          ws.send(JSON.stringify({
            type: 'auth',
            payload: { userId: user.id },
            timestamp: new Date().toISOString()
          }));
        }

        onOpen?.(event);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };

      ws.onclose = (event) => {
        setReadyState(WebSocket.CLOSED);
        wsRef.current = null;
        onClose?.(event);

        // Attempt to reconnect if enabled and within limits
        if (shouldReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
        }
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [url, protocols, user, onOpen, onMessage, onError, onClose, shouldReconnect, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
    setReadyState(WebSocket.CLOSED);
  }, []);

  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: new Date().toISOString()
      };
      wsRef.current.send(JSON.stringify(fullMessage));
    }
  }, []);

  useEffect(() => {
    if (user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  // Update ready state when connection changes
  useEffect(() => {
    const ws = wsRef.current;
    if (ws) {
      setReadyState(ws.readyState);
    }
  }, [wsRef.current]);

  return {
    readyState,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    isConnecting: readyState === WebSocket.CONNECTING,
    isOpen: readyState === WebSocket.OPEN,
    isClosing: readyState === WebSocket.CLOSING,
    isClosed: readyState === WebSocket.CLOSED
  };
}

// Real-time notifications hook
export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const { sendMessage, lastMessage, isOpen } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'notification') {
        setNotifications(prev => [message.payload, ...prev.slice(0, 49)]); // Keep last 50
      }
    }
  });

  const markAsRead = useCallback((notificationId: string) => {
    if (isOpen) {
      sendMessage({
        type: 'mark_notification_read',
        payload: { notificationId }
      });
    }
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  }, [isOpen, sendMessage]);

  const clearAll = useCallback(() => {
    if (isOpen) {
      sendMessage({
        type: 'clear_notifications',
        payload: {}
      });
    }
    setNotifications([]);
  }, [isOpen, sendMessage]);

  return {
    notifications,
    markAsRead,
    clearAll,
    unreadCount: notifications.filter(n => !n.read).length
  };
}

// Real-time course updates hook
export function useRealTimeCourseUpdates(courseId?: number) {
  const [updates, setUpdates] = useState<any[]>([]);
  
  const { sendMessage, lastMessage, isOpen } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'course_update' && 
          (!courseId || message.payload.courseId === courseId)) {
        setUpdates(prev => [message.payload, ...prev.slice(0, 19)]); // Keep last 20
      }
    }
  });

  useEffect(() => {
    if (isOpen && courseId) {
      sendMessage({
        type: 'subscribe_course',
        payload: { courseId }
      });

      return () => {
        sendMessage({
          type: 'unsubscribe_course',
          payload: { courseId }
        });
      };
    }
  }, [isOpen, courseId, sendMessage]);

  return {
    updates,
    clearUpdates: () => setUpdates([])
  };
}

// Real-time assignment status hook
export function useRealTimeAssignmentStatus() {
  const [assignmentStatuses, setAssignmentStatuses] = useState<Map<number, any>>(new Map());
  
  const { sendMessage, lastMessage, isOpen } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'assignment_status_update') {
        setAssignmentStatuses(prev => {
          const newMap = new Map(prev);
          newMap.set(message.payload.assignmentId, message.payload);
          return newMap;
        });
      }
    }
  });

  const subscribeToAssignment = useCallback((assignmentId: number) => {
    if (isOpen) {
      sendMessage({
        type: 'subscribe_assignment',
        payload: { assignmentId }
      });
    }
  }, [isOpen, sendMessage]);

  const unsubscribeFromAssignment = useCallback((assignmentId: number) => {
    if (isOpen) {
      sendMessage({
        type: 'unsubscribe_assignment',
        payload: { assignmentId }
      });
    }
  }, [isOpen, sendMessage]);

  return {
    assignmentStatuses,
    subscribeToAssignment,
    unsubscribeFromAssignment,
    getAssignmentStatus: (assignmentId: number) => assignmentStatuses.get(assignmentId)
  };
}