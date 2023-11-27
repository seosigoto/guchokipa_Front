import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import PropTypes from "prop-types";
import { Container, Grid, Paper, Box, Chip } from "@mui/material";
import { SelectHand } from "../../components/SelectHand";
import PlayedHand from "../../components/PlayedHand";
import PlaceholderGame from "../../components/PlaceholderGame";
import PlayerTwoMove from "./PlayerTwoMove";
import { getOwner } from "../../utils/contracts/gameContract";
import Cancel from "./Cancel";

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
    marginBottom: "20px",
    display: "inline-table",
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
  const [contractOwner, setContractOwner] = useState("");

  useEffect(() => {
    const initOwner = async () => {
      const ownerAddr = await getOwner();
      setContractOwner(ownerAddr);
    };

    initOwner();
  }, []);

  // const lookupGames = () => {
  //   if (contractEvents.Registered.length > 0) {
  //     const openGameRounds = getOpenGames(
  //       contractEvents.Registered,
  //       contractEvents.NewGame,
  //       contractEvents.GameDecided
  //     );
  //     setGameData(openGameRounds);
  //   }
  // };

  const setBet = (changedGameData) => {
    let newGameData = [];
    for (const gameItem of gameData) {
      if (gameItem.tokenId == changedGameData.tokenId) {
        newGameData.push(changedGameData);
      } else {
        newGameData.push(gameItem);
      }
    }

    setGameData(newGameData);
  };

  // const setTimeoutIsOver = (key) => {
  //   let updatedGameData = [...gameData];
  //   updatedGameData[key].timeoutIsOver = true;
  //   setGameData(updatedGameData);
  // };

  const isOwner =
    account && contractOwner.toLowerCase() == account.address.toLowerCase();

  const renderOpenGames = (game) => {
    return (
      <>
        <Grid container sx={styles.Grid}>
          <Grid item xs={6} sx={styles.GridItem}>
            <PlayedHand player={game?.owner} name={t("joingame.firstplayer")} />
          </Grid>
          <Grid item xs={6} sx={styles.GridItem}>
            {isOwner ? (
              <div style={styles.placeholderPlayer2}>
                <div style={styles.handPlaceholder}>⏳</div>
                <Chip
                  color="info"
                  label={t("joingame.secondplayer")}
                  variant="outlined"
                ></Chip>
              </div>
            ) : (
              account && <SelectHand gameData={game} setBet={setBet} />
            )}
          </Grid>
        </Grid>
        {isOwner ? (
          <Cancel game={game} />
        ) : (
          account && <PlayerTwoMove game={game} setBet={setBet} />
        )}
      </>
    );
  };

  return (
    <Container maxWidth="sm" sx={styles.Container}>
      <h2 style={styles.h2}>{t("joingame.title")}</h2>
      {gameData.length > 0 ? (
        <h3 style={styles.h3}>
          {gameData.length}
          {gameData.length === 1
            ? t("joingame.subtitle1")
            : t("joingame.subtitle2")}
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
