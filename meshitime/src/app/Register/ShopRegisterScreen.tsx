import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { styles } from "../../styles/ShopRegisterStyle";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function ShopRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [site, setSite] = useState("");
  const [shopName, setShopName] = useState("");
  const [businessHours, setBusinessHours] = useState("");

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImagePath(result.assets[0].uri);
    }
  }

  const handleRegister = () => {
    console.log({
      email,
      password,
      imagePath,
      address,
      tel,
      site,
      shopName,
      businessHours,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Shop Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Shop Name"
        value={shopName}
        onChangeText={setShopName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Telephone Number"
        value={tel}
        onChangeText={setTel}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Website (optional)"
        value={site}
        onChangeText={setSite}
      />

      <TextInput
        style={styles.input}
        placeholder="営業時間"
        value={businessHours}
        onChangeText={setBusinessHours}
      />

      <TouchableOpacity
        style={styles.imagePicker}
        onPress={pickImage}
      >
        <Ionicons name="camera" size={32} color="gray" />
        <Text>Select Image</Text>
      </TouchableOpacity>

      {imagePath !== "" && (
        <Image
          source={{ uri: imagePath }}
          style={styles.previewImage}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >

        <Text style={styles.buttonText}>Register Shop</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}