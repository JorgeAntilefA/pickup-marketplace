import React from "react";
import ListPointsForm from "../../components/transport/ListPoints/ListPointsForm";

export default function ListPoints(props) {
  const { navigation, route } = props;
  return <ListPointsForm navigation={navigation} route={route} />;
}
