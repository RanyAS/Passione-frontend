import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { styles } from "../styles/login.styles";
import { loginUser } from "../services/Auth/authService";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "ログイン失敗",
        "メールアドレスとパスワードを入力してください。"
      );
      return;
    }
    try {
      setLoading(true);
      const data = await loginUser(email.trim(), password);
      const accountType = data.user?.user_metadata?.account_type;
      console.log("LOGIN ACCOUNT TYPE:", accountType);
      if (accountType === "store") {
        router.replace("/shop");
      } else {
        router.replace("/HomeMapScreen");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "ログイン失敗",
        "メールアドレスまたはパスワードが正しくありません。"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoSection}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🍜</Text>
        </View>
        <Text style={styles.appName}>めしタイム</Text>
        <Text style={styles.appNameSub}>MESHITIME</Text>
      </View>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>おかえりなさい</Text>
        <Text style={styles.subtitle}>
          アカウントにログインしてください
        </Text>
      </View>
      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>メールアドレス</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            placeholderTextColor="#AAAAAA"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <Text style={styles.label}>パスワード</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#AAAAAA"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>
            パスワードをお忘れですか？
          </Text>
        </TouchableOpacity>
      </View>
      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        activeOpacity={0.85}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? "ログイン中..." : "ログイン"}
        </Text>
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>または</Text>
        <View style={styles.dividerLine} />
      </View>
      {/* Social Buttons */}
      <TouchableOpacity style={styles.googleButton} activeOpacity={0.85}>
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.googleButtonText}>
          Sign in with Google
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.appleButton} activeOpacity={0.85}>
        <Text style={styles.appleIcon}></Text>
        <Text style={styles.appleButtonText}>
          Sign in with Apple
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}