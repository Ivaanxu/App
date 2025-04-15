import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { globalStyles } from "../styles/global";

export default function SignUp({ navigation, setIsLoggedIn }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const handleRegister = async () => {
    try {
      const response = await fetch('http://192.168.0.22:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
          surname,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors.reduce((acc, error) => {
          acc[error.path] = error.msg;
          return acc;
        }, {}));
      } else {
        setErrors({});
        await AsyncStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Registration request failed:", error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>{t('createAccount')}</Text>

      <View style={globalStyles.inputContainer}>
        <Icon name="person-outline" size={25} style={globalStyles.icon} />
        <TextInput
          style={globalStyles.input}
          placeholder={t('name')}
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={globalStyles.errorText}>{errors.name}</Text>}
      </View>

      <View style={globalStyles.inputContainer}>
        <Icon name="person-outline" size={25} style={globalStyles.icon} />
        <TextInput
          style={globalStyles.input}
          placeholder={t('surname')}
          value={surname}
          onChangeText={setSurname}
        />
        {errors.surname && <Text style={globalStyles.errorText}>{errors.surname}</Text>}
      </View>

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

      <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
        <Text style={globalStyles.buttonText}>{t('signUp')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('SignIn')}>
        <Text style={styles.loginText}>{t('hasAccount')} <Text style={globalStyles.link}>{t('signIn')}</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loginText: {
    textAlign: 'center',
    color: '#000',
  },
});
