import { StyleSheet } from "react-native";
import { MeshitimeColors } from "@/theme/meshitime-theme";

export const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: MeshitimeColors.background,
  },

  title: {
    fontSize: 28,
    marginBottom: 32,
    textAlign: "center",
    color: MeshitimeColors.text,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderColor: MeshitimeColors.border,
    backgroundColor: MeshitimeColors.card,
    color: MeshitimeColors.text,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderColor: MeshitimeColors.border,
    backgroundColor: MeshitimeColors.card,
  },

  inputIcon: {
    marginRight: 8,
  },

  inputField: {
    flex: 1,
    paddingVertical: 14,
    color: MeshitimeColors.text,
  },

  rightIconButton: {
    padding: 8,
  },

  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },

  button: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: MeshitimeColors.primary,
  },

  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  imagePicker: {
    width: "100%",
    height: 120,
    borderWidth: 2,
    borderColor: MeshitimeColors.border,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: MeshitimeColors.card,
  },
});