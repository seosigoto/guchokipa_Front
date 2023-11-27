import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Tooltip } from "@mui/material";

const styles = {
  info: {
    fontWeight: 500,
    marginBottom: "0px",
  },
};

const GameState = (props) => {
  const { game } = props;

  const { t } = useTranslation();

  return (
    <Tooltip title={`Game ID / hash: ${game?.toeknId}`}>
      {/* <p style={styles.info}>
        {t("gamestate.info", {
          gameId: game?.toeknId,
        })}
      </p> */}
    </Tooltip>
  );
};

export default GameState;

GameState.propTypes = {
  game: PropTypes.shape({
    gameId: PropTypes.number.isRequired,
  }),
};
