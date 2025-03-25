import type { NextPage } from 'next';

import MainLayout from '@/modules/common/components/layouts/MainLayout';

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  NoSsr,
  Stack,
  Tabs,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import { NextSeo } from 'next-seo';
import { SyntheticEvent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const NftsTab = dynamic(() => import('@/modules/wallet/components/NftsTab'));

const TransactionsTab = dynamic(
  () => import('@/modules/wallet/components/TransactionsTab')
);

const WalletCoinsTab = dynamic(
  () => import('@/modules/wallet/components/WalletCoinsTab')
);

import { Receipt } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import dynamic from 'next/dynamic';

enum PageTabs {
  Portfolio,
  Nfts,
  Transactions,
}

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState(PageTabs.Portfolio);

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    value: PageTabs
  ): void => {
    setActiveTab(value);
  };

  const { formatMessage } = useIntl();

  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'home',
          defaultMessage: 'Home',
        })}
      />
      <MainLayout
        renderBottomNavigation={() => (
          <BottomNavigation
            showLabels
            value={activeTab}
            onChange={(event, newValue) => {
              setActiveTab(newValue);
            }}
          >
            <BottomNavigationAction
              label={<FormattedMessage defaultMessage="Home" id="home" />}
              icon={<HomeIcon />}
            />
            <BottomNavigationAction
              label={<FormattedMessage defaultMessage="NFTs" id="nfts" />}
              icon={<HomeIcon />}
            />
            <BottomNavigationAction
              label={
                <FormattedMessage
                  defaultMessage="Transactions"
                  id="transactions"
                />
              }
              icon={<Receipt />}
            />
          </BottomNavigation>
        )}
      >
        <Stack spacing={2}>
          <Box
            sx={{
              display: { sm: 'block', xs: 'none' },
              borderBottom: 1,
              borderColor: 'divider',
            }}
            className="sad"
          >
            <Tabs value={activeTab} onChange={handleChange}>
              <Tab
                label={
                  <FormattedMessage id="portfolio" defaultMessage="Portfolio" />
                }
                value={PageTabs.Portfolio}
              />
              <Tab
                label={<FormattedMessage id="nfts" defaultMessage="NFTs" />}
                value={PageTabs.Nfts}
              />
              <Tab
                label={
                  <FormattedMessage
                    id="transactions"
                    defaultMessage="Transactions"
                  />
                }
                value={PageTabs.Transactions}
              />
            </Tabs>
          </Box>
          <NoSsr>
            {activeTab === PageTabs.Portfolio && <WalletCoinsTab />}
            {activeTab === PageTabs.Nfts && <NftsTab />}
            {activeTab === PageTabs.Transactions && <TransactionsTab />}
          </NoSsr>
        </Stack>
      </MainLayout>
    </>
  );
};

export default Home;
