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
import Loading from "../../../components/Loading";
import Toast from "react-native-easy-toast";

export default function PackageIdForm({ navigation, route }) {
  const [manifest, setManifest] = useState();

  const { urlInsert, urlInsertP, urlCountProductivity } = Constants;
  const toastRef = useRef();
  const [isVisibleLoading, setIsvisibleLoading] = useState(false);
  const { id_user, user, fecha } = route.params;
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  useEffect(() => {
    //setCount1(total);
    loadCounters();
    console.log("useeeffect");
  }, [fecha]);

  async function loadCounters() {
    setIsvisibleLoading(true);
    await axios
      .get(urlCountProductivity)
      .then((response) => {
        setCount1(response.data.total);
        setCount2(response.data.fuera_man);
        setIsvisibleLoading(false);
      })
      .catch((error) => {
        console.log("manifestTem" + error);
        setIsvisibleLoading(false);
      });
  }

  const handlerInsert = async (package_id) => {
    await axios
      .post(urlInsert, { package_id: package_id, fk_user: id_user })
      .then((response) => {
        console.log(response.data);
        if (response.data == "2") {
          setCount1(count1 + 1);
          toastRef.current.show("GUARDADO");
        }
        if (response.data == "1") {
          soundError();
          alertNotExist(package_id);
        }
        if (response.data == "0") {
          soundError();
          alertExist();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlerInsertP = async (package_id) => {
    axios
      .post(urlInsertP, { package_id: package_id, fk_user: id_user })
      .then((response) => {
        // console.log(response.data);
        setCount2(count2 + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlerFinish = () => {
    setCount1(0);
    setCount2(0);
    navigation.goBack();
  };

  // const handlerButton = async (manifest) => {
  //   console.log(manifest);
  //   if (manifest === "" || manifest === undefined) {
  //     inputMan();
  //   } else {
  //     const inMan = arrayMan.includes(manifest);

  //     if (!inMan) {
  //       setArrayMan((oldArray) => [...oldArray, manifest]);
  //       console.log(arrayMan);

  //       await axios
  //         .post(urlOrdersManifests, { code: arrayMan })
  //         .then((response) => {
  //           if (response.data.length === 0) {
  //             alertManifest();
  //           } else {
  //             console.log(response.data);
  //             setDatabox(response.data);
  //             // data: response.data,
  //             // setManifest("");
  //             // setArrayManifests([]);
  //             // setCountMan(0);

  //             setIsDialogVisible(false);
  //           }
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     } else {
  //       alert("Manifiesto ya está pinchado");
  //     }
  //   }
  // };

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

  const BoxCount = () => {
    return (
      <View style={styles.wrapper}>
        <View style={styles.container2}>
          <View style={[styles.box, styles.box1]}>
            {/* <Text style={styles.titleBox}>ACTUAL</Text> */}
            <Text style={styles.counter}>{count1}</Text>
          </View>
          <View style={[styles.box, styles.box2]}>
            {/* <Text style={styles.titleBox}>TOTAL</Text> */}
            <Text style={styles.counter}>{count2}</Text>
          </View>
        </View>
      </View>
    );
  };

  const ReadCode = async (text) => {
    setManifest(text);
    // let man = "";
    // let idx = "";
    //let inBD = false;
    // for (let x = 0; x < data.length; x++) {
    //   let manBol = await data[x][0].data.find((p) => p.packageId === text);
    //   //let inBD_ = await data[x][0].inBD.find((p) => p.package_id === text);

    //   if (manBol !== undefined) {
    //     man = manBol;
    //     idx = x;
    //   }
    //   // if (inBD_) {
    //   //   inBD = inBD_;
    //   // }
    // }
    // console.log("enbase:" + inBD);
    // if (man === "") {
    //   console.log("no encontrado");
    //   alertNotExist(text);
    // } else {
    //   // if (inBD) {
    //   //   console.log("ya esta pinchado");
    //   //   alertExist();
    //   // } else {
    //   let type_ = man.type;
    //   let code = man.code;
    //   console.log(type_);
    //data[idx][0].inBD.push(text);
    //type_ === "Mixed" ? soundMixta() : soundPura();
    // if (type_ == "MIXTA") {
    //   soundMixta();
    // }
    // if (type_ == "RM") {
    //   soundRM();
    // }
    // if (type_ == "REGIONES") {
    //   soundRegiones();
    // }
    // let code = "22";
    handlerInsert(text);
    // }
    // }

    setManifest("");
  };

  const alertNotExist = (text) =>
    Alert.alert(
      "Pedido no está en la base",
      "Guardar pedido " + text + " ?",
      [
        { text: "GUARDAR", onPress: () => handlerInsertP(text) },
        {
          text: "CANCELAR",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );

  const alertExist = () =>
    Alert.alert(
      "Alerta",
      "Pedido ya fue pinchado hoy",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );

  // const alertManifest = () =>
  //   Alert.alert("Alerta", "Manifiesto no existe", [{ text: "OK" }], {
  //     cancelable: false,
  //   });

  // function InputManifest() {
  //   return (
  //     <DialogInput
  //       isDialogVisible={isDialogVisible}
  //       title={"Ingreso de nuevo manifiesto"}
  //       message={"Debes pinchar manifiesto"}
  //       hintInput={"ID MANIFIESTO"}
  //       submitInput={(inputText) => {
  //         handlerButton(inputText);
  //       }}
  //       closeDialog={() => {
  //         setIsDialogVisible(false);
  //       }}
  //     ></DialogInput>
  //   );
  // }

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

  async function soundRegiones() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(
        require("../../../../assets/sound/regiones.mp3")
      );
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

  async function soundError() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(
        require("../../../../assets/sound/bicycle.mp3")
      );
      const status = await soundObject.playAsync();
      setTimeout(() => {
        soundObject.unloadAsync();
        //  await soundObject.playAsync();
        // soundObject.playAsync();
      }, status.playableDurationMillis);

      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log(error);
    }
  }

  async function soundRM() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require("../../../../assets/sound/RM.mp3"));
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
        <Button
          title={"Actualizar"}
          buttonStyle={{ backgroundColor: "red" }}
          onPress={() => loadCounters()}
        />
        <View style={styles.container}>
          <Text style={styles.title}>Ingrese Package ID</Text>
          {/* <View style={styles.container2}>
            <Button
              buttonStyle={{
                width: 50,
                backgroundColor: "#0000FF",
                fontSize: 40,
              }}
              title={count1.toString()}
            />
            <Button
              buttonStyle={{
                width: 50,
                backgroundColor: "#E72B11",
                marginLeft: 15,
              }}
              title={count2.toString()}
            />
          </View> */}
          <BoxCount />
          <View>
            <Input
              inputContainerStyle={styles.SectionStyle}
              placeholder=" ID Manifiesto"
              // ref={inputRef}
              value={manifest}
              onSubmitEditing={Keyboard.dismiss}
              onChange={(e) => ReadCode(e.nativeEvent.text)}
            />
          </View>
          {/* {data.map((manifest, index) => (
            <Box key={index} manifest={manifest} />
          ))} */}

          <View style={{ width: "80%", marginTop: 20, marginBottom: 10 }}>
            <Button title="OK" onPress={() => handlerFinish()} />
          </View>
          {/* <InputManifest /> */}
        </View>
        <Toast
          style={styles.toast}
          ref={toastRef}
          position="center"
          opacity={0.5}
        />
      </ScrollView>
      <Toast
        style={styles.toast}
        ref={toastRef}
        position="center"
        opacity={0.5}
      />
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
  boxCount: {
    width: 50,
    height: 50,
  },
  box12: {
    backgroundColor: "#0000FF",
    alignItems: "center",
  },
  box22: {
    backgroundColor: "#E72B11",
    marginLeft: 20,
    alignItems: "center",
  },
  titleBox: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  counter: {
    fontSize: 30,
    color: "white",
    marginTop: 20,
    fontWeight: "bold",
  },
  counter2: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  toast: {
    marginTop: -30,
    height: 40,
  },
});
