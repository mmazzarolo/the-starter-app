import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const metrics = {
  DEVICE_WIDTH: width,
  DEVICE_HEIGHT: height
};

export default metrics;
