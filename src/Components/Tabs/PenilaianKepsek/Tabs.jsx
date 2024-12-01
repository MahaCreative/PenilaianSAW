import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PenilaianKepseek from "../../../Pages/PenilaianKepsek/PenilaianKepseek";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
const Tabs = createBottomTabNavigator();
export default function TabsKepsek() {
  return (
    <Tabs.Navigator
      initialRouteName="Penilaian Guru"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Ranking Sementara") {
            iconName = "rangking-star";
          } else if (route.name === "History Penilaian") {
            iconName = "history";
          } else if (route.name === "Penilaian Guru") {
            iconName = "home";
          }

          // Mengembalikan ikon dengan nama, warna, dan ukuran sesuai kondisi
          return <FontAwesome6 name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "orange",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tabs.Screen name="Penilaian Guru" component={PenilaianKepseek} />
      <Tabs.Screen name="History Penilaian" component={PenilaianKepseek} />
      <Tabs.Screen name="Rangking Sementara" component={PenilaianKepseek} />
    </Tabs.Navigator>
  );
}
