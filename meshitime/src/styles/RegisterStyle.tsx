import { StyleSheet } from "react-native";
import { MeshitimeColors } from "@/theme/meshitime-theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: MeshitimeColors.background,
  },
  title: {
    fontSize: 22,
    marginBottom: 40,
    color: MeshitimeColors.text,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: MeshitimeColors.primary,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});