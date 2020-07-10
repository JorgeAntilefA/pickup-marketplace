import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import axios from "axios";
import Constants from "../../../utils/Constants";

export default function OperatorForm({}) {
  const [manifest, setManifest] = useState();
  const { urlOrdersManifests } = Constants;

  const handlerButton = async () => {
    console.log(manifest);
    await axios
      .post(urlOrdersManifests, { code: "MFJB/CL100H6/20200601071315121" })
      .then((response) => {
        console.log(response.data);
        // if (response.data.name == "null") {
        //   toastRef.current.show("Credenciales inválidas");
        // } else {
        //   rememberUser();
        //   navigation.navigate("operator", {
        //     usuario: response.data.name,
        //   });
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Ingrese Manifiesto</Text>
        </View>
        <View>
          <Input
            inputContainerStyle={styles.SectionStyle}
            placeholder=" ID Manifiesto"
            onChange={(e) => setManifest(e.nativeEvent.text)}
          />
          <Button title="OK" onPress={() => handlerButton()} />
        </View>
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
    width: "90%",
    borderRadius: 5,
  },
  title: {
    marginTop: 10,
    fontSize: 25,
    marginLeft: 10,
  },
});
