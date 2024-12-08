import React, { useEffect, useState } from "react";
import { GlobalUrl } from "../../Config/GlobalVar";
import { Picker } from "@react-native-picker/picker";
import { Alert, Text, View } from "react-native";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import Buttons from "../../Components/Buttons";
import { StorageAccessFramework } from "expo-file-system";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";

global.Buffer = Buffer; // Tambahkan ini di awal file
export default function FilterLaporanSiswa({ uriDownload, setUriDownload }) {
  const [dataPeriode, setDataPeriode] = useState([]);
  const [params, setParams] = useState({ periode_id: "", periode: "" });
  const useToken = useRecoilValue(tokenUser);
  const fetchDataPeriode = async () => {
    try {
      const response = await axios.get(GlobalUrl + "/api/get-data-periode", {
        headers: {
          Authorization: `Bearer ${useToken}`,
        },
      });

      setDataPeriode(response.data.periode);

      setParams({
        ...params,
        periode_id: response.data.periode[0].id,
        periode: dataPeriode[0].bulan + dataPeriode[0].tahun,
      });
    } catch (err) {}
  };
  useEffect(() => {
    fetchDataPeriode();
  }, []);

  const handleDownloadPDF = async (show) => {
    try {
      // Step 1: Fetch PDF File from API
      console.log(uriDownload.uri + params.periode_id + "?showData=" + show);

      const response = await axios.get(
        GlobalUrl + uriDownload.uri + params.periode_id + "?showData=" + show,

        {
          responseType: "arraybuffer", // Menggunakan arraybuffer untuk file biner
        }
      );

      const base64Data = Buffer.from(response.data, "binary").toString(
        "base64"
      );

      // Step 2: Request Permissions to Choose Directory
      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        Alert.alert("Permission Denied", "Izin penyimpanan ditolak.");
        return;
      }

      // Step 3: Save File in Chosen Directory
      let fileName = "";
      if (uriDownload.type == "siswa") {
        fileName = `lhps-${params.periode}.pdf`; // Nama file yang akan disimpan
      } else if (uriDownload.type == "kepsek") {
        fileName = `lhpk-${params.periode}.pdf`; // Nama file yang akan disimpan
      } else {
        fileName = `lpkg-${params.periode}.pdf`; // Nama file yang akan disimpan
      }

      const mimeType = "application/pdf";

      const fileUri = await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        mimeType
      );

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert("Success", "File berhasil didownload dan disimpan!");
      console.log("File saved to:", fileUri);
    } catch (error) {
      console.error("Error downloading or saving file:", error);
      Alert.alert("Error", "Gagal mendownload atau menyimpan file.");
    }
  };
  const startDownload = (show) => {
    handleDownloadPDF(show);
  };
  console.log(params);

  return (
    <View className="my-3 px-3">
      <View className="flex flex-row items-center justify-between">
        <Text>Silahkan Memilih Periode</Text>
        <View className="w-1/2">
          <Picker
            onValueChange={(itemValue, itemIndex) =>
              setParams({
                ...params,
                periode_id: itemValue,
                periode:
                  dataPeriode[itemIndex - 1].bulan +
                  dataPeriode[itemIndex - 1].tahun,
              })
            }
            selectedValue={params.periode_id}
            mode="dropdown"
          >
            <Picker.Item
              label="Pilih periode yang ingin ditampilkan"
              value=""
            />
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
      </View>
      <View className="py-1 my-2 px-3 bg-gray-300">
        <Text className="text-xs ">
          Silahkan memilih periode yang ingin di export terlebih dahulu, lalu
          selanjutnya pilih format data yang ingin ditampilkan dengan menekan
          tombol dibawah ini
        </Text>
      </View>
      <View className="flex flex-col gap-y-1">
        {uriDownload.type == "all" ? (
          <>
            <Buttons
              onPress={() => startDownload("all")}
              name="Export Semua Laporan"
              className={"bg-blue-500 justify-center"}
            />
          </>
        ) : uriDownload.type == "siswa" ? (
          <>
            <Buttons
              onPress={() => startDownload("siswa")}
              name="Export Data Berdasarkan Siswa"
              className={"bg-blue-500  justify-center"}
            />
            <Buttons
              onPress={() => startDownload("guru")}
              name="Export Data Berdasarkan Guru"
              className={"bg-blue-500 justify-center"}
            />
            <Buttons
              onPress={() => startDownload("kriteria")}
              name="Export Data Berdasarkan Kriteria"
              className={"bg-blue-500  justify-center "}
            />
          </>
        ) : (
          <>
            <Buttons
              onPress={() => startDownload("guru")}
              name="Export Data Berdasarkan Guru"
              className={"bg-blue-500 justify-center"}
            />
            <Buttons
              onPress={() => startDownload("kriteria")}
              name="Export Data Berdasarkan Kriteria"
              className={"bg-blue-500  justify-center "}
            />
          </>
        )}
      </View>
    </View>
  );
}
