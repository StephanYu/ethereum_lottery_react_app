import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    admin: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    const admin = await lottery.methods.admin().call();
    const players = await lottery.methods.fetchPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ admin, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enterDraw().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        
        <p>This contract is managed by account: {this.state.admin}</p>
        <p>There are currently {this.state.players.length} players in this lottery competing for a total pool of {web3.utils.fromWei(this.state.balance, 'ether')} ether.</p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>

          <button>Enter</button>
        </form>

        <hr />
        
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick Winner</button>
        
        <hr />

        <h4>{this.state.message}</h4>
      </div>
    );
  }
}

export default App;
