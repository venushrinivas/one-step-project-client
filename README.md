# one-step-project

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Environment variables
*VUE_APP_GOOGLE_API_KEY* - The api key for google maps api
*VUE_APP_SERVER_URL* - The url where the server is running

### How to run
1. Set the above environment variables.
2. Run the build command to generate the production files, and then use a http-server to serve the files from the dist folder.
3. Optionally, a development build can be directly served by running a serve command which will start the vue application in development mode, in the default port.

### How to use
1. Access the application in its url.
2. By default the home page is loaded, this is where the devices are listed and also a map showing the location where each of these devices are present.
3. Depending on the user preferences, there are also options to paginate, and hide devices from the view. 
4. On clicking each row, the map zooms to locate that particular device on the map.
5. There is also a reset zoom button which resets the map to its original state.
6. There is also a preferences tab, which routes to the preferences page.
7. In the preferences page, you have options to update the preferences including individual device preferences.
8. preferences include sort column, sort order and number of rows.
9. device preferences include an option to show/hide individual device which is shown in the form of a checkbox, and an option to upload an icon to represent the device. To upload a new icon, you need to click the Edit button located near the icon, and follow the prompts.
10. Once the preferences are set, click the save button to save the preferences.
11. There is also an option to search for individual devices while setting their preference.
12. Once the preferences are saved, navigate to the home page by clicking the home button or the logo, and see the user preferences reflected in the home tab.
