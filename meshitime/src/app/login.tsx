import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { styles } from '../styles/login.styles';

export default function LoginScreen() {
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
        <Text style={styles.subtitle}>アカウントにログインしてください</Text>
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
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>パスワードをお忘れですか？</Text>
        </TouchableOpacity>

      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} activeOpacity={0.85}>
        <Text style={styles.loginButtonText}>ログイン</Text>
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
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.appleButton} activeOpacity={0.85}>
        <Text style={styles.appleIcon}></Text>
        <Text style={styles.appleButtonText}>Sign in with Apple</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}