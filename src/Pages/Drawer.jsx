import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Index from "./DataGuru/Index";
import { useRecoilState, useRecoilValue } from "recoil";
import { authenticated, tokenUser } from "../Store/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GlobalUrl } from "../Config/GlobalVar";
import DataKelas from "./DataKelas/DataKelas";
import DataSiswa from "./DataSiswa/DataSiswa";
const DrawerScreen = createDrawerNavigator();

export default function Drawer({ navigation }) {
  const [auth, setAuth] = useRecoilState(authenticated);
  const useToken = useRecoilValue(tokenUser);
  const checkUser = async () => {
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
      }, 1500);
    }
  };

  useEffect(() => {
    checkUser();
  }, [navigation]);
  return (
    <DrawerScreen.Navigator initialRouteName="Dashboard">
      <DrawerScreen.Screen name="Dashboard" component={Dashboard} />
      <DrawerScreen.Screen name="Data Guru" component={Index} />
      <DrawerScreen.Screen name="Data Kelas" component={DataKelas} />
      <DrawerScreen.Screen name="Data Siswa" component={DataSiswa} />
    </DrawerScreen.Navigator>
  );
}
