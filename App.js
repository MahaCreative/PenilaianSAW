import { NavigationContainer } from "@react-navigation/native";
import SplashScreeen from "./src/Pages/SplashScreeen";
import { RecoilRoot, useRecoilState } from "recoil";
import Login from "./src/Pages/Login";
import Dashboard from "./src/Pages/Dashboard";
import Drawer from "./src/Pages/Drawer";

import axios from "axios";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splashscreen" component={SplashScreeen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Drawer"
            component={Drawer}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}
