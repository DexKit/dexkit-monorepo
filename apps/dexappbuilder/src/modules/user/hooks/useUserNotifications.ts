import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import axios from 'axios';
import { useEffect, useState } from 'react';

export interface Notification {
  id: string;
  title: { en: string; es: string };
  subtitle: { en: string; es: string };
  icon?: { url: string };
  metadata?: any;
  createdAt: string;
  readAt?: string;
}

export function useUserNotifications() {
  const { account } = useWeb3React();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!account) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/user/notifications');
      setNotifications(response.data);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.post(`/api/user/notifications/${notificationId}/read`);
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, readAt: new Date().toISOString() } 
            : notification
        )
      );
    } catch (err) {
    }
  };

  useEffect(() => {
    if (account) {
      fetchNotifications();
    }
  }, [account]);

  useEffect(() => {
    if (!account) return;

    const intervalId = setInterval(fetchNotifications, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [account]);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.readAt).length,
    loading,
    error,
    fetchNotifications,
    markAsRead
  };
}