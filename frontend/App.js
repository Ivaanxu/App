import react, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Welcome from './src/screens/Welcome';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import Forget from './src/screens/Forget'
import BottomTab from "./src/components/BottomTab";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <BottomTab />
        ) : (
          <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn" options={{ title: 'Iniciar sesión' }}>
              {(props) => <SignIn {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp" options={{ title: 'Registrarse' }} >
              {(props) => <SignUp {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="Forget" component={Forget} />
            <Stack.Screen name="Home" component={BottomTab} options={{ headerShown: false }} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}