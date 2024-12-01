import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator } from "react-native-paper";
import Octicons from "@expo/vector-icons/Octicons";
import { debounce } from "lodash";
import axios from "axios";
import { GlobalUrl } from "../../Config/GlobalVar";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import moment from "moment";
import CreatePenilaian from "./CreatePenilaian";
export default function PenilaianKepseek({ route, navigation }) {
  const [guru, setGuru] = useState([]);
  const [periode, setPeriode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState([]);
  const [params, setParams] = useState({ cari: "" });
  const useToken = useRecoilValue(tokenUser);
  const [modalCreate, setModalCreate] = useState(false);
  const [model, setModel] = useState([]);
  const fetchData = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        GlobalUrl + "/api/get-guru-belum-dinilai?cari=" + query,
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      console.log(response.data.cekPenilaian);

      setGuru(response.data.getGuru);
      setCount(response.data.count);
      setPeriode(response.data.cekPenilaian);
    } catch (err) {
      let message = "";
      if (err.response.data?.errors) {
        message = err.response.data.errors.message[0];
        Alert.alert(
          "Error",
          message,
          [{ text: "refresh", onPress: () => reload(query) }],
          { cancelable: true }
        );
      } else {
        Alert.alert("Error", "Gagal mengambil data Error Code: " + err);
      }
    }
    setTimeout(() => setLoading(false), 1000);
  };
  const reload = useCallback(debounce((query) => fetchData(params), 300));
  useEffect(() => {
    reload(params);
  }, [params]);
  const selectGuru = (item) => {
    setModel(item);
    setModalCreate(true);
  };
  return (
    <View className="px-2">
      <View className="bg-green-500 rounded-md p-1 px-2 text-white flex justify-between flex-row items-center">
        <View className="flex items-center">
          <MaterialIcons name="date-range" size={42} color="white" />
          <Text className="text-xs text-white font-light capitalize">
            Status : {periode?.periode?.status}
          </Text>
        </View>
        <View className="flex flex-col items-end justify-between">
          <Text className="text-4xl font-bold text-white">
            {periode?.periode?.bulan + "-" + periode?.periode?.tahun}
          </Text>
          <Text className="text-xs text-white font-light">
            Tanggal Mulai - Tanggal Berakhir
          </Text>
          <Text className="text-xs text-white font-light">
            {moment(periode?.preiode?.tanggal_mulai).format("L") +
              " - " +
              moment(periode?.preiode?.tanggal_berakhir).format("L")}
          </Text>
        </View>
      </View>
      <View className="w-full  py-1">
        <View className="flex flex-row  py-1  items-center ">
          <View className="bg-pink-500 rounded-md py-3 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <MaterialIcons name="face-3" size={42} color="white" />
              <Text className="text-xs text-white font-light">
                Sudah Dinilai
              </Text>
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {periode?.jumlah_guru_dinilain}
              </Text>
              <Text className="text-xs text-white font-light">Jumlah Guru</Text>
            </View>
          </View>
          <View className="ml-1 bg-blue-500 rounded-md py-3 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <MaterialIcons name="face" size={42} color="white" />
              <Text className="text-xs text-white font-light">
                Belum Dinilai
              </Text>
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {guru?.length - periode?.jumlah_guru_dinilain}
              </Text>
              <Text className="text-xs text-white font-light">Jumlah Guru</Text>
            </View>
          </View>
        </View>
      </View>
      <Text className="py-1 px-2 rounded-md bg-slate-300 text-orange-500 font-light text-xs">
        Tekan nama guru yang ingin di berikan penilaian
      </Text>

      {loading ? (
        <TouchableOpacity
          onPress={() => fetchData()}
          className="flex justify-center items-center w-full gap-4 h-1/2"
        >
          <ActivityIndicator size={"large"} color="orange" />
          <Text>Loading Data</Text>
        </TouchableOpacity>
      ) : (
        <ScrollView className=" w-full min-h-[200px] max-h-[500px] overflow-y-auto">
          {guru?.length > 0 ? (
            <>
              {guru.map((item, key) => (
                <TouchableOpacity
                  onPress={() => selectGuru(item)}
                  key={key + 1}
                  className="rounded-md items-center bg-slate-200 my-1.5 py-2 px-8 mx-2 flex gap-x-3 flex-row"
                >
                  <Image
                    source={{
                      uri: GlobalUrl + "/storage/" + item.foto_profile,
                    }}
                    className="w-10 h-10 rounded-full"
                  />

                  <View className="flex flex-col gap-y-1">
                    <Text className="font-bold text-md">
                      Nama : {item.nama}
                    </Text>
                    <Text className="font-light text-md">NIP: {item.nip}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <TouchableOpacity
              onPress={() => fetchData()}
              className="w-full h-[350px]  flex items-center justify-center"
            >
              <Octicons name="list-ordered" size={92} color="orange" />
              <Text className="text-orange-500 font-light text-center">
                Tidak ada data guru yang dapat dinilai saat ini, silahkan, atau
                kemungkinan periode terbaru belum ditambahkan/selesai refresh
                kembali
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
      {modalCreate && (
        <CreatePenilaian
          open={modalCreate}
          setOpen={() => {
            setModalCreate(false);
            setModel([]);
          }}
          guru={model}
          penilaian_id={periode.id}
        />
      )}
    </View>
  );
}
