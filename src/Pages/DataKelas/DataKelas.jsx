import React, { useEffect, useState } from "react";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, ScrollView, Text, View } from "react-native";
import axios from "axios";
import { GlobalUrl } from "../../Config/GlobalVar";
import { ActivityIndicator } from "react-native-paper";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import Octicons from "@expo/vector-icons/Octicons";
import Show from "./Show";
import Buttons from "../../Components/Buttons";
import Input from "../../Components/Input";
export default function DataKelas({ navigation }) {
  const useToken = useRecoilValue(tokenUser);
  const [count, setCount] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState();
  const [showModal, setShowModal] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(GlobalUrl + "/api/get-data-kelas", {
        headers: {
          Authorization: `Bearer ${useToken}`,
          Accept: "application/json",
        },
      });
      setLoading(false);
      setData(response.data.dataKelas);
      setCount(response.data.count);
    } catch (err) {
      Alert.alert(
        "Error",
        "Gagal mengambil data silahkan lakukan refresh halaman dengan menekan tombol dibawah ini. Error Code : " +
          err,
        [
          {
            text: "Refresh Page",
            onPress: () => fetchData(),
          },
        ],
        { cancelable: false }
      );
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const showHandler = (kode_kelas) => {
    setModel(kode_kelas);
    setShowModal(true);
  };

  const [form, setForm] = useState("");
  const submitHandler = async () => {
    try {
      const response = await axios.post(
        GlobalUrl + "/api/create-data-kelas",
        {
          nama_kelas: form,
        },
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
            Accept: "application/json",
          },
        }
      );
      fetchData();
      Alert.alert("success", "Data kelas baru berhasil ditambahkan");
    } catch (err) {
      Alert.alert(
        "Error",
        "Gagal menambahkan data kelas baru Error Code: " +
          err.response.data.errors.nama_kelas[0] ?? err
      );
    }
  };
  return (
    <View className="h-full">
      {/* Card */}
      <View className="w-full px-2 py-3">
        <View className="w-full bg-green-500 rounded-md py-2 px-2 text-white s flex justify-between flex-row items-center">
          <View className="flex flex-col items-end justify-between">
            <Text className="text-4xl font-bold text-white">
              {count == null ? 0 : count}
            </Text>
            <Text className="text-xs text-white font-light">
              Jumlah Total Kelas
            </Text>
          </View>
        </View>
      </View>
      <View className="flex flex-row px-2 w-full my-3 ">
        <Input
          value={form}
          onChangeText={(text) => setForm(text)}
          label="Nama Kelas"
          placeholder="Masukkan nama kelas"
        />
        <Buttons
          onPress={submitHandler}
          name={"Tambah Kelas"}
          className={"bg-orange-500 w-32 mx-2"}
        />
      </View>
      {/* End Card */}
      {loading ? (
        <TouchableOpacity
          onPress={() => fetchData()}
          className="flex justify-center items-center w-full gap-4 h-full"
        >
          <ActivityIndicator size={"large"} color="orange" />
          <Text>Loading Data</Text>
        </TouchableOpacity>
      ) : data ? (
        <ScrollView className="px-3 flex flex-col gap-2">
          {data.map((item, key) => (
            <TouchableOpacity
              onPress={() => showHandler(item.kode_kelas)}
              key={key}
              className="py-2 px-3 rounded-md shadow-sm shadow-gray-500/20  bg-slate-200"
            >
              <Text className="text-orange-500 text-xl font-bold">
                {item.nama_kelas}
              </Text>
              <Text className="font-light text-xs">
                Total Siswa: {item.siswa_count} Siswa
              </Text>
              <Text className="font-light text-xs">
                Jumlah Laki-laki: {item.laki_laki} Siswa
              </Text>
              <Text className="font-light text-xs">
                Jumlah Perempuan: {item.perempuan} Siswa
              </Text>
              <Text className="font-light text-orange-500 text-sm ">
                Press untuk melihat daftar siswa
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View className="w-full h-[350px]  flex items-center justify-center">
          <Octicons name="list-ordered" size={92} color="orange" />
          <Text className="text-orange-500 font-light">
            Belum ada data kelas yang ditambahkan
          </Text>
        </View>
      )}
      {model && (
        <Show
          refresh={() => fetchData()}
          kode_kelas={model}
          open={showModal}
          setOpen={() => {
            setShowModal(false);
            setModel();
          }}
        />
      )}
    </View>
  );
}
