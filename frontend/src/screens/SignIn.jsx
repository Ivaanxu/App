import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../styles/global";

export default function SignIn({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.22:3000/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrors(data.errors.reduce((acc, error) => {
          acc[error.path] = error.msg;
          return acc;
        }, {}));
      } else {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        setErrors({});
      }

    } catch (error) {
      console.error("Login request failed: ", error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Iniciar sesión</Text>

      <View style={globalStyles.inputContainer}>
        <Icon name="mail-outline" size={25} style={globalStyles.icon} />
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text style={globalStyles.errorText}>{errors.email}</Text>}
      </View>

      <View style={globalStyles.inputContainer}>
        <Icon name="lock-closed-outline" size={25} style={globalStyles.icon} />
        <TextInput
          style={globalStyles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text style={globalStyles.errorText}>{errors.password}</Text>}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Forget')}>
        <Text style={styles.forgotPassword}>¿Has olvidado tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      {errors.server && <Text style={globalStyles.errorText}>{errors.server}</Text>}

      <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
        <Text style={styles.signUp}>¿No tienes una cuenta? <Text style={globalStyles.link}>Registrate</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    marginBottom: 20,
    color: '#000',
  },
  signUp: {
    color: '#000',
  },
});