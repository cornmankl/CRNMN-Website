/**
 * Web3 Wallet Authentication Service
 * Implements cryptocurrency wallet-based authentication
 */

export interface WalletProvider {
  name: string;
  icon: string;
  isInstalled: boolean;
  isDetected: boolean;
  connect: () => Promise<WalletConnection>;
}

export interface WalletConnection {
  address: string;
  chainId: number;
  balance?: string;
  ensName?: string;
  nftCount?: number;
}

export interface Web3User {
  walletAddress: string;
  ensName?: string;
  chainId: number;
  balance: string;
  nfts: NFTAsset[];
  premiumMember: boolean;
  loyaltyTokens: number;
}

export interface NFTAsset {
  contractAddress: string;
  tokenId: string;
  name: string;
  image: string;
  attributes: Record<string, any>;
}

export interface SignatureRequest {
  message: string;
  nonce: string;
  timestamp: number;
}

export class Web3AuthService {
  private provider: any;
  private currentWallet?: WalletConnection;

  /**
   * Check if MetaMask is installed
   */
  static isMetaMaskInstalled(): boolean {
    return !!(window as any).ethereum?.isMetaMask;
  }

  /**
   * Check if any Web3 wallet is detected
   */
  static isWeb3Available(): boolean {
    return !!(window as any).ethereum;
  }

  /**
   * Get available wallet providers
   */
  static getAvailableWallets(): WalletProvider[] {
    const wallets: WalletProvider[] = [];

    // MetaMask
    if ((window as any).ethereum?.isMetaMask) {
      wallets.push({
        name: 'MetaMask',
        icon: 'https://docs.metamask.io/img/metamask-fox.svg',
        isInstalled: true,
        isDetected: true,
        connect: () => new Web3AuthService().connectMetaMask()
      });
    }

    // WalletConnect
    wallets.push({
      name: 'WalletConnect',
      icon: 'https://walletconnect.com/walletconnect-logo.svg',
      isInstalled: true, // Always available
      isDetected: true,
      connect: () => new Web3AuthService().connectWalletConnect()
    });

    // Coinbase Wallet
    if ((window as any).ethereum?.isCoinbaseWallet) {
      wallets.push({
        name: 'Coinbase Wallet',
        icon: 'https://www.coinbase.com/img/favicon.ico',
        isInstalled: true,
        isDetected: true,
        connect: () => new Web3AuthService().connectCoinbase()
      });
    }

    return wallets;
  }

