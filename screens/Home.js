import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { FontAwesome as Icon } from '@expo/vector-icons';
import { connect } from 'react-redux'; 
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart
} from "react-native-chart-kit";

const Home = ({ totalPoints, todo_list, activityLog }) => {
  const [points, setPoints] = useState(0); 
  const screenWidth = Dimensions.get("window").width;

  console.log(activityLog);
  useEffect(() => {
    
    setPoints(totalPoints);
  }, [totalPoints]);

  const chartConfig = {
    backgroundColor: "#FF6347",
    backgroundGradientFrom: "#7F7F7F",
    backgroundGradientTo: "#FF6347",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#FF6347"
    }
  }

  const countTasksByMonth = () => {
    const months = {};
    activityLog.forEach(log => {
      if (log.status === "Done") {
        const month = new Date(log.timestamp).getMonth();
        if (!months[month]) {
          months[month] = 1;
        } else {
          months[month]++;
        }
      }
    });
    return Object.values(months);
  };
  
  const countTasksByCategory = () => {
    let personalCount = 0;
    let workCount = 0;
    let otherCount = 0;

    todo_list.forEach(task => {
        if (task.category && task.category.value === 'Personal') {
            personalCount++;
        } else if (task.category && task.category.value === 'Work') {
            workCount++;
        } else {
            otherCount++;
        }
    });

    const generateColor = (opacity) => {
        return `rgba(255, 99, 71, ${opacity})`;
    };

    const data = [
        {
            name: "Personal",
            population: personalCount,
            color: generateColor(1), //  opacity: 0.6
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Work",
            population: workCount,
            color: generateColor(0.8), //  opacity: 0.8
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Others",
            population: otherCount,
            color: "#808080", 
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ];

    return data;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.pointsContainer}>
          <View style={styles.pointsCard}>
            <Icon name="trophy" size={20} color="tomato" style={{ padding: 3 }} />
            <Text style={styles.pointsText}>{ points || 0}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text>Chart 1</Text>
        <View  style={styles.chartContainer}>
          <LineChart
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Dec"],
                datasets: [
                  {
                    data: countTasksByMonth()
                  }
                ]
              }}
              width={screenWidth - 30} 
              height={220}
              yAxisInterval={1} 
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 16
              }}
           />
        </View>
        <Text>Chart 2</Text>
        <View  style={styles.chartContainer}>
          <PieChart
            data={countTasksByCategory()}
            width={screenWidth - 30}
            height={220}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[5, 4]}
            absolute
          />
        </View>
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
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  pointsText: {
    color: 'grey',
    padding: 4,
    fontWeight: 'bold',
  },

  chartContainer: {
    width: '100%', 
    borderRadius: 16, 
    overflow: 'hidden', 
    marginBottom: 40,
    shadowColor: '#8B0000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
  },
});

const mapStateToProps = (state) => {
  return {
    totalPoints: state.todos.totalPoints,
    todo_list: state.todos.todo_list,
    activityLog: state.todos.activityLog
  };
};

export default connect(mapStateToProps)(Home); 
