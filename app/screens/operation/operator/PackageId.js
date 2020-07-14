import React from "react";
import PackageIdForm from "../../../components/operation/operator/PackageIdForm";

export default function PackageId(props) {
  const { navigation, route } = props;
  return <PackageIdForm navigation={navigation} route={route} />;
}
