import getGApi from 'google-client-api'

export var CLIENT_ID = "206827991320-j3m3knj85n3o0trnvtfmn3ohqo7mpbbg.apps.googleusercontent.com"
export var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
export var SCOPES = "https://www.googleapis.com/auth/calendar"

// create a formatted date time for the google calendar api
// ('2017-09-12', '08:30:00') => '2017-09-12T08:30:00'
function createDateTime(date, time) {
	return (date + "T" + time)
}
function padNumber(num, size) {
	var s = String(num)
	while (s.length < (size || 2)) {s = "0" + s}
	return s
}
// create an event from the class info
function createEvent(classInfo, lastDay) {
	return {
		summary: classInfo.name,
		location: classInfo.room,
		start: {
				dateTime: createDateTime(classInfo.date, classInfo.period.startTime),
				timeZone: 'America/New_York'
		},
		end: {
				dateTime: createDateTime(classInfo.date, classInfo.period.endTime),
				timeZone: 'America/New_York'
		},
		recurrence: [
				//classInfo.recurrence === 'weekly' ? 'RRULE:FREQ=WEEKLY;UNTIL=20180531' : null
				classInfo.recurrence === 'weekly' ? 'RRULE:FREQ=WEEKLY;UNTIL=' + String(lastDay.getFullYear()) + String(padNumber(lastDay.getMonth() + 1)) + String(padNumber(lastDay.getDate())) : null
		],
		reminders: {
				useDefault: false,
				overrides: [
					{
						method: 'popup',
						minutes: 5
					}
				]
		}
	}
}

// add a class to the calendar API
export function addClass(classInfo, calendarId, lastDay, callback) {
	getGApi().then((gapi) => {
		var request = gapi.client.calendar.events.insert({
				calendarId: calendarId,
				resource: createEvent(classInfo, lastDay)
		})
		request.execute((event) => {
			callback(event)
		})
	})
}