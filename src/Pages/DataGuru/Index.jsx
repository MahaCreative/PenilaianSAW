import React, { useCallback, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Dialog, PaperProvider } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import Octicons from "@expo/vector-icons/Octicons";
import { debounce, pickBy } from "lodash";
import Input from "../../Components/Input";
import Show from "./Show";
import { GlobalUrl } from "../../Config/GlobalVar";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import FormCreate from "./FormCreate";

export default function Index({ navigation }) {
  const [dataGuru, setDataGuru] = useState();
  const [count, setCount] = useState();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ cari: "", page: 1, load: 10 });
  const [model, setModel] = useState();
  const [modalCreate, setModalCreate] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const getTOken = useRecoilValue(tokenUser);
  const getDataGuru = async (query) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${GlobalUrl}/api/get-guru/?cari=` + params.cari,
        {
          headers: {
            Authorization: `Bearer ${getTOken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setDataGuru(response.data.guru);
      setCount(response.data.count);
    } catch (err) {
      alert("gagal fetching data. Error Code : " + err.response?.status);
      setDataGuru();
      setCount();
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const reload = useCallback(debounce((quer) => getDataGuru(quer), 1000));
  useEffect(() => {
    reload(params);
  }, [params]);
  const showHandler = (value) => {
    setModel({ ...model, nip: value });
    setModalShow(true);
  };

  return (
    <View className="h-full">
      {/* Dialog */}

      <View className="w-full px-2 py-3">
        <View className="w-full bg-green-500 rounded-md py-2 px-2 text-white s flex justify-between flex-row items-center">
          <View className="flex items-center">
            <MaterialIcons name="face-3" size={42} color="white" />
            <Text className="text-xs text-white font-light">Jumlah Guru</Text>
          </View>
          <View className="flex flex-col items-end justify-between">
            <Text className="text-4xl font-bold text-white">
              {count?.total}
            </Text>
            <Text className="text-xs text-white font-light">Perempuan</Text>
          </View>
        </View>
        <View className="flex flex-row  py-1 gap-x-1 items-center justify-between w-full  ">
          <View className="bg-pink-500 rounded-md py-3 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <MaterialIcons name="face-3" size={42} color="white" />
              <Text className="text-xs text-white font-light">Jumlah Guru</Text>
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {count?.perempuan}
              </Text>
              <Text className="text-xs text-white font-light">Perempuan</Text>
            </View>
          </View>
          <View className="bg-blue-500 rounded-md py-3 px-2 text-white w-1/2 flex justify-between flex-row items-center">
            <View className="flex items-center">
              <MaterialIcons name="face" size={42} color="white" />
              <Text className="text-xs text-white font-light">Jumlah Guru</Text>
            </View>
            <View className="flex flex-col items-end justify-between">
              <Text className="text-4xl font-bold text-white">
                {count?.laki}
              </Text>
              <Text className="text-xs text-white font-light">Laki-Laki</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex flex-row  items-center w-full px-2 justify-between">
        <TouchableOpacity
          onPress={() => setModalCreate(true)}
          className="rounded-md py-2 px-3 bg-orange-500 items-center flex justify-center "
        >
          <Text className="text-white font-bold">Tambah Guru</Text>
        </TouchableOpacity>
        <Input
          placeholder="cari"
          value={params.cari}
          onChangeText={(text) => setParams({ ...params, cari: text })}
          className="w-[150px] h-[40px]"
        />
      </View>
      {/* Data */}
      <ScrollView className=" w-full min-h-[200px] max-h-[500px] overflow-y-auto px-2">
        {dataGuru?.length > 0 ? (
          <>
            {dataGuru.map((item, key) => (
              <TouchableOpacity
                onPress={() => showHandler(item.nip)}
                onLongPress={() => alert("select")}
                key={key + 1}
                className="rounded-md items-center bg-slate-200 my-1.5 py-2 px-8 mx-2 flex gap-x-3 flex-row"
              >
                <Text>{key + 1}</Text>
                <Image
                  source={{ uri: GlobalUrl + "/storage/" + item.foto_profile }}
                  className="w-10 h-10 rounded-full"
                />
                <View className="flex flex-col gap-y-1">
                  <Text className="font-bold text-md">Nama : {item.nama}</Text>
                  <Text className="font-light text-md">Nip: {item.nip}</Text>
                  <Text className="font-light text-md">
                    No Hp: {item.no_hp}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View className="w-full h-[350px]  flex items-center justify-center">
            <Octicons name="list-ordered" size={92} color="orange" />
            <Text className="text-orange-500 font-light">
              Belum ada data guru yang ditambahkan
            </Text>
          </View>
        )}
      </ScrollView>

      {model && (
        <Show
          refresh={getDataGuru}
          nip={model?.nip}
          open={modalShow}
          setOpen={() => {
            setModalShow(false);
            setModel();
          }}
        />
      )}
      <FormCreate
        loadAgain={getDataGuru}
        open={modalCreate}
        setOpen={() => setModalCreate(false)}
      />
    </View>
  );
}
