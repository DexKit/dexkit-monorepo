import type { NextPage } from 'next';

import RankingList from '@/modules/coinleague/components/RankingList';
import RankingListItemSkeleton from '@/modules/coinleague/components/RankingListItemSkeleton';
import { RoomType } from '@/modules/coinleague/constants/enums';
import { useGameProfilesState } from '@/modules/coinleague/hooks/coinleague';
import { RankingType, useRanking } from '@/modules/coinleague/hooks/ranking';
import AppPageHeader from '@/modules/common/components/AppPageHeader';
import MainLayout from '@/modules/common/components/layouts/MainLayout';
import { List, Stack, Tab, Tabs } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

const RankingPage: NextPage = () => {
  const { chainId } = useWeb3React();

  const [room, setRoom] = useState(RoomType.Stable);
  const isNFT = room === RoomType.Stable ? false : true;

  const [tab, setTab] = useState<RankingType>(RankingType.MostWinner);

  const rankingQuery = useRanking(tab, isNFT, chainId);

  const { profiles } = useGameProfilesState(
    rankingQuery.data?.map((p) => p.id)
  );

  const handleChangeTab = (
    _event: React.ChangeEvent<{}>,
    newValue: RankingType
  ) => {
    setTab(newValue);
  };

  return (
    <>
      <MainLayout>
        <Stack spacing={2}>
          <AppPageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage
                    id="coin.league"
                    defaultMessage="Coin League"
                  />
                ),
                uri: '/coinleague',
              },
              {
                caption: (
                  <FormattedMessage id="ranking" defaultMessage="Ranking" />
                ),
                uri: '/coinleague/ranking',
                active: true,
              },
            ]}
          />

          <Tabs
            scrollButtons="auto"
            value={tab}
            onChange={handleChangeTab}
            variant="scrollable"
            TabIndicatorProps={{
              style: { display: 'none' },
            }}
          >
            <Tab
              value={RankingType.MostWinner}
              label={RankingType.MostWinner}
            />
            <Tab
              value={RankingType.MostJoined}
              label={RankingType.MostJoined}
            />
            <Tab
              value={RankingType.MostEarned}
              label={RankingType.MostEarned}
            />
            <Tab
              value={RankingType.MostProfit}
              label={RankingType.MostProfit}
            />
          </Tabs>

          {rankingQuery.isLoading ? (
            <List disablePadding>
              <RankingListItemSkeleton />
              <RankingListItemSkeleton />
              <RankingListItemSkeleton />
              <RankingListItemSkeleton />
              <RankingListItemSkeleton />
              <RankingListItemSkeleton />
            </List>
          ) : (
            rankingQuery.data &&
            profiles && (
              <RankingList
                profiles={profiles}
                ranking={rankingQuery.data}
                chainId={chainId}
              />
            )
          )}
        </Stack>
      </MainLayout>
    </>
  );
};

export default RankingPage;
