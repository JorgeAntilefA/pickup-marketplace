import React from "react";
import OperatorForm from "../../../components/operation/operator/operatorForm";

export default function Operator(props) {
  const { navigation, route } = props;
  return <OperatorForm navigation={navigation} route={route} />;
}
