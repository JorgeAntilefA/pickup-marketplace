import React from "react";
import SavePointForm from "../components/SavePoint/SavePointForm";

export default function SavePoint(props) {
  const { navigation, route } = props;
  return <SavePointForm navigation={navigation} route={route} />;
}
