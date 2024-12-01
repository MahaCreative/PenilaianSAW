import React, { useEffect, useState } from "react";
import { Alert, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import { GlobalUrl } from "../../Config/GlobalVar";
import { ActivityIndicator } from "react-native-paper";
import Octicons from "@expo/vector-icons/Octicons";
import Buttons from "../../Components/Buttons";

export default function Periode({ navigation }) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState([]);
  const [tahun, setTahun] = useState(2024);
  const [loading, setLoading] = useState(false);
  const useToken = useRecoilValue(tokenUser);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(GlobalUrl + "/api/get-data-periode", {
        headers: {
          Authorization: `Bearer ${useToken}`,
        },
      });
      setTahun(response.data.tahun);
      setData(response.data.periode);
      setCount(response.data.count);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (err) {
      Alert.alert(
        "Error ",
        "Gagal melakukan pengambilan data, silahkan refresh kembali. Error Code : " +
          err,
        [
          {
            text: "Refresh",
            onPress: () => fetchData(),
          },
        ]
      );
    }
  };

  const deleteHandler = async (id) => {
    Alert.alert(
      "Hapus Periode",
      "Menghapus periode akan menghapus data yang terkait dengan periode yang akan dihapus, Yakin ingin Menghapus?",
      [
        {
          text: "Ya Yakin",
          onPress: async () => {
            try {
              const response = await axios.delete(
                GlobalUrl + "/api/delete-data-periode/" + id,
                {
                  headers: {
                    Authorization: `Bearer ${useToken}`,
                  },
                }
              );
              Alert.alert(
                "Success",
                "Data periode berhasil dihapus. Data tidak dapat lagi dikembalikan1"
              );
              setTimeout(() => {
                fetchData();
              }, 300);
            } catch (err) {
              Alert.alert("Error", "Data gagal dihapus. Error Code: " + err);
            }
          },
        },
        {
          text: "Cancell",
        },
      ],
      { cancelable: true }
    );
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View className="py-3 px-3">
      <View className="py-1 px-2  bg-slate-200 rounded-md">
        <Text className="text-orange-500 text-xs">
          Silahkan menambahkan periode penilaian setiap bulannya, agar kinerja
          guru dapat di nilai oleh siswa dan kepala sekolah
        </Text>
      </View>
      {/* Card */}
      <View className="w-full px-2 py-3">
        <View className="flex flex-row  py-1 gap-x-1 items-center justify-between w-full  ">
          <View className="bg-pink-500 rounded-md py-3 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <MaterialIcons name="face-3" size={42} color="white" />
              <Text className="text-xs text-white font-light">
                Total Periode
              </Text>
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {/* {count?.perempuan} */}
              </Text>
              <Text className="text-xs text-white font-light">Ditambahkan</Text>
            </View>
          </View>
          <View className="bg-blue-500 rounded-md py-3 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <MaterialIcons name="face" size={42} color="white" />
              <Text className="text-xs text-white font-light">
                Periode {tahun}
              </Text>
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {/* {count?.laki} */}
              </Text>
              <Text className="text-xs text-white font-light">Laki-Laki</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Data */}
      {loading ? (
        <TouchableOpacity
          onPress={() => fetchData()}
          className="w-full flex flex-col justify-center items-center"
        >
          <ActivityIndicator color="orange" size={"large"} />
          <Text className="my-3 text-orange-500 font-light">
            Tunggu sebentar,sedang memuat data
          </Text>
        </TouchableOpacity>
      ) : data.length > 0 ? (
        <ScrollView>
          {data.map((item, key) => (
            <View
              className="my-1 bg-slate-200 py-2 px-3 rounded-md flex flex-col gap-x-2 justify-between"
              key={key + 1}
            >
              <View>
                <Text>Periode Penilain : {item.bulan + "-" + item.tahun}</Text>
                <Text>
                  Tanggal Mulai : {item.tanggal_mulai} - {item.tanggal_berakhir}
                </Text>

                <Text>Status: {item.status}</Text>
              </View>
              <ScrollView
                horizontal={true}
                className="overflow-x-auto flex  flex-row gap-x-1 flex-wrap"
              >
                <Buttons
                  name={"Delete"}
                  className={"bg-red-500"}
                  onPress={() => deleteHandler(item.id)}
                />
                <Buttons
                  name={"Lihat hasil penilaian"}
                  className={"bg-blue-500"}
                  onPress={() => deleteHandler(item.id)}
                />
                {item.status == "berlangsung" && (
                  <Buttons
                    name={"Buat Penilaian Guru"}
                    className={"bg-green-500"}
                    onPress={() =>
                      navigation.navigate("Penilaian Kepsek", {
                        periodeId: item.id,
                      })
                    }
                  />
                )}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      ) : (
        <TouchableOpacity
          onPress={() => fetchData()}
          className="w-full h-full flex flex-col justify-center items-center"
        >
          <Octicons name="list-ordered" size={92} color="orange" />
          <Text className="my-3 text-orange-500 font-light">
            Belum ada data yang ditambahkan
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
