# Slack Application!

This is one of our demo applications which will show you how to use our components and how you can write your app.

This application contains tab component with two tabs:
  - Appointments browser
  - Settings

### Appointments browser
In first tab you will find simple form for selecting date and list of appointments for this date. Date picker and List components are used here. The labels of the date picker comes from the locale file and the data of appointments come from TIMIFY API. 

Clicking on the button "load" you will send an API request for loading all appointments for selected date. When you click on button "Send" of appointment" application will send an API request to Slack and the message will be posted at the channel.

### Settings
In this tab you will see how the uninstallation process of the app works. Here you will find simple box with a button. When click on this button you will see popup window to confirm the uninstallation. When confirm will execute a function from our Timify SDK to uninstall the application. This is the whole process of the uninstallation which must be a part of you application.

------
If you have any questions feel free to contact us.