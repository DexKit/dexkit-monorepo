import { Alert, AlertTitle, Button, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNftProfileValidator } from '../hooks/useNftProfileValidator';

interface NftProfileValidatorProps {
  checkIntervalSeconds?: number;
}

export function NftProfileValidator({ checkIntervalSeconds = 300 }: NftProfileValidatorProps) {
  const { validationResult, isValidating, validateNow, hasNftProfile } = useNftProfileValidator(checkIntervalSeconds);
  const [showNotification, setShowNotification] = useState(false);
  
  useEffect(() => {
    if (validationResult && !validationResult.success) {
      setShowNotification(true);
    }
  }, [validationResult]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
  };

  return (
    <>
      {validationResult && !validationResult.success && (
        <Snackbar 
          open={showNotification} 
          autoHideDuration={20000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleClose} 
            severity="warning" 
            sx={{ width: '100%' }}
            action={
              <Button color="inherit" size="small" onClick={validateNow}>
                <FormattedMessage id="verify.again" defaultMessage="Verificar de nuevo" />
              </Button>
            }
          >
            <AlertTitle>
              <FormattedMessage id="nft.profile.removed" defaultMessage="NFT Profile Removed" />
            </AlertTitle>
            <FormattedMessage 
              id="nft.profile.removed.message" 
              defaultMessage="Your NFT profile picture has been removed because you no longer own the NFT." 
            />
          </Alert>
        </Snackbar>
      )}
    </>
  );
}