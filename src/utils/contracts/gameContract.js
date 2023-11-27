import { Contract, BigNumber, providers, utils } from "ethers";
import GameABI from "../abi/Game.json";

const rpc_url = "https://rpc.ankr.com/eth_goerli";
// "https://1rpc.io/sepolia" 0x681D09e6e5A99Ea1A9e9612AB2f41B4c0313e2f2";
const provider = new providers.JsonRpcProvider(rpc_url);
const contractAddr = "0x64add82D2a29144d2bA9790Ed6D25de5d6fb1f00";
const gameContract = new Contract(contractAddr, GameABI, provider);

export const getGames = async () => {
  const currentId = Number(await gameContract.currentGameID());
  const owner = await getOwner();

  const idList = Array.from({ length: currentId }, (_, i) => i);
  const _gameList = await Promise.all(
    idList.map(async (tokenId) => {
      const gameInfo = await gameContract.gameList(tokenId);
      return gameInfo.pFee == BigNumber.from(0)
        ? null
        : { ...gameInfo, owner, tokenId };
    })
  );

  const gameList = _gameList.filter((gameItem) => gameItem !== null);
  return gameList;
};

export const getOwner = async () => {
  const owner = await gameContract.owner();
  return owner.toLowerCase();
};

export const createGame = async (signer, hand, hash) => {
  try {
    const signerAddr = await signer.getAddress();
    const initGameHash = utils.solidityKeccak256(
      ["address", "uint256", "bytes32"],
      [signerAddr, hand, utils.formatBytes32String(hash)]
    );

    const pFee = await gameContract.pFee();

    const tx = await gameContract.connect(signer).initializeGame(initGameHash, {
      value: pFee,
    });
    await tx.wait();

    return {
      status: true,
      message: tx.hash,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: JSON.stringify(err),
    };
  }
};

export const joinGame = async (signer, gameId, hand) => {
  try {
    const gameInfo = await gameContract.gameList(gameId);

    const tx = await gameContract.connect(signer).join( gameId, hand,{
      value: gameInfo.pFee,
    });
    await tx.wait();

    return {
      status: true,
      message: tx.hash,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: JSON.stringify(err),
    };
  }
};


export const judgeGame = async (signer, gameId, hash) => {
  try {
    const tx = await gameContract.connect(signer).judge( gameId, hash,);
    await tx.wait();

    return {
      status: true,
      message: tx.hash,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: JSON.stringify(err),
    };
  }
};


export const judgeGameWithHand = async (signer, gameId, hand, hash) => {
  try {
    const tx = await gameContract.connect(signer).judgeWithHand( gameId, hand, hash,);
    await tx.wait();

    return {
      status: true,
      message: tx.hash,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: JSON.stringify(err),
    };
  }
};

export const cancelGame = async (signer, gameId,) => {
  try {
    const tx = await gameContract.connect(signer).cancel( gameId, );
    await tx.wait();

    return {
      status: true,
      message: tx.hash,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: JSON.stringify(err),
    };
  }
};
