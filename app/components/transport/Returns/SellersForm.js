import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import axios from "axios";
import Constants from "../../../utils/Constants";
import Loading from "../../Loading";
import { Input } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SellersForm(props) {
  const { navigation, route } = props;
  const { usuario, nombre, estado } = route.params;
  const isFocused = useIsFocused();
  const [data, setData] = useState();
  const [isVisibleLoading, setIsvisibleLoading] = useState(false);
  const { urlMysql } = Constants;
  const [reached, setReached] = useState(0);
  const [arrayholder, setArrayholder] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getPendingOrders = async () => {
      if (isFocused) {
        setIsvisibleLoading(true);
        load();
      }
    };
    getPendingOrders();
  }, [isFocused]);

  const load = async () => {
    const params = new URLSearchParams();
    params.append("Opcion", "getSellers");

    await axios
      .post(urlMysql, params)
      .then((response) => {
        setData(response.data);
        setArrayholder(response.data);
        setIsvisibleLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function searchData(text) {
    if (text.length > 0) {
      setReached(1);
      const newData = arrayholder.filter((item) => {
        return item.seller.indexOf(text) > -1;
      });
      setData(newData);
    } else {
      setReached(0);
    }
  }

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
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "100%", height: 50, backgroundColor: "#272626" }}>
          <Input
            inputContainerStyle={styles.SectionStyle}
            placeholder="Busqueda"
            onChangeText={(text) => searchData(text)}
            leftIcon={
              <Icon
                name="search"
                size={24}
                color="black"
                style={{ marginLeft: 5 }}
              />
            }
          />
        </View>
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
          backgroundColor: "#CED0CE",
        }}
      />
    );
  }

  function Order(props) {
    const { direccion, comuna, seller, id_seller } = props.item;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("guides", {
            id_usuario: usuario,
            nombre: nombre,
            seller: seller,
            id_seller: id_seller,
          })
        }
      >
        <View style={styles.item}>
          <View style={styles.inline}>
            <Text style={styles.seller}>{seller} </Text>
          </View>
          <View style={styles.inline}>
            <View style={styles.containerInfo}>
              <Text style={styles.comuna}>{comuna} </Text>
              <Text style={styles.direccion}>{direccion}</Text>
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
  SectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#000",
    height: 40,
    borderRadius: 5,
    margin: 5,
  },
});
