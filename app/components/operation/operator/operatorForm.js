import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert } from "react-native";
import { Input, Button } from "react-native-elements";
import axios from "axios";
import Constants from "../../../utils/Constants";

export default function OperatorForm({ navigation, route }) {
  const [manifest, setManifest] = useState();
  const { user, id_user } = route.params;
  // console.log(route.params);
  const { urlOrdersManifests } = Constants;

  const handlerButton = async () => {
    await axios
      .post(urlOrdersManifests, { code: manifest })
      .then((response) => {
        console.log(response.data.inBd);
        if (response.data.data.length === 0) {
          alertManifest();
        } else {
          setManifest("");
          navigation.navigate("package", {
            data: response.data.data,
            count: response.data.data.length,
            inBd: response.data.inBd,
            code: manifest,
            user: user,
            id_user: id_user,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const alertManifest = () =>
    Alert.alert(
      "Alerta",
      "Manifiesto no existe",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          height: 20,
          backgroundColor: "#FACC2E",
          alignItems: "center",
        }}
      >
        <Text>{user}</Text>
      </View>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Ingrese Manifiesto</Text>
        </View>
        <View>
          <Input
            inputContainerStyle={styles.SectionStyle}
            placeholder=" ID Manifiesto"
            value={manifest}
            onChange={(e) => setManifest(e.nativeEvent.text)}
          />
        </View>
        <Button
          title="OK"
          containerStyle={{ width: "80%" }}
          onPress={() => handlerButton()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
  },

  SectionStyle: {
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#000",
    marginTop: 10,
    height: 40,
    width: "100%",
    borderRadius: 5,
  },
  title: {
    marginTop: 10,
    fontSize: 25,
    marginLeft: 10,
  },
});
