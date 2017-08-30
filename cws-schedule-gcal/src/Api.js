import 'fs';
import $ from 'jquery';
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var content = require(process.env.PUBLIC_URL + './client_secret.json')
var periods = require(process.env.PUBLIC_URL + './periods.js')

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar'];

const classInfo = {
    day: periods.tuesday,
    period: periods.tuesday.first,
    name: "Relativity",
    room: '4B',
    date: '2017-09-12',
    recurrence: "weekly" // 'single' or 'weekly'
}

// Load client secrets from a local file.
export function authorize() {
    var oauth2Client = authorize(JSON.parse(content))
    return oauth2Client;
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // get a new token
  return oauth2Client;
  //getNewToken(oauth2Client, callback);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  var code = prompt('Authorize this app by visiting this url: ', authUrl)
  if (code != null) {
    oauth2Client.getToken(code, function(err, token) {
        if (err) {
          alert('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        callback(oauth2Client);
      });
  }
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
        ],
        reminders: {
            useDefault: true
        }
    }
}

function addEvent(auth) {
    
    var calendar = google.calendar('v3');
    calendar.events.insert({
        auth: auth,
        //calendarId: '639uf4qd2s0j7bu3gauh70arf8@group.calendar.google.com',
        calendarId: 'primary',
        resource: createEvent(classInfo)
    }, (err, event) => {
        if (err) {
            alert("There was an error contacting the calendar service: " + err)
            return
        }
        alert('Event created: %s', event.htmlLink);
    })
    alert(JSON.stringify(createEvent(classInfo)))
}