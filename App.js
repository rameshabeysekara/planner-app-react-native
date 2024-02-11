import * as React from "react";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Button, MD3LightTheme as DefaultTheme, PaperProvider } from "react-native-paper";
import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import Tasks from "./screens/Tasks";

import { Provider } from 'react-redux';
import store from './redux/store';


const Tab = createMaterialBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "yellow",
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" options={{
              tabBarIcon: () => (
                <FontAwesome name="home" size={24} color="black" />
              ),
            }} component={Home} />
            <Tab.Screen name="Tasks" options={{
              tabBarIcon: () => (
                <FontAwesome name="tasks" size={24} color="black" />
              ),
            }} component={Tasks} />
            <Tab.Screen name="Settings" options={{
              tabBarIcon: () => (
                <Feather name="settings" size={24} />
              ),
            }} component={Settings} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

AppRegistry.registerComponent(appName, () => App);
