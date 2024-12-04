import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { GlobalUrl } from "../../Config/GlobalVar";
import { tokenUser } from "../../Store/Auth";
import { useRecoilValue } from "recoil";
import { Picker } from "@react-native-picker/picker";
import Octicons from "@expo/vector-icons/Octicons";
import { debounce } from "lodash";
import { TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Buttons from "../../Components/Buttons";
export default function RangkingSementara() {
  const useToken = useRecoilValue(tokenUser);
  const [params, setParams] = useState({ periode_id: "" });
  const [dataPeriode, setDataPeriode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [normalisasi, setNormalisasi] = useState([]);
  const [hasilAkhir, setHasilAkhir] = useState([]);
  const [showMenu, setShowMenu] = useState("hasil akhir");
  const fetchDataPeriode = async () => {
    try {
      const response = await axios.get(GlobalUrl + "/api/get-data-periode", {
        headers: {
          Authorization: `Bearer ${useToken}`,
        },
      });

      setDataPeriode(response.data.periode);
      setParams({ ...params, periode_id: response.data.periode[0].id });
    } catch (err) {
      console.log(err.response);
    }
  };
  const fetchRangking = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        GlobalUrl +
          "/api/rangking-sementara-penilaian-kepsek?periode_id=" +
          query.periode_id,
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      setLoading(false);
      setHasilAkhir(response.data.hasilAkhir);
      setNormalisasi(response.data.normalisasi);
    } catch (err) {
      Alert.alert(
        "Error",
        "Gagal mendapatkan rangking sementara, silahkan refresh kembali Error Code: " +
          err
      );
    }
  };
  const reload = useCallback(debounce((query) => fetchRangking(params), 300));
  useEffect(() => {
    fetchDataPeriode();
  }, []);
  useEffect(() => reload(params), [params]);
  console.log(hasilAkhir);

  return (
    <SafeAreaView>
      <View className="flex flex-row items-center px-2">
        <View className="w-1/2">
          <Text>PILIH Periode</Text>
        </View>
        <View className="w-1/2">
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
          {hasilAkhir.length > 0 && (
            <View className="w-full px-2 py-1">
              <View className="w-full bg-green-500 rounded-md py-2 px-2 text-white s flex justify-between flex-row items-end">
                <View className="flex items-center">
                  <FontAwesome6 name="ranking-star" size={20} color="white" />
                  <Text className="text-xs text-white font-light">
                    Rangking 1
                  </Text>
                </View>
                <View className="flex flex-col items-end justify-between">
                  <Text className="text-xs text-white font-light">
                    {hasilAkhir[0].guru.nama}
                  </Text>
                </View>
              </View>
              {hasilAkhir.length > 1 && (
                <View className="flex flex-row  py-1 gap-x-1 items-center justify-between w-full  ">
                  <View
                    className={`bg-pink-500 rounded-md py-3 px-2 text-white ${
                      hasilAkhir.length > 1 ? "w-1/2" : "w-full"
                    } `}
                  >
                    <View className="flex items-center">
                      <FontAwesome6
                        name="ranking-star"
                        size={20}
                        color="white"
                      />
                      <Text className="text-xs text-white font-light">
                        Rangking 2
                      </Text>

                      <Text className="text-xs text-white font-light">
                        {hasilAkhir[1].guru.nama}
                      </Text>
                    </View>
                  </View>
                  {hasilAkhir.length > 2 && (
                    <View className="bg-blue-500 rounded-md py-3 px-2 text-white w-1/2 ">
                      <View className="flex items-center">
                        <FontAwesome6
                          name="ranking-star"
                          size={20}
                          color="white"
                        />
                        <Text className="text-xs text-white font-light">
                          Rangking 3
                        </Text>

                        <Text className="text-xs text-white font-light">
                          {hasilAkhir[2].guru.nama}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
          <View className="flex flex-row px-2">
            <Buttons
              onPress={() => setShowMenu("hasil akhir")}
              name={"hasil akhir"}
              className={`${
                showMenu === "hasil akhir" ? "bg-blue-800" : "bg-blue-500"
              } `}
            />
            <Buttons
              onPress={() => setShowMenu("normalisasi")}
              name={"Lihat Normalisasi"}
              className={`${
                showMenu === "normalisasi" ? "bg-blue-800" : "bg-blue-500"
              } mx-1`}
            />
          </View>
          <ScrollView className=" w-full min-h-[200px] max-h-[400px] overflow-y-auto px-3">
            {/* {dataHistory?.length > 0 ? (
              <>
                {dataHistory.map((item, key) => (
                  <View className="bg-gray-300/50 py-2 px-2 my-1">
                    <Text className="text-xs text-orange-500 font-medium">{`Penilaian Periode ${item.penilaian_kepesek.periode.bulan}-${item.penilaian_kepesek.periode.tahun}`}</Text>
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
            )} */}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}
