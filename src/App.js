import React, { Component } from 'react'
import { CLIENT_ID, DISCOVERY_DOCS, SCOPES, addClass } from './Api.js'
import getGApi from 'google-client-api'
import { FormComponent } from './FormComponent.js'

// material design stuff
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import AppBar from 'material-ui/AppBar'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Paper from 'material-ui/Paper'

injectTapEventPlugin()

// produce MuiTheme with CWS colors
const muiTheme = getMuiTheme({
	margin: 0,
	appBar: {
		height: 70
	},
	fontFamily: 'Roboto, sans-serif',
	palette: {
		primary1Color: '#b71c1c',
		accent1Color: "#45585f"
	}
})

class App extends Component{
	constructor(props) {
		super(props)
		this.state = {
			showAuthButton: false,
			showSignOutButton: false
		}
		this.initClient = this.initClient.bind(this)
		this.updateSigninStatus = this.updateSigninStatus.bind(this)
	}

	// handle the 'authorize application' button click on first run
	handleAuthClick(){
		getGApi().then((gapi) => {
			gapi.auth2.getAuthInstance().signIn()
		})
	}
	
	// handle the signout application
	handleSignoutClick(){
		getGApi().then((gapi) => {
			gapi.auth2.getAuthInstance().signOut()
		})
	}

	// handle once the client finishes loading
	handleClientLoad() {
		getGApi().then((gapi) => {
			gapi.load('client:auth2', this.initClient)
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
		var _this = this // save the 'this' item, so it can be used inside the callback
		getGApi().then((gapi) => {
			gapi.client.init({
				discoveryDocs: DISCOVERY_DOCS,
				clientId: CLIENT_ID,
				scope: SCOPES
			}).then(function () {
				console.log(gapi)
				gapi.auth2.getAuthInstance().isSignedIn.listen(_this.updateSigninStatus)
				_this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
			})
		})
	}

	// handle the client loading once the component finishes mounting
	componentDidMount(){
		this.handleClientLoad()
	}

	render() {
		// used because for easier readability
		let authButton = <RaisedButton label="Authorize Application" onClick={this.handleAuthClick.bind(this)} secondary={true} style={{marginTop: 24}} />
		let signOutButton = <RaisedButton label="Sign out" onClick={this.handleSignoutClick.bind(this)} secondary={true} style={{marginLeft: 24}} />
		return(
			<MuiThemeProvider muiTheme={muiTheme}>
			<div>
				<AppBar
					showMenuIconButton={false}
					title="CWS Google Scheduler"/>
					<div style={{margin: 8}}>
						{this.state.showAuthButton ? (
							<div style={{padding: 24}}>
								<Paper style={{padding: 24, paddingBottom: 0, minWidth: 250, maxWidth: 550}}>
									<div style={{fontSize: 24}}>Commonwealth Scheduler for Google Calendar</div><br/>
									<div>To use the scheduler, click Authorize Application below and log into your Google account.</div>
									<div>Once you log in, you will be able to add classes to your calendar.</div><br/>
									<div style={{fontSize: 12, marginTop: 8, paddingBottom: 8}}>Made by Kevin Fang. Source code available on <a href="https://github.com/kevin-fang/cws-google-calendar">GitHub</a>.</div><br/>
								</Paper>
								{authButton}
							</div>
						): null}
						{this.state.showSignOutButton ? (
							<div>
								<div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row'}}>
									<FormComponent
										handleSubmit={addClass}
										style={{marginBottom: 0}}/>
									<div style={{padding: 24}}>
										<b>Instructions:</b><br/><br/>
										<a href="https://calendar.google.com">Click here to go to Google Calendar</a><br/><br/>
										Fill the boxes with the according information, and click "Add Class." <br/><br/>
										If you wish to add the class to another calendar, go to <a href="https://calendar.google.com/calendar/render#settings-calendars_9">Calendar Settings</a> and click the alternate calendar.<br/><br/>
										Copy the Calendar ID in the 'Calendar Address' field, and then paste it into the Calendar ID box in the form below.<br/>
										It should look like this: 639uf4qd2s0j7bu3gauh70arf8@group.calendar.google.com
									</div>
								</div>
								{signOutButton}
							</div>
						 ) : null}
					</div>
					{/*<div style={{color: 'grey', position: 'absolute', minWidth: 175, height: 30, bottom: 0, right: 0}}>Made by Kevin Fang</div>*/}
			</div>
		</MuiThemeProvider>
		)
	}
}

export default App
