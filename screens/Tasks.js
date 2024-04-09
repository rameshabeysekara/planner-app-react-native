import React from "react";
import ButtonIcon from "../components/ButtonIcon";
import Spacer from "../components/Spacer";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
  Alert,
  Keyboard,
  Share,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  Button,
  TextInput,
  Card,
  Paragraph,
  IconButton,
} from "react-native-paper";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { connect, useDispatch } from "react-redux";
import moment from "moment";
import {
  addTodo,
  deleteTodo,
  updateTodo,
  updateTotalPoints,
  updateStatusTodo,
  resetAllTasks,
} from "../redux/actions";

const Tasks = ({
  todo_list,
  addTodo,
  deleteTodo,
  updateTodo,
  updateStatusTodo,
  totalPoints,
  updateTotalPoints,
  priorityLevels,
  resetAllTasks,
}) => {
  const [modalFormVisible, setModalFormVisible] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [task, setTask] = React.useState("");
  const [selectedDependency, setSelectedDependency] = React.useState(null);
  const [selectedPriority, setSelectedPriority] = React.useState(0);
  const [modalEditMode, setModalEditMode] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [modalTask, setModalTask] = React.useState("");
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalUpdateVisible, setModalUpdateVisible] = React.useState(false);
  const [selectedIteration, setSelectedIteration] = React.useState(null);
  const [filterModalVisible, setFilterModalVisible] = React.useState(false);
  const [filterType, setSelectedFilterType] = React.useState(null);
  const [filteredTasks, setFilteredTasks] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [notificationTriggered, setNotificationTriggered] =
    React.useState(false);
  const [statusMap, setStatusMap] = React.useState({});
  const dispatch = useDispatch();

  const LL = moment().format("LL");
  const ddd = moment().format("ddd");
  const currentDate = `${LL} / ${ddd}`; // Apr 9, 2024 / Tue
  const stampDate = moment().format("lll"); // Apr 9, 2024 12:00 AM
  // const dateOnce = moment().add(1, 'days').calendar()

  const [countdown, setCountdown] = React.useState("");
  React.useEffect(() => {
    const interval = setInterval(() => {
      const hoursUntilEndOfDay = moment().endOf("day").diff(moment(), "hours");
      const minutesUntilEndOfDay =
        moment().endOf("day").diff(moment(), "minutes") % 60;

      if (hoursUntilEndOfDay < 0) {
        setCountdown("Your task has passed.");
      } else {
        setCountdown(
          `${hoursUntilEndOfDay} hours and ${minutesUntilEndOfDay} minutes, until the end of this tasks.`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [dailyCountdown, setDailyCountdown] = React.useState("");
  React.useEffect(() => {
    const interval = setInterval(() => {
      const endOfNextDay = moment().add(1, "days");
      const diff = endOfNextDay.diff(moment());

      if (diff < 0) {
        setDailyCountdown("End of day has passed.");
      } else {
        setDailyCountdown(endOfNextDay.calendar());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [weeklyCountdown, setweeklyCountdown] = React.useState("");
  React.useEffect(() => {
    const interval = setInterval(() => {
      const endOfWeek = moment().add(1, "week");
      const diff = endOfWeek.diff(moment());

      if (diff < 0) {
        setweeklyCountdown("End of week has passed.");
      } else {
        const countdownDescription = moment()
          .add(diff)
          .format("MMMM D, YYYY / ddd");
        setweeklyCountdown(`${countdownDescription}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [monthlyCountdown, setMonthlyCountdown] = React.useState("");
  React.useEffect(() => {
    const interval = setInterval(() => {
      const endOfMonth = moment().endOf("month").add(1, "month");
      const diff = endOfMonth.diff(moment());

      const duration = moment.duration(diff);
      const days = duration.days();
      const hours = duration.hours();

      if (diff < 0) {
        setMonthlyCountdown("End of month has passed.");
      } else {
        setMonthlyCountdown(
          `${days} days and ${hours} hours, until the end of the month.`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const availableColors = [
    { label: "Tomato", value: "#FF6347" },
    { label: "Steel Blue", value: "#4682B4" },
    { label: "Lime Green", value: "#32CD32" },
    { label: "Blue Violet", value: "#8A2BE2" },
    { label: "Orange", value: "#FFA500" },
    { label: "Royal Blue", value: "#4169E1" },
  ];

  const [selectedColor, setSelectedColor] = React.useState(null);
  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const onShare = async (item) => {
    try {
      const shareOptions = {
        message: item.task,
        subject: "Task from my planner app",
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        } else {
          console.log("Content shared successfully!");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share action dismissed");
      }
    } catch (error) {
      console.error("Error sharing content:", error.message);
      alert("Oops! Something went wrong while sharing.");
    }
  };

  const handleAddTodo = async () => {
    if (task.trim() !== "") {
      if (title.trim() !== "") {
        console.log(stampDate);
        // Call addTodo function and store the returned id
        const newTaskId = await addTodo(
          title,
          task,
          selectedIteration,
          "On going", //STATUS DEFAULT VALUE
          selectedDependency,
          selectedCategory,
          selectedColor,
          selectedPriority.value,
          stampDate
        );

        // taskReminder(newTaskId);
        setTask("");
        setTitle("");
        setSelectedIteration(null);
        setSelectedDependency(null);
        setSelectedPriority(0);
        setModalFormVisible(false);
        setSelectedCategory("");
        setSelectedColor(null);
        // setCurrentDates('')
      } else {
        // If the title is empty, prompt the user
        Alert.alert("Alert", "Do you want to add the task without a title?", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              addTodo(
                "",
                task,
                selectedIteration,
                "On going", //STATUS DEFAULT VALUE
                selectedDependency,
                selectedCategory,
                selectedPriority.value
              );
              // taskReminder("")
              setTask("");
              setTitle("");
              setSelectedIteration(null);
              setSelectedDependency(null);
              setSelectedPriority(0);
              setModalFormVisible(false);
            },
          },
        ]);
      }
    } else {
      // If both fields are empty, show an alert
      Alert.alert("Alert", "Task Name cannot be empty", [
        {
          text: "OK",
        },
      ]);
    }
  };

  const timers = {}; // Define the timers dictionary to store timers associated with tasks
  const taskReminder = (newTask) => {
    const taskId = newTask.payload.id;
    const title = newTask.payload.title;

    // Reset notificationTriggered to false
    setNotificationTriggered(false);

    // Initialize countdown variable to 60 seconds
    let countdown = 30;

    // Start a timer for the new task
    const timer = setInterval(() => {
      // Decrement the countdown
      countdown--;

      // Log the countdown value to the console
      console.log(`${title} : ${countdown}sec.`);

      // Check if 20 seconds are remaining and notification hasn't been triggered yet
      if (countdown === 15 && !notificationTriggered) {
        // Trigger the notification
        Alert.alert("Reminder", `Your task "${title}" is about to Due.`, [
          { text: "OK", onPress: () => {} },
        ]);

        // Set notificationTriggered to true to prevent multiple notifications
        // setNotificationTriggered(true)
      }

      // Check if countdown reaches 0
      if (countdown === 0) {
        // Stop the timer
        clearInterval(timer);

        handleUpdateStatusTodo(taskId, "Due");

        // Remove the timer from the timers dictionary
        delete timers[title];
      }
    }, 1000); // 1000 milliseconds = 1 second

    // Store the timer in a dictionary with task ID as key
    timers[title] = timer;
  };

  // Function to handle updating a plan/task by its ID
  const handleupdateTodo = (id) => {
    // Check if the title is not empty
    if (modalTitle.trim() !== "") {
      // If title is not empty, update the plan/task with the provided ID, title, and task
      updateTodo(
        id,
        modalTitle,
        modalTask,
        selectedDependency,
        selectedPriority.value
      );
      // Hide the update modal
      setModalUpdateVisible(false);
    } else {
      // If title is empty, prompt the user with an alert
      Alert.alert("Alert", "Do you want to update without a title?", [
        // Options to cancel or proceed without a title
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            // If the user chooses to proceed without a title, update the plan/task with an empty title and the provided task
            updateTodo(
              id,
              "",
              modalTask,
              selectedDependency,
              selectedPriority.value
            );
            // Hide the update modal
            setModalUpdateVisible(false);
          },
        },
      ]);
    }
  };

  // Function to handle the deletion of a plan/task by its ID
  // Dispatch action to delete the plan/task with the given ID
  const handleDeleteTodo = (id) => {
    // Display an alert asking for confirmation before deletion
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Deletion canceled"),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // If user confirms deletion, call deleteTodo function
            deleteTodo(id);
            console.log("Task deleted successfully");
          },
        },
      ]
    );
  };

  //get task list to the dropdown
  const generateDropdownData = (todoList) => {
    const dropdownData = todoList.map((todo) => ({
      label: todo.title || "[ No Title ]",
      value: todo.id,
    }));

    dropdownData.unshift({
      label: "No Dependency",
      value: null,
    });
    return dropdownData;
  };

  //get priority level types
  const generatePriorityLevels = () => {
    var priorityLevels = [0, 1, 2];
    const dropdownData = priorityLevels.map((level) => ({
      label: level == 2 ? "High" : level == 1 ? "Medium" : "Low",
      value: level,
    }));

    return dropdownData;
  };

  const generateCategoryDropdownData = () => {
    return [
      { label: "Work", value: "Work" },
      { label: "Personal", value: "Personal" },
      { label: "School", value: "School" },
      { label: "Fitness", value: "Fitness" },
      { label: "Health", value: "Health" },
      { label: "Family", value: "Family" },
      { label: "Finance", value: "Finance" },
      { label: "Home", value: "Home" },
      { label: "Hobbies", value: "Hobbies" },
      { label: "Travel", value: "Travel" },
      { label: "Entertainment", value: "Entertainment" },
    ];
  };

  // Function to get the corresponding icon based on the selected category
  const getIconForCategory = (category) => {
    const categoryValue = category?.value || "";
    switch (categoryValue) {
      case "Work":
        return "briefcase";
      case "Personal":
        return "street-view";
      case "School":
        return "graduation-cap";
      case "Fitness":
        return "bicycle";
      case "Health":
        return "heartbeat";
      case "Family":
        return "users";
      case "Finance":
        return "dollar";
      case "Home":
        return "building-o";
      case "Hobbies":
        return "paint-brush";
      case "Travel":
        return "plane";
      case "Entertainment":
        return "film";
      default:
        return "sticky-note";
    }
  };

  // Custom Icon Component
  const CustomIcon = ({ category, size, color }) => {
    const iconName = getIconForCategory(category);

    return (
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <Icon name={iconName} size={size} color={color} />
      </View>
    );
  };

  React.useEffect(() => {
    const loadStatusMap = async () => {
      try {
        const statusMapString = await AsyncStorage.getItem("statusMap");
        if (statusMapString !== null) {
          setStatusMap(JSON.parse(statusMapString));
        }
      } catch (error) {
        console.error("Error loading status map from AsyncStorage:", error);
      }
    };

    loadStatusMap();
  }, []);

  const handleUpdateStatusTodo = async (id, status) => {
    try {
      const currentTask = todo_list.find((task) => task.id === id);

      // Assuming statusMap is defined elsewhere
      let updatedStatusMap = { ...statusMap };

      if (status === "Done") {
        // Assuming currentTask is defined elsewhere
        const dependentTask = currentTask.dependentTaskId;

        if (dependentTask != null) {
          if (dependentTask.value != null) {
            if (statusMap.hasOwnProperty(dependentTask.value.toString())) {
              // Create a new object reference with updated statusMap
              updatedStatusMap = {
                ...statusMap,
                [id]: status,
              };

              const updatedPoints = totalPoints + 10;
              updateTotalPoints(updatedPoints);

              // Update the statusMap state
              setStatusMap(updatedStatusMap);
              setModalUpdateVisible(false);
            } else {
              //if there is a dependency and status != done
              Alert.alert(
                "Dependency Alert",
                `Completion of the task "${dependentTask.label}" is required before proceeding.`,
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setModalUpdateVisible(false);
                    },
                  },
                ]
              );
              return; // Exit early if dependency is not completed
            }
          }
        }

        // Call the updateStatusTodo function with the new status
        updateStatusTodo(id, status);

        updatedStatusMap = {
          ...statusMap,
          [id]: status,
        };

        const updatedPoints = totalPoints + 10;
        updateTotalPoints(updatedPoints);

        setModalUpdateVisible(false);
      } else {
        updateStatusTodo(id, status);

        updatedStatusMap = {
          ...statusMap,
          [id]: status,
        };
        setStatusMap(updatedStatusMap);
      }

      setStatusMap(updatedStatusMap);

      if (status !== "Due") {
        Alert.alert(
          "Whoops 🥳",
          `Task "${currentTask.title}" completed! You get 10 points 🎉`,
          [
            {
              text: "OK",
            },
          ]
        );
      }

      // Save the updated statusMap to AsyncStorage
      await AsyncStorage.setItem("statusMap", JSON.stringify(updatedStatusMap));
    } catch (error) {
      console.error("Error updating task status:", error);
      console.error("Error stack trace:", error.stack); // Log the stack trace for more detailed information
    }
  }; // END OF handleUpdateStatusTodo * * * * * * * * * * *

  // Function to open the modal for updating a selected plan/task
  const openModal = (item) => {
    // Set the selected item to the one passed as parameter
    setSelectedItem(item);
    // Set the modal task to the task of the selected item
    setModalTask(item.task);
    // Set the modal title to the title of the selected item
    setModalTitle(item.title);
    // Set the modal dependency to the dependency ID of the selected item
    setSelectedDependency(item.dependencyId);
    // Set the priority level of the task
    setSelectedPriority(item.priority);
    // Set the visibility of the update modal to true, thus opening the modal
    setModalUpdateVisible(true);
    // Set the mode of the modal
    setModalEditMode(true);
  };

  // Function for Selected Iterations
  const handlePress = (option) => {
    // setSelectedIteration(option)

    if (option == "Once") {
      console.log("Current Date : ", stampDate);
      setSelectedIteration(countdown);
    }

    if (option == "Daily") {
      console.log("Current Date : ", stampDate);
      setSelectedIteration(dailyCountdown);
    }

    if (option == "Weekly") {
      console.log("Current Date : ", stampDate);
      setSelectedIteration(weeklyCountdown);
    }

    if (option == "Monthly") {
      console.log("Current Date : ", stampDate);
      setSelectedIteration(monthlyCountdown);
    }

    Keyboard.dismiss();
  };

  const filterClicked = () => {
    const filtered = todo_list.filter((task) => {
      const status = statusMap[task.id] || "On going";
      return status === _.get(filterType, "value");
    });
    setFilteredTasks(filtered);
    setFilterModalVisible(false);
  };

  const resetFilter = () => {
    setFilteredTasks([]);
    setFilterModalVisible(false);
  };

  // SPRINT 04 | Allow user delete all tasks - app reset (user data) #9
  // TO DO by RONALD
  const handleResetTasks = () => {
    Alert.alert("Confirm Reset", "This is to deleted all of your tasks.", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => console.log("Reset canceled"),
      },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          dispatch(resetAllTasks()); // Dispatch the resetAllTasks action
          console.log("Reset Tasks Press : ", stampDate);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Spacer />
        <View style={[styles.flatList]}>
          {/* SPRINT 04 */}
          <View style={styles.resetTaskAlign}>
            <View style={{ flexDirection: "row", paddingLeft: 12 }}>
              <Icon name="calendar" size={15} color="gray" />
              {/* <MaterialCommunityIcons name="stamper" size={15} color="gray" /> */}
              <Text
                style={{
                  fontSize: 15,
                  alignSelf: "center",
                  paddingLeft: 3,
                  color: "gray",
                }}
              >
                {/* Display Month date year and day */}
                {currentDate}
              </Text>
            </View>
            <Pressable onPress={handleResetTasks}>
              <Text style={styles.resetTasks}>Reset Tasks</Text>
            </Pressable>
          </View>

          <FlatList
            data={filteredTasks.length > 0 ? filteredTasks : todo_list}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const status = statusMap[item.id] || "On going";

              const cardTitle = (
                <>
                  <Text
                    style={{ color: "black", fontWeight: "bold", fontSize: 20 }}
                  >
                    {item.title || "[ No Title ]"}{" "}
                  </Text>
                  <View style={styles.priorityCard}>
                    {item.priority == 2 ? (
                      <MaterialCommunityIcons
                        name="chevron-triple-up"
                        size={15}
                        color="white"
                      />
                    ) : item.priority == 1 ? (
                      <MaterialCommunityIcons
                        name="chevron-double-up"
                        size={15}
                        color="white"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="chevron-up"
                        size={15}
                        color="white"
                      />
                    )}
                  </View>
                </>
              );

              const statusColor =
                status === "Done" ? "green" : status === "Due" ? "red" : "gray";

              const cardSubTitle = (
                <Text style={{ color: statusColor, fontSize: 15 }}>
                  {status}{" "}
                  {status === "On going" ? (
                    <Icon name="hourglass-2" size={12} color={statusColor} />
                  ) : status === "Due" ? (
                    <Icon
                      name="calendar-times-o"
                      size={17}
                      color={statusColor}
                    />
                  ) : (
                    <Icon
                      name="calendar-check-o"
                      size={17}
                      color={statusColor}
                    />
                  )}
                </Text>
              );

              const dateCreated = (
                <Text style={{ fontSize: 12, color: "gray" }}>
                  {item.dateCreated}
                </Text>
              );

              const dependentOn = (
                <Paragraph
                  style={{ marginTop: 10, color: "tomato", fontSize: 12 }}
                >
                  <Octicons name="workflow" size={15} color="grey" />{" "}
                  {item.dependentTaskId != null
                    ? item.dependentTaskId.label
                    : "No Dependency"}
                </Paragraph>
              );

              const period = item.iteration || "No Iteration";

              const pointsLabel = (
                <View style={styles.pointsContainer}>
                  <View style={styles.pointsCard}>
                    <Icon
                      name="trophy"
                      size={20}
                      color="tomato"
                      style={{ padding: 3 }}
                    />
                    <Text style={styles.pointsText}>{item.points || 0}</Text>
                  </View>
                </View>
              );

              return (
                <>
                  <Pressable key={item.id} onPress={() => openModal(item)}>
                    <Card
                      style={{
                        width: 365,
                        marginTop: 6,
                        borderColor: item.color?.value,
                        borderWidth: 2,
                      }}
                    >
                      <Card.Title
                        title={<>{cardTitle}</>}
                        // subtitle={<>{cardSubTitle}</>}
                        subtitle={dateCreated}
                        left={(props) => (
                          <CustomIcon
                            category={item.category}
                            size={31}
                            color={statusColor}
                          />
                        )}
                        right={(props) => (
                          <View style={{ flexDirection: "row" }}>
                            <IconButton
                              icon="share"
                              onPress={() => onShare(item)}
                            />

                            <ButtonIcon
                              iconName="close"
                              color="tomato"
                              onPress={() => handleDeleteTodo(item.id)}
                            />
                          </View>
                        )}
                      />

                      <Card.Content>
                        <Paragraph style={{ paddingTop: 5, paddingBottom: 5 }}>
                          {item.task}
                        </Paragraph>
                        <View
                          style={{
                            flexDirection: "column",
                            justifyContent: "start",
                            gap: -5,
                          }}
                        >
                          <View>{dependentOn}</View>
                          <View>
                            <Text
                              style={{
                                marginTop: 12,
                                color: "tomato",
                                fontSize: 12,
                              }}
                            >
                              <Octicons
                                name="iterations"
                                size={15}
                                color="grey"
                              />{" "}
                              {period}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={{
                            position: "absolute",
                            bottom: -35,
                            left: 15,
                            color: "gray",
                            fontSize: 12,
                          }}
                        >
                          Tap to edit{" "}
                          <Icon name="pencil" size={12} color="gray" />
                        </Text>
                      </Card.Content>
                      {/* display points */}
                      <Card.Actions
                        style={{
                          justifyContent: "flex-end",
                          paddingRight: 10,
                          paddingBottom: 10,
                        }}
                      >
                        {pointsLabel}
                      </Card.Actions>
                    </Card>
                  </Pressable>
                </>
              );
            }}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          labelStyle={{ fontWeight: "bold", color: "white" }}
          style={{ backgroundColor: "tomato" }}
          onPress={() => {
            setModalFormVisible(true);
            setModalEditMode(false);
            setTitle("");
            setTask("");
            setSelectedDependency(null);
            setSelectedPriority(0);
          }}
        >
          Create a Task
        </Button>
        <Button
          icon="filter"
          mode="contained"
          onPress={() => setFilterModalVisible(true)}
          style={{ marginLeft: 10 }}
        >
          Filter
        </Button>
      </View>

      {/* Modal for filter tasks */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.filterModalView}>
            <View style={{ flexDirection: "row", marginBottom: 30 }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text
                  style={[
                    styles.modalTitle,
                    { paddingLeft: 10, paddingTop: 3 },
                  ]}
                >
                  Filter by status
                </Text>
              </View>
              <View>
                <Pressable
                  onPress={() => setFilterModalVisible(!filterModalVisible)}
                >
                  <Icon name="close" size={24} color="red" />
                </Pressable>
              </View>
            </View>
            <View style={{ paddingBottom: 10 }}>
              <Dropdown
                style={styles.dropdown}
                label="No Dependency"
                data={[
                  { label: "On going", value: "On going" },
                  { label: "Done", value: "Done" },
                  { label: "Due", value: "Due" },
                ]}
                value={filterType}
                labelField="label"
                valueField="value"
                onChange={(value) => setSelectedFilterType(value)}
              />
            </View>
            <View style={styles.filterButtonsContainer}>
              <Button onPress={resetFilter}>Reset Filter</Button>
              <Button
                mode="contained"
                style={{ marginLeft: 10 }}
                onPress={filterClicked}
                disabled={filterType == null}
              >
                Filter
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal form for creating and updating tasks */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalFormVisible || modalUpdateVisible}
        onRequestClose={() => {
          setModalFormVisible(false);
          setModalUpdateVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <CustomIcon name="sticky-note" size={25} color={"tomato"} />
                <Text
                  style={[
                    styles.modalTitle,
                    { paddingLeft: 10, paddingTop: 3 },
                  ]}
                >
                  {modalEditMode ? "Update Task" : "New Task"}
                </Text>
              </View>

              <View>
                <Pressable
                  onPress={() => {
                    setModalFormVisible(false), setModalUpdateVisible(false);
                  }}
                >
                  <Icon name="close" size={24} color="red" />
                </Pressable>
              </View>
            </View>
            <View>
              <View>
                <TextInput
                  style={styles.txtInput}
                  label="Title"
                  value={modalEditMode ? modalTitle : title}
                  onChangeText={(text) =>
                    modalEditMode ? setModalTitle(text) : setTitle(text)
                  }
                />
                <TextInput
                  style={styles.txtInput}
                  label="Task"
                  value={modalEditMode ? modalTask : task}
                  onChangeText={(text) =>
                    modalEditMode ? setModalTask(text) : setTask(text)
                  }
                />
              </View>
              {!modalEditMode && (
                <View>
                  <Text style={styles.label}>Select Category</Text>
                  <Dropdown
                    style={styles.dropdown}
                    label="Task Category"
                    data={generateCategoryDropdownData()}
                    value={selectedCategory}
                    search
                    labelField="label"
                    valueField="value"
                    placeholder="Task Category"
                    searchPlaceholder="Search..."
                    onChange={(value) => setSelectedCategory(value)}
                  />

                  <Text style={styles.label}>Select Dependency</Text>
                  <Dropdown
                    style={styles.dropdown}
                    label="No Dependency"
                    data={generateDropdownData(todo_list ?? [])}
                    value={selectedDependency}
                    search
                    labelField="label"
                    valueField="value"
                    placeholder="Select Dependency"
                    searchPlaceholder="Search..."
                    onChange={(value) => setSelectedDependency(value)}
                  />

                  <Text style={styles.label}>Select Priority Level</Text>
                  <Dropdown
                    style={styles.dropdown}
                    label="Low"
                    data={generatePriorityLevels()}
                    value={selectedPriority}
                    search
                    labelField="label"
                    valueField="value"
                    placeholder="Select a Priority Level"
                    searchPlaceholder="Search..."
                    onChange={(value) => setSelectedPriority(value)}
                  />

                  <Text style={styles.label}>Select Color</Text>
                  <Dropdown
                    style={styles.dropdown}
                    label="Select Color"
                    data={availableColors}
                    value={selectedColor}
                    search
                    labelField="label"
                    valueField="value"
                    placeholder="Select a Color"
                    searchPlaceholder="Search..."
                    onChange={(color) => handleColorSelection(color)}
                    maxHeight={180}
                  />
                  <Text style={styles.label}>Select Iteration</Text>
                  <View style={{ flexDirection: "row" }}>
                    {/* ONCE */}
                    <Pressable
                      style={({ pressed }) => [
                        styles.iterationPress,
                        selectedIteration === countdown
                          ? styles.selected
                          : null,
                        {
                          backgroundColor: pressed
                            ? "lightcoral"
                            : selectedIteration === countdown
                              ? "tomato"
                              : "lightgray",
                        },
                      ]}
                      onPress={() => handlePress("Once")}
                    >
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        Once
                      </Text>
                    </Pressable>
                    {/* DAILY */}
                    <Pressable
                      style={({ pressed }) => [
                        styles.iterationPress,
                        selectedIteration === dailyCountdown
                          ? styles.selected
                          : null,
                        {
                          backgroundColor: pressed
                            ? "lightcoral"
                            : selectedIteration === dailyCountdown
                              ? "tomato"
                              : "lightgray",
                        },
                      ]}
                      onPress={() => handlePress("Daily")}
                    >
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        Daily
                      </Text>
                    </Pressable>
                    {/* WEEKLY */}
                    <Pressable
                      style={({ pressed }) => [
                        styles.iterationPress,
                        selectedIteration === weeklyCountdown
                          ? styles.selected
                          : null,
                        {
                          backgroundColor: pressed
                            ? "lightcoral"
                            : selectedIteration === weeklyCountdown
                              ? "tomato"
                              : "lightgray",
                        },
                      ]}
                      onPress={() => handlePress("Weekly")}
                    >
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        Weekly
                      </Text>
                    </Pressable>
                    {/* MONTHLY */}
                    <Pressable
                      style={({ pressed }) => [
                        styles.iterationPress,
                        selectedIteration === monthlyCountdown
                          ? styles.selected
                          : null,
                        {
                          backgroundColor: pressed
                            ? "lightcoral"
                            : selectedIteration === monthlyCountdown
                              ? "tomato"
                              : "lightgray",
                        },
                      ]}
                      onPress={() => handlePress("Monthly")}
                    >
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        Monthly
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.separator}></View>
            <View style={{ flexDirection: "row" }}>
              {modalEditMode && (
                <View style={{ flex: 1 }}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      handleUpdateStatusTodo(selectedItem.id, "Done");
                    }}
                    disabled={statusMap[selectedItem.id] === "Done"}
                  >
                    <Text> Done Task </Text>
                  </Button>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Button
                  style={{ alignSelf: "center" }}
                  icon={modalEditMode ? "note" : "note-plus"}
                  onPress={() =>
                    modalEditMode
                      ? handleupdateTodo(selectedItem.id)
                      : handleAddTodo()
                  }
                >
                  {modalEditMode ? "Update Task" : "Save Task"}
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    paddingBottom: Constants.statusBarHeight,
  },
  separator: {
    height: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: "tomato",
    marginTop: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 15,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  filterModalView: {
    margin: 15,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    // marginBottom: 5
  },
  txtInput: {
    width: 300,
    margin: 5,
  },
  iterationPress: {
    padding: 7,
    margin: 3,
    width: 71,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  filterButtonsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    paddingTop: 20,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 5,
  },
  pointsCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 4,
    marginRight: 5,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pointsText: {
    color: "grey",
    padding: 4,
    fontWeight: "bold",
  },

  priorityCard: {
    backgroundColor: "tomato",
    borderRadius: 10,
    minWidth: 10,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  priorityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  // SPRINT 04
  resetTaskAlign: {
    width: 366,
    paddingRight: 15,
    justifyContent: "space-between",
    flexDirection: "row",
    // backgroundColor : 'gray',
  },
  resetTasks: {
    alignSelf: "flex-end",
    color: "red",
    fontSize: 18,
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    todo_list: state.todos.todo_list,
    totalPoints: state.todos.totalPoints,
  };
};

const mapDispatchToProps = {
  addTodo,
  deleteTodo,
  updateTodo,
  updateStatusTodo,
  updateTotalPoints,
  resetAllTasks,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
