import React, { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Dialog, RadioButton, Text, TextInput } from "react-native-paper";
import Input from "../../Components/Input";

import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { result } from "lodash";
import { Image } from "react-native";
import axios from "axios";
import { GlobalUrl } from "../../Config/GlobalVar";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
export default function FormCreate({ open, setOpen, loadAgain }) {
  const [showPassword, setShowPassword] = useState(false);
  const useToken = useRecoilValue(tokenUser);
  const [data, setData] = useState({
    nip: "",
    nama: "",
    alamat: "",
    no_hp: "",
    jenis_kelamin: "laki-laki",
    foto_profile: "",
    password: "",
  });
  const [errors, setErrors] = useState();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setData({ ...data, foto_profile: result.assets[0].uri });
    }
  };
  const cancellHandler = () => {
    setData({
      nip: "",
      nama: "",
      alamat: "",
      no_hp: "",
      jenis_kelamin: "laki-laki",
      foto_profile: "",
    });
    setErrors();
    setOpen(false);
  };
  const submitHandler = async () => {
    setErrors();
    if (!data.foto_profile) {
      alert("Silahkan tambahkan gambar terlebih dahulu");
      return;
    }
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append("foto_profile", {
      uri: data.foto_profile,
      name: "image.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post(
        GlobalUrl + "/api/create-guru",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      alert("Berhasil menambahkan 1 data guru baru.");
      loadAgain();
      setOpen();
    } catch (err) {
      setErrors(err.response.data.errors);
      if (err.response.data.errors.foto_profile) {
        alert(err.response.data.errors.foto_profile[0]);
      }
      alert(
        "Gagal melakukan penambahan data, Silahkan periksa isian anda kembali"
      );
    }
  };
  console.log(useToken);

  return (
    <Dialog visible={open} onDismiss={setOpen}>
      <Dialog.Title>Create Guru</Dialog.Title>
      <Dialog.Content className="flex flex-col gap-y-1 ">
        <ScrollView className="max-h-[500px]">
          {data.foto_profile && (
            <Image
              source={{ uri: data.foto_profile }}
              className="w-full h-32"
            />
          )}
          <View className="flex flex-row gap-1  w-full justify-between">
            <Input
              className={"w-[120px]"}
              label={"NIP"}
              errors={errors?.nip}
              value={data.nip}
              onChangeText={(text) => setData({ ...data, nip: text })}
            />
            <Input
              className={"w-[125px]"}
              label={"Nama"}
              errors={errors?.nama}
              value={data.nama}
              onChangeText={(text) => setData({ ...data, nama: text })}
            />
          </View>

          <Input
            multiline
            className={"h-[100px]"}
            label={"Alamat"}
            errors={errors?.alamat}
            value={data.alamat}
            onChangeText={(text) => setData({ ...data, alamat: text })}
          />
          <Input
            label={"No HP"}
            keyboardType="numeric"
            errors={errors?.no_hp}
            value={data.no_hp}
            onChangeText={(text) => setData({ ...data, no_hp: text })}
          />
          <Input
            value={data.password}
            type="password"
            onChangeText={(text) => setData({ ...data, password: text })}
            label={"Password"}
            errors={errors?.password}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          <Text>Jenis Kelamin</Text>
          <RadioButton.Group
            onValueChange={(newValue) =>
              setData({ ...data, jenis_kelamin: newValue })
            }
            value={data.jenis_kelamin}
          >
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-row items-center">
                <Text>Laki-Laki</Text>
                <RadioButton value="laki-laki" />
              </View>
              <View className="flex flex-row items-center">
                <Text>Perempuan</Text>
                <RadioButton value="perempuan" />
              </View>
            </View>
          </RadioButton.Group>
          <TouchableOpacity
            onPress={pickImage}
            className="w-full bg-blue-500 flex justify-center items-center py-2 px-3 rounded-md"
          >
            <Text className="text-white">Pilih Foto</Text>
          </TouchableOpacity>

          <View className="flex flex-row justify-between w-full ">
            <TouchableOpacity
              onPress={submitHandler}
              className="w-full bg-orange-500 flex justify-center items-center py-2 px-3 rounded-md"
            >
              <Text className="text-white">Tambah Guru</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancellHandler}
              className="w-full bg-red-500 flex justify-center items-center py-2 px-3 rounded-md"
            >
              <Text className="text-white">Cancell</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Dialog.Content>
    </Dialog>
  );
}
