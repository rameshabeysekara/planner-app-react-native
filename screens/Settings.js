import React from 'react';
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

const Settings = ({ navigation }) => {
  const navigateToActivityLog = () => {
    navigation.navigate('ActivityLog');
  };

  const navigateToOtherScreen = () => {
   
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>

        <TouchableOpacity onPress={navigateToActivityLog}>
          <ListItem bottomDivider containerStyle={{ marginTop: 5 }}>
            <ListItem.Content>
              <ListItem.Title>Activity Log</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>

        {/* for other screens */}
        <TouchableOpacity onPress={navigateToOtherScreen}>
          <ListItem bottomDivider containerStyle={{ marginTop: 5 }}>
            <ListItem.Content>
              <ListItem.Title>Notifications</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>

        {/* Add more items as needed */}
      </View>
    </SafeAreaView>
  );
};

export default withNavigation(Settings);
