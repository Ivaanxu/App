import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { globalStyles } from "../styles/global";

export default function SignIn({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.22:3000/api/auth/login', {
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
      <Text style={globalStyles.title}>{t('welcome')}</Text>

      <View style={globalStyles.inputContainer}>
        <Icon name="mail-outline" size={25} style={globalStyles.icon} />
        <TextInput
          style={globalStyles.input}
          placeholder={t('email')}
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
          placeholder={t('password')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text style={globalStyles.errorText}>{errors.password}</Text>}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Forget')}>
        <Text style={styles.forgotPassword}>{t('forgotPassword')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>{t('login')}</Text>
      </TouchableOpacity>

      {errors.server && <Text style={globalStyles.errorText}>{errors.server}</Text>}

      <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
        <Text style={styles.signUp}>{t('noAccount')} <Text style={globalStyles.link}>{t('signUp')}</Text></Text>
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