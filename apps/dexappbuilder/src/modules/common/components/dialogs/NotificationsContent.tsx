import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUserNotifications } from '../../../user/hooks/useUserNotifications';

export function NotificationsContent() {
  const intl = useIntl();
  const { notifications, markAsRead, loading } = useUserNotifications();
  
  const getDateLocale = () => {
    return intl.locale.startsWith('es') ? es : enUS;
  };
  
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };
  
  if (loading && notifications.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage id="loading.notifications" defaultMessage="Loading notifications..." />
        </Typography>
      </Box>
    );
  }
  
  if (notifications.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage id="no.notifications" defaultMessage="No notifications" />
        </Typography>
      </Box>
    );
  }
  
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {notifications.map((notification) => {
        const isNftRelated = notification.metadata?.type === 'nft_profile_removed';
        const isUnread = !notification.readAt;
        
        return (
          <Box key={notification.id}>
            <ListItem 
              alignItems="flex-start"
              onClick={() => handleNotificationClick(notification.id)}
              sx={{ 
                cursor: 'pointer',
                bgcolor: isUnread ? 'action.hover' : 'transparent',
                '&:hover': {
                  bgcolor: 'action.selected',
                }
              }}
            >
              <ListItemAvatar>
                {notification.icon?.url ? (
                  <Avatar alt="" src={notification.icon.url} />
                ) : (
                  <Avatar>
                    {isNftRelated ? 'NFT' : 'N'}
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography 
                    variant="subtitle2" 
                    color="text.primary"
                    fontWeight={isUnread ? 'bold' : 'normal'}
                  >
                    {notification.title[intl.locale.startsWith('es') ? 'es' : 'en']}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      display="block"
                    >
                      {notification.subtitle[intl.locale.startsWith('es') ? 'es' : 'en']}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {formatDistanceToNow(new Date(notification.createdAt), { 
                        addSuffix: true,
                        locale: getDateLocale()
                      })}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </Box>
        );
      })}
    </List>
  );
}
