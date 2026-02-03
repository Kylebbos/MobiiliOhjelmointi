// App.js
import React, { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Calculator from "./components/Calculator";
import History from "./components/History";

const Tab = createBottomTabNavigator();

export default function App() {
  const [history, setHistory] = useState([]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Calculator') {
              iconName = focused ? 'calculator' : 'calculator';
            } else if (route.name === 'History') {
              iconName = focused ? 'list' : 'list';
            }

            return <Ionicons name={iconName} size={size} color="pink" />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Calculator">
          {() => <Calculator setHistory={setHistory} history={history} />}
        </Tab.Screen>
        <Tab.Screen name="History">
          {() => <History history={history} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
