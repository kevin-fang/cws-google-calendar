var google = require('googleapis');
var googleAuth = require('google-auth-library');
var periods = require('./periods.js')
var fs = require('fs');
var readline = require('readline');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Calendar API.
  authorize(JSON.parse(content), addEvent);
});

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

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
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
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
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

classInfo = {
    day: periods.tuesday,
    period: periods.tuesday.first,
    name: "Relativity",
    room: '4B',
    date: '2017-09-12',
    recurrence: "weekly" // 'single' or 'weekly'
}

function addEvent(auth) {
    
    var calendar = google.calendar('v3');
    calendar.events.insert({
        auth: auth,
        calendarId: '639uf4qd2s0j7bu3gauh70arf8@group.calendar.google.com',
        resource: createEvent(classInfo)
    }, (err, event) => {
        if (err) {
            console.log("There was an error contacting the calendar service: " + err)
            return
        }
        console.log('Event created: %s', event.htmlLink);
    })
    console.log(JSON.stringify(createEvent(classInfo)))
}