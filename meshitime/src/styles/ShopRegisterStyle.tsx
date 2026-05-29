import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 32,
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

  imagePicker: {
    width: "100%",
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
});