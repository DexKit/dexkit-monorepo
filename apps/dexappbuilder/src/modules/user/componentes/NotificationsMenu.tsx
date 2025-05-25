import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUserNotifications } from '../hooks/useUserNotifications';

export function NotificationsMenu() {
  const intl = useIntl();
  const { notifications, unreadCount, markAsRead } = useUserNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    handleClose();
  };

  const getDateLocale = () => {
    return intl.locale.startsWith('es') ? es : enUS;
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 300,
            maxWidth: 360,
            maxHeight: 500,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 'bold' }}>
          <FormattedMessage id="notifications" defaultMessage="Notifications" />
        </Typography>
        <Divider />
        
        {notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage id="no.notifications" defaultMessage="No notifications" />
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => {
            const isNftRelated = notification.metadata?.type === 'nft_profile_removed';
            
            return (
              <MenuItem 
                key={notification.id} 
                onClick={() => handleNotificationClick(notification.id)}
                sx={{ 
                  opacity: notification.readAt ? 0.7 : 1,
                  bgcolor: notification.readAt ? 'transparent' : 'action.hover',
                  py: 1.5
                }}
              >
                {notification.icon?.url ? (
                  <ListItemIcon>
                    <Avatar 
                      src={notification.icon.url} 
                      alt=""
                      sx={{ width: 40, height: 40 }}
                    />
                  </ListItemIcon>
                ) : (
                  <ListItemIcon>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {isNftRelated ? 'NFT' : 'N'}
                    </Avatar>
                  </ListItemIcon>
                )}
                
                <ListItemText
                  primary={notification.title[intl.locale.startsWith('es') ? 'es' : 'en']}
                  secondary={
                    <>
                      <Typography variant="body2" component="span" display="block">
                        {notification.subtitle[intl.locale.startsWith('es') ? 'es' : 'en']}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(notification.createdAt), { 
                          addSuffix: true,
                          locale: getDateLocale()
                        })}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{ fontWeight: notification.readAt ? 'normal' : 'bold' }}
                />
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
}