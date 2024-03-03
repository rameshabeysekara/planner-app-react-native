import React, { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import { FontAwesome as Icon } from '@expo/vector-icons';

const Home = () => {
  const [points, setPoints] = useState(100); 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.pointsContainer}>
          <View style={styles.pointsCard}>
            <Icon name="trophy" size={20} color="tomato" style={{ padding: 3 }} />
            <Text style={styles.pointsText}>{points}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text>Dashboards here</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  bottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
  },
  
  pointsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 4,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  pointsText: {
    color: 'black',
    padding: 4,
    fontWeight: 'bold',
  },

});

export default Home;
