import React from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

export default function Input({ errors, className, ...props }) {
  return (
    <View className={"w-fit"}>
      <TextInput
        className="w-full bg-white"
        {...props}
        type="outlined"
        mode="outlined"
        cursorColor="orange"
        underlineColor="orange"
        activeOutlineColor="orange"
        outlineColor="orange"
        textColor="orange"
        leftIcon={{ type: "font-awesome", name: "chevron-left" }}
      />
      {errors && (
        <HelperText type="error" visible={errors ? true : false}>
          {errors}
        </HelperText>
      )}
    </View>
  );
}
