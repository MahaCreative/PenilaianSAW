import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { ActivityIndicator, Dialog } from "react-native-paper";
import { GlobalUrl } from "../../Config/GlobalVar";
import axios from "axios";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import Buttons from "../../Components/Buttons";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import { method } from "lodash";

export default function Show({ open, setOpen, nip, refresh }) {
  const [dataShow, setDataShow] = useState();
  const [load, setLoad] = useState(false);
  const getTOken = useRecoilValue(tokenUser);
  const fetchData = async () => {
    setLoad(true);
    console.log("TOKEN", getTOken);
    try {
      const response = await axios.get(GlobalUrl + `/api/detail-guru/${nip}`, {
        headers: {
          Authorization: `Bearer ${getTOken}`,
          "Content-Type": "application/json",
        },
      });

      setDataShow(response.data);
    } catch (err) {
      alert("Gagal mendapatkan data Error Code: " + err);
    }
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  };
  useEffect(() => {
    fetchData();
  }, [nip]);

  const deleteHandler = async () => {
    try {
      console.log("====================================");
      console.log(getTOken);
      console.log("====================================");
      const response = await axios.post(GlobalUrl + "/api/delete-guru/" + nip, {
        method: "post",
        headers: {
          Authorization: `Bearer ${getTOken}`,
        },
      });

      alert("Berhasil menghapus data Guru dengan NIP: " + nip);
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
          Lihat Data Guru
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
                  NIP : {dataShow.nip}
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
