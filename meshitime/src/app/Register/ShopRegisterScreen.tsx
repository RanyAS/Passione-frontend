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

export default function ShopRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [site, setSite] = useState("");
  const [shopName, setShopName] = useState("");
  const [businessHours, setBusinessHours] = useState("");

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

      <TextInput
        style={styles.input}
        placeholder="Image Path (optional)"
        value={imagePath}
        onChangeText={setImagePath}
      />

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