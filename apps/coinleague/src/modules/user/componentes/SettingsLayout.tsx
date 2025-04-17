import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Card, Grid, List, ListItemButton, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

export interface SettingsLayoutProps {
  children: (tab: string) => React.ReactNode;
  tab: string;
  shallow?: boolean;
  title?: React.ReactNode;
  uri?: string;
}

export default function SettingsLayout({
  children,
  tab,
  shallow,
  title,
  uri,
}: SettingsLayoutProps) {
  const activeOption: any = useMemo(() => {
    if (tab === 'ai') {
      return {
        uri: '/u/settings?section=ai',
        active: title ? false : true,
        caption: (
          <FormattedMessage id="ai.assistant" defaultMessage="AI Assistant" />
        ),
      };
    } else if (tab === 'billing') {
      return {
        uri: '/u/settings?section=billing',
        active: title ? false : true,
        caption: <FormattedMessage id="billing" defaultMessage="Billing" />,
      };
    } else if (tab === 'payments') {
      return {
        uri: '/u/settings?section=payments',
        active: title ? false : true,
        caption: <FormattedMessage id="payments" defaultMessage="Payments" />,
      };
    }

    return {};
  }, [tab, title]);

  const router = useRouter();

  const handleClick = useCallback((page: string) => {
    return () => {
      if (page === 'ai') {
        router.push('/u/settings?section=ai', undefined, { shallow });
      } else if (page === 'billing') {
        router.push('/u/settings?section=billing', undefined, {
          shallow,
        });
      } else if (page === 'payments') {
        router.push('/u/settings?section=payments', undefined, {
          shallow,
        });
      }
    };
  }, []);

  const breadcrumbs = useMemo(() => {
    let bc = [
      {
        caption: <FormattedMessage id="home" defaultMessage="Home" />,
        uri: '/',
      },
      /* {
        caption: <FormattedMessage id="settings" defaultMessage="Settings" />,
        uri: '/u/settings',
      },*/
      activeOption,
    ];

    if (title && uri) {
      bc.push({ caption: title, active: true, uri });
    }

    return bc;
  }, [title, activeOption, uri]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PageHeader breadcrumbs={breadcrumbs} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <List disablePadding>
            {/* <ListItemButton
              selected={tab === 'ai'}
              divider
              onClick={handleClick('ai')}
            >
              <ListItemText
                primary={
                  <FormattedMessage
                    defaultMessage="AI Assistant"
                    id="ai.assistant"
                  />
                }
              />
            </ListItemButton> */}
            <ListItemButton
              selected={tab === 'billing'}
              divider
              onClick={handleClick('billing')}
            >
              <ListItemText
                primary={
                  <FormattedMessage defaultMessage="Billing" id="billing" />
                }
              />
            </ListItemButton>
            {/* <ListItemButton
              selected={tab === 'payments'}
              divider
              onClick={handleClick('payments')}
            >
              <ListItemText
                primary={
                  <FormattedMessage
                    defaultMessage="Payment Methods"
                    id="payment.methods"
                  />
                }
              />
            </ListItemButton> */}
          </List>
        </Card>
      </Grid>
      <Grid item xs={12} sm={9}>
        {children(tab)}
      </Grid>
    </Grid>
  );
}
