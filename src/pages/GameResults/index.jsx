import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { BigNumber, utils, constants } from "ethers";
import { Container, Grid, Paper, Box } from "@mui/material";

import { Hands } from "../../constants/hands";
import { GAME_HANDS } from "../../utils/constants";
import GameState from "../../components/GameState";
import PlayedHand from "../../components/PlayedHand";

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
  const renderDecidedGames = (game) => {
    let gplayer = game?.player;

    let feeweiValue = BigNumber.from(game?.pFee);
    let feeetherValue = utils.formatEther(feeweiValue);

    if (game?.winner == constants.AddressZero) {
      ownerhand = game?.playerHand;
    } else if (game?.winner == game?.owner) {
      if (game?.playerHand == GAME_HANDS.ROCK) {
        ownerhand = GAME_HANDS.PAPER;
      } else if (game?.playerHand == GAME_HANDS.SCISSOR) {
        ownerhand = GAME_HANDS.ROCK;
      } else if (game?.playerHand == GAME_HANDS.PAPER) {
        ownerhand = GAME_HANDS.SCISSOR;
      }
    } else if (game?.winner == gplayer) {
      if (game?.playerHand == GAME_HANDS.ROCK) {
        ownerhand = GAME_HANDS.SCISSOR;
      } else if (game?.playerHand == GAME_HANDS.SCISSOR) {
        ownerhand = GAME_HANDS.PAPER;
      } else if (game?.playerHand == GAME_HANDS.PAPER) {
        ownerhand = GAME_HANDS.ROCK;
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
