import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Index from "../../../Pages/Siswa/PenilaianSiswa/Index";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import HistoryPenilaianKepsek from "../../../Pages/Guru/HistoryPenilaianKepsek";
import HistoryPenilaianSiswa from "../../../Pages/Guru/HistoryPenilaianSiswa";
import RankinSaya from "../../../Pages/Guru/RankingSaya";
const Tabs = createBottomTabNavigator();
export default function TabsGuru() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "orange",
        tabBarInactiveTintColor: "gray",
      })}
      initialRouteName="Hasil Penilaian Kepsek"
    >
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={24} color="orange" />
          ),
        }}
        name="Hasil Penilaian Kepsek"
        component={HistoryPenilaianKepsek}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={24} color="orange" />
          ),
        }}
        name="History Penilaian Siswa"
        component={HistoryPenilaianSiswa}
      />

      <Tabs.Screen
        name="Rangking Saya"
        component={RankinSaya}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="ranking-star" size={24} color="orange" />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
