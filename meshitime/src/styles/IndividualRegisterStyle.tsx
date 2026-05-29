import { StyleSheet } from "react-native";

 export const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    marginBottom: 32,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },

  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },

  button: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    fontSize: 18,
  },
});