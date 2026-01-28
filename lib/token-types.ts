export interface TokenCreateRequest {
  name: string;
  symbol: string;
  totalSupply: number;
  decimals?: number;
  accessToken: string;
}

export interface TokenCreateResponse {
  success: boolean;
  tokenId: string;
  name: string;
  symbol: string;
  totalSupply: number;
  decimals: number;
  network: string;
  createdAt: string;
  contractAddress: string;
}

export interface TokenInfo {
  tokenId: string;
  name: string;
  symbol: string;
  totalSupply: number;
  decimals: number;
  contractAddress: string;
  createdAt: string;
}
