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
