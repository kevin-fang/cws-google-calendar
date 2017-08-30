import getGApi from 'google-client-api'

export var CLIENT_ID = "206827991320-j3m3knj85n3o0trnvtfmn3ohqo7mpbbg.apps.googleusercontent.com";
export var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
export var SCOPES = "https://www.googleapis.com/auth/calendar";

export function getUpcomingEvents(callback) {
  getGApi().then((gapi) => {
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      var events = response.result.items;
      callback(JSON.stringify(events))
    });
  })
}

// create a formatted date time
// ('2017-09-12', '08:30:00') => '2017-09-12T08:30:00'
function createDateTime(date, time) {
  return (date + "T" + time)
}

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

export function addClass(classInfo, calendarId) {
  getGApi().then((gapi) => {
    var request = gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: createEvent(classInfo)
    })
    request.execute((event) => {
      if (window.confirm('Event created. Click OK to visit the event')) {
        window.open(event.htmlLink);
      };
    })
  })
}