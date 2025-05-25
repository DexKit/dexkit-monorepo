import { useListDeployedContracts } from '@/modules/forms/hooks';
import { useIsMobile } from '@dexkit/core';
import LazyTextField from '@dexkit/ui/components/LazyTextField';

import { DeployedContract } from '@/modules/forms/types';
import { ipfsUriToUrl, parseChainId } from '@dexkit/core/utils';
import { useActiveChainIds } from '@dexkit/ui/hooks';
import {
  DexGeneratorPageSection,
  ReferralPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Error from '@mui/icons-material/Error';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Search from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { NETWORKS } from 'src/constants/chain';

import { getChainSlug } from '@dexkit/core/utils/blockchain';
import LinkIcon from '@mui/icons-material/Link';
import {
  DEX_GENERATOR_CONTRACT_TYPES,
  DEX_GENERATOR_CONTRACT_TYPES_AVAIL,
} from '../../../constants';
import DexGeneratorSectionCard from '../../DexGeneratorSectionCard';
import DexGeneratorContractForm from './DexGeneratorContractForm';
import DexGeneratorReferralForm from './DexGeneratorReferralForm';

export interface DexGeneratorSectionFormProps {
  onSave: (section: DexGeneratorPageSection) => void;
  onChange: (section: DexGeneratorPageSection) => void;
  onCancel: () => void;
  section?: DexGeneratorPageSection;
  showSaveButton?: boolean;
}

export default function DexGeneratorSectionForm({
  onSave,
  onChange,
  onCancel,
  section,
  showSaveButton,
}: DexGeneratorSectionFormProps) {
  const { account } = useWeb3React();
  const { activeChainIds } = useActiveChainIds();
  const isMobile = useIsMobile();
  const [type, setType] = useState<string>('all');
  const [contract, setContract] = useState<DeployedContract | undefined>(
    section?.contract,
  );

  const [chainId, setChainId] = useState(-1);
  const [query, setQuery] = useState<string>();

  const filter = useMemo(() => {
    let f: any = {
      owner: account?.toLowerCase(),
      type: { in: DEX_GENERATOR_CONTRACT_TYPES_AVAIL },
    };

    if (query) {
      f.q = query;
    }

    if (type && type !== '' && type !== undefined && type !== 'all') {
      f.type = type;
    }

    if (chainId > -1) {
      f.chainId = chainId;
    }

    return f;
  }, [query, account, type, chainId]);

  const [page, setPage] = useState(0);

  const handleNext = () => {
    setPage((page) => page + 1);
  };

  const handlePrev = () => {
    setPage((page) => page - 1);
  };

  const listContractsQuery = useListDeployedContracts({
    filter,
    page,
    pageSize: 10,
    sort: ['id', 'desc'],
  });

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const [currSection, setCurrSection] = useState<
    DexGeneratorPageSection | undefined
  >(section);

  useEffect(() => {
    if (section) {
      setCurrSection(section);
    }
  }, [section]);

  const handleChangeSection = useCallback(
    (section: DexGeneratorPageSection) => {
      setCurrSection(section);
      onChange(section);
    },
    [contract, onChange],
  );

  const handleClick = useCallback(
    (newContract: DeployedContract) => {
      if (newContract.id === contract?.id) {
        return setContract(undefined);
      }

      setContract(newContract);

      let network = getChainSlug(newContract?.chainId);

      if (network) {
        if (newContract.type === 'DropERC20') {
          handleChangeSection({
            section: {
              type: 'token-drop',
              settings: {
                address: newContract.contractAddress,
                network,
                variant: 'simple',
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'DropERC721') {
          handleChangeSection({
            section: {
              type: 'nft-drop',
              settings: {
                address: newContract.contractAddress,
                network,
                variant: 'simple',
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'DropERC1155') {
          handleChangeSection({
            section: {
              type: 'edition-drop-section',
              config: {
                network,
                address: newContract.contractAddress,
                tokenId: '',
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'StakeERC721') {
          handleChangeSection({
            section: {
              type: 'nft-stake',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'StakeERC1155') {
          handleChangeSection({
            section: {
              type: 'edition-stake',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'StakeERC20') {
          handleChangeSection({
            section: {
              type: 'token-stake',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'AirdropERC20') {
          handleChangeSection({
            section: {
              type: 'airdrop-token',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'TokenERC20') {
          handleChangeSection({
            section: {
              type: 'token',
              settings: {
                address: newContract.contractAddress,
                network,
                disableBurn: false,
                disableInfo: false,
                disableMint: false,
                disableTransfer: false,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (
          newContract.type === 'TokenERC721' ||
          newContract.type === 'TokenERC1155'
        ) {
          handleChangeSection({
            section: {
              type: 'collection',
              config: {
                address: newContract.contractAddress,
                network,
                hideAssets: false,
                hideDrops: false,
                hideFilters: false,
                hideHeader: false,
                showPageHeader: true,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'TokenStake') {
          handleChangeSection({
            section: {
              type: 'token-stake',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'NFTStake') {
          handleChangeSection({
            section: {
              type: 'nft-stake',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'EditionStake') {
          handleChangeSection({
            section: {
              type: 'edition-stake',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        } else if (newContract.type === 'AirdropERC20Claimable') {
          handleChangeSection({
            section: {
              type: 'claim-airdrop-token-erc-20',
              settings: {
                address: newContract.contractAddress,
                network,
              },
            },
            contract: newContract,
            type: 'dex-generator-section',
          });
        }
      }
    },
    [contract, handleChangeSection],
  );

  const handleSave = useCallback(() => {
    if (currSection) {
      if (
        currSection.section &&
        'type' in currSection.section &&
        currSection.section.type === 'referral'
      ) {
        onSave(currSection);
      } else if (contract) {
        onSave(currSection);
      }
    }
  }, [onSave, currSection, contract]);

  const handleChangeType = (e: SelectChangeEvent) => {
    setType(e.target.value);
    setContract(undefined);
  };

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .filter((nk) => activeChainIds.includes(Number(nk)))
      .map((key: string) => NETWORKS[parseChainId(key)]);
  }, []);

  const handleChangeChainId = (e: SelectChangeEvent<number>) => {
    return setChainId(parseChainId(e.target.value));
  };

  const handleCreateReferralSection = () => {
    handleChangeSection({
      type: 'dex-generator-section',
      section: {
        type: 'referral',
        title: '',
        subtitle: '',
        config: {
          showStats: true,
          showLeaderboard: true,
          rankingId: undefined,
        },
      } as ReferralPageSection,
    });
  };

  return (
    <Box>
      <Grid container spacing={isMobile ? 1 : 2}>
        {!contract && (
          <Grid item xs={12}>
            <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
              <InputLabel>
                <FormattedMessage id="network" defaultMessage="Network" />
              </InputLabel>
              <Select
                label={
                  <FormattedMessage id="network" defaultMessage="Network" />
                }
                name="network"
                fullWidth
                value={chainId}
                onChange={handleChangeChainId}
                size={isMobile ? 'small' : 'medium'}
                renderValue={(value: number) => {
                  if (value === -1) {
                    return <FormattedMessage id="all" defaultMessage="All" />;
                  }

                  return (
                    <Stack
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      spacing={1}
                    >
                      <Avatar
                        src={ipfsUriToUrl(
                          networks.find(
                            (n) => n.chainId === parseChainId(value),
                          )?.imageUrl || '',
                        )}
                        style={{
                          width: 'auto',
                          height: isMobile ? '0.8rem' : '1rem',
                        }}
                      />
                      <Typography variant={isMobile ? 'caption' : 'body1'}>
                        {
                          networks.find(
                            (n) => n.chainId === parseChainId(value),
                          )?.name
                        }
                      </Typography>
                    </Stack>
                  );
                }}
              >
                <MenuItem value={-1}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText
                    primary={<FormattedMessage id="all" defaultMessage="All" />}
                  />
                </MenuItem>
                {networks.map((n) => (
                  <MenuItem key={n.chainId} value={n.chainId}>
                    <ListItemIcon>
                      <Avatar
                        src={ipfsUriToUrl(n?.imageUrl || '')}
                        style={{
                          width: isMobile ? '0.8rem' : '1rem',
                          height: isMobile ? '0.8rem' : '1rem',
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={n.name}
                      primaryTypographyProps={{
                        variant: isMobile ? 'caption' : 'body1',
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12}>
          <Grid container spacing={isMobile ? 1 : 2}>
            <Grid item xs>
              <LazyTextField
                TextFieldProps={{
                  size: 'small',
                  fullWidth: true,
                  margin: isMobile ? 'dense' : 'normal',
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize={isMobile ? 'small' : 'medium'} />
                      </InputAdornment>
                    ),
                    style: isMobile ? { fontSize: '0.85rem' } : {},
                  },
                }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel htmlFor="contractType" shrink>
                  <FormattedMessage
                    id="contract.type"
                    defaultMessage="Contract Type"
                  />
                </InputLabel>
                <Select
                  id="contractType"
                  size="small"
                  label={
                    <FormattedMessage
                      id="contract.type"
                      defaultMessage="Contract Type"
                    />
                  }
                  fullWidth
                  value={type}
                  onChange={handleChangeType}
                  sx={
                    isMobile
                      ? {
                          '& .MuiInputBase-input': { fontSize: '0.85rem' },
                          '& .MuiInputLabel-root': { fontSize: '0.85rem' },
                        }
                      : {}
                  }
                >
                  <MenuItem value="all">
                    <FormattedMessage id="all" defaultMessage="All" />
                  </MenuItem>
                  {DEX_GENERATOR_CONTRACT_TYPES.map((type) => (
                    <MenuItem value={type.type} key={type.type}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {!contract && (
          <Grid item xs={12}>
            <Grid container spacing={isMobile ? 0.5 : 2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    overflowY: 'scroll',
                    maxHeight: isMobile ? '15rem' : '20rem',
                  }}
                >
                  <Grid container spacing={isMobile ? 0.5 : 2}>
                    {listContractsQuery.data?.data.length === 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ py: isMobile ? 1 : 2 }}>
                          <Stack alignItems="center">
                            <Error fontSize={isMobile ? 'small' : 'large'} />
                            <Typography
                              align="center"
                              variant={isMobile ? 'body2' : 'h5'}
                            >
                              <FormattedMessage
                                id="no.contracts.found"
                                defaultMessage="No contracts found"
                              />
                            </Typography>
                          </Stack>
                        </Box>
                      </Grid>
                    )}
                    {listContractsQuery.data?.data?.map((c) => (
                      <Grid key={c.id} item xs={12}>
                        <DexGeneratorSectionCard
                          id={c.id}
                          type={c.type}
                          chainId={c.chainId}
                          name={c.name}
                          onClick={() => handleClick(c)}
                          isMobile={isMobile}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton
                      disabled={page === 0}
                      onClick={handlePrev}
                      size={isMobile ? 'small' : 'medium'}
                    >
                      <KeyboardArrowLeftIcon
                        fontSize={isMobile ? 'small' : 'medium'}
                      />
                    </IconButton>
                    <IconButton
                      disabled={
                        listContractsQuery.data !== undefined &&
                        listContractsQuery.data.data.length !== 10
                      }
                      onClick={handleNext}
                      size={isMobile ? 'small' : 'medium'}
                    >
                      <KeyboardArrowRightIcon
                        fontSize={isMobile ? 'small' : 'medium'}
                      />{' '}
                    </IconButton>
                  </Stack>
                </Box>
              </Grid>
              {listContractsQuery.isLoading &&
                new Array(isMobile ? 3 : 5).fill(null).map((_, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent sx={isMobile ? { padding: '8px 12px' } : {}}>
                        <Typography variant={isMobile ? 'body1' : 'h5'}>
                          <Skeleton />
                        </Typography>
                        <Typography variant={isMobile ? 'caption' : 'body1'}>
                          <Skeleton />
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        )}
        {contract && (
          <Grid item xs={12}>
            <DexGeneratorContractForm
              onChange={handleChangeSection}
              onCancel={() => {
                setContract(undefined);
                handleChangeSection({
                  type: 'dex-generator-section',
                  contract: undefined,
                  section: undefined,
                });
              }}
              params={{
                address: contract.contractAddress,
                contractType: contract.type || '',
                network: getChainSlug(contract.chainId) || '',
                name: contract.name,
              }}
              section={currSection?.section}
              contract={contract}
            />
          </Grid>
        )}
        {showSaveButton && (
          <Grid item xs={12}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                justifyContent="flex-end"
              >
                <Button onClick={onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button
                  disabled={
                    !contract &&
                    !(
                      currSection?.section &&
                      'type' in currSection.section &&
                      currSection.section.type === 'referral'
                    )
                  }
                  onClick={handleSave}
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </Box>
          </Grid>
        )}
        {currSection?.section &&
          'type' in currSection.section &&
          currSection.section.type === 'referral' && (
            <Box mt={2}>
              <DexGeneratorReferralForm
                onChange={(section) => {
                  handleChangeSection({
                    ...currSection,
                    section: section as any,
                  });
                }}
                section={currSection.section as ReferralPageSection}
              />
            </Box>
          )}
        <Grid item xs={12}>
          <Box>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCreateReferralSection}
              startIcon={<LinkIcon />}
              sx={{ mt: 2 }}
            >
              <FormattedMessage
                id="create.referral.section"
                defaultMessage="Create Referral Section"
              />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
