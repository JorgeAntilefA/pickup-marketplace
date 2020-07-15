import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  AsyncStorage,
  TouchableOpacity,
  Picker,
} from "react-native";
import { Input, Icon } from "@ui-kitten/components";
import axios from "axios";
import Loading from "../Loading";
import Constants from "./../../utils/Constants";

export default function LoginForm(props) {
  const { toastRef, navigation } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [typeUser, setTypeUser] = useState(0);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isVisibleLoading, setIsvisibleLoading] = useState(false);
  const { urlMysql, urlLogin } = Constants;
  const [selectedValue, setSelectedValue] = useState("Proveedor");

  useEffect(() => {
    const getRememberedUser = async () => {
      try {
        const credentialsUser = await AsyncStorage.getItem(
          "@localStorage:credentials"
        );
        if (credentialsUser !== null) {
          //console.log(credentialsUser);
          setUsername(JSON.parse(credentialsUser).username);
          setPassword(JSON.parse(credentialsUser).password);
          setSelectedValue(JSON.parse(credentialsUser).type_user);
          // return username;
        }
      } catch (error) {
        toastRef.current.show("Error al cargar usuario, vuelva a ingresar");
      }
    };

    getRememberedUser();
  }, []);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderInputIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={!secureTextEntry ? "eye" : "eye-off"} />
    </TouchableWithoutFeedback>
  );

  const renderIconUser = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name="person" />
    </TouchableWithoutFeedback>
  );

  rememberUser = async () => {
    try {
      let credentials = {
        username: username,
        password: password,
        type_user: selectedValue,
      };

      console.log(credentials);
      await AsyncStorage.setItem(
        "@localStorage:credentials",
        JSON.stringify(credentials)
      );
    } catch (error) {
      console.log(error);
      toastRef.current.show("Error al guardar credenciales.");
    }
  };

  const login = async () => {
    if (selectedValue === "Tipo Usuario...") {
      toastRef.current.show("Debes seleccionar TIPO USUARIO");
    } else {
      setIsvisibleLoading(true);

      const params = new URLSearchParams();
      params.append("Opcion", "login");
      params.append("Usuario", username);
      params.append("Password", password);

      if (!username || !password) {
        toastRef.current.show("Hay campos vacios");
      } else {
        if (selectedValue === "Proveedor") {
          await axios
            .post(urlMysql, params)
            .then((response) => {
              //console.log(response);
              if (Platform.OS === "ios") {
                if (response.data.id == "null") {
                  toastRef.current.show("Credenciales inválidas");
                } else {
                  rememberUser();
                  navigation.navigate("options", {
                    usuario: response.data.id,
                    nombre: response.data.nombre,
                  });
                }
              } else {
                if (response.data.id == "null") {
                  toastRef.current.show("Credenciales inválidas");
                } else {
                  rememberUser();
                  navigation.navigate("options", {
                    usuario: response.data.name,
                    // nombre: response.data.name,
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          await axios
            .post(urlLogin, { name: username, password: password })
            .then((response) => {
              if (response.data.length === 0) {
                toastRef.current.show("Credenciales inválidas");
              } else {
                rememberUser();
                navigation.navigate("operator", {
                  id_user: response.data[0].id_user,
                  user: response.data[0].name,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        setIsvisibleLoading(false);
      }
    }
  };

  const PickerUser = () => {
    return (
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="Tipo Usuario..." value="Tipo Usuario..." />
          <Picker.Item label="Proveedor" value="Proveedor" />
          <Picker.Item label="Operario" value="Operario" />
        </Picker>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='"light-content"' />
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={Keyboard.dismiss}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Text style={styles.title}>Dafiti</Text>
          </View>
          <View>
            <Input
              style={styles.inputForm}
              placeholder="Usuario"
              placeholderColor="#c4c3cb"
              accessoryRight={renderIconUser}
              value={username}
              onChange={(e) => setUsername(e.nativeEvent.text)}
            />
            <Input
              style={styles.inputForm}
              placeholder="Contraseña"
              placeholderColor="#c4c3cb"
              style={styles.inputForm}
              secureTextEntry={secureTextEntry}
              value={password}
              //  icon={renderIconPassword}
              accessoryRight={renderInputIcon}
              //onIconPress={onIconPress}
              onChange={(e) => setPassword(e.nativeEvent.text)}
            />
            <PickerUser />
            <TouchableOpacity style={styles.buttonContainer} onPress={login}>
              <Text style={styles.buttonText}>INGRESAR</Text>
            </TouchableOpacity>
          </View>

          {<Loading isVisible={isVisibleLoading} text="Cargando" />}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#29292A",
    flexDirection: "column",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 90,
  },
  logo: {
    width: 120,
    height: 126,
  },
  title: {
    color: "#f7c744",
    fontSize: 18,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
    opacity: 0.9,
  },
  inputForm: {
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  buttonContainer: {
    backgroundColor: "#1001F8",
    paddingVertical: 15,
    marginTop: 15,
    marginBottom: 8,
    borderRadius: 15,
    marginLeft: 40,
    width: "80%",
  },
  buttonText: {
    textAlign: "center",
    color: "#FBFBFB",
    fontWeight: "bold",
    fontSize: 18,
  },
  picker: {
    height: 40,
    backgroundColor: "white",
    width: "50%",
  },
  pickerContainer: {
    alignItems: "center",
  },
});
