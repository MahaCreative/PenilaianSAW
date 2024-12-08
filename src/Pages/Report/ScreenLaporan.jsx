import React, { useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FilterLaporanSiswa from "./FilterLaporanSiswa";
export default function ScreenLaporan() {
  const [uriDownload, setUriDownload] = useState({
    type: "siswa",
    uri: "/lapora-history-penilaian-siswa/",
  });
  return (
    <View className="pl-1 pr-3">
      <View className="bg-slate-300/50 py-1 px-2">
        <Text>
          Laporan yang anda pilih akan, terdownload dan tersimpan pada file anda
        </Text>
      </View>
      <View className="flex flex-row my-2 px-2">
        <TouchableOpacity
          onPress={() =>
            setUriDownload({
              ...uriDownload,
              type: "siswa",
              uri: "/lapora-history-penilaian-siswa/",
            })
          }
          className={`${
            uriDownload.type === "siswa" ? "bg-green-500" : "bg-orange-500"
          } mr-1  text-lg   py-2 px-3 rounded-md flex flex-col justify-center items-center w-1/3`}
        >
          <MaterialIcons name="local-print-shop" size={24} color="white" />
          <Text className="text-center text-white text-xs">
            Export Penilaian Siswa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setUriDownload({
              ...uriDownload,
              type: "kepsek",
              uri: "/lapora-history-penilaian-kepsek/",
            })
          }
          className={`${
            uriDownload.type === "kepsek" ? "bg-green-500" : "bg-orange-500"
          } ml-1 mr-2  text-lg   py-2 px-3 rounded-md flex flex-col justify-center items-center w-1/3`}
        >
          <MaterialIcons name="local-print-shop" size={24} color="white" />
          <Text className="text-center text-white text-xs">
            Export Penilaian Kepsek
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setUriDownload({
              ...uriDownload,
              type: "all",
              uri: "/laporan-penilaian-guru/",
            })
          }
          className={`${
            uriDownload.type === "all" ? "bg-green-500" : "bg-orange-500"
          } mr-1 text-lg   py-2 px-3 rounded-md flex flex-col justify-center items-center w-1/3`}
        >
          <MaterialIcons name="local-print-shop" size={24} color="white" />
          <Text className="text-center text-white text-xs">
            Export Semua Laporan
          </Text>
        </TouchableOpacity>
      </View>
      <FilterLaporanSiswa
        uriDownload={uriDownload}
        setUriDownload={setUriDownload}
      />
    </View>
  );
}
