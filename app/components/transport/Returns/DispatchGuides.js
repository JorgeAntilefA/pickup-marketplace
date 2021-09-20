import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import Loading from "../../Loading";
import Constants from "../../../utils/Constants";
import Toast from "react-native-easy-toast";
import { Input } from "@ui-kitten/components";
import { ScrollView } from "react-native-gesture-handler";
import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements";

export default function GuidesForm(props) {
  const { navigation, route } = props;
  const { seller, id_seller, id_usuario, nombre } = route.params;

  const [isVisibleLoading, setIsvisibleLoading] = useState(false);
  const [isVisibleLoadingCam, setIsvisibleLoadingCam] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [imageUrlBol, setImageUrlBol] = useState();
  const [assetsPhoto, setAssetsPhoto] = useState(null);
  const { urlMysql } = Constants;
  const toastRef = useRef();

  const [guia, setGuia] = useState("");
  const [comentario, setComentario] = useState();

  useEffect(() => {
    const getManifests = async () => {
      setIsvisibleLoading(true);
      (async () => {
        const { status } = await Camera.requestPermissionsAsync();

        if (status === "granted") {
          //setErrorMsg("Error al otorgar el permiso");
        }
      })();
      setIsvisibleLoading(false);
    };
    getManifests();
  }, [seller]);

  const getImageFromCamera = async () => {
    setIsvisibleLoadingCam(true);
    try {
      const { status } = await Camera.requestPermissionsAsync();
      // const cameraRollPermission = await MediaLibrary.requestPermissionsAsync();

      if (status === "granted") {
        let captureImage = await ImagePicker.launchCameraAsync({
          allowEditing: true,
          aspect: [4, 3],
          quality: 0.1,
          //base64: true,
        });
        if (!captureImage.cancelled) {
          setIsvisibleLoadingCam(false);
          setImageUrlBol(true);

          setImageUrl(captureImage.uri);
        } else {
          setIsvisibleLoadingCam(false);
        }
      } else {
        AlertError(status);
      }
    } catch (error) {
      AlertError(error.message);
    }
  };

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
          <Text>{nombre}</Text>
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
        <Text style={styles.text}>INGRESE GUIA</Text>
        <Input
          style={styles.inputForm}
          placeholder="NUMERO GUIA"
          placeholderColor="#c4c3cb"
          keyboardType="numeric"
          value={guia}
          onChange={(e) => setGuia(e.nativeEvent.text)}
        />
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
        <View style={styles.imageContainer}>
          <CameraR />
          {/* <Signature /> */}
        </View>
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
      "Debes ingresar Numero Guia",
      [{ text: "OK", onPress: () => console.log("OK") }],
      { cancelable: false }
    );
  }

  function AlertError(error) {
    Alert.alert(
      "Alerta",
      error,
      [{ text: "OK", onPress: () => console.log("OK") }],
      { cancelable: false }
    );
  }

  function CameraR() {
    if (!imageUrlBol) {
      return (
        <View>
          <TouchableOpacity onPress={getImageFromCamera}>
            <Icon
              type="material-community"
              name="camera"
              color="#7a7a7a"
              containerStyle={styles.containerIcon}
              onPress={getImageFromCamera}
            />
          </TouchableOpacity>
          {<Loading isVisible={isVisibleLoadingCam} text="Cargando Foto" />}
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity onPress={getImageFromCamera}>
            <Image
              source={{
                //uri: `data:image/jpg;base64,'${imageUrl}`,
                uri: imageUrl,
              }}
              style={styles.image}
            />
          </TouchableOpacity>
          {<Loading isVisible={isVisibleLoadingCam} text="Cargando Foto" />}
        </View>
      );
    }
  }

  async function savePoint() {
    if (!guia) {
      AlertVacio();
    } else {
      setIsvisibleLoading(true);
      // const params = new URLSearchParams();
      // try {
      //   if (imageUrlBol) {
      //     let localUri = imageUrl;
      //     let filename = localUri.split("/").pop();
      //     let match = /\.(\w+)$/.exec(filename);
      //     let type = match ? `image/${match[1]}` : `image`;
      //     params.append("imgGuia", {
      //       uri: localUri,
      //       name: filename,
      //       type,
      //     });
      //   }
      // } catch (error) {
      //   AlertErrorPrint("error foto:" + error.message);
      // }
      // params.append("Content-Type", "image/jpg");
      // params.append("Opcion", "guardaGuia");
      // params.append("id_usuario", id_usuario);
      // params.append("id_seller", id_seller);
      // params.append("guia", guia);
      // params.append("comentario", comentario);
      // console.log(imageUrl);

      // console.log(params);
      // await axios
      //   .post(urlMysql, params, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   })
      //   .then((response) => {
      //     console.log(response.data);
      //     //navigation.goBack();
      //     setIsvisibleLoading(false);
      //     setGuia(null);
      //     setComentario(null);
      //   })
      //   .catch((error) => {
      //     AlertError(error);
      //   });

      const formData = new FormData();
      formData.append("imgGuia", {
        uri: imageUrl,
        name: "my_photo.png",
        type: "image/png",
      });
      formData.append("Content-Type", "image/png");
      formData.append("Opcion", "guardaGuia");
      formData.append("id_usuario", id_usuario);
      formData.append("id_seller", id_seller);
      formData.append("guia", guia);
      formData.append("comentario", comentario ? comentario : "");

      fetch(urlMysql, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setIsvisibleLoading(false);
          setGuia(null);
          setComentario(null);
          setImageUrl(null);
          navigation.goBack();
        })
        .catch((error) => {
          setIsvisibleLoading(false);
          console.log(error);
        });
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

  imageContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    margin: 15,
    marginBottom: 15,
    width: 60,
    height: 60,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 25,
    height: 70,
    width: 90,
    backgroundColor: "#e3e3e3",
  },
});
