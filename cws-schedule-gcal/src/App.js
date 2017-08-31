import React, { Component } from 'react'
import { CLIENT_ID, DISCOVERY_DOCS, SCOPES, addClass } from './Api.js'
import getGApi from 'google-client-api'
import { FormComponent } from './FormComponent.js'

// material design stuff
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton'
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme'

injectTapEventPlugin();

const muiTheme = getMuiTheme({
	margin: 0,
	appBar: {
		height: 70
	}
})

class App extends Component{
	constructor(props) {
		super(props);
		this.state = {
			showAuthButton: false,
			showSignOutButton: false
		};
		this.initClient = this.initClient.bind(this);
		this.updateSigninStatus = this.updateSigninStatus.bind(this);
	}

	// handle the 'authorize application' button click on first run
	handleAuthClick(){
		getGApi().then((gapi) => {
			gapi.auth2.getAuthInstance().signIn();
		})
	}
	
	// handle the signout application
	handleSignoutClick(){
		getGApi().then((gapi) => {
			gapi.auth2.getAuthInstance().signOut();
		})
	}

	// handle once the client finishes loading
	handleClientLoad() {
		getGApi().then((gapi) => {
			gapi.load('client:auth2', this.initClient);
		})
	}

	// updates whether the user is signed in/has been previously signed in
	updateSigninStatus(isSignedIn) {
		if (isSignedIn) {
			this.setState({
				showAuthButton: false,
				showSignOutButton: true
			})
		} else {
			this.setState({
				showAuthButton: true,
				showSignOutButton: false
			})
		}
	}

	// initializes the client
	initClient() {
		var _this = this; // save the 'this' item, so it can be used inside the callback
		getGApi().then((gapi) => {
			gapi.client.init({
				discoveryDocs: DISCOVERY_DOCS,
				clientId: CLIENT_ID,
				scope: SCOPES
			}).then(function () {
				console.log(gapi);
				gapi.auth2.getAuthInstance().isSignedIn.listen(_this.updateSigninStatus);
				_this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			});
		})
	}

	// handle the client loading once the component finishes mounting
	componentDidMount(){
		this.handleClientLoad();
	}

	render() {
		// used because for easier readability
		let authButton = <RaisedButton label="Authorize Application" onClick={this.handleAuthClick.bind(this)} secondary={true} style={{margin: 24}} />
		let signOutButton = <RaisedButton label="Sign out" onClick={this.handleSignoutClick.bind(this)} secondary={true} style={{marginLeft: 24}} />
		return(
			<MuiThemeProvider muiTheme={muiTheme}>
			<div>
				<AppBar
					showMenuIconButton={false}
					title="CWS Scheduler for Google Calendar"/>
					<div style={{margin: 8}}>
						{this.state.showAuthButton ? (
							<div>
								{authButton}
								<div style={{marginLeft: 24}}>To use the scheduler, first click "Authorize Application" and log into your Google account.</div>
								<div style={{marginLeft: 24}}>Once you log in, you will be able to add classes to your calendar.</div>
							</div>
						): null}
						{this.state.showSignOutButton ? (
							<div>
								<a href="https://calendar.google.com" style={{marginLeft: 24}}>Google Calendar</a><br/><br/>
								<div style={{marginLeft: 24}}>Fill the boxes below with the according information, and click "Add Class." 
									<br/>If you wish to add the class to another calendar, go to <a href="calendar.google.com">Google Calendar</a> and find the alternate calendar.
									<br/>Click 'Calendar Settings,' copy the Calendar ID in the 'Calendar Address' field, and then paste it into the Calendar ID box in the form below.</div>
								<FormComponent
									handleSubmit={ (classInfo, calendarId) => { addClass(classInfo, calendarId) } }
									style={{marginBottom: 0}}/>
								{signOutButton}
							</div>
						 ) : null}
					</div>
					<div style={{color: 'grey', position: 'absolute', minWidth: 175, height: 30, bottom: 0, right: 0}}>Made by Kevin Fang</div>
			</div>
		</MuiThemeProvider>
		)
	}
}

export default App
