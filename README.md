# Node library for the TIMIFY developer API

It will help you build reliable apps for the TIMIFY eco system on top of TIMIFY's API.

## Requirements

* Node version 6+ | <https://nodejs.org/en/>

## Architecture
There are three main components that define a TIMIFY app:
- the front-end part
- the back-end part
- the database

The **front-end** part is a package that need to be deployed in your TIMIFY developer account. You will use HTML, CSS and Javascript to communicate with the back-end and to display data in the app itself.

The **back-end** will save data in the database, retrieve data form the TIMIFY API and/or establish a connection to a third party service. Your code need to be deployed by you on your own server. You can use whatever technology (PHP, Node.js etc.) you prefer.

To save some data you will need your own **database**. You are free to choose whatever database type (MySQL, MongoDB etc.) you need.

In this README we treat only the topic how to create the **front-end** part fot he app 

## Installation

1). Clone the Git repository

```bash
git clone git@github.com:timify/timify-packager.git
```

2). Go into the project folder

3). Install all dependencies needed for the timity packager project (use the console):

```bash
npm install
```

4).  Initialize the project with the packager (use the console)

```bash
node packager.js new YOUR_APP_NAME
```

## Project structure
Your project should have now the following structure (in the folder timify-packager):

```bash
timify-packager/
...
|- YOUR_APP_NAME/
   |- manifest         // meta file 
   |- root             // project root folder
      |- app.html      // app UI elements
      |- assets/ 
         |- img/       // app images
         |- css/
            |- app.css // app style 
         |- js/ 
            |- app.js  // app logic
         |- locales/   // locale files
            |- en.js   // english localization file
```            

To start developing the front-end of the app you can put your code inside the files:
- timify-packager/YOUR_APP_NAME/root/**app.html**,
- timify-packager/YOUR_APP_NAME/root/**css/app.css**
- timify-packager/YOUR_APP_NAME/root/**js/app.js**

These are the files that define the front-end side of the app.

You can check the examples in the folder **timify-packager/examples/** to start faster with the development.

**WARNING!!!** Do not change the folder structure or rename any files in the project **timify-packager**. If you do this the app will not be packaged properly at the end.
 
## Internationalization
You need to put your texts that need to be transalted in the file timify-packager/YOUR_APP_NAME/root/**assets/locales/en.js** (key : value format). We need texts only in English. We will translate your app in other languages If it is necessary.

How to use the keys in your code? For example if you have a key **error** and you want to use the text for this key in the front-end you can just call it with **Locales.error** like this:

```bash
var notification = Components.get('notification-box');
notification.setTitle(Locales.error);
```

## Testing
To start testing your app you will probably need the back-end part and a database.

You can test your app on your local machine first and when you think you are ready go to the next topic **Publishing the app**.

**IMPORTANT!!!** Before you can test your app locally you will need to make a small change in the timify-packager/YOUR_APP_NAME​​​​​​​/root/**app.html** file. Search for **{__LOCALE__}** replaced it with **en**. Now your English locale file will be loaded on your local environment.
When you are ready you need to replaced **en** with **{__LOCALE__}**. We need this variable so we can load dynamically the required app langauge in our TIMIFY web-app.

## Publishing the app
Check the variables in the file timify-packager/YOUR_APP_NAME​​​​​​​/root/**app.html**:

- **backendUrl** - your backend URL
- **apiKey** - your API key associated to the app (It will be replaced by our script when we run the application)
- **appId** - the ID of the app (It will be replaced by our script when we run the application)
- **accountId** - This is Id of your account in TIMIFY (It will be replaced by our script when we run the application)
- **accessToken** - This is accessToken for TIMIFY API (It will be replaced by our script when we run the application)

When your application is ready for publishing you need to package it. This can be done with one simple command. First go to the project folder **timify-packager** and use this command in the console:

```bash
node packager.js pack YOUR_APP_NAME
```

When the package is created you will find the package file **YOUR_APP_NAME.tpkg** in the project folder timify-packager/YOUR_APP_NAME/**dist/** .

The package is ready to be uploaded in your developer account under the menu point **Apps**. 

**IMPORTANT!!!** The first time when you want to publish your app you will need to give an access to a TIMIFY SMB account to test the app in real environment. For this purpose you will need a TIMIFY SMB account. To register one you can go to the official TIMIFY webiste https://www.timify.com.

## What`s next?
At this point we will receive your app data and we run a few tests to check the functionallity. 

We will contact you as soon as possible when your app is published or if you need to update the app for some reason.

## Full documentation

You can access our developers website at https://developers.timify.com to check all UI components which you can use (https://developers.timify.com/en-gb/#/ui-elements) and all endpoints in our API (https://developers.timify.com/en-gb/#/api-reference). If you have some question feel free to contact us. 