import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Dialog } from "react-native-paper";
import Input from "../../Components/Input";
import { Picker } from "@react-native-picker/picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import axios from "axios";
import { GlobalUrl } from "../../Config/GlobalVar";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import moment from "moment";

export default function FormCreate({ open, setOpen, fetchPeriode }) {
  const useToken = useRecoilValue(tokenUser);
  const [data, setData] = useState({
    tahun: "",
    bulan: "",
    tanggal_mulai: "",
    tanggal_berakhir: "",
  });
  const [errors, setErrors] = useState([]);
  const tanggalMulai = async () => {
    const date = new Date();
    DateTimePickerAndroid.open({
      value: date,
      mode: "date",

      onChange: (event, selectedDate) => {
        if (event.type === "set") {
          const currentDate = selectedDate || date;

          setData({
            ...data,
            tanggal_mulai: currentDate.toLocaleDateString("en-CA"),
            bulan: moment(currentDate).format("M"),
          }); // Format YYYY-MM-DD
        }
      },
    });
  };
  const tanggalBerakhir = async () => {
    const date = new Date();
    DateTimePickerAndroid.open({
      value: date,
      mode: "date",

      onChange: (event, selectedDate) => {
        if (event.type === "set") {
          const currentDate = selectedDate || date;

          setData({
            ...data,
            tanggal_berakhir: currentDate.toLocaleDateString("en-CA"),
          }); // Format YYYY-MM-DD
        }
      },
    });
  };

  const cancellHandler = () => {
    setData({ tahun: "", bulan: "", tanggal_mulai: "", tanggal_berakhir: "" });
    setErrors([]);
    setOpen();
  };
  const submitHandler = async () => {
    try {
      const response = await axios.post(
        GlobalUrl + "/api/create-data-periode",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      Alert.alert("Success", "1 periode baru berhasil ditambahkan ke database");

      setOpen();
      fetchPeriode();
    } catch (err) {
      console.log("errors");
      if (err.response?.data.errors.message) {
        Alert.alert(
          "Errors",
          "Periode yang anda isikan telah ditambahkan sebelumnya"
        );
      }

      setErrors(err.response.data.errors);
    }
  };
  return (
    <Dialog visible={open} onDismiss={setOpen}>
      <Dialog.Title className="text-xs text-orange-500">
        Create Periode
      </Dialog.Title>
      <Dialog.Content className="flex flex-col gap-y-1 w-full">
        <View className="w-full">
          <Input
            className={"w-full"}
            label={"Tahun"}
            errors={errors?.tahun}
            value={data.tahun}
            onChangeText={(text) => setData({ ...data, tahun: text })}
            keyboardType="numeric"
          />

          <View View className="">
            <Input
              // className="w-[130px]"
              onPress={() => tanggalMulai(true)}
              label={"Tanggal Mulai"}
              errors={errors?.tanggal_mulai}
              value={data.tanggal_mulai}
            />
            <Input
              // className="w-[130px]"
              onPress={() => tanggalBerakhir(true)}
              label={"Tanggal Mulai"}
              errors={errors?.tanggal_berakhir}
              value={data.tanggal_berakhir}
            />
          </View>
        </View>
        <View className="">
          <Input
            disabled
            className={"w-full"}
            label={"Bulan"}
            errors={errors?.bulan}
            value={data.bulan}
            // onChangeText={(text) => setData({ ...data, tahun: text })}
            keyboardType="numeric"
          />
        </View>
        <View className="flex flex-row gap-x-3 my-6 w-full ">
          <TouchableOpacity
            onPress={submitHandler}
            className=" bg-orange-500 flex justify-center items-center py-2 px-3 rounded-md"
          >
            <Text className="text-white">Tambah Periode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={cancellHandler}
            className=" bg-red-500 flex justify-center items-center py-2 px-3 rounded-md"
          >
            <Text className="text-white">Cancell</Text>
          </TouchableOpacity>
        </View>
      </Dialog.Content>
    </Dialog>
  );
}
