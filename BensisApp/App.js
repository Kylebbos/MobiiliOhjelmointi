import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from "./Home";
import FillUp from "./FillUp";
import Map from "./Map";
import AddVehicle from "./AddVehicle";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
       screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map';
          } else if (route.name === 'FillUp History') {
            iconName = focused ? 'list' : 'list';
          } else if (route.name === 'Add Vehicle') {
            iconName = focused ? 'car' : 'car';
          }

          return <Ionicons name={iconName} size={size} color="pink" />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Map" component={Map} />
        <Tab.Screen name="FillUp History" component={FillUp} />
        <Tab.Screen name="Add Vehicle" component={AddVehicle} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


