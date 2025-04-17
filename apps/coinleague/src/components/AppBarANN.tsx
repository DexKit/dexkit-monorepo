import Link from '@dexkit/ui/components/AppLink';
import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { FormattedMessage } from 'react-intl';

export function AppBarANN() {
  let hostname;
  if (typeof window !== 'undefined') {
    hostname = window.location.hostname;
  }

  return (
    <>
      {(hostname === 'dexappbuilder.dexkit.com' ||
        hostname === 'dexappbuilder.com') && (
        <AppBar position="static" sx={{ pt: 1, pb: 1 }}>
          <Box display={'flex'} justifyContent={'center'}>
            <Typography sx={{ pr: 1 }}>😉👉</Typography>
            <Typography>
              <FormattedMessage
                id={'dexappbuilder.ann.app.bar2'}
                defaultMessage={
                  'Support us on {Giveth} and allow our service to be free for all. Each donation is matched by ENS builders round.'
                }
                values={{
                  Giveth: (
                    <Link
                      color={'secondary'}
                      href={
                        'https://giveth.io/project/dexappbuilder-the-no-codelow-code-toolkit-of-dexkit'
                      }
                      target="_blank"
                    >
                      Giveth
                    </Link>
                  ),
                  Gitcoin: (
                    <Link
                      color={'secondary'}
                      href={'https://passport.gitcoin.co/'}
                      target="_blank"
                    >
                      Gitcoin Passport
                    </Link>
                  ),
                }}
              />
            </Typography>
          </Box>
        </AppBar>
      )}
    </>
  );
}
