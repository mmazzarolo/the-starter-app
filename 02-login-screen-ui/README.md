<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app-dev/blob/master/public/logo-extra-wide.png?raw=true" height="320"></img>
</p>

# Part 2: Login screen UI

Since in the previous chapter we completed the setup of the development environment we can finally focus on coding our app.  
In this chapter we'll create the UI of the login form for both Android and iOS, starting from the following mockup:

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app-dev/blob/master/public/02-mockup.png?raw=true" height="520"></img>
</p>

## The Button component

The button component is often the first component that is built in a new React-Native project.  
I'm not aiming at doing anything fancy here, so let's start with a simple button that accepts just a `label` and an `onPress` prop.

> **src/components/Button.tsx**

```javascript
import * as React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import colors from "../config/colors";

interface Props {
  label: string;
  onPress: () => void;
}

class Button extends React.Component<Props> {
  render() {
    const { label, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.MARINER,
    paddingVertical: 16,
    width: "100%",
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.7)",
    marginBottom: 12
  },
  text: {
    color: colors.WHITE,
    textAlign: "center"
  }
});

export default Button;
```

## The FormTextInput component

The next component we'll build is our own custom version of the TextInput.  
Again, let's start simple:

> **src/components/FormTextInput.tsx**

```javascript
import * as React from "react";
import { TextInput, StyleSheet } from "react-native";
import colors from "../config/colors";

interface Props {
  onChangeText: (value: string) => void;
  value: string | undefined;
  placeholder: string;
}

class FormTextInput extends React.Component<Props> {
  render() {
    const { onChangeText, value, placeholder } = this.props;
    return (
      <RNTextInput
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        style={styles.textInput}
        selectionColor={colors.MARINER}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: colors.FRENCH_GRAY,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20
  }
});

export default FormTextInput;
```

## The login form UI

Now that all our needed components are ready, we can use them to compose our login form.

> **src/screens/LoginScreen.tsx**

```javascript
import * as React from "react";
import { Image, StyleSheet, Text, View, StatusBar } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import colors from "../config/colors";
import imageLogo from "../assets/images/logo.png";

interface State {
  email: string;
  password: string;
}

class LoginScreen extends React.Component<{}, State> {
  state = {
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
            placeholder="Email"
          />
          <FormTextInput
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder="Password"
          />
          <Button label="Log In" onPress={this.handleLoginPress} />
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
    width: "90%",
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
<img src="https://github.com/mmazzarolo/the-app-starter/blob/master/.github/02-login-form.png?raw=true" height="520"></img>
</p>
