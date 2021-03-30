import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, NavLink, Redirect, Prompt} from 'react-router-dom';





function Hole(props){
  return <div className="Hole"><div className={props.value}></div></div>
}

function Slat(props){
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
      winner: ''
    }
  }

  selectedGame(mode){
    this.setState({
       gameMode: mode,
       gameSelected: true, 
       boardState: new Array(7).fill(new Array(6).fill(null))
    })
  }

  makeMove(slatID){
    const boardCopy = this.state.boardState.map(function(arr) {
      return arr.slice();
    });
    if( boardCopy[slatID].indexOf(null) !== -1 ){
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
    if(this.state.winner === ''){
      this.makeMove(slatID)
    }
  }
  
  /*check the winner and make AI move IF game is in AI mode*/
  componentDidUpdate(){
    let winner = checkWinner(this.state.boardState)
    if(this.state.winner !== winner){
      this.setState({winner: winner})
    } 
    
  }

  render(){

    /*If a winner exists display the name*/
    let winnerMessageStyle
    if(this.state.winner !== ""){
      winnerMessageStyle = "winnerMessage appear"
    }else {
      winnerMessageStyle = "winnerMessage"
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
        <div className={winnerMessageStyle}>{this.state.winner}</div>
        {(!this.state.gameSelected || this.state.winner !== '') &&
          <div>
            <button onClick={() => this.selectedGame('human')}>Play Human</button>
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
                    <img src="connect.png"/>

        <div className="App">
        <ul className="ul">
            <button><NavLink to="/" exact activeStyle={
              { color:'green' }
            }>Home</NavLink></button>        
            <button><NavLink to="/play" exact activeStyle={
              { color:'green' }
            }>play</NavLink></button>
          </ul>
       

        <Route path="/" exact strict render={
          () => {
            return (
              <div>
            <h1>Rules of the Game</h1>
            <ol>
                    <li className="list">
                    Make sure there are two players to play.
                    </li>
                    <li className="list">
                    There are 21 red checkers and 21 white checkers in the game
                    </li>
                    <li className="list">
                    Decide which player starts.
                    </li>
                    <li className="list">
                    Players will alternate turn after playing a checker.
                    </li>
                    <li className="list">
                    On your turn, drop one of your checkers down any of the slots in the top of the grid.
                    </li>
                    <li className="list">
                    Players alternates until one player gets 4 checkers of his color in a row.
                    </li>
                    <li className="list">
                   After reading all the rules, click on play button which is available in navigation bar to start the game
                   </li>
                   </ol>
              </div>
          
          );
        }
        }/>
        <Route path="/play" exact strict render={
          () => {
            return ( <div className="App">
        
            <div className="Game">
              <Board></Board>
            </div>
          </div>);
          }
        }/>
      
        </div>
      </Router>

      
    );
  }
}

function checkLine(a,b,c,d) {
    return ((a !== null) && (a === b) && (a === c) && (a === d));
}

function checkWinner(bs) {
    for (let c = 0; c < 7; c++)
        for (let r = 0; r < 4; r++)
            if (checkLine(bs[c][r], bs[c][r+1], bs[c][r+2], bs[c][r+3]))
                return bs[c][r] + ' wins!'

    for (let r = 0; r < 6; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r], bs[c+2][r], bs[c+3][r]))
                 return bs[c][r] + ' wins!'

    for (let r = 0; r < 3; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r+1], bs[c+2][r+2], bs[c+3][r+3]))
                 return bs[c][r] + ' wins!'

    for (let r = 0; r < 4; r++)
         for (let c = 3; c < 6; c++)
             if (checkLine(bs[c][r], bs[c-1][r+1], bs[c-2][r+2], bs[c-3][r+3]))
                 return bs[c][r] + ' wins!'

    return "";
}

export default App;
