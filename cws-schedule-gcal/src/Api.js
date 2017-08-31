import getGApi from 'google-client-api'

export var CLIENT_ID = "206827991320-j3m3knj85n3o0trnvtfmn3ohqo7mpbbg.apps.googleusercontent.com";
export var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
export var SCOPES = "https://www.googleapis.com/auth/calendar";

// create a formatted date time for the google calendar api
// ('2017-09-12', '08:30:00') => '2017-09-12T08:30:00'
function createDateTime(date, time) {
  return (date + "T" + time)
}

// create an event from the class info
function createEvent(classInfo) {
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
          classInfo.recurrence === 'weekly' ? 'RRULE:FREQ=WEEKLY;UNTIL=20180531' : null
          //'RRULE:FREQ=WEEKLY;UNTIL=20180531'
      ],
      reminders: {
          useDefault: true
      }
  }
}

// add a class to the calendar API
export function addClass(classInfo, calendarId) {
  getGApi().then((gapi) => {
    var request = gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: createEvent(classInfo)
    })
    request.execute((event) => {
      if (window.confirm('Event created. Click OK to visit the event (you may have to enable popups)')) {
        window.open(event.htmlLink);
      };
    })
  })
}