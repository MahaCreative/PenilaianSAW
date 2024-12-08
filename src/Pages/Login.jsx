import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Dialog,
  TextInput,
} from "react-native-paper";
import Input from "../Components/Input";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authenticated, tokenUser } from "../Store/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalUrl } from "../Config/GlobalVar";
export default function Login({ navigation }) {
  const [auth, setAuth] = useRecoilState(authenticated);
  const [loading, setLoading] = useState(false);
  const setUserToken = useSetRecoilState(tokenUser);
  const [data, setData] = useState({ nip: "", password: "" });
  const [errors, setErrors] = useState({ nip: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [dialog, setDialog] = useState(false);
  const loginHandler = async () => {
    setLoading(true);
    try {
      const response = await axios.post(GlobalUrl + "/api/login", {
        nip: data.nip,
        password: data.password,
      });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        setUserToken(response.data.token);
        setAuth({ check: true, user: response.data });
        setLoading(false);

        navigation.replace("Drawer");
      }
    } catch (error) {
      setData({ ...data, password: "" });
      setErrors({
        ...errors,
        nip: error.response?.data.errors?.nip[0],
        password: error.response?.data.errors?.password,
      });
      setAuth({ check: false, user: [] });
      setDialog(true);

      setTimeout(() => {
        setDialog(false);
      }, 100);
    }
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  return (
    <SafeAreaView className="bg-orange-500 relative w-full h-full flex flex-col justify-center items-center">
      <View className="bg-white px-3 py-16 relative  w-[80%] h-[400px] rounded-md shadow-md shadow-gray-500/60 mx-2">
        <View className="absolute w-full -top-10 h-[80px] flex justify-center items-center">
          <View className="bg-orange-500 p-3 rounded-full">
            <Image
              source={require("../Image/alchaeriyah.png")}
              resizeMode="contain"
              className="w-[80px] h-[80px] rounded-full"
            />
          </View>
        </View>
        <Text className="text-center text-orange-500 font-bold text-2xl">
          Login
        </Text>
        <Text className="text-center  font-light">
          Sistem Penilaian Digital Madrasah
        </Text>
        <Text className="font-light text-sm text-center mb-3">
          MTsS Al- Chaeriyah Ma'rif Simboro
        </Text>
        <View className="my-3">
          <Input
            value={data.nip}
            type="number"
            onChangeText={(text) =>
              setData({
                ...data,
                nip: text.replace(/[^0-9]/g, ""),
              })
            }
            label={"NIP / NIS"}
            errors={errors.nip}
            keyboardType="numeric"
          />
          <Input
            value={data.password}
            type="password"
            onChangeText={(text) => setData({ ...data, password: text })}
            label={"Password"}
            errors={errors.password}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
        </View>
        <TouchableOpacity
          onPress={loginHandler}
          className="my-3 py-2 px-4 rounded-md bg-orange-500 flex justify-center items-center "
        >
          <Text className="text-white  text-base font-medium">Log In</Text>
        </TouchableOpacity>
      </View>
      {/* Loading */}
      {loading && (
        <View className="absolute top-0 left-0 w-full h-full bg-slate-800/50 backdrop-blur-md flex justify-center items-center">
          <ActivityIndicator size="large" color="white" />
          <Text className="my-3 text-xl text-white">Loading</Text>
        </View>
      )}

      {/* Dialog Response */}
      <Dialog visible={dialog} onDismiss={() => setDialog(false)}>
        <Dialog.Icon icon="alert" color="red" size={30} />
        <Dialog.Title>Error</Dialog.Title>
        <Dialog.Content>
          <Text>Gagal melakukan login silahkan periksa isian anda?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialog(false)}>Close </Button>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
}
