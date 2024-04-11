import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView, Dimensions, ScrollView, Animated } from "react-native";
import { FontAwesome as Icon } from '@expo/vector-icons';
import { connect } from 'react-redux'; 
import {
  LineChart,
  PieChart,
  BarChart
} from "react-native-chart-kit";

const Home = ({ totalPoints, todo_list, activityLog }) => {
  const [points, setPoints] = useState(0); 
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const [fadeAnim] = useState(new Animated.Value(1));


  const motivationalMessages = [
    "Ready to conquer your day? Let's conquer those tasks and make waves of accomplishment!",
    "Every task completed is a step closer to your dreams. Let's make today count!",
    "Embrace the power of progress. One task at a time, you're unstoppable!",
    "Unlock your potential and achieve greatness. Your to-do list is your roadmap to success!",
    "Today is full of possibilities. Let's tackle those tasks and make magic happen!",
    "You've got this! With determination and focus, your to-dos are mere stepping stones to victory!",
    "Seize the day and make it yours! Your to-do list is your ally on the journey to excellence!",
    "Rise and shine, it's time to thrive! Let's conquer those tasks and make waves of accomplishment!",
    "Small steps lead to big victories. Keep pushing forward and watch your dreams unfold!",
    "Embrace the challenge and celebrate the progress. You're one step closer to greatness!"
  ];

  useEffect(() => {
    setPoints(totalPoints);
  }, [totalPoints]);

  useEffect(() => {
    // Start the animation loop
    const interval = setInterval(() => {
      animateOut(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % motivationalMessages.length);
        animateIn();
      });
    }, 5000); // Change message every 5 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  const animateIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = (callback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(callback);
  };

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

  const countTasksByDay = () => {
    const today = new Date();
    const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        days.push(date);
      }

      const taskCountByDay = days.map(date => {
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
        const count = activityLog.filter(log => log.status === "Done" && isSameDay(new Date(log.timestamp), date)).length * 10;
        return { date: formattedDate, count };
      });

      return taskCountByDay;
    };

    const isSameDay = (date1, date2) => {
      return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    const countTasksByCategory = () => {
      let personalCount = 0;
      let workCount = 0;
      let schoolCount = 0;
      let fitnessCount = 0;
      let healthCount = 0;
      let familyCount = 0;
      let financeCount = 0;
      let homeCount = 0;
      let hobbiesCount = 0;
      let travelCount = 0;
      let entertainmentCount = 0;
      let otherCount = 0;
    
      todo_list.forEach(task => {
          switch(task.category && task.category.value) {
              case 'Personal':
                  personalCount++;
                  break;
              case 'Work':
                  workCount++;
                  break;
              case 'School':
                  schoolCount++;
                  break;
              case 'Fitness':
                  fitnessCount++;
                  break;
              case 'Health':
                  healthCount++;
                  break;
              case 'Family':
                  familyCount++;
                  break;
              case 'Finance':
                  financeCount++;
                  break;
              case 'Home':
                  homeCount++;
                  break;
              case 'Hobbies':
                  hobbiesCount++;
                  break;
              case 'Travel':
                  travelCount++;
                  break;
              case 'Entertainment':
                  entertainmentCount++;
                  break;
              default:
                  otherCount++;
                  break;
          }
      });
    
      const data = [
          {
              name: "Personal",
              population: personalCount,
              color: "rgba(255, 87, 51, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          },
          {
              name: "Work",
              population: workCount,
              color: "rgba(255, 195, 0, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          },
          {
              name: "School",
              population: schoolCount,
              color: "rgba(54, 162, 235, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          },
          {
              name: "Fitness",
              population: fitnessCount,
              color: "rgba(76, 175, 80, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          },
          {
              name: "Health",
              population: healthCount,
              color: "rgba(156, 39, 176, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          },
          {
              name: "Family",
              population: familyCount,
              color: "rgba(255, 64, 129, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          },
          {
              name: "Finance",
              population: financeCount,
              color: "rgba(100, 169, 244, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          },
          {
              name: "Home",
              population: homeCount,
              color: "rgba(255, 87, 34, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          },
          {
              name: "Hobbies",
              population: hobbiesCount,
              color: "rgba(121, 85, 72, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          },
          {
              name: "Travel",
              population: travelCount,
              color: "rgba(0, 188, 102, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          },
          {
              name: "Entertainment",
              population: entertainmentCount,
              color: "rgba(1, 158, 18, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          },
          {
              name: "Others",
              population: otherCount,
              color: "rgba(128, 128, 128, 0.8)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 10
          }
      ];
    
      return data;
    };    


  const handleScroll = (event) => {
    const currentScrollPosition = event.nativeEvent.contentOffset.y;
    setScrollPosition(currentScrollPosition);
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}> 
          <Text style={styles.greeting}>Hello!</Text>
          <View style={styles.pointsContainer}>
              <View style={styles.pointsCard}>
                <Icon name="trophy" size={20} color="tomato" style={{ padding: 3 }} />
                <Text style={styles.pointsText}>{ points || 0}</Text>
              </View>
          </View>
          <View style={styles.header}>
            <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
              <Text style={styles.messageText}>{motivationalMessages[currentMessageIndex]}</Text>
            </Animated.View>
          </View>
        </View>

      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <View style={styles.bottomContainer}>
          <Text style={styles.chartTitle}>Number of Points Collected (Last 7 Days)</Text>
          <View style={styles.chartContainer}>
            <LineChart
                data={{
                  labels: countTasksByDay().map(entry => entry.date),
                  datasets: [
                    {
                      data: countTasksByDay().map(entry => entry.count)
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
          <Text style={styles.chartTitle}>Task Categories</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={countTasksByCategory()}
              width={screenWidth - 30}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[5, 4]}
              absolute
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    justifyContent: "flex-start", 
    alignItems: "flex-start", 
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  header: {
    alignItems: "flex-start",
    alignSelf: 'flex-start', 
  },
  greeting: {
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 8,
    textAlign: 'left', 
    color: "#FF6347"
  },
  motivationalMessage: {
    fontSize: 16,
    color: "#555",
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    paddingBottom: 5,
    justifyContent: 'flex-end', 
    flex: 1, 
  },
  pointsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 4,
    marginLeft: 'auto', 
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
  chartTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 10,
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
