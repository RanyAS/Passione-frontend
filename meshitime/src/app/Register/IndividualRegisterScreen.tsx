import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { styles } from "../../styles/IndividualRegisterStyle";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function IndividualRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [showPassword, setShowPassword] = useState(false);


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
      username,
      address,
      imagePath,
    });
  };
  
  //toggle password visibility
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Individual Registration</Text>
      {imagePath !== "" && (
        <Image
          source={{ uri: imagePath }}
          style={styles.previewImage}
        />
      )}
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
    {/* //password 8 characters minimum, at least one letter and one number */}
      <Text style={{ color: "gray", marginBottom: 16 }}>
        Password must be at least 8 characters, and include at least one letter and one number.
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.imagePicker}
        onPress={pickImage}
      >
        <Ionicons name="camera" size={32} color="gray" />
        <Text>Select Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}