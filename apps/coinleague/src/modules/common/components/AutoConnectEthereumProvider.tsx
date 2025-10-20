import { useEffect } from 'react';
import { useConnect } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';

function getProvider() {
  return new Promise((resolve) => {
    //@ts-ignore
    if (window.ethereum) {
      //@ts-ignore
      return resolve(window.ethereum);
    }

    // Recursive function with exponential backoff
    function checkForProvider(attempt = 1, delay = 100) {
      setTimeout(() => {
        //@ts-ignore
        if (window.ethereum) {
          //@ts-ignore
          resolve(window.ethereum);
        } else if (attempt < 7) {
          // Max 7 attempts
          // Exponential backoff with max delay of 5000ms
          const nextDelay = Math.min(delay * 2, 5000);
          checkForProvider(attempt + 1, nextDelay);
        } else {
          console.warn('No ethereum provider detected after maximum attempts');
          resolve(null);
        }
      }, delay);
    }

    // Start the recursive check
    checkForProvider();
  });
}

export function AutoConnectEthereumProvider() {
  const { connect } = useConnect();

  useEffect(() => {
    window.addEventListener('load', async () => {
      try {
        const provider = await getProvider();
        if (!provider) {
          return;
        }
        // Auto-connect request
        //@ts-ignore
        const accounts = await provider.request({
          method: 'eth_requestAccounts',
        });
        if (accounts && accounts.length > 0) {
          //@ts-ignore
          if (window?.ethereum?.isCoinbaseWallet) {
            const wallet = createWallet('com.coinbase.wallet');
            connect(wallet);
          }
          // Update UI, proceed with dapp logic
        } else {
          console.warn('Auto-connect did not return accounts.');
        }
      } catch (error) {
        console.error('Auto-connect failed:', error);
        // Handle connection failure, potentially show manual connect button as fallback
      }
    });
  }, []);

  return <></>;
}
