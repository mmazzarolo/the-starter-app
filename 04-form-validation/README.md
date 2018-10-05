<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/logo-extra-wide.png?raw=true""></img>
</p>

> This tutorial is also available on [Medium] and on [my personal website].

# Part 4: Form validation

Form validation is difficult.  
Achieving a proper validation requires a carefully crafted mixture of good UX and security: each validation feedback must be both expressive and unobtrusive.

Luckily for us our login form is pretty simple, so I propose implementing a live input validation by showing an error label in the interested input when the user leaves its content empty.

Since this is a login form we will check only that the required fields (email and password) aren't empty. We're not interested in checking the email validity and/or the password length.

We will validate the input only when it has been been blurred at least once, otherwise the error label would be shown right from the beginning (because the inputs don't have any initial value).

And, last but not least, we will disable the login button if the form is invalid.

Let's start!

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
  disabled?: boolean; // Add a "disabled" prop
  label: string;
  onPress: () => void;
}

class Button extends React.Component<Props> {
  render() {
    const { disabled, label, onPress } = this.props;
    // If the button is disabled we lower its opacity
    const containerStyle = [
      styles.container,
      disabled
        ? styles.containerDisabled
        : styles.containerEnabled
    ];
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        disabled={disabled}
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
  containerEnabled: {
    opacity: 1
  },
  containerDisabled: {
    opacity: 0.3
  },
  text: {
    color: colors.WHITE,
    textAlign: "center",
    height: 20
  }
});

export default Button;
```

> **src/components/FormTextInput.tsx**

```javascript
import * as React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View
} from "react-native";
import colors from "../config/colors";

type Props = TextInputProps & {
  error?: string;
};

class FormTextInput extends React.Component<Props> {
  textInputRef = React.createRef<TextInput>();

  focus = () => {
    if (this.textInputRef.current) {
      this.textInputRef.current.focus();
    }
  };

  render() {
    const { error, style, ...otherProps } = this.props;
    return (
      // Since added a wrapper View, I suggest to make it
      // the receiver of the he style prop.
      // Aa a rule of thumb, we will always pass the style
      // prop to the outmost wrapper of a component.
      <View style={[styles.container, style]}>
        <TextInput
          ref={this.textInputRef}
          selectionColor={colors.DODGER_BLUE}
          style={styles.textInput}
          {...otherProps}
        />
        <Text style={styles.errorText}>{error || ""}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  textInput: {
    height: 40,
    borderColor: colors.SILVER,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  errorText: {
    // Setting a fixed text height prevents the label
    // "jump" when we show/hide it
    height: 20,
    color: colors.TORCH_RED
  }
});

export default FormTextInput;
```

> **src/screens/LoginScreen.tsx**

```javascript
import * as React from "react";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  View
} from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogo from "../assets/images/logo.png";
import colors from "../config/colors";
import strings from "../config/strings";

interface State {
  email: string;
  password: string;
  // We add a field that tracks if the user has already
  // touched the input...
  emailTouched: boolean;
  passwordTouched: boolean;
}

class LoginScreen extends React.Component<{}, State> {
  passwordInputRef = React.createRef<FormTextInput>();

  readonly state: State = {
    email: "",
    password: "",
    emailTouched: false,
    passwordTouched: false
  };

  handleEmailChange = (email: string) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

  handleEmailSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  // ...and we update them in the input onBlur callback
  handleEmailBlur = () => {
    this.setState({ emailTouched: true });
  };

  handlePasswordBlur = () => {
    this.setState({ passwordTouched: true });
  };

  handleLoginPress = () => {
    console.log("Login button pressed");
  };

  render() {
    const {
      email,
      password,
      emailTouched,
      passwordTouched
    } = this.state;
    // Show the validation errors only when the inputs
    // are empty AND have been blurred at least once
    const emailError =
      !email && emailTouched
        ? strings.EMAIL_REQUIRED
        : undefined;
    const passwordError =
      !password && passwordTouched
        ? strings.PASSWORD_REQUIRED
        : undefined;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <Image source={imageLogo} style={styles.logo} />
        <View style={styles.form}>
          <FormTextInput
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            onSubmitEditing={this.handleEmailSubmitPress}
            placeholder={strings.EMAIL_PLACEHOLDER}
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            onBlur={this.handleEmailBlur}
            error={emailError}
          />
          <FormTextInput
            ref={this.passwordInputRef}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
          />
          <Button
            label={strings.LOGIN}
            onPress={this.handleLoginPress}
            disabled={!email || !password}
          />
        </View>
      </KeyboardAvoidingView>
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

Great, our login form is now validated and shows to the user a simple feedback about what he should do to make the form valid!

If you want to add some kind of validation to longer forms (_please add a bit of validation to all your forms_) or if you need a complex or asynchronous validation logic I would suggest you to take a look at [formik].

And now, let's bring our login screen to Android as well!

[next - part 5: login screen on Android]

[medium]: https://medium.com/@mmazzarolo/the-starter-app-introduction-3ead074cc589
[my personal website]: https://mmazzarolo.com/blog/2018-09-28-the-starter-app-intro/
[formik]: https://github.com/jaredpalmer/formik
[next - part 5: login screen on android]: https://github.com/mmazzarolo/the-starter-app/tree/master/04-form-validation
