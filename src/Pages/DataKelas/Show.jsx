import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ActivityIndicator, Dialog, RadioButton } from "react-native-paper";
import Buttons from "../../Components/Buttons";
import axios from "axios";
import { GlobalUrl } from "../../Config/GlobalVar";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import { debounce } from "lodash";

export default function Show({ kode_kelas, open, setOpen, refresh }) {
  const useToken = useRecoilValue(tokenUser);
  const [params, setParams] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const deleteHandler = () => {
    console.log(useToken);

    Alert.alert(
      "Hapus Data?",
      "Apakah anda yakin ingin menghapus data ini?",
      [
        {
          text: "Yakin",
          onPress: async () => {
            try {
              const response = await axios.post(
                GlobalUrl + "/api/delete-data-kelas/" + kode_kelas,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${useToken}`,
                  },
                }
              );
              Alert.alert("Succes", "Data Kelas Berhasil Dihapus,");
              setOpen(false);
            } catch (err) {
              console.log(err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const fetchData = async (q) => {
    setLoading(true);
    try {
      const response = await axios.get(
        GlobalUrl +
          "/api/show-daftar-siswa/" +
          kode_kelas +
          "?jenis_kelamin=" +
          q,
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      setTimeout(() => {
        setData(response.data);
      }, 300);
      setLoading(false);
    } catch (err) {
      Alert.alert(
        "Error",
        "Gagal mendapatkan data, silahkan refresh kembali. Err Code: " + err,
        [
          {
            text: "Refresh Page",
            onPress: () => fetchData(),
          },
        ],
        {
          cancelable: true,
        }
      );
    }
  };
  const reload = useCallback(debounce((quer) => fetchData(quer), 1000));
  useEffect(() => {
    reload(params);
  }, [kode_kelas, params]);
  console.log(useToken);

  return (
    <Dialog visible={open} onDismiss={setOpen} className="min-h-[50%]">
      <Dialog.Title className="text-lg text-orange-500 font-semibold">
        Daftar Siswa {kode_kelas}
      </Dialog.Title>
      <Dialog.Content>
        <View>
          <Buttons
            onPress={deleteHandler}
            className={"bg-red-500"}
            name={"Hapus Kelas"}
          />
          <View className="my-3">
            {loading ? (
              <View className="flex flex-col justify-center items-center gap-y-6">
                <ActivityIndicator size={"large"} color="orange" />
                <Text className="text-orange-500">Loading</Text>
              </View>
            ) : (
              <View className="w-full ">
                <View className="flex px-1 items-center flex-row">
                  <RadioButton.Group
                    onValueChange={(newValue) => setParams(newValue)}
                    value={params}
                  >
                    <View className="flex flex-row justify-between items-center flex-wrap">
                      <View className="flex flex-row items-center">
                        <RadioButton value="" />
                        <Text>All</Text>
                      </View>
                      <View className="flex flex-row items-center">
                        <RadioButton value="laki-laki" />
                        <Text>Laki-Laki</Text>
                      </View>
                      <View className="flex flex-row items-center">
                        <RadioButton value="perempuan" />
                        <Text>Perempuan</Text>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
                <ScrollView className="w-full max-h-[90%]">
                  {data.map((item, key) => (
                    <View
                      className="py-2 flex flex-row px-3  rounded-md bg-slate-300 my-1 items-center"
                      key={key}
                    >
                      <Image
                        source={{
                          uri: GlobalUrl + "/storage/" + item.foto_profile,
                        }}
                        className="w-10 h-10"
                      />
                      <View className="mx-3">
                        <Text className="font-bold text-orange-500 text-base">
                          {item.nis}
                        </Text>
                        <Text>{item.nama}</Text>
                        <Text>{item.no_hp}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </Dialog.Content>
    </Dialog>
  );
}
