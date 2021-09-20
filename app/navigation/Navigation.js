import React from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import LoginScreen from "../screens/login/Login";
import OptionsScreen from "../screens/transport/Options";
import ListPoints from "../screens/transport/ListPoints";
import SavePoint from "../screens/transport/SavePoint";
import RetunrScreen from "../screens/returns/Sellers";
import Operator from "../screens/operation/operator/Operator";
import PackageId from "../screens/operation/operator/PackageId";
import Guides from "../screens/returns/DispatchGuides";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="login">
        <Tab.Screen
          name="login"
          component={LoginScreen}
          options={{ title: "salir", tabBarVisible: false }}
        />
        <Tab.Screen
          name="options"
          component={OptionsScreen}
          options={{ title: "salir", tabBarVisible: false }}
        />
        <Tab.Screen
          name="listPoints"
          component={ListPoints}
          options={{ title: "salir", tabBarVisible: false }}
        />
        <Tab.Screen
          name="savePoint"
          component={SavePoint}
          options={{ title: "salir", tabBarVisible: false }}
        />
        <Tab.Screen
          name="operator"
          component={Operator}
          options={{ title: "salir", tabBarVisible: false }}
        />
        <Tab.Screen
          name="package"
          component={PackageId}
          options={{ title: "salir", tabBarVisible: false }}
        />
        <Tab.Screen
          name="return"
          component={RetunrScreen}
          options={{ title: "salir", tabBarVisible: false }}
        />
        <Tab.Screen
          name="guides"
          component={Guides}
          options={{ title: "salir", tabBarVisible: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
