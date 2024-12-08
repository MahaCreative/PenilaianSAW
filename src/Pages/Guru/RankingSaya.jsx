import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { GlobalUrl } from "../../Config/GlobalVar";
import { tokenUser } from "../../Store/Auth";
import { useRecoilValue } from "recoil";
import { Picker } from "@react-native-picker/picker";
import Octicons from "@expo/vector-icons/Octicons";
import { debounce } from "lodash";
import { TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Buttons from "../../Components/Buttons";
import RankingKepsek from "./RankingKepsek";
export default function RankinSaya() {
  const useToken = useRecoilValue(tokenUser);

  return (
    <SafeAreaView>
      <RankingKepsek />
    </SafeAreaView>
  );
}
