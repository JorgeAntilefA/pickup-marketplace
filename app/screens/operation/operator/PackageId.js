import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import PackageIdForm from "../../../components/operation/operator/PackageIdForm";

export default function PackageId(props) {
  const { navigation, route } = props;

  return <PackageIdForm navigation={navigation} route={route} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
});
