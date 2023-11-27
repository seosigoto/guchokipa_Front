import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import PropTypes from "prop-types";
import { Container, Grid, Paper, Box, TextField } from "@mui/material";
import PlayedHand from "../../components/PlayedHand";
import PlaceholderGame from "../../components/PlaceholderGame";
import JudgeMove from "./JudgeMove";

const styles = {
  Grid: {
    paddingBottom: "20px",
  },
  GridItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  Container: {
    marginBottom: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  Button: { width: "100%", borderRadius: "0px 0px 4px 4px" },
  Box: {
    width: 600,
    bgcolor: "background.paper",
    height: 200,
  },
  inputField: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
  },
  h2: { margin: "50px" },
  h3: { marginBottom: "40px" },
  placeholderPlayer2: {},
  handPlaceholder: {
    fontSize: "50px",
    minHeight: "80px",
    minWidth: "80px",
    paddingTop: "15px",
  },
  gameState: { paddingTop: "10px" },
};

const JoinGame = (props) => {
  const { contractEvents } = props;
  const { t } = useTranslation();
  const [{ data: account }] = useAccount();

  useEffect(() => {
    if (contractEvents !== undefined) {
      setGameData(contractEvents);
    } else {
      setGameData();
    }
  }, [contractEvents]);

  const [gameData, setGameData] = useState([]);

  const setBet = (tokenId, hashStr) => {
    let newGameData = [];
    for (const gameItem of gameData) {
      if (gameItem.tokenId == tokenId) {
        newGameData.push({
          ...gameItem,
          hand: hashStr.toString().trim(),
        });
      } else {
        newGameData.push(gameItem);
      }
    }

    setGameData(newGameData);
  };

  const renderOpenGames = (game) => {
    return (
      <>
        <Grid container sx={styles.Grid}>
          <Grid item xs={6} sx={styles.GridItem}>
            <PlayedHand player={game?.owner} name="Creator" />
            <PlayedHand player={game?.player} name="Player" />
          </Grid>
          <Grid item xs={6} sx={styles.GridItem}>
            <div style={styles.inputField}>
              <TextField
                helperText="Insert game key"
                size="small"
                id="filled-basic"
                label={t("selectbet.inputlabel")}
                type="text"
                variant="outlined"
                value={game.hand ? game.hand : ""}
                name="amount"
                onChange={(e) => setBet(game.tokenId, e.target.value)}
              />
            </div>
          </Grid>
        </Grid>
        {account && <JudgeMove game={game} />}
      </>
    );
  };

  return (
    <Container maxWidth="sm" sx={styles.Container}>
      <h2 style={styles.h2}>Judge Game</h2>
      {gameData.length > 0 ? (
        <h3 style={styles.h3}>
          {gameData.length}
          {gameData.length === 1 ? " Judge Game" : " Judge Games"}
        </h3>
      ) : (
        <PlaceholderGame />
      )}
      {gameData.map((game) => (
        <Box key={game.tokenId} sx={styles.Box}>
          <Paper elevation={3}>{renderOpenGames(game)}</Paper>
        </Box>
      ))}
    </Container>
  );
};

export default JoinGame;

JoinGame.propTypes = {
  contractEvents: PropTypes.array,
  // contractEvents: PropTypes.shape({
  //   Registered: PropTypes.array,
  //   NewGame: PropTypes.array,
  //   Canceled: PropTypes.array,
  // }),
};
