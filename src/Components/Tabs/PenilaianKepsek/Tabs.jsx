import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PenilaianKepseek from "../../../Pages/PenilaianKepsek/PenilaianKepseek";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import HistoryPenilaianKepsek from "../../../Pages/PenilaianKepsek/HistoryPenilaianKepsek";
import RangkingSementara from "../../../Pages/PenilaianKepsek/RangkingSementara";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const Tabs = createBottomTabNavigator();
export default function TabsKepsek() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "orange",
        tabBarInactiveTintColor: "gray",
      })}
      initialRouteName="Penilaian Guru"
    >
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="star" size={24} color="orange" />
          ),
        }}
        name="Penilaian Guru"
        component={PenilaianKepseek}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={24} color="orange" />
          ),
        }}
        name="History Penilaian Kepsek"
        component={HistoryPenilaianKepsek}
      />
      <Tabs.Screen
        name="Rangking Sementara Kepsek"
        component={RangkingSementara}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="ranking-star" size={24} color="orange" />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
