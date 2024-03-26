import * as React from "react";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import ActivityLog from "./screens/ActivityLog";
import Tasks from "./screens/Tasks";
import Study from "./screens/Study";
import Weather from "./screens/Weather";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
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
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen
                name="Home"
                options={{
                  tabBarIcon: () => (
                    <FontAwesome name="home" size={24} color="black" />
                  ),
                }}
                component={Home}
              />
              <Tab.Screen
                name="Tasks"
                options={{
                  tabBarIcon: () => (
                    <FontAwesome name="tasks" size={24} color="black" />
                  ),
                }}
                component={Tasks}
              />

              <Tab.Screen
                name="Study"
                options={{
                  tabBarIcon: () => (
                    <FontAwesome5 name="book" size={24} color="black" />
                  ),
                }}
                component={Study}
              />

              <Tab.Screen
                name="Weather"
                options={{
                  tabBarIcon: () => (
                    <FontAwesome5
                      name="cloud-sun-rain"
                      size={24}
                      color="black"
                    />
                  ),
                }}
                component={Weather}
              />
              <Tab.Screen
                name="Settings"
                options={{
                  tabBarIcon: () => (
                    <FontAwesome5 name="cog" size={24} color="black" />
                  ),
                }}
              >
                {() => (
                  <Stack.Navigator>
                    <Stack.Screen
                      name="settings"
                      component={Settings}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="ActivityLog"
                      component={ActivityLog}
                      options={{ title: "Activity Log" }}
                    />
                  </Stack.Navigator>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
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
