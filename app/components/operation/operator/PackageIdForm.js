import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  Keyboard,
  ScrollView,
} from "react-native";
import { Input, Button } from "react-native-elements";
import axios from "axios";
import Constants from "../../../utils/Constants";

export default function PackageIdForm({ navigation, route }) {
  const [manifest, setManifest] = useState();
  const [arrayPackage, setArrayPackage] = useState([]);
  const { urlInsert } = Constants;
  const inputRef = useRef();
  const { data, count, id_user, user, inBd, code } = route.params;
  const [countCurrent, setCountCurrent] = useState(0);
  const datajs = JSON.parse(JSON.stringify(data));

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handlerInsert = async (package_id) => {
    await axios
      .post(urlInsert, { code: code, package_id: package_id, fk_user: id_user })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlerFinish = () => {
    setCountCurrent(0);
    navigation.goBack();
  };

  const Box = () => {
    return (
      <View style={styles.wrapper}>
        <View style={styles.container2}>
          <View style={[styles.box, styles.box1]}>
            <Text style={styles.titleBox}>ACTUAL</Text>
            <Text style={styles.counter}>{countCurrent + inBd.length}</Text>
          </View>
          <View style={[styles.box, styles.box2]}>
            <Text style={styles.titleBox}>TOTAL</Text>
            <Text style={styles.counter}>{count}</Text>
          </View>
        </View>
      </View>
    );
  };

  const ReadCode = async (text) => {
    setManifest(text);
    let man = datajs.find((p) => p.packageId === text);

    if (man === undefined) {
      console.log("no encontrado");
      alertNotExist();
    } else {
      const pack = arrayPackage.includes(text);
      const pack2 = JSON.stringify(inBd).includes(text);
      if (!pack && !pack2) {
        setArrayPackage((oldArray) => [...oldArray, text]);
        console.log(arrayPackage);
        handlerInsert(text);
        setCountCurrent(countCurrent + 1);
      } else {
        alertExist();
      }
    }

    setManifest("");
  };

  const alertNotExist = () =>
    Alert.alert(
      "Alerta",
      "Pedido no está en la base",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );

  const alertExist = () =>
    Alert.alert(
      "Alerta",
      "Pedido ya fue pinchado hoy",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
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
            <Text style={styles.title}>Ingrese Package ID</Text>
          </View>
          <View>
            <Input
              inputContainerStyle={styles.SectionStyle}
              placeholder=" ID Manifiesto"
              ref={inputRef}
              value={manifest}
              onSubmitEditing={Keyboard.dismiss}
              onChange={(e) => ReadCode(e.nativeEvent.text)}
            />

            {/* <Button title="OK" onPress={() => handlerButton()} /> */}
          </View>
          <Box />
          <View style={{ width: "80%", marginTop: 30 }}>
            <Button title="OK" onPress={() => handlerFinish()} />
          </View>
        </View>
      </ScrollView>
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
  wrapper: {
    flex: 1,
  },
  //   container: {
  //     flex: 0.5,
  //     flexDirection: "row",
  //     justifyContent: "flex-start", //replace with flex-end or center
  //     borderBottomWidth: 1,
  //     borderBottomColor: "#000",
  //   },
  container2: {
    flexDirection: "row",
    justifyContent: "flex-start", //replace with flex-end or center
    borderBottomColor: "#000",
    marginTop: 10,
  },
  box: {
    width: 140,
    height: 140,
  },
  box1: {
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  box2: {
    backgroundColor: "#8BC34A",
    marginLeft: 20,
    alignItems: "center",
  },
  titleBox: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
  counter: {
    fontSize: 60,
    color: "white",
    fontWeight: "bold",
  },
});
