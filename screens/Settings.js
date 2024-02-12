import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

const Settings = ({ navigation }) => {
  const navigateToActivityLog = () => {
    navigation.navigate('ActivityLog');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Page</Text>
      <TouchableOpacity onPress={navigateToActivityLog}>
        <Text style={{ color: 'blue', marginTop: 10 }}>Go to Activity Log</Text>
      </TouchableOpacity>
    </View>
  );
};

export default withNavigation(Settings);