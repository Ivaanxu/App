import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import { globalStyles } from "../styles/global";

export default function Profile({ setIsLoggedIn }) {
  const { t } = useTranslation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <View><Text>Perfil</Text>
      <TouchableOpacity style={globalStyles.button} onPress={handleLogout}>
        <Text style={globalStyles.buttonText}>{t('logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}