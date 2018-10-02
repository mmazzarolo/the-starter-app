<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app-dev/blob/master/public/logo-extra-wide.png?raw=true"></img>
</p>

> This tutorial is also available on [Medium] and on [my personal website].

# Part 2: Login screen UI

In the previous chapter we completed the setup of the development environment so we can finally focus on coding our app.  
In this chapter we'll create the UI of the login screen, starting from the following mockup:

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app-dev/blob/master/public/02-mockup.png?raw=true" height="520"></img>
</p>

## The Button component

The button component is quite often the first component built in a new React-Native project.  
We're not aiming at doing anything fancy here, so let's start with a simple button that accepts just a `label` and an `onPress` prop.

> **src/components/Button.tsx**

```javascript
import * as React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import colors from "../config/colors";

interface Props {
  label: string;
  onPress: () => void;
}

class Button extends React.Component<Props> {
  render() {
    const { label, onPress } = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
      >
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.DODGER_BLUE,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.7)"
  },
  text: {
    color: colors.WHITE,
    textAlign: "center",
    height: 20
  }
});

export default Button;
```

## The FormTextInput component

Instead of using the raw [React Native TextInput] we'll wrap it in our own component.

Creating your own custom version of the components offered by React Native is more often than not a good practice because it leads to an improved UI consistency and simplifies future refactorings.

> **src/components/FormTextInput.tsx**

```javascript
import * as React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps
} from "react-native";
import colors from "../config/colors";

// We support all the TextInput props
type Props = TextInputProps;

class FormTextInput extends React.Component<Props> {
  render() {
    // We define our own custom style for the TextInput, but
    // we still want to allow the developer to supply its
    // own additional style if needed.
    // To do so, we extract the "style" prop from all the
    // other props to prevent it to override our own custom
    // style.
    const { style, ...otherProps } = this.props;
    return (
      <TextInput
        selectionColor={colors.DODGER_BLUE}
        // Add the externally specified style to our own
        // custom one
        style={[styles.textInput, style]}
        // ...and then spread all the other props
        {...otherProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: colors.SILVER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20
  }
});

export default FormTextInput;
```

## The login form UI

Now that all our presentational components are ready we can use them to compose our login screen.

> **src/screens/LoginScreen.tsx**

```javascript
import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogo from "../assets/images/logo.png";
import colors from "../config/colors";
import strings from "../config/strings";

interface State {
  email: string;
  password: string;
}

class LoginScreen extends React.Component<{}, State> {
  readonly state: State = {
    email: "",
    password: ""
  };

  handleEmailChange = (email: string) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

  handleLoginPress = () => {
    console.log("Login button pressed");
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={imageLogo} style={styles.logo} />
        <View style={styles.form}>
          <FormTextInput
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            placeholder={strings.EMAIL_PLACEHOLDER}
          />
          <FormTextInput
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
          />
          <Button
            label={strings.LOGIN}
            onPress={this.handleLoginPress}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  }
});

export default LoginScreen;
```

<p align="center">
<img src="https://github.com/mmazzarolo/the-app-starter/blob/master/public/02-login-ui.png?raw=true" height="520"></img>
</p>

Neat!

## That's it

That's all for this chapter. In the next one we'll improve the keyboard support of our login form ⌨️!

[Next - Part 3: Keyboard improvements]

[medium]: https://medium.com/@mmazzarolo/the-starter-app-introduction-3ead074cc589
[my personal website]: https://mmazzarolo.com/blog/2018-09-28-the-starter-app-intro/
[react native textinput]: https://facebook.github.io/react-native/docs/textinput
[next - part 3: keyboard improvements]: https://github.com/mmazzarolo/the-starter-app/tree/master/03-keyboard-improvements
