import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { ActivityIndicator, Dialog } from "react-native-paper";
import { GlobalUrl } from "../../Config/GlobalVar";
import axios from "axios";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import Buttons from "../../Components/Buttons";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import { method } from "lodash";

export default function Show({ open, setOpen, nis, refresh }) {
  const [dataShow, setDataShow] = useState();
  const [load, setLoad] = useState(false);
  const getTOken = useRecoilValue(tokenUser);
  const fetchData = async () => {
    setLoad(true);

    try {
      const response = await axios.get(
        GlobalUrl + `/api/show-data-siswa/${nis}`,
        {
          headers: {
            Authorization: `Bearer ${getTOken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDataShow(response.data);
      console.log(response.data);

      setTimeout(() => {
        setLoad(false);
      }, 100);
    } catch (err) {
      console.log(err);

      Alert.alert(
        "Error " + err,
        "Gagal meload data siswa, silahkan refresh kembali",
        [
          {
            text: "Refresh",
            onPress: () => fetchData(),
          },
        ],
        {
          cancelable: false,
        }
      );
    }
  };
  useEffect(() => {
    fetchData();
  }, [nis]);

  const deleteHandler = async () => {
    try {
      const response = await axios.delete(
        GlobalUrl + "/api/delete-data-siswa/" + nis,

        {
          headers: {
            Authorization: `Bearer ${getTOken}`,
          },
          method: "DELETE",
        }
      );

      alert("Berhasil menghapus data Siswa dengan nis: " + nis);
    } catch (err) {
      alert("Gagal menghapus data Error Code: " + err);
    }
    refresh();
    setOpen(false);
  };
  return (
    <>
      <Dialog visible={open} onDismiss={setOpen}>
        <Dialog.Title className="text-sm font-semibold text-orange-500">
          Lihat Data Siswa
        </Dialog.Title>
        <Dialog.Content>
          {load ? (
            <View className="flex flex-col justify-center items-center gap-y-6">
              <ActivityIndicator size={"large"} color="orange" />
              <Text className="text-orange-500">Loading</Text>
            </View>
          ) : (
            dataShow && (
              <View>
                <Image
                  source={{
                    uri: `${GlobalUrl}/storage/${dataShow.foto_profile}`,
                  }}
                  className="w-full h-52 object-cover"
                  sizeMode="cover"
                />
                <Text className="font-bold text-xl text-orange-500 capitalize ">
                  {dataShow.nama}
                </Text>
                <Text className="text-orange-500 text-xl">
                  nis : {dataShow.nis}
                </Text>
                <Text className="font-light text-sm capitalize ">
                  Jenis Kelamin {dataShow.jenis_kelamin}
                </Text>
                <Text className="font-light text-sm capitalize ">
                  No HP: {dataShow.no_hp}
                </Text>
                <Text className="font-light text-sm capitalize ">
                  Di tambahkan Tanggal:{" "}
                  {moment(dataShow.created_at).format("DD-MM-YYYY")}
                </Text>
                <View className="py-6 flex flex-row gap-x-2">
                  <Buttons
                    onPress={deleteHandler}
                    name={"Delete"}
                    className={"bg-red-500"}
                  />
                </View>
              </View>
            )
          )}
        </Dialog.Content>
      </Dialog>
    </>
  );
}