  /**
   * Connect to MetaMask
   */
  async connectMetaMask(): Promise<WalletConnection> {
    if (!Web3AuthService.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      const ethereum = (window as any).ethereum;
      
      // Request account access
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your MetaMask wallet.');
      }

      // Get chain ID
      const chainId = await ethereum.request({
        method: 'eth_chainId'
      });

      // Get balance
      const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });

      // Convert balance from wei to ETH
      const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);

      const connection: WalletConnection = {
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        balance: `${balanceInEth} ETH`
      };

      // Try to get ENS name
      try {
        const ensName = await this.getENSName(accounts[0]);
        if (ensName) connection.ensName = ensName;
      } catch {
        // ENS lookup failed, continue without it
      }

      this.currentWallet = connection;
      return connection;
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      
      if (error.code === 4001) {
        throw new Error('Connection request was rejected. Please approve the connection in MetaMask.');
      } else if (error.code === -32002) {
        throw new Error('Connection request is already pending. Please check MetaMask.');
      }
      
      throw new Error('Failed to connect to MetaMask. Please try again.');
    }
  }

  /**
   * Connect via WalletConnect
   */
  async connectWalletConnect(): Promise<WalletConnection> {
    try {
      // In a real implementation, you'd use WalletConnect library
      // For demo purposes, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock WalletConnect response
      const connection: WalletConnection = {
        address: '0x' + Math.random().toString(16).substr(2, 40),
        chainId: 1,
        balance: (Math.random() * 10).toFixed(4) + ' ETH'
      };

      this.currentWallet = connection;
      return connection;
    } catch (error) {
      console.error('WalletConnect error:', error);
      throw new Error('Failed to connect via WalletConnect. Please try again.');
    }
  }

  /**
   * Connect to Coinbase Wallet
   */
  async connectCoinbase(): Promise<WalletConnection> {
    try {
      const ethereum = (window as any).ethereum;
      
      if (!ethereum?.isCoinbaseWallet) {
        throw new Error('Coinbase Wallet not detected');
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      const chainId = await ethereum.request({
        method: 'eth_chainId'
      });

      const connection: WalletConnection = {
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        balance: '0.0000 ETH' // Simplified for demo
      };

      this.currentWallet = connection;
      return connection;
    } catch (error) {
      console.error('Coinbase Wallet error:', error);
      throw new Error('Failed to connect to Coinbase Wallet. Please try again.');
    }
  }

  /**
   * Sign authentication message
   */
  async signAuthenticationMessage(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('No wallet connected');
    }

    const message = this.generateAuthMessage();
    
    try {
      const signature = await this.provider.request({
        method: 'personal_sign',
        params: [message, address]
      });

      return signature;
    } catch (error: any) {
      console.error('Signature error:', error);
      
      if (error.code === 4001) {
        throw new Error('Signature request was rejected');
      }
      
      throw new Error('Failed to sign authentication message');
    }
  }

  /**
   * Get user's NFT assets (mock implementation)
   */
  async getUserNFTs(address: string): Promise<NFTAsset[]> {
    try {
      // In real implementation, query NFT APIs like Alchemy, Moralis, etc.
      // Mock some CRNMN-themed NFTs
      const mockNFTs: NFTAsset[] = [
        {
          contractAddress: '0x742d35cc6aa1234567890...',
          tokenId: '1',
          name: 'Golden Corn #001',
          image: 'https://example.com/corn-nft-1.png',
          attributes: {
            rarity: 'Legendary',
            type: 'Golden Corn',
            harvest: 'Summer 2024',
            loyalty_boost: '50%'
          }
        },
        {
          contractAddress: '0x742d35cc6aa1234567890...',
          tokenId: '47',
          name: 'Premium Kernel #047',
          image: 'https://example.com/corn-nft-47.png',
          attributes: {
            rarity: 'Rare',
            type: 'Premium Kernel',
            discount: '25%',
            early_access: true
          }
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockNFTs;
    } catch (error) {
      console.error('NFT fetch error:', error);
      return [];
    }
  }

  /**
   * Check CRNMN loyalty token balance
   */
  async getLoyaltyTokenBalance(address: string): Promise<number> {
    try {
      // Mock loyalty token balance
      // In real implementation, query your smart contract
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return Math.floor(Math.random() * 10000) + 1000; // 1000-11000 tokens
    } catch (error) {
      console.error('Token balance error:', error);
      return 0;
    }
  }

  /**
   * Generate authentication message for signing
   */
  private generateAuthMessage(): string {
    const nonce = Math.random().toString(36).substring(2);
    const timestamp = Date.now();
    
    return `Welcome to CRNMN!

Click to sign in and accept the Terms of Service.

This request will not trigger a blockchain transaction or cost any gas fees.

Wallet address:
{address}

Nonce: ${nonce}
Timestamp: ${timestamp}`;
  }

  /**
   * Get ENS name for address (mock implementation)
   */
  private async getENSName(address: string): Promise<string | null> {
    try {
      // In real implementation, use ethers.js or similar to resolve ENS
      // Mock ENS names for demo
      const mockENSNames = [
        'cornlover.eth',
        'kernelking.eth',
        'sweetcorn.eth',
        'harvest2024.eth',
        'goldencob.eth'
      ];
      
      // Randomly assign ENS name (10% chance)
      if (Math.random() > 0.9) {
        return mockENSNames[Math.floor(Math.random() * mockENSNames.length)];
      }
      
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Disconnect current wallet
   */
  disconnect(): void {
    this.currentWallet = undefined;
    this.provider = undefined;
  }

  /**
   * Get current wallet connection
   */
  getCurrentWallet(): WalletConnection | undefined {
    return this.currentWallet;
  }

  /**
   * Switch network (for multi-chain support)
   */
  async switchNetwork(chainId: number): Promise<void> {
    if (!this.provider) {
      throw new Error('No wallet connected');
    }

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error: any) {
      // If the chain is not added to MetaMask
      if (error.code === 4902) {
        throw new Error('Network not found in wallet. Please add the network manually.');
      }
      throw new Error('Failed to switch network');
    }
  }
}

/**
 * Utility functions for Web3 authentication
 */
export class Web3AuthUtils {
  /**
   * Format wallet address for display
   */
  static formatAddress(address: string, chars: number = 4): string {
    if (address.length <= chars * 2 + 2) return address;
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  }

  /**
   * Validate Ethereum address format
   */
  static isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Get network name from chain ID
   */
  static getNetworkName(chainId: number): string {
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      137: 'Polygon',
      56: 'BSC',
      43114: 'Avalanche',
      10: 'Optimism',
      42161: 'Arbitrum'
    };
    
    return networks[chainId] || `Chain ID ${chainId}`;
  }

  /**
   * Calculate loyalty benefits based on NFT holdings
   */
  static calculateLoyaltyBenefits(nfts: NFTAsset[]): {
    discountPercentage: number;
    earlyAccess: boolean;
    premiumSupport: boolean;
    loyaltyMultiplier: number;
  } {
    let discountPercentage = 0;
    let earlyAccess = false;
    let premiumSupport = false;
    let loyaltyMultiplier = 1;

    nfts.forEach(nft => {
      const attributes = nft.attributes;
      
      // Apply benefits based on NFT attributes
      if (attributes.rarity === 'Legendary') {
        discountPercentage = Math.max(discountPercentage, 50);
        earlyAccess = true;
        premiumSupport = true;
        loyaltyMultiplier = Math.max(loyaltyMultiplier, 3);
      } else if (attributes.rarity === 'Rare') {
        discountPercentage = Math.max(discountPercentage, 25);
        loyaltyMultiplier = Math.max(loyaltyMultiplier, 2);
      } else if (attributes.rarity === 'Uncommon') {
        discountPercentage = Math.max(discountPercentage, 10);
        loyaltyMultiplier = Math.max(loyaltyMultiplier, 1.5);
      }

      if (attributes.early_access) earlyAccess = true;
      if (attributes.premium_support) premiumSupport = true;
    });

    return {
      discountPercentage,
      earlyAccess,
      premiumSupport,
      loyaltyMultiplier
    };
  }

  /**
   * Generate SIWE (Sign-In with Ethereum) message
   */
  static generateSIWEMessage(
    address: string,
    domain: string,
    nonce: string,
    chainId: number
  ): string {
    const timestamp = new Date().toISOString();
    
    return `${domain} wants you to sign in with your Ethereum account:
${address}

Welcome to CRNMN - Premium Corn Ordering Platform!

By signing this message, you agree to our Terms of Service and confirm ownership of this wallet address.

URI: https://${domain}
Version: 1
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${timestamp}`;
  }

  /**
   * Verify wallet signature (client-side validation)
   */
  static async verifySignature(
    message: string,
    signature: string,
    address: string
  ): Promise<boolean> {
    try {
      // In a real implementation, you'd use ethers.js or similar
      // For demo purposes, we'll simulate verification
      return signature.length > 100 && address.startsWith('0x');
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }
}

/**
 * Mock Web3 Provider for development/testing
 */
export class MockWeb3Provider {
  /**
   * Create a mock wallet connection for testing
   */
  static createMockConnection(): WalletConnection {
    const addresses = [
      '0x742d35Cc6aA39b1234567890abcdef123456789',
      '0x8ba1f109551bD432803012645Hac136c6789012',
      '0x1234567890aBcDeF123456789aBcDeF12345678'
    ];
    
    const address = addresses[Math.floor(Math.random() * addresses.length)];
    const balance = (Math.random() * 50).toFixed(4);
    
    return {
      address,
      chainId: 1,
      balance: `${balance} ETH`,
      nftCount: Math.floor(Math.random() * 10)
    };
  }

  /**
   * Generate mock NFT collection
   */
  static createMockNFTs(): NFTAsset[] {
    const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    const types = ['Golden Corn', 'Silver Kernel', 'Harvest Cob', 'Premium Grain', 'Mystic Corn'];
    
    const nfts: NFTAsset[] = [];
    const nftCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < nftCount; i++) {
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      
      nfts.push({
        contractAddress: '0x742d35cc6aa39b1234567890abcdef123456789',
        tokenId: (i + 1).toString(),
        name: `${type} #${String(i + 1).padStart(3, '0')}`,
        image: `/assets/nft-${i + 1}.png`, // Mock image path
        attributes: {
          rarity,
          type,
          harvest: 'Summer 2024',
          loyalty_boost: rarity === 'Legendary' ? '100%' : 
                        rarity === 'Epic' ? '50%' : 
                        rarity === 'Rare' ? '25%' : '10%',
          discount: rarity === 'Legendary' ? '50%' : 
                   rarity === 'Epic' ? '30%' : 
                   rarity === 'Rare' ? '20%' : '10%',
          early_access: rarity === 'Legendary' || rarity === 'Epic',
          premium_support: rarity === 'Legendary'
        }
      });
    }
    
    return nfts;
  }

  /**
   * Simulate signature creation
   */
  static async mockSignMessage(message: string): Promise<string> {
    // Simulate signing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock signature
    return '0x' + Array.from({length: 130}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}

/**
 * Web3 Authentication Constants
 */
export const Web3AuthConstants = {
  SUPPORTED_CHAINS: {
    ETHEREUM: 1,
    POLYGON: 137,
    BSC: 56,
    AVALANCHE: 43114
  },
  
  CRNMN_CONTRACTS: {
    NFT_COLLECTION: '0x742d35cc6aa39b1234567890abcdef123456789',
    LOYALTY_TOKEN: '0x987654321abcdef1234567890abcdef987654321',
    STAKING_CONTRACT: '0x456789012abcdef3456789012abcdef456789012'
  },

  ERROR_CODES: {
    USER_REJECTED: 4001,
    UNAUTHORIZED: 4100,
    UNSUPPORTED_METHOD: 4200,
    DISCONNECTED: 4900,
    CHAIN_DISCONNECTED: 4901
  }
} as const;