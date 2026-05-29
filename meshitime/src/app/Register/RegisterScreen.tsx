import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "../../styles/RegisterStyle";
import { router } from "expo-router";

export default function RegisterScreen() {

  const handlePersonalRegister = () => {
    router.push("/Register/IndividualRegisterScreen");
    console.log("個人登録画面へ遷移");
  };

  const handleShopRegister = () => {
    router.push("/Register/ShopRegisterScreen");
    console.log("お店登録画面へ遷移");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Do you want to sign up as:
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePersonalRegister}
      >
        <Text style={styles.buttonText}>個人</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleShopRegister}
      >
        <Text style={styles.buttonText}>お店</Text>
      </TouchableOpacity>
    </View>
  );
}