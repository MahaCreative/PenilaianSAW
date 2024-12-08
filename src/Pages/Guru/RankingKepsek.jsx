import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GlobalUrl } from "../../Config/GlobalVar";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import { ActivityIndicator } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
export default function RankingKepsek() {
  const [loading, setLoading] = useState(false);
  const [rangking, setRanking] = useState([]);
  const [data, setData] = useState([]);
  const useToken = useRecoilValue(tokenUser);
  const fetchData = async (query) => {
    setLoading(true);

    try {
      const response = await axios.get(
        GlobalUrl + `/api/guru/ranking-kepsek/`,
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      setData(response.data);
    } catch (err) {
      if (err.response.data.errors?.message) {
        Alert.alert(
          "Errors",
          "Data history penilaian siswa tidak ditemukan, mugkin elum ada siswa yang melakukan penilaian" +
            err
        );
      } else {
        Alert.alert(
          "Errors",
          "Gagal mendapatkan data history penilaian siswa Error Code: " + err
        );
      }
      setData([]);
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(data);

  return (
    <View>
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
            {data.map((item, key) => (
              <View
                key={key}
                className="bg-gray-200 p-2 rounded-md shadow-sm shadow-gray-500/50 my-1 flex flex-row items-center gap-x-3"
              >
                <View className="w-[70px] h-[70px]  bg-orange-500 flex flex-row justify-center items-center">
                  <FontAwesome6 name="ranking-star" size={24} color="white" />
                  <Text className="font-bold text-white text-2xl ml-4">
                    {item.rank}
                  </Text>
                </View>
                <View className="w-full">
                  <Text className="font-bold text-orange-500 text-lg">
                    Periode {item.periode.bulan + "-" + item.periode.tahun}
                  </Text>
                  <Text>Skor Penilaian Kepsek : {item.nilai_kepsek}</Text>
                  <Text>Skor Penilaian Siswa : {item.nilai_siswa}</Text>
                  <Text>Skor Penilaian Akhir : {item.skor_akhir}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
