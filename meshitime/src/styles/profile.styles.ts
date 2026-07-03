import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F8",
  },
  header: {
    backgroundColor: "#FF3B35",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 44,
    position: "relative",
  },
  settingButton: {
    position: "absolute",
    right: 24,
    top: 42,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  settingIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "700",
  },
  backIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 22,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.6)",
  },
  avatarText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FF3B35",
  },
  name: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  email: {
    marginTop: 6,
    fontSize: 14,
    color: "#FFFFFF",
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginTop: -24,
    borderRadius: 16,
    paddingVertical: 18,
    justifyContent: "space-around",
    elevation: 4,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },
  section: {
    padding: 18,
  },
  sectionTitle: {
    marginBottom: 14,
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  historyImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  historyIcon: {
    fontSize: 32,
  },
  historyInfo: {
    flex: 1,
    marginLeft: 14,
  },
  historyName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
  },
  historyDate: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
  historyDealRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  historyDiscount: {
    backgroundColor: "#FF3B35",
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  historyPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
  },
  arrow: {
    fontSize: 32,
    color: "#9CA3AF",
  },

settingCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  overflow: "hidden",
  elevation: 3,
},

settingItem: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 18,
  paddingHorizontal: 18,
  borderBottomWidth: 1,
  borderBottomColor: "#EEF0F4",
},

settingLeft: {
  flexDirection: "row",
  alignItems: "center",
},

settingIconCircle: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: "#F3F4F8",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 14,
},

settingIconText: {
  fontSize: 18,
  fontWeight: "bold",
},

settingLabel: {
  fontSize: 15,
  fontWeight: "600",
  color: "#111827",
},

settingArrow: {
  fontSize: 28,
  color: "#9CA3AF",
},

versionText: {
  marginTop: 24,
  textAlign: "center",
  fontSize: 12,
  color: "#9CA3AF",
},

});