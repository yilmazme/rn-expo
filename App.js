import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import logo from "./assets/logo-black.png";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { Platform } from "expo-modules-core";

export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("permisson to access camera roll is required");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: true,
      presentationStyle: 0,
    });
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  };

  let openShareDialogAsync = async () => {
    if (Platform.OS === "web") {
      alert(`Uh no, sharing isn't available on your platform`);
      setSelectedImage(null);
      return;
    }
    await Sharing.shareAsync(selectedImage.localUri).then(() => {
      setSelectedImage(null);
    });
  };
  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}> Share this photo</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.header}>Share Photo App!</Text>
      <Text style={styles.instructions}>To share your awesome photo just press button below!</Text>
      <TouchableOpacity onPress={openImagePickerAsync} style={{ backgroundColor: "#6b5b95", padding: 10, borderRadius: 8 }}>
        <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600" }}>Pick a Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 36,
  },
  logo: {
    width: 200,
    height: 150,
  },
  header: {
    color: "#888",
    fontSize: 18,
    margin: 20,
  },
  instructions: {
    color: "#000",
    fontSize: 16,
    paddingTop: 10,
    textAlign: "center",
    padding: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
