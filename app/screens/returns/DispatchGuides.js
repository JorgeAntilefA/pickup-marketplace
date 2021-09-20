import React from "react";
import GuidesForm from "../../components/transport/Returns/DispatchGuides";

export default function Guides(props) {
  const { navigation, route } = props;
  return <GuidesForm navigation={navigation} route={route} />;
}
