import { Pressable, Text, View } from "react-native";
import { profileStyles as styles } from "../../styles/profile.styles";

type SettingMenuItemProps = {
  icon: string;
  label: string;
  iconColor: string;
  onPress: () => void;
};

export default function SettingMenuItem({
  icon,
  label,
  iconColor,
  onPress,
}: SettingMenuItemProps) {
  return (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconCircle}>
          <Text style={[styles.settingIconText, { color: iconColor }]}>
            {icon}
          </Text>
        </View>

        <Text style={styles.settingLabel}>{label}</Text>
      </View>

      <Text style={styles.settingArrow}>›</Text>
    </Pressable>
  );
}