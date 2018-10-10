<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/logo-extra-wide.png?raw=true""></img>
</p>

> This tutorial is also available on [Medium] and on [my personal website].

# Part 5: Login screen on Android

Until now we tried our app on iOS only and we haven't put much attention into making the app looks good on Android.

That's ok though, now that we developed a stable UI/UX for the screen we can focus on making it work on Android as well.

First of all, let's see how the app looks on Android by running:

```
yarn run android
```

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/05-initial-state.png?raw=true" height="520"></img>
</p>

## The Status Bar

Let's start from the top.  
You can clearly see that the status bar style doesn't match the theme of the screen.

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/05-statusbar-gray.png?raw=true"></img>
</p>

Luckily for us, React Native provides the [StatusBar component] to customize the look of the status bar (on both Android and iOS).

For example, I would suggest adding the following StatusBar in the LoginScreen:

```javascript
<StatusBar
  backgroundColor="#FFFFFF"
  barStyle="dark-content"
/>
```

It will sets the status bar background color to white and its text will be dark gray (the text color of the status bar is controlled by the `barStyle` prop).

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/05-statusbar-white.png?raw=true"></img>
</p>

> The StatusBar doesn't work like a standard component: you can place it wherever you want in the hierarchy of your screen without having to worry about its layout position.

# The input fields

Now that the status bar matches the screen color scheme we can focus on the input fields, which now look... really bad.

The most notable issue of the input fields is that they have two underlines.
The lighter underline is the one we declared ourself in the `FormTextInput` by setting the input bottom border style:

```javascript
textInput: {
  height: 40,
  borderColor: colors.SILVER,
  borderBottomWidth: StyleSheet.hairlineWidth
},
```

The darker one shows up only on Android: it's a native underline that follows the Material Design guidelines.

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/05-input-underline.png?raw=true" ></img>
</p>

I recently posted [a short article that explains how we can fix the TextInput UI on Android]; the plan is the following:

1. Hide the lighter underline on Android, we'll use it only on iOS
2. Add a left padding to the TextInput on Android to fix the wrong placeholder alignment
3. Change the TextInput underline color (on Android) when it's focused

```javascript
import * as React from "react";
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View
} from "react-native";
import colors from "../config/colors";

type Props = TextInputProps & {
  error?: string;
};

interface State {
  isFocused: boolean;
}

class FormTextInput extends React.Component<Props, State> {
  textInputRef = React.createRef<TextInput>();

  readonly state: State = {
    isFocused: false
  };

  focus = () => {
    if (this.textInputRef.current) {
      this.textInputRef.current.focus();
    }
  };

  handleFocus = (
    e: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    this.setState({ isFocused: true });
    // Remember to propagate the `onFocus` event to the
    // parent as well (if set)
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  handleBlur = (
    e: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    this.setState({ isFocused: false });
    // Remember to propagate the `onBlur` event to the
    // parent as well (if set)
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  render() {
    // On Android we want to change the color of the input
    // underline when it is focused. To do so this component
    // must be aware of being focused, so we'll use the
    // TextInput `onFocus` and `onBlur` callbacks to set
    // a variable in the state that keeps track of when the
    // TextInput is focused.
    // We should also make sure to remove the `onFocus` and
    // `onBlur` props from the `...otherProps`, otherwise
    // they would override our own handlers.
    const {
      error,
      onFocus,
      onBlur,
      style,
      ...otherProps
    } = this.props;
    const { isFocused } = this.state;
    return (
      <View style={[styles.container, style]}>
        <TextInput
          ref={this.textInputRef}
          selectionColor={colors.DODGER_BLUE}
          underlineColorAndroid={
            isFocused
              ? colors.DODGER_BLUE
              : colors.LIGHT_GRAY
          }
          style={styles.textInput}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
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
    ...Platform.select({
      ios: {
        borderColor: colors.SILVER,
        borderBottomWidth: StyleSheet.hairlineWidth
      },
      // The underline on Android is slightly misaligned so
      // we fix it by adding a left padding here...
      android: {
        paddingLeft: 6
      }
    })
  },
  errorText: {
    height: 20,
    color: colors.TORCH_RED,
    // ...and here as well
    ...Platform.select({
      android: {
        paddingLeft: 6
      }
    })
  }
});

export default FormTextInput;
```

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/05-mid-state.png?raw=true" height="520"></img>
</p>

# Fixing the keyboard issues

Our app looks way better now, but we still have a few things we should improve.

If you focus an input you'll notice that the keyboard will push the screen to the top:

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/05-with-padding.png?raw=true" height="520"></img>
</p>

This happens because the keyboard behaviour is different between Android and iOS.
From my experience the best way to handle the keyboard on Android is to add `android:windowSoftInputMode="adjustResize"` to the `AndroidManifest.xml` so that the OS will take care of adding resizing/moving the screen automatically.

> If you created the app using create-react-native-app the change above is not needed.

Giving the resizing/moving control to the OS means we can safely disable the `KeyboardAvoidingView` behaviour on Android by changing its declaration this way:

```javascript
<KeyboardAvoidingView
  style={styles.container}
  // On Android the keyboard behaviour is handled
  // by Android itself, so we should disable it
  // by passing `undefined`.
  behavior={constants.IS_IOS ? "padding" : undefined}
>
```

By doing so we'll fix the bottom padding:

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/05-without-padding.png?raw=true" height="520"></img>
</p>

...that said, if you play a bit with the form you might spot another small glitch:

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/05-without-blur-on-submit.gif?raw=true" height="520"></img>
</p>

Did you catch that?
When the email input is focused and you press on the submit/next button the keyboard will start its hiding animation for a fraction of a second.  
The root cause of this issue is that the React Native TextInput default behaviour is to blur the input field whenever you press the submit button and, since the keyboard showing/hiding animation on Android is way faster than on iOS, the keyboard will quickly close and re-open when you move between the two fields.
Luckily for us, [the blurOnSubmit prop] can come to the rescue: we set it to `false` in the email FormTextInput...

```javascript
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
  // `blurOnSubmit` causes a keyboard glitch on
  // Android when we want to manually focus the
  // next input.
  blurOnSubmit={constants.IS_IOS}
/>
```

...and the glitch is fixed!

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/05-with-blur-on-submit.gif?raw=true" height="520"></img>
</p>

# Final result

Here is our login screen on Android:

<p align="center">
<img src="https://github.com/mmazzarolo/the-starter-app/blob/master/.github/05-with-blur-on-submit.gif?raw=true" height="520"></img>
</p>

In the next chapter we'll add some logic to the login process itself, stay tuned!

[medium]: https://medium.com/@mmazzarolo/the-starter-app-introduction-3ead074cc589
[my personal website]: https://mmazzarolo.com/blog/2018-09-28-the-starter-app-intro/
[statusbar component]: https://facebook.github.io/react-native/docs/statusbar
[the bluronsubmit prop]: https://facebook.github.io/react-native/docs/textinput#bluronsubmit
[a short article that explains how we can fix the textinput ui on android]: https://medium.com/@mmazzarolo/styling-the-react-native-textinput-on-android-ed84aba6f7df
