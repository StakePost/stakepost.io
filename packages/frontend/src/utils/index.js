import { ethers } from 'ethers';

const isBrowser = () =>
  !!(typeof window !== 'undefined' && typeof document !== 'undefined');

const truncateAddress = (address, firstSegLength = 5, lastSegLength = 4) => {
  if (!address) return '';
  return address
    ? `${address.slice(0, firstSegLength)}...${address.slice(
        address.length - lastSegLength,
      )}`
    : '...';
};

const HASH_PREFIX = '0x1220';
const HashUtils = {
  addPrefix: (hash) => HASH_PREFIX + hash.replace('0x', ''),
  removePrefix: (hash) => `0x${hash.replace(HASH_PREFIX, '')}`,
  fromEth: (hash) => ethers.utils.base58.encode(HashUtils.addPrefix(hash)),
  toEth: (hash) =>
    HashUtils.removePrefix(
      ethers.utils.hexlify(ethers.utils.base58.decode(hash)),
    ),
};

const AuthStore = {
  get: () => ({
    storeAccount: localStorage.getItem('account'),
    storeNonce: localStorage.getItem('nonce'),
    storeToken: localStorage.getItem('token'),
    storeRefresh: localStorage.getItem('refresh'),
  }),
  save: ({ account, nonce, token, refresh }) => {
    localStorage.setItem('account', account);
    localStorage.setItem('nonce', nonce);
    localStorage.setItem('token', token);
    localStorage.setItem('refresh', refresh);
  },
  remove: () => {
    localStorage.removeItem('account');
    localStorage.removeItem('nonce');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  },
};

const authHeader = () => {
  const { storeToken } = AuthStore.get();

  if (storeToken) {
    return { Authorization: `Bearer ${storeToken}` };
  }
  return {};
};

const isTokenExpired = (token) => {
  if (
    !token ||
    token === undefined ||
    typeof token === 'undefined' ||
    token === 'undefined'
  ) {
    return true;
  }

  const jwt = JSON.parse(atob(token.split('.')[1]));

  const exp = (jwt && jwt.exp && jwt.exp * 1000) || null;

  if (!exp) {
    return false;
  }

  return Date.now() > exp;
};

export {
  isBrowser,
  truncateAddress,
  HashUtils,
  authHeader,
  AuthStore,
  isTokenExpired,
};
