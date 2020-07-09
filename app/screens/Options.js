import React from "react";
import OptionsForm from "../components/Options/OptionsForm";

export default function Options(props) {
  const { navigation, route } = props;
  return <OptionsForm navigation={navigation} route={route} />;
}
