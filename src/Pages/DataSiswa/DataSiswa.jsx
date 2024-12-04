import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, Text, View } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Dialog, PaperProvider } from "react-native-paper";
import axios from "axios";

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { debounce, pickBy } from "lodash";

// import Show from "./Show";
import { GlobalUrl } from "../../Config/GlobalVar";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import { Picker } from "@react-native-picker/picker";
import Filter from "./Filter";
import Show from "./Show";
import FormCreate from "./FormCreate";
// import FormCreate from "./FormCreate";

export default function DataSiswa({ navigation }) {
  const [dataSiswa, setDataSiswa] = useState([]);
  const [count, setCount] = useState();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    nama: "",
    nis: "",
    kelas: "",
    jenis_kelamin: "",
  });
  const [modelFilter, setModelFilter] = useState(false);
  const [model, setModel] = useState();
  const [modalCreate, setModalCreate] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const getTOken = useRecoilValue(tokenUser);
  const fetchData = async (query) => {
    setLoading(true);
    const formData = new FormData(params);

    try {
      const response = await axios.get(
        `${GlobalUrl}/api/get-data-siswa/`,

        {
          headers: {
            Authorization: `Bearer ${getTOken}`,
            "Content-Type": "application/json",
          },
          params: params,
        }
      );
      setTimeout(() => {
        setLoading(false);
      }, 100);
      setDataSiswa(response.data.siswa);
      setCount(response.data.count);
    } catch (err) {
      Alert.alert(
        "Error",
        "Gagal mendapatkan data silahkan refresh page Error Code: " + err,
        [
          {
            text: "Refresh",
            onPress: () => fetchData(params),
          },
        ]
      );
    }
  };
  const reload = useCallback(debounce((quer) => fetchData(quer), 1000));
  useEffect(() => {
    reload(params);
  }, [params]);
  const showHandler = (value) => {
    setModel({ ...model, nis: value });
    setModalShow(true);
  };

  return (
    <View className="h-full">
      {/* Dialog */}

      <View className="w-full px-2 py-3">
        <View className="w-full bg-green-500 rounded-md py-2 px-2 text-white s flex justify-between flex-row items-center">
          <View className="flex items-center">
            <MaterialIcons name="face-3" size={42} color="white" />
            <Text className="text-xs text-white font-light">Jumlah Siswa</Text>
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
              <Text className="text-xs text-white font-light">
                Jumlah Siswa
              </Text>
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
              <Text className="text-xs text-white font-light">
                Jumlah Siswa
              </Text>
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
          <Text className="text-white font-bold">Tambah Siswa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModelFilter(true)}
          className="rounded-md py-2 px-3 bg-orange-500 items-center flex justify-center flex-row"
        >
          <Ionicons name="filter" size={17} color="white" />
          <Text className="text-white font-bold ml-3">Filter Data</Text>
        </TouchableOpacity>
      </View>
      {/* Data */}
      {loading ? (
        <TouchableOpacity
          onPress={() => fetchData()}
          className="flex justify-center items-center w-full gap-4 h-full"
        >
          <ActivityIndicator size={"large"} color="orange" />
          <Text>Loading Data</Text>
        </TouchableOpacity>
      ) : (
        <ScrollView className=" w-full min-h-[200px] max-h-[500px] overflow-y-auto px-2">
          {dataSiswa?.length > 0 ? (
            <>
              {dataSiswa.map((item, key) => (
                <TouchableOpacity
                  onPress={() => showHandler(item.nis)}
                  onLongPress={() => alert("select")}
                  key={key + 1}
                  className="rounded-md items-center bg-slate-200 my-1.5 py-2 px-8 mx-2 flex gap-x-3 flex-row"
                >
                  <Text>{key + 1}</Text>
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
                    <Text className="font-light text-md">nis: {item.nis}</Text>
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
      )}

      {model && (
        <Show
          refresh={fetchData}
          nis={model?.nis}
          open={modalShow}
          setOpen={() => {
            setModalShow(false);
            setModel();
          }}
        />
      )}
      <FormCreate
        loadAgain={fetchData}
        open={modalCreate}
        setOpen={() => setModalCreate(false)}
      />
      {modelFilter && (
        <Filter
          params={params}
          setParams={setParams}
          open={modelFilter}
          setOpen={() => setModelFilter(false)}
        />
      )}
    </View>
  );
}
