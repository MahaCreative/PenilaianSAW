import React, { useEffect, useState } from "react";
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
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function FormCreate({ open, setOpen, loadAgain }) {
  const [showPassword, setShowPassword] = useState(false);

  const useToken = useRecoilValue(tokenUser);
  const [dataKelas, setDataKelas] = useState([]);

  const fetchKelas = async () => {
    try {
      const response = await axios.get(GlobalUrl + "/api/get-data-kelas", {
        headers: {
          Authorization: `Bearer ${useToken}`,
          Accept: "application/json",
        },
      });

      setDataKelas(response.data.dataKelas);
    } catch (err) {
      alert("Gagal mengambil data kelas Error Code: " + err);
    }
  };
  useEffect(() => {
    fetchKelas();
  }, []);
  const [data, setData] = useState({
    nis: "",
    nama: "",
    alamat: "",
    no_hp: "",
    jenis_kelamin: "laki-laki",
    tanggal_lahir: "",
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
      nis: "",
      nama: "",
      alamat: "",
      no_hp: "",
      jenis_kelamin: "laki-laki",
      tanggal_lahir: "",
      foto_profile: "",
      password: "",
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
        GlobalUrl + "/api/create-data-siswa",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      alert("Berhasil menambahkan 1 data siswa baru.");
      loadAgain();
      setOpen();
    } catch (err) {
      console.log(err.response.data);

      setErrors(err.response.data.errors);

      alert(
        "Gagal melakukan penambahan data, Silahkan periksa isian anda kembali"
      );
    }
  };
  const dateShow = async () => {
    const date = new Date();
    DateTimePickerAndroid.open({
      value: date,
      mode: "date",

      onChange: (event, selectedDate) => {
        if (event.type === "set") {
          const currentDate = selectedDate || date;

          setData({
            ...data,
            tanggal_lahir: currentDate.toLocaleDateString("en-CA"),
          }); // Format YYYY-MM-DD
        }
      },
    });
  };
  console.log(useToken);

  return (
    <Dialog visible={open} onDismiss={setOpen}>
      <Dialog.Title>Create Siswa</Dialog.Title>
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
              label={"NIS"}
              errors={errors?.nis}
              value={data.nis}
              onChangeText={(text) => setData({ ...data, nis: text })}
            />

            <Input
              className={"w-[125px]"}
              label={"Nama"}
              errors={errors?.nama}
              value={data.nama}
              onChangeText={(text) => setData({ ...data, nama: text })}
            />
          </View>
          <Picker
            selectedValue={data.kelas}
            onValueChange={(itemValue, itemIndex) =>
              setData({ ...data, kelas: itemValue })
            }
          >
            <Picker.Item label={"Pilih kelas siswa"} value="" />
            {dataKelas.map((item, key) => (
              <Picker.Item
                key={key}
                label={item.nama_kelas}
                value={item.kode_kelas}
              />
            ))}
          </Picker>
          {errors?.kelas && (
            <Text className={"text-red-500"}>{errors.kelas}</Text>
          )}
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
            onPress={() => dateShow(true)}
            label={"Tanggal Lahir"}
            errors={errors?.tanggal_lahir}
            value={data.tanggal_lahir}
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
          <View className="flex justify-between flex-row">
            <TouchableOpacity
              onPress={pickImage}
              className="w-full bg-blue-500 flex justify-center items-center py-2 px-3 rounded-md"
            >
              <Text className="text-white">Pilih Foto</Text>
            </TouchableOpacity>
          </View>

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
