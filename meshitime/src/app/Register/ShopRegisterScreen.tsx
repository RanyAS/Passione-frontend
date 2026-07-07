import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { styles } from "../../styles/ShopRegisterStyle";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { registerUser } from "../../services/Auth/authService"
import { router } from "expo-router";
import { getGenre } from "../../api/genreApi"
import { Genre } from "../../types/Genre";
import { Picker } from "@react-native-picker/picker";

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
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const handleRegister = async () => {
      try {

          if (!selectedGenre) {
              Alert.alert("ジャンルを選択してください。");
              return;
          }

          const account_type = "store";

          const res = await registerUser(
              email,
              password,
              shopName,
              address,
              account_type,
              imagePath,
              tel,
              site,
              businessHours,
              selectedGenre
          );

          console.log(res);

          router.push("../profile");

      } catch (error) {
          console.log(error);
          Alert.alert("Error", JSON.stringify(error));
      }
    };

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
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
      loadGenres();
  }, []);

  async function loadGenres() {
      try {
          const data = await getGenre();
          console.log("Fetched genres:", data);
          setGenres(data);
      } catch (error) {
          console.error(error);
      }
  }

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
          <Ionicons
              name="restaurant-outline"
              size={20}
              color="gray"
              style={styles.inputIcon}
          />

          <Picker
              selectedValue={selectedGenre}
              style={{ flex: 1, height: 50 }}
              onValueChange={(value) => setSelectedGenre(value)}
          >
              <Picker.Item
                  label="ジャンルを選択してください"
                  value=""
              />

              {genres.map((genre) => (
                  <Picker.Item
                      key={genre.id}
                      label={genre.gname}
                      value={genre.id}
                  />
              ))}
          </Picker>
      </View>

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
