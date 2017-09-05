import React, { Component } from 'react'
import Periods from './periods.js'

// material design stuff from material-ui
import TextField from 'material-ui/TextField'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import DatePicker from 'material-ui/DatePicker'
import Toggle from 'material-ui/Toggle'
import Paper from 'material-ui/Paper'
import Dialog from 'material-ui/Dialog'
import AutoComplete from 'material-ui/AutoComplete'
import FlatButton from 'material-ui/FlatButton'

var courses = require('./courses.json').classes

const alignedStyle = {
	marginLeft: 24
}

/* a sample class, just for formatting purposes

var sampleClass = {
	period: Periods.tuesday.first,
	name: "Relativity",
	room: '4B',
	date: '2017-09-12',
	recurrence: "weekly" // 'single' or 'weekly'
}
*/

function disableWeekends(date) {
	return date.getDay() === 0 || date.getDay() === 6
  }
  
var daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

var daysOfWeekCapitalized = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

/*
  TODO:
	  * add sports
	  * use material design dialogs
	  * add different way of confirming that event was added
*/
export class FormComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			className: "",
			dayOfWeek: 0, // 0-4
			periodOfDay: "first",
			room: "",
			date: new Date(),
			weekly: true,
			calendarId: 'primary',
			lastDay: new Date(2018, 4, 31),
			open: false,
			eventLink: "",
			validSettings: false,
			event: null
		}
		this.handlePeriodChange = this.handlePeriodChange.bind(this)
		this.handleWeeklyToggle = this.handleWeeklyToggle.bind(this)
		this.handleDateChange = this.handleDateChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.getTimes = this.getTimes.bind(this)
		this.handleLastDayChange = this.handleLastDayChange.bind(this)
		this.handleOpen = this.handleOpen.bind(this)
		this.handleClose = this.handleClose.bind(this)
		this.validSettings = this.validSettings.bind(this)
		this.handleNewClassName = this.handleNewClassName.bind(this)
		this.handleNameChange = this.handleNameChange.bind(this)
	}

	handleWeeklyToggle() {
		this.setState({weekly: !this.state.weekly})
	}

	handlePeriodChange(event, index, value) {
		this.setState({periodOfDay: value})
	}
	
	handleDateChange(event, date) {
		this.setState({date: date, dayOfWeek: date.getDay() - 1})
		this.validateSettings();
	} 

	handleLastDayChange(event, date) {
		this.setState({lastDay: date})
	} 

	handleNewClassName(request, index) {
		this.setState({className: request}, () => {
			this.validateSettings()
		})
	}

	handleNameChange(searchText, dataSource, params) {
		this.setState({className: searchText}, () => {
			this.validateSettings()
		})
	}

	// check if the details filled out are valid, importantly the class name and date
	validSettings() {
		if (this.state.className === "" || this.state.date === null) {
			return false
		}
		return true
	}

	handleSubmit() {
		// format the date
		const formatDate = (date) => {
			var dayOfMonth = date.getDate()
			const padNumber = (num, size) => {
				var s = String(num)
				while (s.length < (size || 2)) {s = "0" + s}
				return s
			}
			var month = padNumber(date.getMonth() + 1, 2)
			var year = date.getFullYear()
			return year + '-' + month + '-' + dayOfMonth
		}

		// create the class info object object 
		if (this.validSettings()) {
			var classInfo = {
				period: Periods[daysOfWeek[this.state.dayOfWeek]][this.state.periodOfDay],
				name: this.state.className,
				room: this.state.room,
				date: formatDate(this.state.date),
				recurrence: this.state.weekly ? "weekly" : "single"
			} 
			//alert(JSON.stringify(classInfo))
			this.props.handleSubmit(classInfo, this.state.calendarId, this.state.lastDay, (event) => {
				this.setState({eventLink: event.htmlLink, event: event}, () => {
					this.handleOpen()
				})
			})
		} 
	} 

	validateSettings() {
		if (this.validSettings()) {
			this.setState({validSettings: true})
		} else {
			this.setState({validSettings: false})
		}
	}
	
	// get the times for the selected period
	getTimes() {
		var period = Periods[daysOfWeek[this.state.dayOfWeek]][this.state.periodOfDay]
		return period.startTime + '-' + period.endTime
	}
	
	handleOpen = () => {
		this.setState({open: true});
	}
	
	handleClose = () => {
		this.setState({open: false});
	}
	
	render() {
		const goodActions = [
			<FlatButton
			  label="Dismiss"
			  primary={true}
			  onClick={this.handleClose} />,
			<FlatButton
			  	label="Open Event Page"
			  	primary={true}
			  	onClick={() => {
				  	this.handleClose()
				  	window.open(this.state.eventLink)}} />,
		]

		const issueActions = [
			<FlatButton
			  label="Dismiss"
			  primary={true}
			  onClick={this.handleClose} />,
			<FlatButton
			  	label="Open Issue"
			  	primary={true}
			  	onClick={() => {
				  	window.open("https://github.com/kevin-fang/cws-google-calendar/issues/new?title=Class%fails%to%add&body=Replace%this%text%with%error%message")
				}}/>
		]
		
		return (
			<div>
				<Dialog title={this.state.eventLink === undefined ? "Error" : "Event Added"}
					onRequestClose={this.handleClose}
					model={false}
					actions={this.state.eventLink === undefined ? issueActions : goodActions }
					open={this.state.open}>
						{this.state.eventLink === undefined ? (
							<div>
								<span>"Something went wrong. Please open an issue on GitHub the following error message:</span> <br/>
								<TextField 
									defaultValue={JSON.stringify({state: this.state})}
									style={{minWidth: 600}} />
							</div>
						) : 
						"Event has been created and added to Google Calendar. Click OK to visit the event (you may have to enable popups), or click Cancel to dismiss this box."}
					</Dialog>

				<Paper style={{minWidth: 350, maxWidth: 500, margin: 24}} zDepth={4}>
					<AutoComplete floatingLabelText="Class Name" 
						style={alignedStyle}
						filter={AutoComplete.caseInsensitiveFilter}
						onNewRequest={this.handleNewClassName}
						maxSearchResults={6}
						onUpdateInput={this.handleNameChange}
						dataSource={courses}
					/>
					<br/>
					<TextField floatingLabelText="Room Name" style={alignedStyle} onChange={(e, s) => {this.setState({room: s})}}/>
					<br/>
					<DatePicker floatingLabelText={this.state.weekly ? "Date of first class" : "Date of class"} 
						style={{marginLeft: 24, marginTop: 16}} 
						firstDayOfWeek={0}
						autoOk={true}
						locale="en-US"
						shouldDisableDate={disableWeekends}
						value={this.state.date}
						onChange={this.handleDateChange}/>
					<br/>

					<div style={{display: 'flex'}}>
						<div style={{marginLeft: 24, marginTop: 20}}>{daysOfWeekCapitalized[this.state.dayOfWeek]}</div>
						
						<DropDownMenu value={this.state.periodOfDay}
							style={{marginLeft: 72}}
							onChange={this.handlePeriodChange}>
							<MenuItem value={"first"} primaryText="Period 1"/>
							<MenuItem value={"second"} primaryText="Period 2"/>
							<MenuItem value={"third"} primaryText="Period 3"/>
							<MenuItem value={"fourth"} primaryText="Period 4"/>
							<MenuItem value={"fifth"} primaryText="Period 5"/>
							<MenuItem value={"sixth"} primaryText="Period 6"/>
							<MenuItem value={"seventh"} primaryText="Period 7"/>
						</DropDownMenu>
					</div>
					<br/>
					<div style={{marginLeft: 72, color: 'grey'}}>{this.getTimes()}</div>
					<br/>
					<Toggle label={this.state.weekly ? "Weekly" : "One Day Only"} 
						style={{maxWidth: 250, marginLeft: 24}} 
						trackStyle={{backgroundColor: '#ff9d9d'}}
						thumbStyle={{backgroundColor: "red"}}
						defaultToggled={true} 
						onToggle={this.handleWeeklyToggle} 
						/>
					<br/>
					<RaisedButton label="Add Class" 
						primary={true}
						disabled={!this.state.validSettings}
						style={{marginLeft: 24, marginBottom: 24}} 
						onClick={this.handleSubmit}/><br/>
					<TextField
						style={{marginLeft: 24, marginBottom: 12}}
      					floatingLabelText="Calendar ID (empty = default)"
						onChange={(e, s) => {
							if (s !== "") {
								this.setState({calendarId: s})
							} else {
								this.setState({calendarId: 'primary'})
							}
						}}/>
					<br/>
					{this.state.weekly ? (
						<DatePicker floatingLabelText="Last day of school"
							style={{marginLeft: 24, marginTop: 16}} 
							firstDayOfWeek={0}
							autoOk={true}
							locale="en-US"
							shouldDisableDate={disableWeekends}
							value={this.state.lastDay}
							onChange={this.handleLastDayChange}/>
						) : null
					}
					<br/>
				</Paper>
			</div>
		)
	}
}