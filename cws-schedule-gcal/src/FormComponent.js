import React, { Component } from 'react'
import Periods from './periods.js'

// material design stuff
import TextField from 'material-ui/TextField'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper'

const alignedStyle = {
	marginLeft: 24
}

var sampleClass = {
	period: Periods.tuesday.first,
	name: "Relativity",
	room: '4B',
	date: '2017-09-12',
	recurrence: "weekly" // 'single' or 'weekly'
}

var daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

export class FormComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			className: "",
			dayOfWeek: 0, // 0-4
			periodOfDay: "first",
			room: "",
			date: "",
			weekly: true,
			calendarId: 'primary'
		}
		this.handleDayChange = this.handleDayChange.bind(this)
		this.handlePeriodChange = this.handlePeriodChange.bind(this)
		this.handleWeeklyToggle = this.handleWeeklyToggle.bind(this)
		this.handleDateChange = this.handleDateChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.getTimes = this.getTimes.bind(this)
	}

	handleWeeklyToggle() {
		this.setState({weekly: !this.state.weekly})
	}

	handlePeriodChange(event, index, value) {
		this.setState({periodOfDay: value})
	}

	handleDayChange(event, index, value) {
		this.setState({dayOfWeek: value, date: ""})
	}
	
	handleDateChange(event, date) {
		this.setState({date: date, dayOfWeek: date.getDay() - 1})
	} 

	handleSubmit() {
		const validSettings = () => {
			if (this.state.className === "") {
				alert("Please fill out class name")
				return false
			}
			if (this.state.date === "") {
				alert("Please fill out date")
				return false
			}
			return true
		}
		// format the date
		const formatDate = (date) => {
			var dayOfMonth = date.getDate()
			const padNumber = (num, size) => {
				var s = String(num);
				while (s.length < (size || 2)) {s = "0" + s;}
				return s;
			}
			var month = padNumber(date.getMonth() + 1, 2)
			var year = date.getFullYear()
			return year + '-' + month + '-' + dayOfMonth
		}
		// create the object 
		
		if (validSettings()) {
			var classInfo = {
				period: Periods[daysOfWeek[this.state.dayOfWeek]][this.state.periodOfDay],
				name: this.state.className,
				room: this.state.room,
				date: formatDate(this.state.date),
				recurrence: this.state.weekly ? "weekly" : "single"
			} 
			//alert(JSON.stringify(classInfo))
			this.props.handleSubmit(classInfo, this.state.calendarId)
		} 
	} 
	
	getTimes() {
		var period = Periods[daysOfWeek[this.state.dayOfWeek]][this.state.periodOfDay]
		return period.startTime + '-' + period.endTime
	}

	render() {
		return (
			<div>
				<Paper style={{minWidth: 300, maxWidth: 300, margin: 24}} zDepth={4}>
					<TextField floatingLabelText="Class Name" style={alignedStyle} onChange={(e, s) => this.setState({className: s})}/>
					<br/>
					<TextField floatingLabelText="Room Name" style={alignedStyle} onChange={(e, s) => {this.setState({room: s})}}/>
					<br/>
					<DropDownMenu value={this.state.dayOfWeek}
						onChange={this.handleDayChange}>
						<MenuItem value={0} primaryText="Monday"/>
						<MenuItem value={1} primaryText="Tuesday"/>
						<MenuItem value={2} primaryText="Wednesday"/>
						<MenuItem value={3} primaryText="Thursday"/>
						<MenuItem value={4} primaryText="Friday"/>
					</DropDownMenu>
					
					<DropDownMenu value={this.state.periodOfDay}
						onChange={this.handlePeriodChange}>
						<MenuItem value={"first"} primaryText="Period 1"/>
						<MenuItem value={"second"} primaryText="Period 2"/>
						<MenuItem value={"third"} primaryText="Period 3"/>
						<MenuItem value={"fourth"} primaryText="Period 4"/>
						<MenuItem value={"fifth"} primaryText="Period 5"/>
						<MenuItem value={"sixth"} primaryText="Period 6"/>
						<MenuItem value={"seventh"} primaryText="Period 7"/>
					</DropDownMenu>
					<br/>
					<div style={{marginLeft: 72, color: 'grey'}}>{this.getTimes()}</div>
					<br/>
					<DatePicker hintText={this.state.weekly ? "Date of first class" : "Date of class"} 
						style={alignedStyle} 
						firstDayOfWeek={0}
						locale="en-US"
						autoOk={true}
						value={this.state.date}
						onChange={this.handleDateChange}/>
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
						style={{marginLeft: 24, marginBottom: 24}} 
						onClick={this.handleSubmit}/>
					<TextField
						style={{marginLeft: 24}}
      					hintText="Calendar ID (default is primary)"
						onChange={(e, s) => {
							if (s !== "") {
								this.setState({calendarId: s})
							} else {
								this.setState({calendarId: 'primary'})
							}
						}}/>
					<br/>
				</Paper>
			</div>
		)
	}
}