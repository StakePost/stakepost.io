import { ethers } from 'ethers';

export const IPFSHashPrefix = '0x1220';

export const toChecksum = (address: string): string => {
  return ethers.utils.getAddress(address);
};

export const delIPFSPrefix = (hash: string): string => {
  return '0x' + hash.replace(IPFSHashPrefix, '');
};
export const addIPFSPrefix = (hash: string): string => {
  return IPFSHashPrefix + hash.replace('0x', '');
};
