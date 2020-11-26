import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nRows: 5,
    nCols: 5,
    chanceLightStartsOn: 0.5,
  };

  constructor(props) {
    super(props);

    this.state = {
      hasWon: false,
      board: this.createBoardArray(),
    };

    this.flipCellsAround = this.flipCellsAround.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoardArray() {
    const { nRows, nCols } = this.props;
    const newBoard = [];
    let newRow = [];
    for (let row = 0; row < nRows; row++) {
      for (let col = 0; col < nCols; col++) {
        newRow.push(Math.random() < this.props.chanceLightStartsOn);
      }
      newBoard.push(newRow);
      newRow = [];
    }
    // TODO: create array-of-arrays of true/false values
    return newBoard;
  }

  createBoard() {
    const board = this.state.board;
    const boardRender = [];

    for (let row = 0; row < board.length; row++) {
      let content = [];
      for (let col = 0; col < board[row].length; col++) {
        content.push(
          <Cell
            key={`${row}-${col}`}
            keyData={`${row}-${col}`}
            isLit={board[row][col]}
            flipCellsAroundMe={this.flipCellsAround}
          />
        );
      }
      boardRender.push(<div key={row}>{content}</div>);
    }

    return boardRender;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { nCols, nRows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < nCols && y >= 0 && y < nRows) {
        board[y][x] = !board[y][x];
      }
    }

    const clipCords = [
      [y, x], //clicked
      [y, x - 1], //left
      [y, x + 1], //right
      [y - 1, x], //up
      [y + 1, x], //down
    ];

    clipCords.forEach((cord) => {
      flipCell(cord[0], cord[1]);
    });

    let lit = false;
    for (let row = 0; row < nRows; row++) {
      for (let col = 0; col < nCols; col++) {
        if (board[row][col] === true) {
          lit = true;
          break;
        }
      }
    }
    this.setState({ board: board, hasWon: lit === true ? false : true });
    // TODO: flip this cell and the cells around it

    // win when every cell is turned off
    // TODO: determine is the game has been won

    //this.setState({ board, hasWon });
  }

  /** Render game board or winning message. */

  render() {
    return this.state.hasWon ? "You Win" : <div>{this.createBoard()}</div>;
    // if the game is won, just show a winning msg & render nothing else
    // TODO
    // make table board
    // TODO
  }
}

export default Board;
