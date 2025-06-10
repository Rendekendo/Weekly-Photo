import { Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
      }}
    >
      <Text
        style={{
          color: "#fefefe",
          fontSize: 32,
          fontWeight: "600",
        }}
      >
        Weekly Photo
      </Text>

      <Link
        href="/takeapicture"
        style={{
          backgroundColor: "#202050",
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          color: "white",
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Take a Picture
      </Link>
    </View>
  );
}
