<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app-dev/blob/master/public/logo-extra-wide.png?raw=true" height="320"></img>
</p>

> This tutorial is also available on [Medium] and on [my personal website].

# Part 3: Handling the keyboard

We just built a nice UI for our login screen, but if you run the app and tap on a TextInput you'll quickly discover that the keyboard has a few issues.

## Solving the keyboard overlapping

The first glaring issue you'll see is that when you focus a TextInput the keyboard overlaps it.

<p align="center">
<img src="https://github.com/mmazzarolo/the-app-starter/blob/master/public/03-keyboard-overlap.gif?raw=true" height="520"></img>
</p>

This is a common issue in React Native: handling the keyboard in some cases is really annoying, especially if you're planning to support both iOS and Android and/or you have a long form.

That said, things are getting always better and in our case the [KeyboardAvoidingView component] will take care of the issue nicely.

To use it, we can just wrap the entire screen in it (replacing our outmost View):

> **src/screens/LoginScreen.tsx**

```javascript
import * as React from "react";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  View
} from "react-native";

// ...

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <Image source={imageLogo} style={styles.logo} />
        <View style={styles.form}>
          <TextInput
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            placeholder="Email"
          />
          <TextInput
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder="Password"
          />
          <Button
            label="Log In"
            onPress={this.handleLoginPress}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

// ...
```

From the [React Native documentation]:
`KeyboardAvoidingView` is a component to solve the common problem of views that need to move out of the way of the virtual keyboard. It can automatically adjust either its position or bottom padding based on the position of the keyboard.

The `behavior="padding"` prop of the KeyboardAvoidingView component replaces the empty space underneath the keyboard with a padding. This causes a nice animation of the logo size when you trigger the keyboard:

<p align="center">
<img src="https://github.com/mmazzarolo/the-app-starter/blob/master/public/03-keyboard-overlap-fix.gif?raw=true" height="520"></img>
</p>

The logo animates because we defined both the form and the logo as `flex: 1`, which means they'll try to grow as much as possible in the available space. Since opening a keyboard diminishes the available space on the screen, the logo will shrink.

## Keyboard support improvements

If you look closely at the gif above you'll notice that the keyboard submit button is labeled "return" and pressing it hides the keyboard.

To improve the user experience, we will implement the following flow:
**1. Tapping on the email input shows the keyboard**
There are a few things we can improve here:

- Set the right keyboard type. In this case we want the "e-mail" type, which simplifies entering email addresses showing a prominent "@" key. The [TextInput's keyboardType="email"] will take care of this.
- Being an email address we may want to disable the autocorrection by setting [autoCorrect={false}].
- Rename the submit button label to a more descriptive "next" using the [returnKeyType prop].

**2. Pressing the on the keyboard submit button will focus the next field (in this case the password one)**
Here comes the fun part: when the submit button of the email FormTextInput is pressed (we can use [the TextInput onSubmitEditing prop] to detect it) we must focus the password FormTextInput.  
It sounds straightforward, but since we're using the custom FormTextInput component we don't have a way to programmatically focus the input... yet.
To do so, we will store a reference of the TextInput component inside the FormTextInput and expose a function that will call the TextInput's focus method when invoked.
If it's still not clear to you don't worry, I added a few comment in the code that hopefully will make it clearer.

**3. And now, since the focused field is the last one in the form, pressing the submit button will hide the keyboard**
Again, we can improve the keyboard password input in a few ways:

- Setting the [TextInput secureTextEntry prop to true] will mask the password input characters
- Setting [TextInput returnKeyType to "done"] will label the submit button with "done".

Let's start with the FormTextInput component:

> **src/components/FormTextInput.tsx**

```javascript
import * as React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import colors from "../config/colors";

type Props = TextInputProps;

class FormTextInput extends React.Component<Props> {

  // Create a React ref that will be used to store the
  // TextInput reference
  textInputRef = React.createRef<TextInput>();

  // Expose a `focus` method that will allow us to focus
  // the TextInput
  focus = () => {
    if (this.textInputRef.current) {
      this.textInputRef.current.focus();
    }
  };

  render() {
    const { style, ...otherProps } = this.props;
    return (
      <TextInput
        ref={this.textInputRef}
        style={[styles.textInput, style]}
        selectionColor={colors.DODGER_BLUE}
        {...otherProps}
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

And then we can update the form itself:

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
}

class LoginScreen extends React.Component<{}, State> {
  // Again, create a React ref for storing the FormTextInput
  // reference
  passwordInputRef = React.createRef<FormTextInput>();

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

  // When the "next" button is pressed, focus the password
  // input
  handleEmailSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  handleLoginPress = () => {
    console.log("Login button pressed");
  };

  render() {
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
            placeholder="Email"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
          />
          <FormTextInput
            ref={this.passwordInputRef}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder="Password"
            secureTextEntry={true}
            returnKeyType="done"
          />
          <Button
            label="Log In"
            onPress={this.handleLoginPress}
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

<p align="center">
<img src="https://github.com/mmazzarolo/the-app-starter/blob/master/public/03-keyboard-focus.gif?raw=true" height="520"></img>
</p>

Next - part 4: form validation (WIP)

[medium]: https://medium.com/@mmazzarolo/the-starter-app-introduction-3ead074cc589
[personal website]: https://mmazzarolo.com/blog/2018-09-28-the-starter-app-intro/
[keyboardavoidingview component]: https://facebook.github.io/react-native/docs/keyboardavoidingview
[react native documentation]: https://facebook.github.io/react-native/docs/keyboardavoidingview
[textinput's keyboardtype="email"]: https://facebook.github.io/react-native/docs/textinput#keyboardtype
[autocorrect={false}]: https://facebook.github.io/react-native/docs/textinput#autocorrect
[returnkeytype prop]: https://facebook.github.io/react-native/docs/textinput#returnkeytype
[textinput returnkeytype to "done"]: https://facebook.github.io/react-native/docs/textinput#returnkeytype
[securetextentry"]: https://facebook.github.io/react-native/docs/textinput#securetextentry
[onsubmitediting]: https://facebook.github.io/react-native/docs/textinput#onsubmitediting
[next - part 4: form validation]: https://github.com/mmazzarolo/the-starter-app/tree/master/04-form-validation
