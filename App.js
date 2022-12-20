import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MapPage } from "./screens/MapPage.jsx";
import { LoginPage } from "./screens/LoginPage.jsx";
import { FavesPage } from "./screens/FavesPage.jsx"

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Login"
          component={LoginPage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={MapPage}
          initialParams={{ userInfo: null }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="md-map" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Faves"
          component={FavesPage}
          initialParams={{ userInfo: null }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-heart" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
