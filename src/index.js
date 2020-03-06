import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {  
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        Array(9).fill(null)
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }


  /**
   * Gets the next symbol
   *
   * @returns {'X' | 'O'} Cext symbol
   * @memberof Game
   */
  getSymbol = () => this.state.xIsNext ? 'X' : 'O';

  
  /**
   * Updates the history of the game after a square is clicked.
   *
   * @param {*} i Index of clicked square
   * @memberof Game
   */
  handleClick(i) {
    // Get the fragment of history that stepNumber references
    const history = this.state.history.slice(0, this.state.stepNumber + 1);

    // Get the current squares
    const squares = [...history[history.length - 1]];

    // Do nothing if there's a winner or the square has a value already
    if (calculateWinner(squares) || squares[i]) return;

    // Set current symbol
    squares[i] = this.getSymbol();

    // Update state
    this.setState({
      history: history.concat([squares]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }


  /**
   * Goes to the specified step
   *
   * @param {*} stepNumber Which step to go to
   * @memberof Game
   */
  jumpTo(stepNumber) {
    this.setState({
      stepNumber,
      xIsNext: (stepNumber % 2) === 0
    });
  }

  render() {
    const current = this.state.history[this.state.stepNumber];
    const winner = calculateWinner(current);
    const status = winner
      ? 'Winner: ' + winner
      : 'Next player: ' + this.getSymbol();

    const moves = this.state.history.map((step, move) => {
      const desc = move
        ? `Go to move #${move}`
        : `Go to game start`
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// Copied from de tutorial
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
