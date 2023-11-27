import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSigner } from "wagmi";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

import { judgeGame } from "../../utils/contracts/gameContract";

const styles = {
  Button: { width: "100%", borderRadius: "0px 0px 4px 4px" },
};

const JudgeMove = (props) => {
  const { game } = props;
  const { t } = useTranslation();

  const [{ data: signer }] = useSigner();

  const [isPersistent, setIsPersistent] = useState(true);
  const [buttonText, setButtonText] = useState("Judge Game");

  const judge = async () => {
    if (signer) {
      if (game.hand != null && game.hand.toString().length > 0) {
        setIsPersistent(false);
        setButtonText(t("tx.sending"));

        const { status, message } = await judgeGame(
          signer,
          game.tokenId,
          game.hand
        );

        if (status) {
          toast.success("Successed! tx hash: " + message);

          setTimeout(() => {
            location.href = "/";
          }, 1000);
        } else {
          toast.error("Tx failed: " + message);
        }

        setIsPersistent(true);
        setButtonText(t("startgame.startgameCTA"));
      } else {
        toast.error("Please insert the hash");
      }
    } else {
      toast.error("Please connect wallet");
    }
  };

  return (
    <Button
      variant="contained"
      sx={styles.Button}
      onClick={() => judge()}
      disabled={!isPersistent}
    >
      {buttonText}
    </Button>
  );
};

export default JudgeMove;

JudgeMove.propTypes = {
  game: PropTypes.shape({
    tokenId: PropTypes.number.isRequired,
    hand: PropTypes.string.isRequired,
  }),
};
