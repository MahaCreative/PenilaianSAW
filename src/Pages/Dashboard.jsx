import AsyncStorage from "@react-native-async-storage/async-storage";
import Octicons from "@expo/vector-icons/Octicons";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { GlobalUrl } from "../Config/GlobalVar";
import { authenticated, tokenUser } from "../Store/Auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { debounce } from "lodash";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
export default function Dashboard({ navigation }) {
  const [params, setParams] = useState({ periode_id: "" });
  const [dataPeriode, setDataPeriode] = useState([]);
  const [getPeriode, setPeriode] = useState({ periode: "" });
  const [count, setCount] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const useToken = useRecoilValue(tokenUser);
  const fetchDataPeriode = async () => {
    try {
      const response = await axios.get(GlobalUrl + "/api/get-data-periode", {
        headers: {
          Authorization: `Bearer ${useToken}`,
        },
      });

      setDataPeriode(response.data.periode);
      setParams({ ...params, periode_id: response.data.periode[0].id });
    } catch (err) {}
  };
  useEffect(() => {
    fetchDataPeriode();
  }, []);

  const fetchData = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        GlobalUrl + "/api/dashboard/?periode_id=" + query.periode_id,
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      setCount(response.data.count);
      setData(response.data.rank);
    } catch (err) {
      Alert.alert("Error", "Gagal load data Error Code :" + err);
    }
    setLoading(false);
  };
  const reload = useCallback(debounce((quer) => fetchData(quer), 1000));
  useEffect(() => {
    reload(params);
    if (params.periode_id) {
      const selectedData = dataPeriode.find(
        (item) => item.id === params.periode_id
      );
      console.log(selectedData.bulan);

      setPeriode({
        ...getPeriode,
        periode: selectedData.bulan + "-" + selectedData.tahun,
      });
    }
  }, [params]);
  return (
    <View>
      <View className="w-full px-2 py-1">
        <View className="flex flex-row  py-1 gap-x-1 items-center justify-between w-full  ">
          <View className="bg-pink-500 rounded-md py-1 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <MaterialIcons name="face" size={42} color="white" />
              <Text className="text-xs text-white font-light">
                Jumlah Siswa
              </Text>
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {count?.siswa}
              </Text>
            </View>
          </View>
          <View className="bg-blue-500 rounded-md py-1 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <MaterialIcons name="face-2" size={42} color="white" />
              <Text className="text-xs text-white font-light">Jumlah Guru</Text>
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {count?.guru}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex flex-row  py-1 gap-x-1 items-center justify-between w-full  ">
          <View className="bg-green-500 rounded-md py-1 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <MaterialIcons name="calendar-month" size={42} color="white" />
              <Text className="text-xs text-white font-light">
                Jumlah Periode
              </Text>
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {count?.periode}
              </Text>
            </View>
          </View>
          <View className="bg-orange-500 rounded-md py-1 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <MaterialIcons name="list" size={42} color="white" />
              <Text className="text-xs text-white font-light">
                Jumlah Kelas
              </Text>
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {count?.kelas}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex flex-row items-center justify-between px-2">
        <Text className="text-xs font-light ">Periode</Text>
        <View className="w-1/3">
          <Picker
            onValueChange={(itemValue, itemIndex) =>
              setParams({ ...params, periode_id: itemValue })
            }
            selectedValue={params.periode_id}
            mode="dropdown"
          >
            <Picker.Item
              label="Pilih kriteria yang ingin ditampilkan"
              value=""
            />
            {dataPeriode.length > 0 &&
              dataPeriode.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.bulan + "-" + item.tahun}
                  value={item.id}
                />
              ))}
          </Picker>
        </View>
      </View>

      {loading ? (
        <TouchableOpacity
          onPress={() => reload(params)}
          className="flex justify-center items-center w-full gap-4 h-1/2"
        >
          <ActivityIndicator size={"large"} color="orange" />
          <Text>Loading Data</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <ScrollView className=" w-full min-h-[200px] max-h-[400px] overflow-y-auto px-3">
            <Text>Ranking Guru Periode {getPeriode.periode}</Text>
            {data.length > 0 ? (
              data.map((item, key) => (
                <View
                  key={key}
                  className="bg-gray-200 p-2 rounded-md shadow-sm shadow-gray-500/50 my-1 flex flex-row items-center gap-x-3"
                >
                  <View className="w-[80px] h-[70px] px-3  bg-orange-500 flex flex-row justify-between items-center">
                    <FontAwesome6 name="ranking-star" size={24} color="white" />
                    <Text className="font-bold text-white text-2xl">
                      {key + 1}
                    </Text>
                  </View>
                  <View className="w-full">
                    <Text className="font-bold text-orange-500 text-lg">
                      {item.guru.nama} / {item.guru.nip}
                    </Text>
                    <Text>Skor Penilaian Kepsek : {item.nilai_kepsek}</Text>
                    <Text>Skor Penilaian Siswa : {item.nilai_siswa}</Text>
                    <Text>Skor Penilaian Akhir : {item.skor_akhir}</Text>
                  </View>
                </View>
              ))
            ) : (
              <TouchableOpacity
                onPress={() => reload(params)}
                className="w-full h-[350px]  flex items-center justify-center"
              >
                <Octicons name="list-ordered" size={92} color="orange" />
                <Text className="text-orange-500 font-light">
                  Belum ada data guru yang ditambahkan
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
