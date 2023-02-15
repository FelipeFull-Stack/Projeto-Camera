import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';
import { Camera } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";

export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [permission, setPermission] = useState(null);
  const [pictureURI, setPictureURI] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  if (permission === null) {
    return console.log("Permissão Negada!");
  }

  if (permission === false) {
    return console.log("Permissão Negada!");
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setPictureURI(data.uri);
      setOpen(true);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={camRef}
      >
        <View style={{ flex: 1, backgroundColor: "transparent", flexDirection: "row" }}>
          <TouchableOpacity
            style={{ position: 'absolute', bottom: 20, left: 20 }}
            onPress={() => {
              setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
            }}
          >
            <Text style={{ fontSize: 20, marginBottom: 13, color: "#FFF" }}>Trocar</Text>
          </TouchableOpacity>
        </View>
      </Camera>

      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <FontAwesome name='camera' size={23} color='#FFF' />
      </TouchableOpacity>

      {pictureURI &&
        <Modal
          animationType="slide"
          transparent={false}
          visible={open}
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", margin: 20 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => setOpen(false)}>
              <FontAwesome name='window-close' soze={50} color="#FF0000" />
            </TouchableOpacity>
            <Image
              style={{ width: "100%", height: 300, borderRadius: 20 }}
              source={{ uri: pictureURI }}
            />
          </View>
        </Modal>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    margin: 20,
    borderRadius: 10,
    height: 50,
  }
});
