import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { GlobalUrl } from "../../../Config/GlobalVar";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../../Store/Auth";
import { Picker } from "@react-native-picker/picker";
import { debounce } from "lodash";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Rating } from "react-native-stock-star-rating";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
export default function HistoryPenilaianSiswa() {
  const useToken = useRecoilValue(tokenUser);
  const [getRank, setRank] = useState([]);
  const [params, setParams] = useState({ periode_id: "" });
  const [dataPeriode, setDataPeriode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
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

  const fetchHistory = async (query) => {
    setLoading(true);
    console.log(GlobalUrl + `/api/history-penilaian-siswa/${query.periode_id}`);

    try {
      const response = await axios.get(
        GlobalUrl + `/api/history-penilaian-siswa/${query.periode_id}`,
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      setDataHistory(response.data);
    } catch (err) {
      Alert.alert(
        "Errors",
        "Gagal mendapatkan data history penilaian kepsek Error Code: " + err
      );
    }

    setLoading(false);
  };
  const reload = useCallback(debounce((query) => fetchHistory(params), 300));
  useEffect(() => {
    fetchDataPeriode();
  }, []);
  useEffect(() => {
    if (params.periode_id !== "") {
      reload(params);
      const selectedData = dataPeriode.find(
        (item) => item.id === params.periode_id
      );
      const arr = [];
      arr.push({
        rangking_1: selectedData.rangking_1,
        skor_1: selectedData.skor_1,
        rangking_2: selectedData.rangking_2,
        skor_2: selectedData.skor_2,
        rangking_3: selectedData.rangking_3,
        skor_3: selectedData.skor_3,
      });
      setRank(arr);
    }
  }, [params]);

  return (
    <View>
      <Picker
        onValueChange={(itemValue, itemIndex) =>
          setParams({ ...params, periode_id: itemValue })
        }
        selectedValue={params.periode_id}
        mode="dropdown"
      >
        <Picker.Item label="Pilih kriteria yang ingin ditampilkan" value="" />
        {dataPeriode.length > 0 &&
          dataPeriode.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.bulan + "-" + item.tahun}
              value={item.id}
            />
          ))}
      </Picker>
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
          <View className="w-full px-1 py-1">
            <View className="w-full bg-green-500 rounded-md py-1 px-1 text-white s flex justify-between flex-row items-end">
              <View className="flex items-center">
                <FontAwesome6 name="ranking-star" size={40} color="white" />
                <Text className="text-xs text-white font-light">
                  Rangking 1
                </Text>
              </View>
              <View className="flex flex-col items-end justify-between">
                <Text className="text-xs text-white font-light">
                  {getRank[0]?.rangking_1 == null
                    ? "Penilaian Belum Diproses"
                    : getRank[0]?.rangking_1}
                </Text>
              </View>
            </View>
            <View className="flex flex-row  py-1 gap-x-1 items-center justify-between w-full  ">
              <View className="bg-pink-500 rounded-md py-1 px-1 text-white w-1/2 ">
                <View className="flex items-center">
                  <FontAwesome6 name="ranking-star" size={32} color="white" />
                  <Text className="text-xs text-white font-light">
                    Rangking 2
                  </Text>
                  <Text className="text-xs text-white font-light">
                    <Text className="text-xs text-white font-light">
                      {getRank[0]?.rangking_2 == null
                        ? "Penilaian Belum Diproses"
                        : getRank[0]?.rangking_2}
                    </Text>
                  </Text>
                </View>
              </View>
              <View className="bg-blue-500 rounded-md py-1 px-1 text-white w-1/2 ">
                <View className="flex items-center">
                  <FontAwesome6 name="ranking-star" size={32} color="white" />
                  <Text className="text-xs text-white font-light">
                    Rangking 3
                  </Text>
                  <Text className="text-xs text-white font-light">
                    <Text className="text-xs text-white font-light">
                      {getRank[0]?.rangking_3 == null
                        ? "Penilaian Belum Diproses"
                        : getRank[0]?.rangking_3}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <ScrollView className=" w-full min-h-[200px] max-h-[400px] overflow-y-auto px-3">
            {dataHistory?.length > 0 ? (
              <>
                {dataHistory.map((item, key) => (
                  <View key={key} className="bg-gray-300/50 py-2 px-2 my-1">
                    <Text className="text-xs text-orange-500 font-medium">{`Penilaian Periode ${item.penilaian_siswa.periode.bulan}-${item.penilaian_siswa.periode.tahun}`}</Text>
                    <Text className="text-xs font-medium">{`Guru : ${item.guru.nama} NIP : ${item.guru.nip} `}</Text>
                    <Text className="text-xs font-medium">{`Kriteria : ${item.kriteria.nama_kriteria} `}</Text>
                    <Text className="text-xs font-medium">{`Bobot : ${item.kriteria.bobot_kriteria}%  `}</Text>
                    <Rating
                      stars={item.nilai}
                      bordered={false}
                      size={25}
                      color="orange"
                    />
                  </View>
                ))}
              </>
            ) : (
              <TouchableOpacity
                onPress={() => reload(params)}
                className="w-full h-[350px]  flex items-center justify-center"
              >
                <Octicons name="list-ordered" size={92} color="orange" />
                <Text className="text-orange-500 font-light text-center ">
                  Belum ada data penilaian yang diisikan
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
