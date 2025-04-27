import { Page } from '@playwright/test';

export class WalletMock {
  page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  async connect(chainId = '0x61') { // 0x61 = Binance Testnet
    await this.page.waitForSelector('[role="dialog"]', { timeout: 5000 }).catch(() => {
      console.log('Could not find wallet dialog');
    });
    
    const metamaskOption = this.page.getByText(/metamask/i).or(
      this.page.getByRole('button', { name: /metamask/i })
    );
    
    if (await metamaskOption.isVisible()) {
      await metamaskOption.click();
      await this.page.waitForTimeout(500);
    }
    
    await this.page.evaluate((chainId) => {
      const mockAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
      
      const ethereumProvider = {
        isMetaMask: true,
        selectedAddress: mockAddress,
        chainId: chainId,
        networkVersion: parseInt(chainId, 16).toString(),
        isConnected: () => true,
        request: async (request: any) => {
          if (request.method === 'eth_requestAccounts' || request.method === 'eth_accounts') {
            return [mockAddress];
          }
          if (request.method === 'eth_chainId') {
            return chainId;
          }
          if (request.method === 'personal_sign' || request.method === 'eth_sign') {
            return '0x' + '1'.repeat(130);
          }
          if (request.method === 'eth_sendTransaction') {
            return '0x' + '1'.repeat(64);
          }
          console.log('Mock wallet received request:', request);
          return null;
        },
        on: (eventName: string, callback: any) => {
          console.log('Mock wallet registered event listener:', eventName);
          return ethereumProvider;
        },
        removeListener: () => ethereumProvider,
        emit: (eventName: string, payload: any) => {
          console.log(`Mock wallet emitted ${eventName}`, payload);
          return true;
        }
      };

      (window as any).ethereum = ethereumProvider;
      
      const connectEvent = new CustomEvent('wallet_connected', { 
        detail: { address: mockAddress, chainId: chainId }
      });
      document.dispatchEvent(connectEvent);
      
      if (typeof (window as any).ethereum?.emit === 'function') {
        (window as any).ethereum.emit('connect', { chainId });
        (window as any).ethereum.emit('accountsChanged', [mockAddress]);
      }
      
      console.log('Mock wallet connected with address:', mockAddress, 'on chain:', chainId);
      
      (window as any).__walletStatus = {
        connected: true,
        address: mockAddress,
        chainId: chainId,
        timestamp: new Date().toISOString()
      };
    }, chainId);
    
    await this.page.waitForTimeout(1000);
  }

  async confirmTransaction() {
    await this.page.evaluate(() => {
      const txHash = '0x' + Array(64).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)).join('');
      
      const txEvent = new CustomEvent('transactionConfirmed', { 
        detail: { hash: txHash, status: 'success' } 
      });
      document.dispatchEvent(txEvent);
      
      (window as any).__lastMockTx = {
        hash: txHash,
        status: 'success',
        timestamp: new Date().toISOString()
      };
      
      console.log('Mock wallet confirmed transaction:', txHash);
    });
    
    await this.page.waitForTimeout(1000);
  }
  
  async switchNetwork(chainId: string) {
    await this.page.evaluate((chainId) => {
      if (!(window as any).ethereum) return;
      
      (window as any).ethereum.chainId = chainId;
      (window as any).ethereum.networkVersion = parseInt(chainId, 16).toString();
      
      if (typeof (window as any).ethereum?.emit === 'function') {
        (window as any).ethereum.emit('chainChanged', chainId);
      }
      
      console.log('Mock wallet switched to network:', chainId);
    }, chainId);
    
    await this.page.waitForTimeout(500);
  }
  
  /**
   * Simulates the interaction with a specific contract
   * @param contractAddress
   * @param methodName
   * @param params
   */
  async callContractMethod(contractAddress: string, methodName: string, params: any[] = []) {
    await this.page.evaluate(
      ({ contractAddress, methodName, params }) => {
        const txHash = '0x' + Array(64).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)).join('');
        
        (window as any).__lastContractCall = {
          contract: contractAddress,
          method: methodName,
          params,
          txHash,
          timestamp: new Date().toISOString()
        };
        
        if (typeof (window as any).ethereum?.emit === 'function') {
          (window as any).ethereum.emit('message', {
            type: 'eth_subscription',
            data: {
              jsonrpc: '2.0',
              method: 'eth_subscription',
              params: {
                subscription: txHash,
                result: {
                  from: (window as any).ethereum.selectedAddress,
                  to: contractAddress,
                  transactionHash: txHash,
                  status: '0x1'
                }
              }
            }
          });
        }
        
        console.log(`Mock contract call: ${methodName} at ${contractAddress}`, params);
        return txHash;
      },
      { contractAddress, methodName, params }
    );
    
    await this.page.waitForTimeout(500);
  }
} 