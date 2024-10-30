import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useRecoilState } from "recoil";
import { GlobalUrl } from "../Config/GlobalVar";
import { authenticated, tokenUser } from "../Store/Auth";

export default function Dashboard({ navigation }) {
  return (
    <View>
      <Text>Dashboard</Text>
    </View>
  );
}
