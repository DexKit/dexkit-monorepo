import { providers } from "ethers";

export class RetryProvider extends providers.JsonRpcProvider {
  private maxRetries = 5;
  private initialRetryDelay = 2000;
  private maxRetryDelay = 10000;
  
  constructor(url: string, network?: providers.Networkish, private isBaseNetwork: boolean = false) {
    super(url, network);
    
    if (isBaseNetwork) {
      this.maxRetries = 7;
      this.initialRetryDelay = 3000;
      this.maxRetryDelay = 15000;
    }
  }

  async send(method: string, params: Array<any>): Promise<any> {
    let lastError;
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await super.send(method, params);
      } catch (error: any) {
        lastError = error;
        console.error(`RPC error attempt ${i+1}/${this.maxRetries}:`, error.message || error);
        
        const shouldRetry = this.shouldRetryError(error);
        
        if (shouldRetry) {
          const delay = Math.min(
            this.maxRetryDelay,
            this.initialRetryDelay * Math.pow(1.5, i) * (0.9 + Math.random() * 0.2)
          );
          
          console.log(`Waiting ${Math.round(delay)}ms before retrying...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        throw error;
      }
    }
    
    console.error(`All retries (${this.maxRetries}) for the RPC operation have been exhausted`);
    throw lastError;
  }
  
  private shouldRetryError(error: any): boolean {
    if (error.statusCode === 429) return true;
    
    if (error.statusCode && error.statusCode >= 500 && error.statusCode < 600) return true;
    
    if (error.message && (
      error.message.includes("429") ||
      error.message.includes("rate limit") ||
      error.message.includes("exceeded") ||
      error.message.includes("timeout") ||
      error.message.includes("too many requests") ||
      error.message.includes("server busy") ||
      error.message.includes("try again") ||
      error.message.includes("service unavailable")
    )) return true;
    
    if (error.code && (
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND'
    )) return true;
    
    return false;
  }
}

export const createRetryProvider = (url: string, network?: providers.Networkish, isBaseNetwork: boolean = false) => {
  return new RetryProvider(url, network, isBaseNetwork);
}; 