import { useSigner } from "wagmi";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { createGame } from "../../utils/contracts/gameContract";

const styles = {
  Button: { width: "100%", borderRadius: "0px 0px 4px 4px" },
  error: { color: "red" },
};

const PlayerOneMove = (props) => {
  const { t } = useTranslation();
  const [{ data: signer }] = useSigner();

  const [buttonText, setButtonText] = useState(t("startgame.startgameCTA"));
  const [isPersistent, setIsPersistent] = useState(true);

  const { game } = props;

  const initGame = async () => {
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
        toast.error("Tx failed: " + message);
      }

      setIsPersistent(true);
      setButtonText(t("startgame.startgameCTA"));
    } else {
      toast.error("Please connect wallet");
    }
  };

  // const gameIsSelected = game.key === selectedGame;

  return (
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
