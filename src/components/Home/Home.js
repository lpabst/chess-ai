import React, { Component } from 'react';
import ChessBoard from 'chessboardjs';
import Chess from 'chess.js';
import {
  onDragStart,
  onDrop,
  onMouseoutSquare,
  onMouseoverSquare,
  onSnapEnd
} from './../../helpers/chess.js'

import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: {},
      game: {}
    }
  }

  componentDidMount() {
    let game = new Chess();
    let board = ChessBoard('board', {
      draggable: true,
      position: 'start',
      onDragStart,
      onDrop,
      onMouseoutSquare,
      onMouseoverSquare,
      onSnapEnd
    });
    board.start();
    window.game = game;
    window.board = board;

    this.setState({ board, game })
  }

  render() {
    return (
      <div className="home">

        <h3 className="board">
          Random moves
        </h3>
        <div id="board" className="board"></div>
        <br />
        <div className="info">
          <div id="move-history" className="move-history">
          </div>
        </div>

      </div>
    );
  }
}


export default Home;