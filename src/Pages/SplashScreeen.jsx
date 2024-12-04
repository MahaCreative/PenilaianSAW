import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSetRecoilState } from "recoil";
import { tokenUser } from "../Store/Auth";
export default function SplashScreeen({ navigation }) {
  const setUserToken = useSetRecoilState(tokenUser);
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setUserToken(token);
          navigation.replace("Drawer");
        } else {
          setTimeout(() => {
            navigation.replace("Login"); // Jika error, arahkan ke Login
          }, 100);
        }
      } catch (err) {
        navigation.replace("Login"); // Jika error, arahkan ke Login
      }
    };
    checkLoginStatus();
  }, [navigation]);
  return (
    <View className="flex flex-col bg-orange-500 justify-center items-center w-full h-full">
      <Text className="text-4xl text-white font-bold ">Selamat Datang</Text>
      <Text className="font-extralight text-xl text-white">
        Aplikasi Penilaian Kinerja Guru
      </Text>
      <Image
        className="w-[80%]"
        source={require("../Image/ilustrator.png")}
        resizeMode="contain"
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        className="flex flex-row gap-3 justify-between items-center w-full px-8 py-2"
      >
        <Text className="text-white font-light text-lg text-center">
          Tekan Untuk Melanjutkan
        </Text>
        <View className="p-2 rounded-full bg-blue-500">
          <Text className="text-white">
            <AntDesign name="arrowright" size={24} color="inherit" />
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
