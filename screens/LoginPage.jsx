import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import * as Google from "expo-google-app-auth";
import config from "../config.json";

const IOS_CLIENT_ID = config.google_client_id;

export function LoginPage({ navigation }) {
  signInWithGoogle = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId: IOS_CLIENT_ID,
        scopes: ["profile", "email"],
      });
      if (result.type === "success") {
        const user = result.user;
        const postObj = {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.givenName,
            photourl: user.photoUrl,
          }),
        };
        fetch(`http://${config.ip_address}:5001/api/addUser`, postObj)
          .then((res) => res.json())
          .then((userInfo) => {
            //reroute to map view with userInfo passed into params
            navigation.navigate("Faves", {
              userInfo,
            });
          });
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log("Error with login", e);
      return { error: true };
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <Image source={require("../assets/logo.png")} />
      <TouchableOpacity>
        <TouchableWithoutFeedback onPress={signInWithGoogle}>
          <View style={styles.googleButton}>
            <Image source={require("../assets/google2.png")}></Image>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
      {/* <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
        /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  faveContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#fff",
    height: 40,
    width: 200,
    borderRadius: 5,
    margin: 5,
  },
});
