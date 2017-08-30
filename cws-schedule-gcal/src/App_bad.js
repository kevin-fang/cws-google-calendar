import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';
import { CLIENT_ID, SCOPES } from './Api.js';

// material stuff
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme'

var asyncLoad = require('react-async-loader')

injectTapEventPlugin()

const muiTheme = getMuiTheme({
  margin: 0,
  appBar: {
    height: 70
  }
})

const mapScriptToProps = state => ({
  gapi: {
    globalPath: 'gapi',
    url: "https://apis.google.com/js/api.js"
  }
})

@asyncLoad(mapScriptToProps)
class App extends Component {
  componentDidMount() {
    if (this.props.gapi !== null) {
      this.checkAuth();
    } else {
      alert('nul')
    }
  }

  componentWillReceiveProps({gapi}) {
    if (gapi!== null) {
      this.checkAuth();
    }
  }

  checkAuth() {
    alert("check")
    // Better check with window and make it available in component
    this.gapi = window.gapi;
    this.gapi.auth.authorize({
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, this.handleAuthResult);
  }

  listUpcomingEvents() {
    alert('upcoming')
    this.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      var events = response.result.items;
      alert(events)
    })
  }

  updateSigninStatus(isSignedIn) {
    
    var authorizeButton = document.getElementById('authorize-button');
    var signoutButton = document.getElementById('signout-button');

    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      this.listUpcomingEvents();
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
    }
  }

  handleAuthResult(authData) {
    this.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
  
    // Handle the initial sign-in state.
    this.updateSigninStatus(this.gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  handleAuthClick(event) {
    this.gapi.auth2.getAuthInstance().signIn();
  }

  handleSignoutClick(event) {
    this.gapi.auth2.getAuthInstance().signOut();
  }

  listUpcomingEvents() {
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      var events = response.result.items;
      appendPre('Upcoming events:');

      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          appendPre(event.summary + ' (' + when + ')')
        }
      } else {
        appendPre('No upcoming events found.');
      }
    });
  }

  constructor(props) {
    super(props)
    this.handleAuthClick = this.handleAuthClick.bind(this)
    this.handleSignoutClick = this.handleSignoutClick.bind(this)
    this.updateSigninStatus = this.updateSigninStatus.bind(this)
    this.handleAuthResult = this.handleAuthResult.bind(this)
    this.checkAuth = this.checkAuth.bind(this)
    this.listUpcomingEvents = this.listUpcomingEvents.bind(this)
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            showMenuIconButton={false}
            title="Commonwealth School Google Calendar"/>
            <div style={{margin: 8}}>
              <button
                id="authorize-button"
                onClick={this.handleAuthClick}>Authorize</button><br/><br/>
              <button
                id="signout-button"
                onClick={this.handleSignoutClick}>Sign Out</button>
            </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
