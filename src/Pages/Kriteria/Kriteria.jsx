import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import { debounce } from "lodash";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import axios from "axios";
import { GlobalUrl } from "../../Config/GlobalVar";
import { ActivityIndicator } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import Octicons from "@expo/vector-icons/Octicons";
import Buttons from "../../Components/Buttons";
import { Picker } from "@react-native-picker/picker";
import Form from "./Form";
export default function Kriteria({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const useToken = useRecoilValue(tokenUser);
  const [count, setCount] = useState([]);
  const [params, setParams] = useState("");
  const [modalCreate, setModalCreate] = useState(false);
  const fetchData = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        GlobalUrl + "/api/get-data-kriteria?search=" + query,
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
          },
        }
      );

      setData(response.data.kriteria);
      setCount(response.data.count);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    } catch (err) {
      Alert.alert(
        "Error: " + err,
        "Gagal mendapatkan data silahkan refresh kembali",
        [
          {
            text: "Refresh",
            onPress: () => fetchData(query),
          },
        ],
        { cancelable: true }
      );
    }
  };
  const reload = useCallback(debounce((query) => fetchData(query), 500));
  useEffect(() => reload(params), [params]);

  const deleteHandler = async (id) => {
    console.log(useToken);

    Alert.alert(
      "Hapus Kriteria? ",
      "Yakin ingin menghapus data kriteria ini? \n menghapus data kriteeria akan menghapus data lainnya",
      [
        {
          text: "Ya, Yakin",
          onPress: async () => {
            try {
              const response = await axios.delete(
                GlobalUrl + "/api/delete-data-kriteria/" + id,
                {
                  headers: {
                    Authorization: `Bearer ${useToken}`,
                  },
                }
              );
              console.log(response.data);

              Alert.alert(
                "Sukses",
                "Data kriteria berhasil dihapus pada database"
              );
              fetchData(params);
            } catch (err) {
              Alert.alert(
                "Error",
                "Data kriteria gagal dihapus pada database Error: " + err
              );
            }
          },
        },
      ]
    );
  };
  return (
    <View>
      <View className="w-full px-2 py-3">
        <View className="w-full bg-green-500 rounded-md py-2 px-2 text-white s flex justify-between flex-row items-center">
          <View className="flex items-center">
            <SimpleLineIcons name="list" size={42} color="white" />
          </View>
          <View className="flex flex-col items-end justify-between">
            <Text className="text-4xl font-bold text-white">
              {count?.total}
            </Text>
            <Text className="text-xs text-white font-light">
              Total Jumlah Kriteria
            </Text>
          </View>
        </View>
        <View className="flex flex-row  py-1 gap-x-1 items-center justify-between w-full  ">
          <View className="bg-pink-500 rounded-md py-3 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <SimpleLineIcons name="list" size={42} color="white" />
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {count?.siswa}
              </Text>
              <Text className="text-xs text-white font-light">
                Kriteria Untuk Siswa
              </Text>
            </View>
          </View>
          <View className="bg-blue-500 rounded-md py-3 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <SimpleLineIcons name="list" size={42} color="white" />
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {count?.kepsek}
              </Text>
              <Text className="text-xs text-white font-light">
                Kriteria Untuk Kepsek
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className=" items-center1 mt-1 px-3">
        <Buttons
          onPress={() => setModalCreate(true)}
          name={"Tambah Kriteria"}
          className={"bg-orange-500"}
        />
        <Picker
          onValueChange={(itemValue, itemIndex) => setParams(itemValue)}
          selectedValue={params}
          className="w-30"
          mode="dropdown"
        >
          <Picker.Item label="Pilih kriteria yang ditampilkan" value="" />
          <Picker.Item label="Kriteria Kepala Sekolah" value="kepsek" />
          <Picker.Item label="Kriteria Siswa" value="siswa" />
        </Picker>
      </View>

      {/* FetchData */}
      {loading ? (
        <TouchableOpacity
          onPress={() => fetchData()}
          className="flex justify-center items-center w-full gap-4 h-1/2"
        >
          <ActivityIndicator size={"large"} color="orange" />
          <Text>Loading Data</Text>
        </TouchableOpacity>
      ) : (
        <ScrollView className="px-3">
          {data?.length > 0 ? (
            data.map((item, key) => (
              <View
                className={
                  "py-2 px-3 rounded-md bg-slate-200/50 my-1 flex flex-row"
                }
                key={key}
              >
                <View className="w-[80%]">
                  <Text className="text-sm text-orange-500 font-semibold capitalize">
                    Nama Kriteria: {item.nama_kriteria}
                  </Text>
                  <View className="flex flex-row justify-between">
                    <Text>Bobot: {item.bobot_kriteria}%</Text>
                    <Text>Fuzy: {item.fuzzy}</Text>
                  </View>
                  <Text className="capitalize">
                    Kategori: Kriteria Untuk {item.type}
                  </Text>
                </View>
                <Buttons
                  onPress={() => deleteHandler(item.id)}
                  name={"Delete "}
                  className={"bg-red-500 w-16 mx-3 text-xs"}
                />
              </View>
            ))
          ) : (
            <View className="w-full h-[350px]  flex items-center justify-center">
              <Octicons name="list-ordered" size={92} color="orange" />
              <Text className="text-orange-500 font-light">
                Belum ada data Kriteria yang ditambahkan
              </Text>
            </View>
          )}
        </ScrollView>
      )}
      {modalCreate && <Form open={modalCreate} setOpen={setModalCreate} />}
    </View>
  );
}
