import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import './App.css';
import QRCode from 'qrcode.react';
import axios from 'axios';
import io from 'socket.io-client';
import logo from './logo.svg';

// const Web3 = require('web3');
// const web3 = new Web3();
// web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));


const socket = io('https://backend-nrmzuwwswb.now.sh/');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      height: 0,
      width: 0,
      pageSize: 18,
      margin: 10,
      qrCodeData: '',
      viewQRCode: false,
      status: null,
      msg: '',
      socketId: null,
      viewSignInButton: true,
      loggedIn: false,
      phoneUid: '',
      myPublicAddress: '',
      senderPublicAddress: '',
      ethBalance: 0,
      gzeBalance: 0,
    };
  }

  componentDidMount() {

    socket.on('connect', (msg) => {
      console.log('connected');
      this.setState({status: 'Connected'})
    });

    socket.on('msg', (message) => {
      let msg, socketId;
      if (message) {
        message = JSON.parse(message)
        msg = message.msg;
        socketId = message.socketId;
      }
      console.log(msg)
      console.log(socketId)
      console.log(message);
      this.setState({msg, socketId, qrCodeData: `${msg}.${socketId}`});
    });

    socket.on('login', (msg) => {
      console.log('MSG: ', msg);
      this.setState({status: `LOGGED IN AS ${JSON.parse(msg).wallet}`, myPublicAddress: JSON.parse(msg).wallet, viewQRCode: false, loggedIn: true, phoneUid: JSON.parse(msg).uid})
    });
    socket.on('disconnect', (msg) => {
      this.setState({status: 'Disconnected'})
    });
  };

  _getData = async () => {
    const res = await axios.get('https://backend-nrmzuwwswb.now.sh/ping');
    console.log('res', res);
    // this.setState({qrCodeData: res.data})
  };

  render() {
    const { qrCodeData, viewQRCode, viewSignInButton, status, loggedIn, myPublicAddress, ethBalance } = this.state;
    const { currentPage, height, width } = this.state;

    return (
      <div className="App">
          { viewSignInButton && <button style={{borderRadius: 6, backgroundColor: '#00D4FA', fontSize: 20, color: 'white', borderWidth: 0, height: 40, width: 200, outline: 'none'}} onClick={() => this.setState({viewQRCode: !viewQRCode, viewSignInButton: !viewSignInButton})}>Login</button> }
          { viewQRCode && qrCodeData && !loggedIn &&
            <QRCode
              className="App-logo"
              fgColor='#00D4FA'
              bgColor="transparent"
              value={this.state.qrCodeData}
            />
           }
          { loggedIn &&
            <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: '#1D2533', padding: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <h1 style={{color: 'white'}}>Tenzorum</h1>
                <img src={require('./assets/Tenz_logo.png')} style={{height: 30, }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', margin: 10, backgroundColor: 'white', height: 100, width: 100, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <img style={{ width: 50}} src={require('./assets/olympus_logo.png')} alt=""/>
                </div>
                <div style={{ display: 'flex', margin: 10, backgroundColor: '#200721', height: 100, width: 100, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <img style={{ width: 50}} src={require('./assets/nebulas_logo.png')} alt=""/>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <a href="https://gazecoin.io/" target="_blank" style={{ display: 'flex', margin: 10, backgroundColor: 'black', height: 100, width: 100, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <img style={{ width: 50}} src={require('./assets/gaze.png')} alt=""/>
                </a>
                <div style={{ display: 'flex', margin: 10, backgroundColor: '#027B62', height: 100, width: 100, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <img style={{ width: 50}} src={require('./assets/kyber_logo.png')} alt=""/>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', margin: 10, backgroundColor: '#4A96D5', height: 100, width: 100, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <img style={{ width: 50}} src={require('./assets/balance_logo.png')} alt=""/>
                </div>
                <div style={{ display: 'flex', margin: 10, backgroundColor: '#013266', height: 100, width: 100, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <img style={{ width: 50}} src={require('./assets/celcius_logo.png')} alt=""/>
                </div>
              </div>
            </div>
          }
      </div>
    );
  }
}

export default App;





