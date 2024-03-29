import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSigner } from "wagmi";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

import { joinGame } from "../../utils/contracts/gameContract";

const styles = {
  Button: { width: "100%", borderRadius: "0px 0px 4px 4px" },
};

const PlayerTwoMove = (props) => {
  const { game } = props;
  const { t } = useTranslation();

  const [{ data: signer }] = useSigner();

  const [isPersistent, setIsPersistent] = useState(true);
  const [buttonText, setButtonText] = useState(t("joingame.joingameCTA"));

  const join = async () => {
    if (signer) {
      if (game.hand != null) {
        setIsPersistent(false);
        setButtonText(t("tx.sending"));

        const { status, message } = await joinGame(
          signer,
          game.tokenId,
          game.hand
        );

        if (status) {
          toast.success("Successed! tx hash: " + message);

          setTimeout(() => {
            location.href = "/judge";
          }, 1000);
        } else {
          toast.error("Tx failed: " + message);
        }

        setIsPersistent(true);
        setButtonText(t("startgame.startgameCTA"));
      } else {
        toast.error("Please pick your hand");
      }
    } else {
      toast.error("Please connect wallet");
    }
  };

  return (
    <Button
      variant="contained"
      sx={styles.Button}
      onClick={() => join()}
      disabled={!isPersistent}
    >
      {buttonText}
    </Button>
  );
};

export default PlayerTwoMove;

PlayerTwoMove.propTypes = {
  game: PropTypes.shape({
    tokenId: PropTypes.string.isRequired,
    hand: PropTypes.string.isRequired,
  }),
  setBet: PropTypes.func,
};
