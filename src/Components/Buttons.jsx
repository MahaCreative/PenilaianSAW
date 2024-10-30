import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function Buttons({ name, className, ...props }) {
  return (
    <TouchableOpacity
      {...props}
      className={`py-2 px-3 text-xs flex justify-center items-center rounded-md ${className}`}
    >
      <Text className="text-white text-xs">{name}</Text>
    </TouchableOpacity>
  );
}
