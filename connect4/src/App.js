import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, NavLink, Redirect, Prompt } from 'react-router-dom';
import Logo from './images/connect.png';
import gif from './images/Connect_Four.gif';

function Hole(props) {
  return <div className="Hole"><div className={props.value}></div></div>
}

function Slat(props) {
  return <div className="Slat" onClick={() => props.handleClick()}>
    {[...Array(props.holes.length)].map((x, j) =>
      <Hole key={j} value={props.holes[j]}></Hole>)}
  </div>
}

class Board extends Component {

  constructor() {
    super();
    this.state = {
      boardState: new Array(7).fill(new Array(6).fill(null)),
      playerTurn: 'Red',
      gameMode: '',
      gameSelected: false,
      winner: '',
      Player1: '',
      Player2: ""
    }
  }

  selectedGame(mode) {
    this.setState({
      gameMode: mode,
      gameSelected: true,
      boardState: new Array(7).fill(new Array(6).fill(null))
    })
  }

  makeMove(slatID) {
    const boardCopy = this.state.boardState.map(function (arr) {
      return arr.slice();
    });
    if (boardCopy[slatID].indexOf(null) !== -1) {
      let newSlat = boardCopy[slatID].reverse()
      newSlat[newSlat.indexOf(null)] = this.state.playerTurn
      newSlat.reverse()
      this.setState({
        playerTurn: (this.state.playerTurn === 'Red') ? 'Blue' : 'Red',
        boardState: boardCopy
      })
    }
  }

  /*Only make moves if winner doesn't exist*/
  handleClick(slatID) {
    if (this.state.winner === '') {
      this.makeMove(slatID)
    }
  }

  componentDidUpdate() {
    let winner = checkWinner(this.state.boardState)
    if (this.state.winner !== winner) {
      this.setState({ winner: winner })
    }

  }
  updateResponse = (event) => {
    this.setState({ Player1: event.target.value })
  }
  updateResponse1 = (event) => {
    this.setState({ Player2: event.target.value })
  }

  render() {

    /*If a winner exists display the name*/
    let winnerMessage
    if (this.state.winner !== "") {
      winnerMessage = "winnerMessage appear"
    } else {
      winnerMessage = "winnerMessage"
    }

    /*Contruct slats allocating column from board*/
    let slats = [...Array(this.state.boardState.length)].map((x, i) =>
      <Slat
        key={i}
        holes={this.state.boardState[i]}
        handleClick={() => this.handleClick(i)}
      ></Slat>
    )

    return (
      <div>
        {this.state.gameSelected &&
          <div className="Board">
            {slats}
          </div>

        }
        {(!this.state.gameSelected) &&
          <div>
            <img id="img" src={gif} width="200" alt="logo" />

            <h1 >Please Enter the Player's Names </h1>
            <p><b>Player 1:</b></p>
            <input type="text" value={this.state.Player1} onChange={this.updateResponse} placeholder="Player1 " />
            <br></br>
            <br></br>
            <p><b>Player 2:</b></p>
            <input type="text" value={this.state.Player2} onChange={this.updateResponse1} placeholder="Player2 " />
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <button value={this.state.play} onClick={() => this.selectedGame('Play')}>Play</button>


          </div>
        }
        {(this.state.playerTurn === "Red" && this.state.winner === '' && this.state.gameSelected) &&
          <div>
            <h2 >{this.state.Player1}'s Turn</h2>

          </div>
        }
        {(this.state.playerTurn === "Blue" && this.state.winner === '' && this.state.gameSelected) &&
          <div>

            <h2>{this.state.Player2}'s' Turn</h2>

          </div>
        }

        <div className={winnerMessage}>{this.state.winner}</div>
        {(this.state.winner !== '' && this.state.playerTurn==="Blue" ) &&
          <div>
            <h2 >Congratulations {this.state.Player1}</h2>
            <button  onClick={() => this.selectedGame('Play')}>Play Again</button>
          </div>
        }
        
        {(this.state.winner !== '' && this.state.playerTurn==="Red") &&
          <div>
            <h2 >Congratulations {this.state.Player2} </h2>
            <button onClick={() => this.selectedGame('Play')}>Play Again</button>            
          </div>
        }
     </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <Router>

        <div className="App">
          <ul className="ul">
            <button><NavLink to="/" exact activeStyle={
              { color: 'green' }
            }>Home</NavLink></button>
            <button><NavLink to="/play" exact activeStyle={
              { color: 'green' }
            }>play</NavLink></button>
          </ul>



          <Route path="/" exact strict render={
            () => {
              return (
                <div>
                  <img src={Logo} width="180" height="180" alt="logo" />

                  <h1>Rules of the Game</h1>
                  <ol>
                    <li className="list">
                      Make sure there are two players to play.
                    </li>
                    <li className="list">
                      There are 21 red checkers and 21 white checkers in the game
                    </li>
                   
                    <li className="list">
                      Players will alternate turns after playing a checker.
                    </li>
                    <li className="list">
                      Drop one of your checkers down any of the slots in the top of the grid on your turn.
                    </li>
                    <li className="list">
                      Players alternates until one player gets 4 checkers of his color in a row.
                    </li>
                    <li className="list">
                      After reading all the rules, click on play button.
                   </li>
                  </ol>
                </div>

              );
            }
          } />
          <Route path="/play" exact strict render={
            () => {
              return (<div className="App">

                <div className="Game">
                  <Board></Board>
                </div>
              </div>);
            }
          } />

        </div>
      </Router>


    );
  }
}




function checkLine(a, b, c, d) {
  return ((a !== null) && (a === b) && (a === c) && (a === d));
}

function checkWinner(bs) {
  for (let c = 0; c < 7; c++)
    for (let r = 0; r < 4; r++)
      if (checkLine(bs[c][r], bs[c][r + 1], bs[c][r + 2], bs[c][r + 3]))
        return bs[c][r] + ' wins!'

  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 4; c++)
      if (checkLine(bs[c][r], bs[c + 1][r], bs[c + 2][r], bs[c + 3][r]))
        return bs[c][r] + ' wins!'

  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++)
      if (checkLine(bs[c][r], bs[c + 1][r + 1], bs[c + 2][r + 2], bs[c + 3][r + 3]))
        return bs[c][r] + ' wins!'

  for (let r = 0; r < 4; r++)
    for (let c = 3; c < 6; c++)
      if (checkLine(bs[c][r], bs[c - 1][r + 1], bs[c - 2][r + 2], bs[c - 3][r + 3]))
        return bs[c][r] + ' wins!'

  return "";
}

export default App;
