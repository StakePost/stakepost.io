import { ethers } from 'ethers';
import makeBlockie from 'ethereum-blockies-base64';
import HashGenerator from 'ipfs-only-hash';

import config from '../config';
import { ApiError, ErrorCodes } from './index';
import { HashUtils } from '../../utils';

const getUserPost = async ({ account }, provider) => {
  const contract = new ethers.Contract(
    config.StakepostContractAt,
    config.StakepostContractAbi,
    provider,
  );

  try {
    const postId = await contract.getStakepostIndexByUser(account);
    if (postId.gte(0)) {
      const post = await contract.posts(postId);
      if (post) {
        return {
          hash: HashUtils.fromEth(post.post),
          user: post.user,
          stake: ethers.utils.formatEther(post.stake),
          time: post.time.toNumber() * 1000,
        };
      }
    }

    return Promise.resolve(null);
  } catch (error) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }
    return Promise.reject(new ApiError(ErrorCodes.BLOCKCHAIN, error.message));
  }
};

const getUserData = async ({ account }, provider) => {
  try {
    const image = makeBlockie(account);
    const balanceBn = await provider.getBalance(account);
    const balance = ethers.utils.formatEther(balanceBn).substr(0, 4);
    const post = await getUserPost({ account }, provider);

    return Promise.resolve({
      account,
      image,
      balance,
      post,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }
    return Promise.reject(new ApiError(ErrorCodes.BLOCKCHAIN, error.message));
  }
};

const getUserSignature = async ({ account, nonce }, provider) => {
  try {
    const signature = await provider
      .getSigner(account)
      .signMessage(`${config.SignatureTemplate} ${nonce}`);

    return {
      signature,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }
    return Promise.reject(new ApiError(ErrorCodes.BLOCKCHAIN, error.message));
  }
};

const sendStakeAndPostTx = async ({ account, content, stake }, provider) => {
  try {
    const contract = new ethers.Contract(
      config.StakepostContractAt,
      config.StakepostContractAbi,
      provider.getSigner(account),
    );

    const postContent = JSON.stringify({ content, author: account, stake });

    const hash = await HashGenerator.of(Buffer.from(postContent));

    const postHash = HashUtils.toEth(hash);

    const response = await contract.stakeAndPost(postHash, {
      value: ethers.utils.parseEther(stake.toString()),
    });

    return Promise.resolve(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }
    return Promise.reject(new ApiError(ErrorCodes.BLOCKCHAIN, error.message));
  }
};

const sendExitTx = async ({ account }, provider) => {
  try {
    const contract = new ethers.Contract(
      config.StakepostContractAt,
      config.StakepostContractAbi,
      provider.getSigner(account),
    );
    await contract.exit();
    return Promise.resolve(true);
  } catch (e) {
    const match = e.message.match(/\{.*:\{.*:.*\}\}/gi);

    if (match) {
      const error = JSON.parse(match[0]);
      return Promise.reject(new ApiError(ErrorCodes.BLOCKCHAIN, error.message));
    }
    return Promise.reject(new ApiError(ErrorCodes.BLOCKCHAIN, e.message));
  }
};

export default {
  getUserData,
  getUserSignature,
  sendStakeAndPostTx,
  sendExitTx,
};
