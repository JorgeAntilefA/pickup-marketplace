import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  RefreshControl,
} from "react-native";
import axios from "axios";
import Constants from "../../../utils/Constants";
import Loading from "../../Loading";
import { useIsFocused } from "@react-navigation/native";

export default function ListPointsForm(props) {
  const { navigation, route } = props;
  const { usuario, nombre, estado } = route.params;
  const isFocused = useIsFocused();
  const [data, setData] = useState();
  const [isVisibleLoading, setIsvisibleLoading] = useState(false);
  const { urlMysql } = Constants;

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getPendingOrders = async () => {
      if (isFocused) {
        setIsvisibleLoading(true);
        load();
      }
    };
    getPendingOrders();
    // Goback();
  }, [isFocused]);

  const load = async () => {
    const params = new URLSearchParams();
    params.append("Opcion", estado);
    params.append("id_usuario", usuario);

    await axios
      .post(urlMysql, params)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        // rememberOrders(response.data);
        setIsvisibleLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setData(null);
    load();
    console.log("actualizado");
    //setRefreshing(false);
  }, [refreshing]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: 20,
          backgroundColor: "#FACC2E",
          alignItems: "center",
        }}
      >
        <Text>{nombre}</Text>
      </View>
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        data={data}
        renderItem={({ item }) => (
          <Order
            item={item}
            navigation={navigation}
            nombre={nombre}
            usuario={usuario}
            estado={estado}
          />
        )}
        ItemSeparatorComponent={({ item }) => <SeparatorManifest />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {<Loading isVisible={isVisibleLoading} text="Cargando" />}
    </View>
  );

  function SeparatorManifest() {
    return (
      <View
        style={{
          height: 1,
          // width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  }

  function AlertPoint(props) {
    const { navigation, nombre, usuario } = props;
    const { Nombre, Id_Seller } = props.item;
    Alert.alert(
      "Alerta",
      "¿Quieres guardar el punto de llegada?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("savePoint", {
              seller: Nombre,
              id_usuario: usuario,
              usuario: nombre,
              Id_Seller: Id_Seller,
            }),
        },
      ],
      { cancelable: false }
    );
  }

  function AlertSecondPoint(props) {
    const { navigation, nombre, usuario } = props;
    const { Nombre, Id_Seller } = props.item;
    Alert.alert(
      "Alerta",
      "¿Quieres guardar el punto nuevamente?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("savePoint", {
              seller: Nombre,
              id_usuario: usuario,
              usuario: nombre,
              Id_Seller: Id_Seller,
            }),
        },
      ],
      { cancelable: false }
    );
  }
  function Order(props) {
    const {
      Direccion,
      Comuna,
      Nombre,
      Id_Seller,
      Cantidad_Pickup,
    } = props.item;
    const { navigation, nombre, usuario, estado } = props;

    return estado == "getSellerFinalizados" ? (
      <TouchableOpacity onPress={() => AlertSecondPoint(props)}>
        <View style={styles.item}>
          <View style={styles.inline}>
            <Text style={styles.seller}>{Nombre} </Text>
            <Text style={styles.number}>{Cantidad_Pickup} </Text>
          </View>
          <View style={styles.inline}>
            <View style={styles.containerInfo}>
              <Text style={styles.comuna}>{Comuna} </Text>
              <Text style={styles.direccion}>{Direccion}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={() => AlertPoint(props)}>
        <View style={styles.item}>
          <View style={styles.inline}>
            <Text style={styles.seller}>{Nombre} </Text>
          </View>
          <View style={styles.inline}>
            <View style={styles.containerInfo}>
              <Text style={styles.comuna}>{Comuna} </Text>
              <Text style={styles.direccion}>{Direccion}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inline: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  seller: {
    fontSize: 28,
    textAlign: "center",
    borderColor: "#fff",
  },
  containerInfo: {
    width: "80%",
    marginLeft: 10,
  },
  comuna: {
    fontSize: 22,
    fontWeight: "bold",
    width: "73%",
    borderColor: "#fff",
  },
  direccion: {
    fontSize: 18,
  },

  item: {
    padding: 10,
  },
  title: {
    fontSize: 32,
  },
  number: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#68a0cf",
    borderRadius: 10,
    borderWidth: 1,
    width: "20%",
    borderColor: "#fff",
    alignItems: "center",
  },
});
