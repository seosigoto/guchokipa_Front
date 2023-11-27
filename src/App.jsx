import React, { Suspense, useEffect } from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import JoinGame from "./pages/JoinGame";
import StartGame from "./pages/StartGame";
import JudgeGame from "./pages/JudgeGame";
import GameResults from "./pages/GameResults";

import { GAME_STATUS } from "./utils/constants";
import { getGames } from "./utils/contracts/gameContract";

function App() {
  const [judgeGames, setJudgeGames] = useState([]);
  const [completeGames, setCompleteGames] = useState([]);
  const [progressGames, setProgressGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const gameArr = await getGames();

      if (gameArr.length > 0) {
        let completedGames = [],
          progressingGames = [];
        for (let ii = 0; ii < gameArr.length; ii++) {
          const gameInfo = gameArr[ii];
          if (gameInfo.status == GAME_STATUS.COMPLETED) {
            completedGames.push(gameInfo);
          } else if (gameInfo.status == GAME_STATUS.INITIALIZED) {
            progressingGames.push(gameInfo);
          } else if (gameInfo.status == GAME_STATUS.IN_PROGRESS) {
            judgeGames.push(gameInfo);
          }
        }

        setJudgeGames(judgeGames);
        setCompleteGames(completedGames);
        setProgressGames(progressingGames);
      }
    };

    fetchGames();
  }, []);

  const styles = {
    mainContent: {
      marginBottom: "80px",
      background: "#ffffff",
    },
  };

  return (
    <Suspense fallback={null}>
      <Router>
        <div>
          <ToastContainer position="top-center" />
          <div style={styles.mainContent}>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={<GameResults contractEvents={completeGames} />}
              ></Route>
              <Route path="/start" element={<StartGame />}></Route>
              <Route
                path="/join"
                element={<JoinGame contractEvents={progressGames} />}
              ></Route>
              <Route
                path="/judge"
                element={<JudgeGame contractEvents={judgeGames} />}
              ></Route>
            </Routes>
          </div>
          {/* <Footer /> */}
        </div>
      </Router>
    </Suspense>
  );
}

export default App;
