import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Dialog } from "react-native-paper";
import { GlobalUrl } from "../../Config/GlobalVar";
import { useRecoilValue } from "recoil";
import { tokenUser } from "../../Store/Auth";
import Octicons from "@expo/vector-icons/Octicons";
import { RatingInput } from "react-native-stock-star-rating";
import Buttons from "../../Components/Buttons";
export default function CreatePenilaian({
  open,
  setOpen,
  guru,
  fetchGuru,
  penilaian_id,
}) {
  const useToken = useRecoilValue(tokenUser);
  const [kriteria, setKriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        GlobalUrl + "/api/get-data-kriteria?search=",
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      setKriteria(response.data.kriteria);
      console.log(response.data.kriteria.length);
      let arr = [];
      let id = [];
      for (let i = 0; i < response.data.kriteria.length; i++) {
        arr.push(0);
        id.push(response.data.kriteria[i].id);
      }
      setData({ ...data, nilai: arr, id_kriteria: id });
    } catch (err) {
      Alert.alert(
        "Error",
        "Kriteria gagal diload, silahkan refresh kembali Error Code: " + err,
        [{ text: "Refresh", onPress: () => fetchData() }],
        { cancelable: true }
      );
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [data, setData] = useState({
    id_kriteria: [],
    nilai: [],
    guru_id: guru?.id,
  });

  const submitHandler = async () => {
    console.log(data);

    if (data.id_kriteria.length === data.nilai.length) {
      try {
        const response = await axios.post(
          GlobalUrl + "/api/create-data-nilai-kepsek/" + penilaian_id,
          data,
          {
            headers: {
              Authorization: `Bearer ${useToken}`,
            },
          }
        );
        Alert.alert(
          "Success",
          "Penilaian guru berhasil dikirim, silahkan memberikan penilaian lagi"
        );
        console.log(response.data);

        fetchGuru();
        setOpen();
      } catch (err) {
        console.log(err.response.data);

        setErrors(err.response.data.errors);
      }
    } else {
      Alert.alert(
        "Error",
        "Wajib memberikan nilai pada semua kriteria yang tampil, dan data harus lebih besar dari 1"
      );
    }
  };

  return (
    <Dialog visible={open} onDismiss={setOpen} className="h-[70%] ">
      <Dialog.Title className="text-xs text-orange-500 font-bold">{`Nilai Kinerja ${guru?.nama}`}</Dialog.Title>
      <Dialog.ScrollArea>
        {loading ? (
          <View className="w-full flex flex-col justify-center items-center">
            <ActivityIndicator color="orange" size={"large"} />
            <Text className="my-3 text-orange-500 font-light">
              Tunggu sebentar,sedang memuat data
            </Text>
          </View>
        ) : (
          <ScrollView className="max-h-[100%]">
            {kriteria.length > 0 ? (
              kriteria.map((item, key) => (
                <View
                  key={key}
                  className="py-1 px-2 rounded-md bg-slate-300 my-1"
                >
                  <View>
                    <Text className="capitalize font-semibold text-sm text-orange-500">
                      {item.nama_kriteria}
                    </Text>
                    <Text className="capitalize font-light text-xs">
                      Bobot :{item.bobot_kriteria}
                    </Text>
                    <RatingInput
                      stars={1}
                      rating={data.nilai[key]}
                      setRating={(value) =>
                        setData({
                          ...data,
                          nilai: [
                            ...data.nilai.slice(0, key),
                            value,
                            ...data.nilai.slice(key + 1),
                          ],
                          id_kriteria: [
                            ...data.id_kriteria.slice(0, key),
                            item.id,
                            ...data.id_kriteria.slice(key + 1),
                          ],
                        })
                      }
                      bordered={false}
                      maxStars={5}
                      size={25}
                      color="orange"
                    />
                    {errors[`nilai.${key}`] && (
                      <View>
                        <Text className="text-red-500 text-xs italic">
                          {errors[`nilai.${key}`][0]}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <TouchableOpacity
                onPress={() => fetchData()}
                className="w-full h-[350px]  flex items-center justify-center"
              >
                <Octicons name="list-ordered" size={92} color="orange" />
                <Text className="text-orange-500 font-light text-center">
                  Tidak ada data guru yang dapat dinilai saat ini, silahkan,
                  atau kemungkinan periode terbaru belum ditambahkan/selesai
                  refresh kembali
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <Buttons
          name={"Kirim Penilaian"}
          className={"bg-blue-500"}
          onPress={submitHandler}
        />
        <Buttons
          name={"Cancell"}
          className={"bg-red-500"}
          onPress={() => {
            setOpen();
            setData({
              id_kriteria: [],
              nilai: [],
            });
          }}
        />
      </Dialog.Actions>
    </Dialog>
  );
}
