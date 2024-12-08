import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Index from "../../../Pages/Siswa/PenilaianSiswa/Index";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HistoryPenilaianKepsek from "../../../Pages/Siswa/PenilaianSiswa/HistoryPenilaianSiswa";
import HistoryPenilaianSiswa from "../../../Pages/Siswa/PenilaianSiswa/HistoryPenilaianSiswa";
import RangkingSementara from "../../../Pages/Siswa/PenilaianSiswa/RangkingSementara";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
const Tabs = createBottomTabNavigator();
export default function TabsSiswa() {
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
        component={Index}
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
        name="Rangking Sementara Siswa"
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
