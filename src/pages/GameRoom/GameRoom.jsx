import React, { useState } from "react";
import { useGameContext } from "../../providers/GameContext";
import "./GameRoom.css"; // Import your CSS file for styling

const GameRoom = () => {
  const { gameData } = useGameContext();
  const { player1, player2, totalPoints, gameType } = gameData;

  const [currentPlayer, setCurrentPlayer] = useState(player1);
  const [scores, setScores] = useState({ [player1]: 0, [player2]: 0 });
  const [currentBall, setCurrentBall] = useState("red");

  // Define point values for each colored ball and their background colors
  const ballInfo = {
    red: { points: 1, color: "red" },
    yellow: { points: 2, color: "gold" },
    green: { points: 3, color: "green" },
    brown: { points: 4, color: "brown" },
    blue: { points: 5, color: "blue" },
    pink: { points: 6, color: "pink" },
    black: { points: 7, color: "black" },
    foul: { points: -4, color: "gray" },
  };

  const handlePlayerMove = (ball) => {
    // Implement game logic for player move
    // Update scores, check for game end, etc.

    // After potting a red ball, switch to the colored balls
    if (currentBall === "red" && ball === "red") {
      setCurrentBall("colored");
    } else if (currentBall === "colored" && ball === "changeTurn") {
      setCurrentBall("red");
    } else if (currentBall === "colored" && ball === "red") {
      // If a colored ball is potted after a red, stay in the colored phase
      // Do not switch back to red
    }

    // Update the score for the current player
    setScores((prevScores) => ({
      ...prevScores,
      [currentPlayer]: prevScores[currentPlayer] + ballInfo[ball].points,
    }));

    // If a foul is committed or changeTurn is clicked, change the turn to the other player
    if (ball === "foul" || ball === "changeTurn") {
      setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
      setCurrentBall("red"); // Reset to red ball after changing turn
    } else if (currentBall === "colored" && ball !== "red") {
      // If a colored ball is potted, stay in the colored phase
      // Do not switch back to red
    }
  };
  const handleFoul = () => {
    // Implement foul logic
    // For example, deduct points for the current player on a foul
    setScores((prevScores) => ({
      ...prevScores,
      [currentPlayer]: Math.max(
        0,
        prevScores[currentPlayer] + ballInfo.foul.points
      ),
    }));

    // Change turn to the other player after a foul
    setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
    setCurrentBall("red"); // Reset to red ball after changing turn
  };

  const handleChangeTurn = () => {
    // Change turn to the other player
    setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
    setCurrentBall("red"); // Reset to red ball after changing turn
  };

  const isGameEnd = () => {
    // Implement logic to check if the game has ended
    // For example, check if any player has reached the totalPoints
    return scores[player1] >= totalPoints || scores[player2] >= totalPoints;
  };

  const getWinner = () => {
    // Determine the winner based on the scores
    return scores[player1] > scores[player2] ? player1 : player2;
  };

  const getAvailableBalls = (ballType) => {
    // Return the available balls based on the current game state
    if (ballType === "red") {
      return ["red", "foul" , "changeTurn"];
    } else {
      return [
        "yellow",
        "green",
        "brown",
        "blue",
        "pink",
        "black",
        "changeTurn",
      ];
    }
  };

  const renderBallButtons = (ballType) => {
    // Render buttons dynamically based on available balls
    const availableBalls = getAvailableBalls(ballType);

    return availableBalls.map((ball) => (
      <button
        key={ball}
        onClick={() =>
          ball === "foul"
            ? handleFoul()
            : ball === "changeTurn"
            ? handleChangeTurn()
            : handlePlayerMove(ball)
        }
        className={`ball-btn ${ball === "changeTurn" ? "change-turn-btn" : ""}`}
        style={{
          backgroundColor:
            ball === "foul"
              ? "gray"
              : ball === "changeTurn"
              ? "purple"
              : ballInfo[ball].color,
        }}
      >
        {ball === "foul"
          ? "Foul (-4 points)"
          : ball === "changeTurn"
          ? "Change Turn"
          : `${ball.charAt(0).toUpperCase() + ball.slice(1)} Ball (${
              ballInfo[ball].points
            } points)`}
      </button>
    ));
  };

  const renderRedBallButtons = () => {
    return <div className="move-buttons">{renderBallButtons("red")}</div>;
  };

  const renderColoredBallButtons = () => {
    return <div className="move-buttons">{renderBallButtons("colored")}</div>;
  };

  return (
    <div className="game-room-container">
      <h2>Game Room</h2>

      {/* Score Display */}
      <div className="score-display">
        <div
          className={`player-score ${
            currentPlayer === player1 ? "highlight" : ""
          }`}
        >
          <p>{player1}</p>
          <p>Score: {scores[player1]}</p>
        </div>
        <div
          className={`player-score ${
            currentPlayer === player2 ? "highlight" : ""
          }`}
        >
          <p>{player2}</p>
          <p>Score: {scores[player2]}</p>
        </div>
    
      </div>

      {/* Red Ball Div */}
      <div
        className={`ball-ct red-ball-container ${
          currentBall === "red" ? "visible" : "hidden"
        }`}
      >
        {renderRedBallButtons()}
      </div>

      {/* Colored Ball Div */}
      <div
        className={`ball-ct colored-ball-container ${
          currentBall === "colored" ? "visible" : "hidden"
        }`}
      >
        {renderColoredBallButtons()}
      </div>

      {/* Game Over Message */}
      {isGameEnd() && (
        <div className="game-over-message">
          <h3>Game Over</h3>
          <p>Winner: {getWinner()}</p>
          {/* Additional options, e.g., start a new game or return to the lobby */}
        </div>
      )}
    </div>
  );
};

export default GameRoom;
