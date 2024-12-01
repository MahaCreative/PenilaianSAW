import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Dialog, TextInput } from "react-native-paper";
import { GlobalUrl } from "../../Config/GlobalVar";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import axios from "axios";
import { View } from "react-native";
import Buttons from "../../Components/Buttons";

export default function Filter({ setParams, open, setOpen, params }) {
  const useToken = useRecoilValue(tokenUser);
  const [dataKelas, setDataKelas] = useState([]);

  const fetchKelas = async () => {
    try {
      const response = await axios.get(GlobalUrl + "/api/get-data-kelas", {
        headers: {
          Authorization: `Bearer ${useToken}`,
          Accept: "application/json",
        },
      });

      setDataKelas(response.data.dataKelas);
    } catch (err) {
      alert("Gagal mengambil data kelas Error Code: " + err);
    }
  };
  useEffect(() => {
    fetchKelas();
  }, []);
  return (
    <Dialog visible={open} onDismiss={setOpen}>
      <Dialog.Title className="text-sm font-semibold text-orange-500">
        Filter Data Siswa
      </Dialog.Title>
      <Dialog.Content>
        <View className="flex gap-y-3">
          <Picker
            selectedValue={params.kelas}
            onValueChange={(itemValue, itemIndex) =>
              setParams({ ...params, kelas: itemValue })
            }
          >
            <Picker.Item label="Pilih Kelas" value="" />
            {dataKelas.map((item, key) => (
              <Picker.Item
                key={key}
                label={item.nama_kelas}
                value={item.kode_kelas}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={params.jenis_kelamin}
            onValueChange={(itemValue, itemIndex) =>
              setParams({ ...params, jenis_kelamin: itemValue })
            }
          >
            <Picker.Item label="Pilih Jenis Kelamin" value="" />
            <Picker.Item label="Laki-laki" value="laki-laki" />
            <Picker.Item label="Perempuan" value="perempuan" />
          </Picker>
          <TextInput
            type="outlined"
            mode="outlined"
            cursorColor="orange"
            underlineColor="orange"
            activeOutlineColor="orange"
            outlineColor="orange"
            textColor="orange"
            placeholder="Cari berdasarkan NIS"
            leftIcon={{ type: "font-awesome", name: "search" }}
            value={params.nis}
            onChangeText={(text) => setParams({ ...params, nis: text })}
            label={"NIS"}
          />
          <TextInput
            type="outlined"
            mode="outlined"
            cursorColor="orange"
            underlineColor="orange"
            activeOutlineColor="orange"
            outlineColor="orange"
            textColor="orange"
            placeholder="Cari berdasarkan Nama Siswa"
            leftIcon={{ type: "font-awesome", name: "search" }}
            value={params.nama}
            label={"Nama Siswa"}
            onChangeText={(text) => setParams({ ...params, nama: text })}
          />
        </View>
        <Buttons
          className={"bg-red-500"}
          name={"Reset Filter"}
          onPress={() => {
            setParams({
              ...params,
              nis: "",
              nama: "",
              jenis_kelamin: "",
              kelas: "",
            });
          }}
        />
      </Dialog.Content>
    </Dialog>
  );
}
