import { useSigner } from "wagmi";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { contractABIList } from "../../utils/contracts/contracts";
import { Button, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { createGame } from "../../utils/contracts/gameContract";

const tokenContract = import.meta.env.VITE_CONTRACT_TOKEN;
const gameAddress = import.meta.env.VITE_CONTRACT_RPC;
const { RockPaperScissors: gameABI } = contractABIList;
const gameInstance = {
  addressOrName: gameAddress,
  contractInterface: gameABI,
};

const styles = {
  Button: { width: "100%", borderRadius: "0px 0px 4px 4px" },
  error: { color: "red" },
};

const PlayerOneMove = (props) => {
  const { t } = useTranslation();
  const [{ data: signer }] = useSigner();

  const [buttonText, setButtonText] = useState(t("startgame.startgameCTA"));
  const [isPersistent, setIsPersistent] = useState(true);

  const { game, setBet, accountAddress } = props;

  // const [selectedGame, setSelectedGame] = useState(null);
  // const [moves, setMoves, { isPersistent }] = useLocalStorageState("moves", {
  //   ssr: true,
  //   defaultValue: [],
  // });

  // const [{ data: hash }, read] = useContractRead(gameInstance, "hashHelper");

  // const [{ data, loading: isWritePending, error: signError }, write] =
  //   useContractWrite(gameInstance, "playerOneMove");

  // const [{ loading: isTxPending, error: txError }, wait] =
  //   useWaitForTransaction({
  //     hash: data?.hash,
  //   });

  // // NOTE Not the safe solution to create `hash` by contract call.
  // // Should be implemented on the client-side accordingly to the `hashHelper`.
  // const getHash = () => {
  //   setSelectedGame(game?.key);
  //   read({
  //     args: [game?.hand, game?.password, accountAddress],
  //   });
  // };

  // useEffect(() => {
  //   if (hash) {
  //     write({
  //       args: [hash, ethers.utils.parseUnits(game?.amount, 18), tokenContract],
  //     });
  //   }
  // }, [hash]);

  // useEffect(() => {
  //   if (data?.hash) {
  //     const txData = wait();
  //     toast.promise(txData, {
  //       pending: t("tx.toastPending"),
  //       success: t("tx.toastSuccess"),
  //       error: t("tx.toastError"),
  //     });

  //     setMoves([
  //       ...moves,
  //       {
  //         gameId: hash,
  //         hand: game.hand,
  //         password: game.password,
  //       },
  //     ]);

  //     setBet({
  //       ...game,
  //       hand: "",
  //       amount: "",
  //     });
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (signError || txError) {
  //     setSelectedGame(null);
  //     toast.error(
  //       signError?.error?.message,
  //       signError?.message,
  //       txError?.message
  //     );
  //   }
  // }, [signError, txError]);

  // const buttonText = isTxPending
  //   ? t("tx.sending")
  //   : isWritePending
  //   ? t("tx.confirm")
  //   : t("startgame.startgameCTA");

  const initGame = async () => {
    console.log(signer);
    if (signer) {
      setIsPersistent(false);
      setButtonText(t("tx.sending"));

      const { status, message } = await createGame(
        signer,
        game.hand,
        game.hash
      );

      if (status) {
        toast.success("Successed! tx hash: " + message);
      } else {
        toast.success("Tx failed: " + message);
      }

      setIsPersistent(true);
      setButtonText(t("startgame.startgameCTA"));
    } else {
      toast.error("Please connect wallet");
    }
  };

  // const gameIsSelected = game.key === selectedGame;

  return (
    <>
      <Tooltip title={t("startgame.passwordTooltip", { pwd: game?.hash })}>
        <Button
          variant="contained"
          sx={styles.Button}
          onClick={() => initGame()}
          disabled={!isPersistent}
        >
          {buttonText}
        </Button>
      </Tooltip>
      {!isPersistent && (
        <p style={styles.error}>{t("startgame.isNotPersistent")}</p>
      )}
    </>
  );
};

export default PlayerOneMove;

PlayerOneMove.propTypes = {
  game: PropTypes.shape({
    key: PropTypes.string,
    hand: PropTypes.string,
    hash: PropTypes.string,
    // password: PropTypes.string,
    // amount: PropTypes.string,
  }),
  setBet: PropTypes.func,
  accountAddress: PropTypes.string,
};
