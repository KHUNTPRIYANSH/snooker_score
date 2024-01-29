import React, { useState, useEffect } from "react";
import { useGameContext } from "../../providers/GameContext";
import "./GameRoom.css"; // Import your CSS file for styling

const GameRoom = () => {
  const { gameData } = useGameContext();
  const { player1, player2, totalPoints, gameType } = gameData;

  const [currentPlayer, setCurrentPlayer] = useState(player1);
  const [scores, setScores] = useState({ [player1]: 0, [player2]: 0 });
  const [currentBall, setCurrentBall] = useState("red");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showFoulModal, setShowFoulModal] = useState(false);

  useEffect(() => {
    // Start the timer when the component mounts
    setStartTime(Date.now());

    // Clear the timer when the component unmounts
    return () => {
      setStartTime(null);
    };
  }, []);

  useEffect(() => {
    // Update elapsed time every second
    const intervalId = setInterval(() => {
      if (startTime) {
        const currentTime = Date.now();
        const secondsElapsed = Math.floor((currentTime - startTime) / 1000);

        // Calculate hours, minutes, and remaining seconds
        const hours = Math.floor(secondsElapsed / 3600);
        const minutes = Math.floor((secondsElapsed % 3600) / 60);
        const seconds = secondsElapsed % 60;

        // Format the time
        const formattedTime = `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        setElapsedTime(formattedTime);
      }
    }, 1000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [startTime]);
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
      setCurrentBall("red");
      // Do not switch back to red
    }
  };

  const ballInfo = {
    red: { points: 1, color: "red" },
    yellow: { points: 2, color: "rgb(241, 206, 6)" },
    green: { points: 3, color: "green" },
    brown: { points: 4, color: "rgb(47, 25, 14)" },
    blue: { points: 5, color: "blue" },
    pink: { points: 6, color: "rgb(252, 78, 217)" },
    black: { points: 7, color: "#000" },
    foul4: { points: 4, color: "gray", type: "Foul (4 points)" },
    foul5: { points: 5, color: "gray", type: "Foul (5 points)" },
    foul6: { points: 6, color: "gray", type: "Foul (6 points)" },
    foul7: { points: 7, color: "gray", type: "Foul (7 points)" },
  };

  const handleFoulButtonClick = () => {
    setShowFoulModal(true);
    console.log("Foul button clicked");
  };

// Function to handle fouls in the game
const handleFoul = (foulType) => {
  // Determine the opponent
  const opponent = currentPlayer === player1 ? player2 : player1;
  // Check if the foul penalty exceeds the player's score
  if (ballInfo[foulType].points > scores[currentPlayer]) {
    console.log("Foul penalty exceeds player's score");
    console.log( "foul: ", ballInfo[foulType].points , " ME-",currentPlayer," score:",scores[currentPlayer]);
    // If yes, add the full penalty to the opponent's score
    // and keep the player's score unchanged
    setScores((prevScores) => ({
      ...prevScores,
      [opponent]: prevScores[opponent] + ballInfo[foulType].points, // Add penalty to opponent
      [currentPlayer]: prevScores[currentPlayer], // Keep player's score unchanged
    }));
  } else {
    // If the penalty is less than or equal to the player's score,
    // subtract the penalty from the player's score without going below 0
    setScores((prevScores) => ({
      ...prevScores,
      [currentPlayer]: Math.max(
        0,
        prevScores[currentPlayer] - ballInfo[foulType].points
      ), // Ensure score doesn't go below 0
    }));
  }

  // Switch the turn to the opponent
  setCurrentPlayer(opponent);

  // Reset the current ball to "red"
  setCurrentBall("red");

  // Hide the foul modal
  setShowFoulModal(false);
};

  const renderFoulModal = () => {
    return (
      <div className="foul-modal">
        <div className="fl-hdr">
          <h3>Choose Foul Type</h3>
          <button className="close-btn" onClick={() => setShowFoulModal(false)}>
            x
          </button>
        </div>
        <div className="fls">
          <button className="fl-4" onClick={() => handleFoul("foul4")}>
            Foul -4{" "}
          </button>
          <button className="fl-5" onClick={() => handleFoul("foul5")}>
            Foul -5{" "}
          </button>
          <button className="fl-6" onClick={() => handleFoul("foul6")}>
            Foul -6{" "}
          </button>
          <button className="fl-7" onClick={() => handleFoul("foul7")}>
            Foul -7{" "}
          </button>
        </div>
      </div>
    );
  };

  const renderBallButtons = (ballType) => {
    const availableBalls = getAvailableBalls(ballType);

    return availableBalls.map((ball) => (
      <button
        key={ball}
        onClick={() =>
          ball === "foul"
            ? handleFoulButtonClick()
            : ball === "changeTurn"
            ? handleChangeTurn()
            : handlePlayerMove(ball)
        }
        className={`ball-btn ${ball === "changeTurn" ? "change-turn-btn" : ""}`}
        style={{
          background:
            ball === "foul"
              ? "linear-gradient(45deg, rgba(255, 255, 255, 0.3) , gray , gray , rgba(0, 0, 0, 0.25))"
              : ball === "changeTurn"
              ? " linear-gradient(to right, #7b4397, #dc2430)"
              : `linear-gradient(30deg, rgba(255, 255, 255, 0.3)  , ${ballInfo[ball].color} , ${ballInfo[ball].color}) `,
        }}
      >
        {ball === "foul"
          ? "Foul"
          : ball === "changeTurn"
          ? "Change Turn"
          : `${ballInfo[ball].points}`}
        <img src="./imgs/bt2.png" className="bt" alt="" />
      </button>
    ));
  };
  const renderRedBallButtons = () => {
    return <div className="move-buttons">{renderBallButtons("red")}</div>;
  };

  const renderColoredBallButtons = () => {
    return <div className="move-buttons">{renderBallButtons("colored")}</div>;
  };

  const handleChangeTurn = () => {
    setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
    setCurrentBall("red");
  };

  const isGameEnd = () => {
    return scores[player1] >= totalPoints || scores[player2] >= totalPoints;
  };

  const getWinner = () => {
    return scores[player1] > scores[player2] ? player1 : player2;
  };

  const getAvailableBalls = (ballType) => {
    if (ballType === "red") {
      return ["red", "foul", "changeTurn"];
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

  return (
    <div className="game-room-container">
      <header>
        Game Room
        <div className="time">Time: {elapsedTime} </div>
      </header>
      <div className="score-display">
        <div
          className={`player-score ${
            currentPlayer === player1 ? "highlight" : ""
          }`}
        >
          <p>{player1}</p>
          <big>{scores[player1]}</big>
        </div>
        <div
          className={`player-score ${
            currentPlayer === player2 ? "highlight" : ""
          }`}
        >
          <p>{player2}</p>
          <big>{scores[player2]}</big>
        </div>
      </div>
      <div
        className={`ball-ct red-ball-container ${
          currentBall === "red" ? "visible" : "hidden"
        }`}
      >
        {renderRedBallButtons()}
      </div>
      <div
        className={`ball-ct colored-ball-container ${
          currentBall === "colored" ? "visible" : "hidden"
        }`}
      >
        {renderColoredBallButtons()}
      </div>
      <div>{showFoulModal && renderFoulModal()}</div>
      {isGameEnd() && (
        <div className="game-over-message">
          <h3>Game Over</h3>
          <p>Winner: {getWinner()}</p>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
