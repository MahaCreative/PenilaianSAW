import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { tokenUser } from "./yourRecoilState"; // Ganti dengan path yang benar
import { GlobalUrl } from "./yourConfig"; // Ganti dengan path yang benar

const useAuthRedirect = (setAuth) => {
  const useToken = useRecoilValue(tokenUser);
  const navigation = useNavigation();

  const checkUser = async () => {
    try {
      const response = await axios.get(GlobalUrl + "/api/me", {
        headers: {
          Authorization: `Bearer ${useToken}`,
          Accept: "application/json",
        },
      });
      setAuth({ check: true, user: response.data });
    } catch (err) {
      setAuth({ check: false, user: [] });
      alert("Anda telah Logout dari sistem, silahkan login ulang: " + err);
      setTimeout(() => {
        navigation.replace("Login");
      }, 1500);
    }
  };

  useEffect(() => {
    useAuthRedirect();
  }, [useToken]); // Menambahkan useToken sebagai dependensi
};

export default useAuthRedirect;
