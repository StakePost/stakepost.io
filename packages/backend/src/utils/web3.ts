import { ethers } from 'ethers';

export const toChecksum = (address: string): string => {
  return ethers.utils.getAddress(address);
};
