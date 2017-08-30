import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import logo from './logo.svg';
import './App.css';
import './Api.js';

// material stuff
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton';


injectTapEventPlugin()

const muiTheme = getMuiTheme({
  margin: 0,
  appBar: {
    height: 70
  }
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authorized: false,
      credentials: null
    }
    this.authorize = this.authorize.bind(this)
  }

  authorize() {
    this.setState({
      credentials: null
    })
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            showMenuIconButton={false}
            title="Commonwealth School Google Calendar"/>
            <div style={{margin: 8}}>
              <RaisedButton label='Authorize Application'
					      backgroundColor="#303f9f"
					      labelColor="#ffffff"
              />
            </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
