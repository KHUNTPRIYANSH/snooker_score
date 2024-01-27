// GameContext.js
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameData, setGameData] = useState({
    player1: '',
    player2: '',
    totalPoints: 147,
    gameType: 'standard',
  });

  const setGameContext = (newGameData) => {
    setGameData((prevGameData) => ({ ...prevGameData, ...newGameData }));
  };

  return (
    <GameContext.Provider value={{ gameData, setGameContext }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
