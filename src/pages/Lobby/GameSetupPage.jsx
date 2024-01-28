import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useGameContext } from '../../providers/GameContext';
import './GameSetupPage.css';

const GameSetupPage = ({ startGame }) => {
  const { setGameContext } = useGameContext();
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [totalPoints, setTotalPoints] = useState(147);
  const [gameType, setGameType] = useState('standard');
  
  const navigate = useNavigate();  // Initialize useNavigate

  const handleStartGame = () => {
    // Validate inputs before starting the game
    if (player1.trim() === '' || player2.trim() === '') {
      alert('Please enter names for both players.');
      return;
    }

    // Update the game context with the setup information
    setGameContext({
      player1,
      player2,
      totalPoints,
      gameType,
    });

    // Pass the setup information to the parent component to start the game
    startGame({
      player1,
      player2,
      totalPoints,
      gameType,
    });

    // Navigate to the game page
    navigate('/game');
  };

  return (
    <div className="game-setup-container">
      <div id='box-w-lb'>

      <h1>Hemlo!</h1>
      <h3>
        Track your snooker game scores.
      </h3>
      <Form>
        <Form.Group className="mb-3" controlId="player1Name">
          <Form.Label>Player 1</Form.Label>
          <Form.Control type="text" placeholder="Enter Player 1 Name" value={player1} onChange={(e) => setPlayer1(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="player2Name">
          <Form.Label>Player 2</Form.Label>
          <Form.Control type="text" placeholder="Enter Player 2 Name" value={player2} onChange={(e) => setPlayer2(e.target.value)} />
        </Form.Group>

        {/* <Form.Group className="mb-3" controlId="totalPoints">
          <Form.Label>Total Points</Form.Label>
          <Form.Control type="number" placeholder="Enter Total Points" value={totalPoints} onChange={(e) => setTotalPoints(parseInt(e.target.value, 10))} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="gameType">
          <Form.Label>Game Type</Form.Label>
          <Form.Control as="select" value={gameType} onChange={(e) => setGameType(e.target.value)}>
            <option value="standard">Standard Snooker</option>
            <option value="9-ball">9-Ball Snooker</option>
          </Form.Control>
        </Form.Group> */}
        <Button variant="primary" className='ww-btn' onClick={handleStartGame}>
          Start Game
        </Button>
      </Form>
      </div>
    </div>
  );
};

export default GameSetupPage;
