import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
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

import { useRecoilValue } from "recoil";

import moment from "moment";
// import CreatePenilaian from "./CreatePenilaian";

import { Picker } from "@react-native-picker/picker";
import { RatingInput } from "react-native-stock-star-rating";
import { GlobalUrl } from "../../../Config/GlobalVar";
import { tokenUser } from "../../../Store/Auth";
import CreatePenilaian from "./CreatePenilaian";
export default function Index({ route, navigation }) {
  const [guru, setGuru] = useState([]);
  const [periode, setPeriode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState([]);
  const [params, setParams] = useState({ cari: "", periode_id: "" });
  const useToken = useRecoilValue(tokenUser);
  const [modalCreate, setModalCreate] = useState(false);
  const [model, setModel] = useState([]);
  const [dataPeriode, setDataPeriode] = useState([]);
  const fetchDataPeriode = async () => {
    try {
      const response = await axios.get(GlobalUrl + "/api/get-data-periode", {
        headers: {
          Authorization: `Bearer ${useToken}`,
        },
      });

      setDataPeriode(response.data.periode);
      if (response.data.periode.length == 0) {
        Alert.alert(
          "Errors",
          "Anda belum bisa melakukan penilaian guru, data periode mungkin belum ditambahkan"
        );
      }
      setParams({ ...params, periode_id: response.data.periode[0].id });
    } catch (err) {}
  };

  const fetchData = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        GlobalUrl +
          `/api/create-penilaian-siswa/${query.periode_id}?cari=` +
          query,
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
          },
        }
      );

      setGuru(response.data.getGuru);

      if (response.data.getGuru.length == 0) {
        Alert.alert(
          "Message",
          "Anda telah memberikan penilaian kesemua guru, silahkan lihat History Penilaian Anda"
        );
      }
      setCount(response.data.count);
      setPeriode(response.data.cekPenilaian);
    } catch (err) {
      let message = "";

      setGuru([]);
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
    fetchDataPeriode();
  }, []);
  useEffect(() => {
    if (dataPeriode.length > 0) {
      reload(params);
    }
  }, [params]);
  const selectGuru = (item) => {
    setModel(item);
    setModalCreate(true);
  };

  return (
    <SafeAreaView className="px-2">
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
                {/* {guru?.length - periode?.jumlah_guru_dinilain} */}
                {guru?.length}
              </Text>
              <Text className="text-xs text-white font-light">Jumlah Guru</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="">
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
      </View>
      <Text className="py-1 px-2 rounded-md bg-slate-300 text-orange-500 font-light text-xs">
        Tekan nama guru yang ingin di berikan penilaian
      </Text>
      {loading ? (
        <TouchableOpacity
          onPress={() => reload(params)}
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
                Tidak ada data guru yang dapat diberi penilaian
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
          fetchGuru={() => reload(params)}
          guru={model}
          penilaian_id={params.periode_id}
        />
      )}
    </SafeAreaView>
  );
}
