import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Container, Grid, Paper, Box } from "@mui/material";
import GameState from "../../components/GameState";
import PlayedHand from "../../components/PlayedHand";
import { getDecidedGames } from "../../utils/game/game-states";
import GameStats from "../../components/GameStats";
import { Hands } from "../../constants/hands";
import { ethers } from "ethers";

const styles = {
  Grid: {
    paddingBottom: "40px",
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
  Box: {
    width: 600,
    bgcolor: "background.paper",
    height: 200,
    marginBottom: "100px",
  },
  h2: { margin: "50px" },
  gameStatus: { paddingTop: "10px" },
  handPlaceholder: {
    fontSize: "50px",
    minHeight: "80px",
    minWidth: "80px",
    paddingTop: "15px",
  },
};

const GameResults = (props) => {
  const { contractEvents: allGameData } = props;
  const { t } = useTranslation();
  // const [allGameData, setAllGameData] = useState([]);

  const maxRenderedLogs = 20;

  // useEffect(() => {
  //   if (contractEvents !== undefined) {
  //     lookupGames();
  //   }
  // }, [contractEvents]);

  // const lookupGames = () => {
  //   if (contractEvents.GameDecided.length > 0) {
  //     const openGameRounds = getDecidedGames(
  //       contractEvents.NewGame,
  //       contractEvents.GameDecided,
  //       contractEvents.Revealed
  //     );

  //     openGameRounds.sort((a, b) =>
  //       a.blockNumber < b.blockNumber
  //         ? 1
  //         : b.blockNumber < a.blockNumber
  //         ? -1
  //         : 0
  //     );

  //     setAllGameData(openGameRounds);
  //   }
  // };
  let ownerhand;
  const Zeroaddress = "0x0000000000000000000000000000000000000000";
  const renderDecidedGames = (game) => {
    console.log(game);

    let gplayer = game?.player;

    let feeweiValue = ethers.BigNumber.from(game?.pFee);
    let feeetherValue = ethers.utils.formatEther(feeweiValue);

    if (game?.winner == Zeroaddress) {
      ownerhand = game?.playerHand;
    } else if (game?.winner == game?.owner) {
      if (game?.playerHand == 0) {
        ownerhand = 2;
      } else if (game?.playerHand == 1) {
        ownerhand = 0;
      } else if (game?.playerHand == 2) {
        ownerhand = 1;
      }
    } else if (game?.winner == gplayer) {
      if (game?.playerHand == 0) {
        ownerhand = 1;
      } else if (game?.playerHand == 1) {
        ownerhand = 2;
      } else if (game?.playerHand == 2) {
        ownerhand = 0;
      }
    }
    return (
      <Box key={game?.tokenId} sx={styles.Box}>
        <Paper elevation={3}>
          <div style={styles.gameStatus}>
            <h3>
              {game?.winner === game?.owner ? (
                <div>Owner Wins Fee: {feeetherValue} Eth</div>
              ) : game?.winner === gplayer ? (
                <div>Player Wins Fee: {feeetherValue} Eth</div>
              ) : (
                <div>Draw ! Fee: {feeetherValue} Eth</div>
              )}
            </h3>
            <GameState game={game} />
          </div>
          <Grid container sx={styles.Grid}>
            <Grid item xs={6} sx={styles.GridItem}>
              {/* hand={game?.playerHand} */}
              <div style={styles.handPlaceholder}>
                {ownerhand != undefined ? Hands[ownerhand].icon : "❓"}
              </div>
              <PlayedHand
                player={game?.owner}
                name={t("gameresults.firstplayer")}
              />
            </Grid>
            <Grid item xs={6} sx={styles.GridItem}>
              <div style={styles.handPlaceholder}>
                {game?.playerHand != undefined
                  ? Hands[game?.playerHand].icon
                  : "❓"}
              </div>
              <PlayedHand
                player={gplayer}
                // hand={game?.playerHand}
                name={t("gameresults.secondplayer")}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  };

  let results = [];
  if (allGameData?.length > 0) {
    for (let i = 0; i < maxRenderedLogs; i++) {
      const game = allGameData[i];
      results.push(renderDecidedGames(game));
      if (i === allGameData?.length - 1) break;
      // results;
    }
  }

  return (
    <Container maxWidth="sm" sx={styles.Container}>
      {/* <h2 style={styles.h2}>{t("gameresults.title")}</h2>
      <GameStats allGames={allGameData} /> */}
      {results}
    </Container>
  );
};

export default GameResults;

GameResults.propTypes = {
  contractEvents: PropTypes.array,
  // contractEvents: PropTypes.shape({
  //   NewGame: PropTypes.array,
  //   GameDecided: PropTypes.array,
  //   Revealed: PropTypes.array,
  // }),
};
