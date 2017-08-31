# CWS Scheduler for Google Calendar 

Available at https://kevin-fang.github.io/cws-google-calendar

Are you tired of having to add each school class to your calendar manually? I found that it takes approximately 20 clicks to add a single class to your Google Calendar, assuming you want to have it repeat until the end of the year (5/31/2018). With this CWS Scheduler, you can add a single class in under 8 clicks, with each class after that taking under 5 clicks. It simplifies having to add each class to your Google Calendar greatly.

If you want to run this yourself, clone the repository and run `npm start`. Note that OAuth will not work if you're not running from kevin-fang.github.io/cws-google-calendar, as you need to get a new `CLIENT_ID` (instructions available [here](https://developers.google.com/google-apps/calendar/quickstart/js)). Simply replace the `CLIENT_ID` variable in `src/App.js` with the new key.