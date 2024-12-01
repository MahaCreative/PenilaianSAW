import React, { useState } from "react";
import { Dialog } from "react-native-paper";
import Input from "../../Components/Input";
import { Alert, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Buttons from "../../Components/Buttons";
import axios from "axios";
import { GlobalUrl } from "../../Config/GlobalVar";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";

export default function Form({ open, setOpen }) {
  console.log("running");
  const useToken = useRecoilValue(tokenUser);
  const [data, setData] = useState({
    nama_kriteria: "",
    bobot_kriteria: "",
    type: "",
  });
  const [errors, setErrors] = useState([]);
  const submitHandler = async () => {
    try {
      const responsee = await axios.post(
        GlobalUrl + "/api/create-data-kriteria",
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      alert("Success", "Data kriteria baru berhasil ditambahkan");
    } catch (err) {
      console.log(err.response.data);
      setErrors(err.response.data.errors);
      Alert.alert(
        "Error",
        "Gagal melakukan penambahan data Error Code: " + err
      );
    }
  };
  const cancelHandler = () => {
    setData({ nama_kriteria: "", bobot_kriteria: "", type: "" });
    setErrors([]);
    setOpen(false);
  };
  return (
    <Dialog visible={open} onDismiss={setOpen}>
      <Dialog.Title className="text-sm font-semibold text-orange-500">
        Buat Kriteria Penilaian Baru
      </Dialog.Title>
      <Dialog.Content>
        <View className="flex flex-col gap-y-1">
          <Input
            label="Kriteria Penilaian"
            multiline
            value={data.nama_kriteria}
            onChangeText={(text) => setData({ ...data, nama_kriteria: text })}
            errors={errors.nama_kriteria}
          />
          <Input
            label="Bobot Penilaian"
            value={data.bobot_kriteria}
            onChangeText={(text) => setData({ ...data, bobot_kriteria: text })}
            errors={errors.bobot_kriteria}
            keyboardType="numeric"
          />
          <Picker
            style={{ backgroundColor: "white" }}
            selectedValue={data.type}
            onValueChange={(text, index) => setData({ ...data, type: text })}
          >
            <Picker.Item label="Pilih Kategori Kriteria" value={""} />
            <Picker.Item label="Kriteria Untuk Siswa" value={"siswa"} />
            <Picker.Item label="Kriteria Untuk Kepsek" value={"kepsek"} />
          </Picker>
          {errors.type && (
            <Text className="text-red-500 text-xs italic">{errors.type}</Text>
          )}
        </View>
        <View className="flex flex-row justify-between mt-3">
          <Buttons
            onPress={submitHandler}
            className={"bg-orange-500"}
            name={"Tambah Kriteria"}
          />
          <Buttons
            className={"bg-red-500"}
            name={"Batalkan"}
            onPress={cancelHandler}
          />
        </View>
      </Dialog.Content>
    </Dialog>
  );
}
