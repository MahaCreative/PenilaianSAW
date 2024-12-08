import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Index from "./DataGuru/Index";
import { RecoilState, useRecoilState, useRecoilValue } from "recoil";
import { authenticated, tokenUser } from "../Store/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GlobalUrl } from "../Config/GlobalVar";
import DataKelas from "./DataKelas/DataKelas";
import DataSiswa from "./DataSiswa/DataSiswa";
import Kriteria from "./Kriteria/Kriteria";
import Periode from "./Periode/Periode";
import PenilaianKepseek from "./PenilaianKepsek/PenilaianKepseek";
import Tabs from "../Components/Tabs/PenilaianKepsek/Tabs";
import TabsKepsek from "../Components/Tabs/PenilaianKepsek/Tabs";
import { Alert, Button, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TabsSiswa from "../Components/Tabs/PenilaianSiswa/TabsSiswa";
import TabsPenilaianSiswa from "../Components/Tabs/PenilaianKepsek/TabsPenilaianSiswa";
import ScreenLaporan from "./Report/ScreenLaporan";
import * as MediaLibrary from "expo-media-library"; // Gantikan expo-permissions
import TabsGuru from "../Components/Tabs/Guru/TabsGuru";
const DrawerScreen = createDrawerNavigator();

export default function Drawer({ navigation }) {
  const [auth, setAuth] = useRecoilState(authenticated);
  const [useToken, setUseToken] = useRecoilState(tokenUser);
  const [loading, setLoading] = useState(false);
  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin Diperlukan",
        "Aplikasi membutuhkan izin untuk mengakses penyimpanan perangkat Anda."
      );
    }
  };
  const checkUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(GlobalUrl + "/api/me", {
        headers: {
          Authorization: `Bearer ${useToken}`,
          Accept: "application/json",
        },
      });
      setAuth({ check: true, user: response.data });
    } catch (err) {
      setAuth({ check: false, user: [] });
      alert("Anda telah Logout dari sistem silahkan login ulang " + err);
      setTimeout(() => {
        navigation.replace("Login");
      }, 100);
    }
    setLoading(false);
  };

  useEffect(() => {
    requestPermissions(); // Meminta izin
    checkUser();
  }, [navigation]);
  const logout = async () => {
    try {
      const response = await axios.delete(GlobalUrl + "/api/logout", {
        headers: {
          Authorization: `Bearer ${useToken}`,
          Accept: "application/json",
        },
      });
      setAuth({ check: false, user: [] });
      setUseToken(null);
      alert("Anda telah Logout dari sistem silahkan login ulang " + response);
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert(
        "Error",
        "Gagal melakukan logout, silahkan lakukan beberapa saat lagi Error Code: " +
          err
      );
    }
  };
  // Fungsi untuk meminta izin

  return (
    <>
      <DrawerScreen.Navigator
        screenOptions={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={logout} className="px-3 py-2">
              <MaterialIcons name="logout" size={24} color="red" />
            </TouchableOpacity>
          ),
        })}
        initialRouteName={`Dashboard`}
      >
        <DrawerScreen.Screen name="Dashboard" component={Dashboard} />
        {loading == false && (
          <>
            {auth.user.role == "kepala sekolah" && (
              <>
                <DrawerScreen.Screen name="Data Guru" component={Index} />
                <DrawerScreen.Screen name="Data Kelas" component={DataKelas} />
                <DrawerScreen.Screen name="Data Siswa" component={DataSiswa} />
                <DrawerScreen.Screen
                  name="Data Kriteria Penilaian"
                  component={Kriteria}
                />
                <DrawerScreen.Screen
                  name="Periode Penilaian"
                  component={Periode}
                />
                <DrawerScreen.Screen
                  name="Penilaian Kepsek"
                  component={TabsKepsek}
                ></DrawerScreen.Screen>
                <DrawerScreen.Screen
                  name="Penilaian Siswa"
                  component={TabsPenilaianSiswa}
                ></DrawerScreen.Screen>
              </>
            )}
            {auth.user.role == "siswa" && (
              <>
                <DrawerScreen.Screen
                  name="Penilaian Siswa"
                  component={TabsSiswa}
                />
              </>
            )}
            {auth.user.role == "guru" && (
              <>
                <DrawerScreen.Screen
                  name="Hasil Penilaian Saya"
                  component={TabsGuru}
                />
              </>
            )}
          </>
        )}
        <DrawerScreen.Screen
          name="Laporan Penilaian"
          component={ScreenLaporan}
        />
      </DrawerScreen.Navigator>
    </>
  );
}
