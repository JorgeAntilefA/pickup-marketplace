import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Picker,
  Alert,
} from "react-native";
import axios from "axios";
import Loading from "../../Loading";
import Constants from "../../../utils/Constants";
import Toast from "react-native-easy-toast";
import { Input } from "@ui-kitten/components";
import { ScrollView } from "react-native-gesture-handler";
import * as Location from "expo-location";

export default function SavePointForm(props) {
  const { navigation, route } = props;
  const { usuario, seller, Id_Seller, id_usuario } = route.params;
  const [isVisibleLoading, setIsvisibleLoading] = useState(false);
  const { urlMysql } = Constants;
  const toastRef = useRef();

  const [selectedValueState, setSelectedValueState] = useState("cero");
  const [selectedValueS, setSelectedValueS] = useState([]);

  const [bultos, setBultos] = useState("");
  const [comentario, setComentario] = useState();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getManifests = async () => {
      setIsvisibleLoading(true);
      LocationU();
      load();
    };
    getManifests();
  }, [seller, selectedValueState]);

  const load = async () => {
    const params = new URLSearchParams();
    params.append("Opcion", "getEstadosPickup");

    await axios
      .post(urlMysql, params)
      .then((response) => {
        Platform.OS === "ios"
          ? setSelectedValueS(response.data)
          : setSelectedValueS(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    setIsvisibleLoading(false);
  };

  async function LocationU() {
    let { status } = await Location.requestForegroundPermissionsAsync(); 
    if (status !== "granted") {
      AlertErrorPrint("Debes dar permisos de localización");
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  }

  function PickerEstado() {
    return (
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedValueState}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedValueState(itemValue)
          }
        >
          <Picker.Item label="Seleccione Estado..." value="cero" />

          {selectedValueS.map((item, key) => (
            <Picker.Item
              label={item.estado}
              value={item.id_tbl_pickup_estados}
              key={key}
            />
          ))}
        </Picker>
      </View>
    );
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='"light-content"' />
        <View
          style={{
            height: 20,
            backgroundColor: "#FACC2E",
            alignItems: "center",
          }}
        >
          <Text>{usuario}</Text>
        </View>
        <View
          style={{
            height: 40,
            backgroundColor: "#4687D6",
            alignItems: "center",
          }}
        >
          <Text style={styles.textSeller}>{seller}</Text>
        </View>
        <Text style={styles.text}>Total Bultos</Text>
        <Input
          style={styles.inputForm}
          placeholder="Numero de bultos"
          placeholderColor="#c4c3cb"
          keyboardType="numeric"
          value={bultos}
          onChange={(e) => setBultos(e.nativeEvent.text)}
        />
        <Text style={styles.text}>Estado</Text>
        <PickerEstado />
        <Text style={styles.text}>Comentario</Text>
        <Input
          style={styles.inputTextArea}
          placeholder="Comentario"
          multiline={true}
          numberOfLines={4}
          placeholderColor="#c4c3cb"
          value={comentario}
          onChange={(e) => setComentario(e.nativeEvent.text)}
        />
        <View style={styles.containerB}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => savePoint()}
            activeOpacity={0.5}
          >
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
        {<Loading isVisible={isVisibleLoading} text="Cargando.." />}
        <Toast
          style={styles.toast}
          ref={toastRef}
          position="center"
          opacity={0.5}
        />
      </SafeAreaView>
    </ScrollView>
  );

  function AlertVacio() {
    Alert.alert(
      "Alerta",
      "Debes ingresar Total Bultos",
      [{ text: "OK", onPress: () => console.log("OK") }],
      { cancelable: false }
    );
  }
  function AlertEstado() {
    Alert.alert(
      "Alerta",
      "Debes seleccionar el estado",
      [{ text: "OK", onPress: () => console.log("OK") }],
      { cancelable: false }
    );
  }

  // async function getLocation() {
  //   (async () => {
  //     const resultPermissions = await Permissions.askAsync(
  //       Permissions.LOCATION
  //     );
  //     const statusPermissions = resultPermissions.permissions.location.status;

  //     if (statusPermissions !== "granted") {
  //       toastRef.current.show(
  //         "Tienes que aceptar los permisos de localización",
  //         3000
  //       );
  //     } else {
  //       const loc = await Location.getCurrentPositionAsync({});
  //       //console.log(loc);
  //       setLocation({
  //         latitude: loc.coords.latitude,
  //         longitude: loc.coords.longitude,
  //       });
  //     }
  //   })();
  // }

  function AlertError(error) {
    Alert.alert(
      "Alerta",
      "Error Al guardar " + error,
      [{ text: "OK", onPress: () => console.log("OK") }],
      { cancelable: false }
    );
  }
  async function savePoint() {
    let latitud;
    let longitud;
    if (!bultos.trim()) {
      AlertVacio();
    } else {
      if (selectedValueState == "cero") {
        AlertEstado();
      } else {
        setIsvisibleLoading(true);
        
        // if (location.latitude == null || !location.latitude) {
        //   location.latitude = "0.0";
        // }
        // if (location.longitude == null) {
        //   location.latitude = "0.0";
        // }
        if (location) {
          latitud = location.coords.latitude;
          longitud = location.coords.longitude;
        } else {
          latitud = "0.0";
          longitud = "0.0";
        }

        const params = new URLSearchParams();
        params.append("Opcion", "guardar_llegada_pickup");
        params.append("id_usuario", id_usuario);
        params.append("id_seller", Id_Seller);
        params.append("cantidad_pickup", bultos);
        params.append("EstadoFicha", selectedValueState);
        params.append("ComentarioFicha", comentario);
        params.append("latitud_inicial", latitud);
        params.append("longitud_inicial", longitud);

        await axios
          .post(urlMysql, params)
          .then((response) => {
            console.log(response.data);
            navigation.goBack();
            setIsvisibleLoading(false);
            setBultos(null);
            setSelectedValueState("cero");
            setSelectedValueS([]);
            setComentario(null);
            setLocation(null);
          })
          .catch((error) => {
            //console.log(error);
            AlertError(error);
          });
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textSeller: {
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    marginLeft: 10,
    backgroundColor: "#F37144",
  },
  toast: {
    marginTop: 50,
  },
  inputForm: {
    height: 40,
    marginBottom: 20,
    marginLeft: 10,
    width: "60%",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  inputTextArea: {
    height: 70,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  buttonContainer: {
    backgroundColor: "#4687D6",
    paddingVertical: 15,
    marginTop: 25,
    borderRadius: 15,
    marginBottom: 18,

    width: "80%",
  },
  buttonText: {
    textAlign: "center",
    color: "rgb(32,53,70)",
    fontWeight: "bold",
    fontSize: 18,
  },
  containerB: {
    flex: 1,
    alignItems: "center",
  },
});
