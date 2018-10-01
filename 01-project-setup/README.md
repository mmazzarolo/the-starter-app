<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app-dev/blob/master/public/logo-extra-wide.png?raw=true" height="320"></img>
</p>

> This tutorial is also available on [Medium] and on [my personal website].

# Part 1: Project setup

The project setup will be quick, a bit opinionated and, hopefully, painless: we're going to use [Create React Native App] and [TypeScript].

### Create React Native App

Create React Native App allows us to build a React Native app without any build configuration.  
To hide the build configuration from the developer, [Create React Native App uses Expo] under the hood.  
That said, we are not planning to use many Expo component or API, so feel free to use the standard `react-native init` to kickstart the project.  
If you haven't installed Create React Native App already, you can do it by running:

```bash
# Using npm
npm install -g create-react-native-app
# Using yarn
yarn add -g create-react-native-app
```

### TypeScript

I'm a firm believer that adding static typing to an application makes it much more maintainable.  
I chose TypeScript over FlowType manly because I think it offers a much better developer experience to the user.  
Again, we're not going to focus too much on it, so, if you feel more comfortable with FlowType, go for it!

> If you're not planning to statically type your app at all, please be aware that [PropTypes in the future won't be supported anymore out of the box by React Native].

### Directories structure

Here is the directory structure we're going to use in the tutorial:

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app-dev/blob/master/public/01-directory-structure.png?raw=true" height="520"></img>
</p>

- **assets**: Images, fonts, etc...
- **components**: Presentational/reusable components
- **config**: Configuration of the app (constants, metrics, colors)
- **mocks**: Mocks/stubs/fixtures: placeholder data to speed-up the development
- **context**: Yes, we are going to use the [React Context] (just a bit)
- **navigation**: [React Navigation] settings and navigators
- **screens** (AKA **containers**): Smart components that handles the logic of the app
- **services**: Wrappers on API calls to external services
- **types**: TypeScript interfaces and types
- **utils**: Reusable utilities

### Other libraries

For the sake of consistency in this tutorial I'll use `yarn` instead of `npm`.  
I'll also show screenshots of the app running on iOS (no worries though, we'll work on the Android version as well).

One last thing!  
I **strongly** recommend to stop worrying about code styling and formatting: please use [Prettier] and its default settings.

## Kickstarting the project

Let's kickstart the project by running the following command in your workspace directory:

```
create-react-native-app the-starter-app --scripts-version=react-native-scripts-ts
```

The command above creates an app using Create React Native App and runs a script ([react-native-scripts-ts]) that handles the entire TypeScript setup.

> If you're using `react-native init` instead of `create-react-native-app` you'll have to [manually add TypeScript to the setup]

That's it, navigate to `the-starter-app` directory and you'll see that your React Native app will be here, ready to run for the first time using:

```
yarn run ios
```

> If you used `react-native-init` you'll have to run the app using `react-native-run ios` instead.

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app-dev/blob/master/public/01-empty-app.png?raw=true" height="620"></img>
</p>

## Our first screen

Let's start shaping up our app.

We currently have a single component at the root level: `App.tsx`, which is the entry point of any Create React Native app project.

To better structure our code, we will move all the JavaScript in a `src` folder at root level and use `App.tsx` just as an entry point.

Let's create our first screen:

> **src/screens/LoginScreen.tsx**

```javascript
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

class LoginScreen extends React.Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to the login screen!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default LoginScreen;
```

As you may have already guessed, `LoginScreen.tsx` will be the screen responsible of showing the login form and handling the authentication flow.

Now, let's wire up the Login Screen to the app entry point by replacing the content of `App.tsx` with:

> **App.tsx**

```javascript
import LoginScreen from "./src/screens/LoginScreen";

export default LoginScreen;
```

Run the app again and you should be able to see our login screen in all of its glory!

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app-dev/blob/master/public/01-login-screen-intro.png?raw=true" height="620"></img>
</p>

## Config folder initialization

When you start a new project is a good practice to dedicate a few minutes into setting up an architecture that will simplify the app scaling.  
As a rule of thumb, we'll declare the app configuration and theming variables in the config folder.

**config/colors**
Colors used by the app.  
I'll differentiate the colors by name, but feel free to use any other pattern (e.g.: "PRIMARY_COLOR", "SECONDARY_COLOR", etc...).

> **src/config/colors.ts**

```javascript
const colors = {
  BLACK: "#000",
  WHITE: "#FFF",
  DODGER_BLUE: "#428AF8",
  SILVER: "#BEBEBE",
  TORCH_RED: "#F8262F",
  MISCHKA: "#E5E4E6"
};

export default colors;
```

**config/constants**
Here we'll define all the informations about the environment and the API keys.  
We can further improve it in the future by extracting the API keys from a `.env` file in the future (using libraries like [react-native-config] or [react-native-dotenv]).

> **src/config/constants.ts**

```javascript
import { Platform } from "react-native";

const constants = {
  IS_ENV_DEVELOPMENT: __DEV__,
  IS_ANDROID: Platform.OS === "android",
  IS_IOS: Platform.OS === "ios",
  IS_DEBUG_MODE_ENABLED: Boolean(window.navigator.userAgent)
};

export default constants;
```

**config/metrics**
Not too much to say here, in `metrics.ts` we can declare useful metrics like the statusbar height, the navigation bar height, etc...

> **src/config/metrics.ts**

```javascript
import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const metrics = {
  DEVICE_WIDTH: width,
  DEVICE_HEIGHT: height
};

export default metrics;
```

**config/strings**
Instead of hardcoding the app labels in the components we'll import them from here.  
The main reason for doing so is that it will simplify a lot the internationalization of the app in the future, since we won't have to search for all the hardcoded labels by hand.

> **src/config/strings.ts**

```javascript
const strings = {
  LOGIN: "Log In"
};

export default strings;
```

## Adding assets to the app

Images, fonts, sound effect and other assets will be stored in the `assets` folder.  
In the login screen of the app we'll show the app logo, so let's place [this image] into `src/assets/images/logo.png`.

## That's it

We completed the project setup and we're now finally ready to start coding 🎉!

[Next - Part 2: Login screen UI]

[medium]: https://medium.com/@mmazzarolo/the-starter-app-introduction-3ead074cc589
[personal website]: https://mmazzarolo.com/blog/2018-09-28-the-starter-app-intro/
[next - part 2: login screen ui]: https://github.com/mmazzarolo/the-starter-app/tree/master/02-login-screen-ui
[create react native app]: https://github.com/react-community/create-react-native-app
[typescript]: https://www.typescriptlang.org/
[create react native app uses expo]: https://docs.expo.io/versions/latest/workflow/create-react-native-app
[prettier]: https://github.com/prettier/prettier
[react-native-scripts-ts]: https://github.com/mathieudutour/create-react-native-app-typescript
[manually add typescript to the setup]: https://facebook.github.io/react-native/blog/2018/05/07/using-typescript-with-react-native
[react-native-config]: https://github.com/luggit/react-native-config
[react-native-dotenv]: https://github.com/zetachang/react-native-dotenv
[this image]: https://github.com/mmazzarolo/the-starter-app-dev/blob/master/public/logo-wide.png?raw=true
[proptypes in the future won't be supported anymore out of the box by react native]: https://github.com/react-native-community/discussions-and-proposals/issues/29
[react context]: https://reactjs.org/docs/context.html
[react navigation]: https://reactnavigation.org
