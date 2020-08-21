import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import Constants from "../../../utils/Constants";
import Loading from "../../Loading";
import Toast from "react-native-easy-toast";
import { useIsFocused } from "@react-navigation/native";

export default function OptionsForm(props) {
  const { navigation, route } = props;
  const { usuario, nombre } = route.params;
  const [isVisibleLoading, setIsvisibleLoading] = useState(false);
  const { urlMysql } = Constants;
  const [pendientes, setPendientes] = useState();
  const [finalizados, setFinalizados] = useState();
  const isFocused = useIsFocused();
  const toastRef = useRef();
  console.log("usuario:" + usuario);
  useEffect(() => {
    const getButtons = async () => {
      setIsvisibleLoading(true);

      const params = new URLSearchParams();
      params.append("Opcion", "getCuentaBotones");
      params.append("id_usuario", usuario);

      await axios
        .post(urlMysql, params)
        .then((response) => {
          //   console.log(response);
          if (Platform.OS === "ios") {
            console.log(response);
            if (response.data.Nombre == "null") {
              toastRef.current.show("Credenciales inválidas");
            } else {
              rememberUser();
              setPendientes(response.data[0].Pendientes);
              setFinalizados(response.data[0].Finalizados);
              setIsvisibleLoading(false);
            }
          } else {
            rememberUser();
            setPendientes(response.data[0].Pendientes);
            setFinalizados(response.data[0].Finalizados);
            setIsvisibleLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getButtons();
  }, [isFocused]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            height: 20,
            backgroundColor: "#FACC2E",
            alignItems: "center",
          }}
        >
          <Text>{nombre}</Text>
        </View>

        <View style={styles.boxContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("listPoints", {
                usuario: usuario,
                nombre: nombre,
                estado: "getSellerPendientes",
              })
            }
          >
            <View style={styles.box1}>
              <Text style={styles.text}>Pickup Pendientes {pendientes}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("listPoints", {
                usuario: usuario,
                nombre: nombre,
                estado: "getSellerFinalizados",
              })
            }
          >
            <View style={styles.box2}>
              <Text style={styles.text}>Pickup Finalizados {finalizados}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Toast
          style={styles.toast}
          ref={toastRef}
          position="center"
          opacity={0.5}
        />
        {<Loading isVisible={isVisibleLoading} text="Cargando.." />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxContainer: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: 90,
  },
  box1: {
    width: 250,
    height: 100,
    backgroundColor: "#FF0000",
    marginBottom: 40,
  },
  box2: {
    width: 250,
    height: 100,
    backgroundColor: "#52C140",
    marginBottom: 40,
  },
  text: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
