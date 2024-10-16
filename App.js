// import { NavigationContainer } from '@react-navigation/native';
// import HomeScreen from './screens/HomeScreen';

// export default function App() {
//   return (
//     <NavigationContainer>
//       <HomeScreen />
//     </NavigationContainer>
//   );
// }


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CategoryScreen from './screens/CategoryScreen';
import ProductDetailScreen from './screens/DetailProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen 
          name="WelcomeScreen" 
          component={WelcomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Category" 
          component={CategoryScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CartPage" 
          component={CartScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ForgotPasswordScreen" 
          component={ForgotPasswordScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="RegisterScreen" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

