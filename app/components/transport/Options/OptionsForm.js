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
  const [pendientes, setPendientes] = useState(0);
  const [finalizados, setFinalizados] = useState(0);

  const isFocused = useIsFocused();
  const toastRef = useRef();

  useEffect(() => {
    const getButtons = async () => {
      setIsvisibleLoading(true);
      const params = new URLSearchParams();
      params.append("Opcion", "getCuentaBotones");
      params.append("id_usuario", usuario);

      await axios
        .post(urlMysql, params)
        .then((response) => {
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

  const options = [
    {
      vista: "listPoints",
      estado: "getSellerPendientes",
      style: styles.box1,
      cantidad: pendientes,
      titulo: "Pickup Pendientes",
    },
    {
      vista: "listPoints",
      estado: "getSellerFinalizados",
      style: styles.box2,
      cantidad: finalizados,
      titulo: "Pickup Finalizados",
    },
    {
      vista: "return",
      estado: "getSellers",
      style: styles.box3,
      cantidad: "",
      titulo: "Insumos/Devoluciones",
    },
  ];

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
          {options.map((options, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate(options.vista, {
                    usuario: usuario,
                    nombre: nombre,
                    estado: options.estado,
                  })
                }
              >
                <View style={options.style}>
                  <Text style={styles.text}>
                    {options.titulo + " " + options.cantidad}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
  box3: {
    width: 250,
    height: 100,
    backgroundColor: "#00D1FF",
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
