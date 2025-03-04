import { IconButton, Stack, TableCell, TableRow } from '@mui/material';
import { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { ConfigResponse } from '../../../../types/whitelabel';

import Link from '@dexkit/ui/components/AppLink';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Props {
  config: ConfigResponse;
  handleDeploy: (config: ConfigResponse) => void;
  onMenu: (
    event: React.MouseEvent<HTMLElement>,
    config: ConfigResponse,
  ) => void;
}

function MarketplacesTableRow({ config, onMenu, handleDeploy }: Props) {
  const appConfig: AppConfig = JSON.parse(config.config);
  const domainStatusText = useMemo(() => {
    if (config?.domainStatus === 'NOT_VERIFIED') {
      return (
        <FormattedMessage id="not.verified" defaultMessage="Not verified" />
      );
    }

    if (config?.domainStatus === 'VERIFIED') {
      return <FormattedMessage id="verified" defaultMessage="Verified" />;
    }
    return <FormattedMessage id="not.deployed" defaultMessage="Not deployed" />;
  }, [config?.domainStatus]);

  return (
    <TableRow>
      <TableCell>{appConfig.name}</TableCell>
      <TableCell>
        <Stack>
          {appConfig.domain && (
            <Link href={appConfig.domain} target={'_blank'}>
              {appConfig.domain}
            </Link>
          )}
          {config.previewUrl && (
            <Link href={config.previewUrl} target={'_blank'}>
              {config.previewUrl}
            </Link>
          )}
        </Stack>
      </TableCell>
      {/*<TableCell>
        {config?.cname || (
          <Button
            variant="contained"
            endIcon={<PublishIcon />}
            onClick={() => handleDeploy(config)}
          >
            <FormattedMessage id="deploy" defaultMessage="Deploy" />
          </Button>
        )}
      </TableCell>
        <TableCell>{domainStatusText}</TableCell>*/}
      <TableCell>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-haspopup="true"
          onClick={(e) => onMenu(e, config)}
        >
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default memo(MarketplacesTableRow);
