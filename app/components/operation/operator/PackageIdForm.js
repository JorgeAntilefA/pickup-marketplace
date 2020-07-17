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
import { Audio } from "expo-av";

export default function PackageIdForm({ navigation, route }) {
  const [manifest, setManifest] = useState();
  //const [arrayPackage, setArrayPackage] = useState([]);
  const { urlInsert } = Constants;
  const inputRef = useRef();
  const { id_user, user, data } = route.params;
  //const [countCurrent, setCountCurrent] = useState(0);
  const [databox, setDatabox] = useState(data); //JSON.parse(JSON.stringify(data));
  //console.log(data);
  useEffect(() => {
    // inputRef.current.focus();
    setDatabox(data);
  }, [data]);

  const handlerInsert = async (package_id, code) => {
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
    // setCountCurrent(0);
    navigation.goBack();
  };

  const Box = ({ manifest }) => {
    return (
      <View style={styles.wrapper}>
        <Text>{manifest[0].code}</Text>
        <View style={styles.container2}>
          <View style={[styles.box, styles.box1]}>
            <Text style={styles.titleBox}>ACTUAL</Text>
            <Text style={styles.counter}>{manifest[0].inBD.length}</Text>
          </View>
          <View style={[styles.box, styles.box2]}>
            <Text style={styles.titleBox}>TOTAL</Text>
            <Text style={styles.counter}>{manifest[0].data.length}</Text>
          </View>
        </View>
      </View>
    );
  };

  const ReadCode = async (text) => {
    setManifest(text);
    let man = "";
    let idx = "";
    let inBD = false;
    for (let x = 0; x < databox.length; x++) {
      let manBol = await databox[x][0].data.find((p) => p.packageId === text);
      let inBD_ = await databox[x][0].inBD.includes(text);

      if (manBol !== undefined) {
        man = manBol;
        idx = x;
      }
      if (inBD_) {
        inBD = inBD_;
      }
    }
    if (man === "") {
      console.log("no encontrado");
      alertNotExist();
    } else {
      if (inBD) {
        console.log("ya esta pinchado");
        alertExist();
      } else {
        // console.log(man);
        let type_ = man.type;
        let code = man.code;
        console.log(type_);
        databox[idx][0].inBD.push(text);
        type_ === "Mixed" ? soundMixta() : soundPura();
        handlerInsert(text, code);
      }

      //  console.log(databox);
      // if (!pack && !pack2) {
      //   setArrayPackage((oldArray) => [...oldArray, text]);
      //   handlerInsert(text);
      //   setCountCurrent(countCurrent + 1);
      //   type_ === "Mixed" ? soundMixta() : soundPura();
      // } else {
      //   alertExist();
      // }
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

  async function soundMixta() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(
        require("../../../../assets/sound/translate_tts_mixta.mp3")
      );
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }
  async function soundPura() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(
        require("../../../../assets/sound/translate_tts_pura.mp3")
      );
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

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
              // ref={inputRef}
              value={manifest}
              onSubmitEditing={Keyboard.dismiss}
              onChange={(e) => ReadCode(e.nativeEvent.text)}
            />

            {/* <Button title="OK" onPress={() => handlerButton()} /> */}
          </View>
          {databox.map((manifest, index) => (
            <Box key={index} manifest={manifest} />
          ))}

          <View style={{ width: "80%", marginTop: 20, marginBottom: 10 }}>
            <Button title="OK" onPress={() => handlerFinish()} />
            {/* <Button title="OK" onPress={() => sound()} /> */}
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
    width: 80,
    height: 80,
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
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  counter: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
});
