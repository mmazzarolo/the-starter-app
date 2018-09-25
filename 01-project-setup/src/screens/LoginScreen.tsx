import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import strings from "../config/strings";

class LoginScreen extends React.Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text>{strings.WELCOME_TO_LOGIN}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default LoginScreen;
