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
  const [showPassword, setShowPassword] = useState(false);

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
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Shop Registration</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="business-outline" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Shop Name"
          value={shopName}
          onChangeText={setShopName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.rightIconButton} accessibilityLabel="Toggle password visibility">
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Telephone Number"
          value={tel}
          onChangeText={setTel}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="globe-outline" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Website (optional)"
          value={site}
          onChangeText={setSite}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="time-outline" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="営業時間"
          value={businessHours}
          onChangeText={setBusinessHours}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="image-outline" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Image Path (optional)"
          value={imagePath}
          onChangeText={setImagePath}
        />
      </View>

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
