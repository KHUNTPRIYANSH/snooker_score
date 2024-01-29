import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameSetupPage from "./pages/Lobby/GameSetupPage";
import GameRoom from "./pages/GameRoom/GameRoom";
import { GameProvider } from "./providers/GameContext";

const startGame = (gameSetupInfo) => {
  console.log("Game setup information:", gameSetupInfo);
  // Add logic to update game data using the GameProvider
};

const App = () => {
  return (
    <div className="main">
      <Router>
        {/* Wrap your Routes with the GameProvider */}
        <GameProvider>
          <Routes>
            <Route
              path="/"
              exact
              element={<GameSetupPage startGame={startGame} />}
            />
            <Route path="/game" element={<GameRoom />} />
          </Routes>
        </GameProvider>
      </Router>
    </div>
  );
};

export default App;
