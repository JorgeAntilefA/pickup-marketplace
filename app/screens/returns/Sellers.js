import React from "react";
import SellersForm from "../../components/transport/Returns/SellersForm";

export default function Sellers(props) {
  const { navigation, route } = props;
  return <SellersForm navigation={navigation} route={route} />;
}