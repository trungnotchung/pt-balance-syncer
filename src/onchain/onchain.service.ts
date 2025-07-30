import { Injectable } from '@nestjs/common';
import {
  AbiEvent,
  Address,
  createPublicClient,
  erc20Abi,
  formatUnits,
  http,
} from 'viem';
import { mainnet } from 'viem/chains';

import { ethereumConfig } from 'src/config';

@Injectable()
export class OnchainService {
  private readonly viemClient;

  constructor() {
    this.viemClient = createPublicClient({
      chain: mainnet,
      transport: http(ethereumConfig().rpcUrl),
    });
  }

  async getUserBalanceOnChain(
    tokenAddress: string,
    userAddress: string,
  ): Promise<string> {
    const rawBalance = await this.viemClient.readContract({
      address: tokenAddress as Address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [userAddress as Address],
    });

    return formatUnits(rawBalance, 18);
  }

  async getLatestBlock(): Promise<bigint> {
    const block = await this.viemClient.getBlockNumber();
    return block;
  }

  async getLogs(
    contractAddress: string,
    event: AbiEvent,
    fromBlock: bigint = 0n,
    toBlock: bigint = 9999999999999999999999999999999999999999999999999999999999999999n,
  ) {
    return await this.viemClient.getLogs({
      address: contractAddress as Address,
      event,
      fromBlock,
      toBlock,
    });
  }
}
