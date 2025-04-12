import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/global";

export default function Welcome() {
  const navigation = useNavigation();

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>¡ Bienvenido !</Text>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={globalStyles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[globalStyles.button, styles.outlineButton]}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={[globalStyles.buttonText, styles.outlineButtonText]}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outlineButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1E90FF',
  },
  outlineButtonText: {
    color: '#1E90FF',
  },
});