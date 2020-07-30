import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert } from "react-native";
import { Input, Button } from "react-native-elements";
import axios from "axios";
import Constants from "../../../utils/Constants";
import Loading from "../../../components/Loading";

export default function OperatorForm({ navigation, route }) {
  const [manifest, setManifest] = useState();
  const [arrayManifests, setArrayManifests] = useState([]);
  const [countMan, setCountMan] = useState(0);
  const { user, id_user } = route.params;
  const [isVisibleLoading, setIsvisibleLoading] = useState(false);
  const { urlOrdersManifests, urlManifests } = Constants;

  const handlerButton = async (arrayManifests) => {
    if (arrayManifests.length === 0) {
      alertPickup();
    } else {
      setIsvisibleLoading(true);

      await axios
        .post(urlOrdersManifests, { code: arrayManifests })
        .then((response) => {
          if (response.data.length === 0) {
            alertManifest();
          } else {
            let total = 0;
            for (let x = 0; x < response.data.length; x++) {
              total = total + response.data[x][0].total;
            }

            navigation.navigate("package", {
              data: response.data,
              user: user,
              id_user: id_user,
              total: total,
            });

            setManifest("");
            setIsvisibleLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const ReadCode = async (manifest) => {
    const pack = arrayManifests.includes(manifest);
    console.log(manifest);
    if (!pack) {
      if (manifest.length > 25) {
        setIsvisibleLoading(true);
        await axios
          .post(urlManifests, { code: manifest })
          .then((response) => {
            setIsvisibleLoading(false);
            if (response.data[0].total > 0) {
              setArrayManifests((oldArray) => [...oldArray, manifest]);
              setCountMan(countMan + 1);
            } else {
              alertManifest();
            }
          })
          .catch((error) => {
            console.log(error);
            setIsvisibleLoading(false);
          });
        setManifest("");
      }
    } else {
      alertExist();
    }
  };

  const handlerRefresh = () => {
    setArrayManifests([]);
    setCountMan(0);
  };

  const alertPickup = () =>
    Alert.alert("Alerta", "Debes pinchar Manifiesto", [{ text: "OK" }], {
      cancelable: false,
    });

  const alertManifest = () =>
    Alert.alert("Alerta", "Manifiesto no existe", [{ text: "OK" }], {
      cancelable: false,
    });

  const alertExist = () =>
    Alert.alert("Alerta", "Manifiesto ya está pinchado", [{ text: "OK" }], {
      cancelable: false,
    });

  const CleanManifest = () =>
    Alert.alert(
      "Borrar Manifiestos",
      "Quieres borrar los manifiestos pinchados?",
      [
        { text: "OK", onPress: () => handlerRefresh() },
        {
          text: "CANCELAR",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
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
      <Button
        title={"Limpiar"}
        buttonStyle={{ backgroundColor: "red" }}
        onPress={() => CleanManifest()}
      />
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Ingrese Manifiesto</Text>
        </View>
        <View>
          <Input
            inputContainerStyle={styles.SectionStyle}
            placeholder=" ID Manifiesto"
            value={manifest}
            onChange={(e) => ReadCode(e.nativeEvent.text)}
          />
        </View>
        <Button
          title={countMan.toString()}
          containerStyle={{ width: "80%" }}
          onPress={() => handlerButton(arrayManifests)}
        />
        {arrayManifests.map((manifest, index) => (
          <Text key={index}>{manifest}</Text>
        ))}
      </View>

      {<Loading isVisible={isVisibleLoading} text="Cargando" />}
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
