
import React from "react"
import ButtonIcon from "../components/ButtonIcon"
import Spacer from "../components/Spacer"
import Constants from "expo-constants"
import _ from "lodash"
import {
  Text,
  View,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
  Alert,
} from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import { Button, TextInput, Card, Paragraph } from "react-native-paper"
import { FontAwesome as Icon } from "@expo/vector-icons"
import { connect } from "react-redux"
import { addTodo, deleteTodo, updateTodo, updateTotalPoints, updateStatusTodo } from "../redux/actions"


const Tasks = ({ todo_list, addTodo, deleteTodo, updateTodo, totalPoints, updateTotalPoints, updateStatusTodo }) => {
  const [modalFormVisible, setModalFormVisible] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [task, setTask] = React.useState("")
  const [selectedDependency, setSelectedDependency] = React.useState(null)
  const [modalEditMode, setModalEditMode] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState(null)
  const [modalTask, setModalTask] = React.useState("")
  const [modalTitle, setModalTitle] = React.useState("")
  const [modalUpdateVisible, setModalUpdateVisible] = React.useState(false)
  const [selectedIteration, setSelectedIteration] = React.useState(null)
  const [filterModalVisible, setFilterModalVisible] = React.useState(false)
  const [filterType, setSelectedFilterType] = React.useState("On going")
  const [filteredTasks, setFilteredTasks] = React.useState([])
  const [selectedCategory, setSelectedCategory] = React.useState("")
  const [statusTodo, setStatusTodo] = React.useState("")

  /**
   * Handles the addition of a new todo item.
   * Validates if the task and title are not empty.
   * If title is empty, prompts the user to confirm adding the task without a title.
   * If both title and task are empty, alerts the user.
   */
  const handleAddTodo = () => {
    if (task.trim() !== "") {
      if (title.trim() !== "") {
        // Add todo with provided details
        addTodo(
          title,
          task,
          selectedIteration,
          "On going",
          selectedDependency,
          selectedCategory,
        )
        // Reset fields and hide modal form
        setTask("")
        setTitle("")
        setSelectedIteration(null)
        setSelectedDependency(null)
        setModalFormVisible(false)
        setSelectedCategory("")
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
              // Add todo with empty title
              addTodo(
                "",
                task,
                selectedIteration,
                "On going",
                selectedDependency,
                selectedCategory
              )
              // Reset fields and hide modal form
              setTask("")
              setTitle("")
              setSelectedIteration(null)
              setSelectedDependency(null)
              setModalFormVisible(false)
            },
          },
        ])
      }
    } else {
      // If both fields are empty, show an alert
      Alert.alert("Alert", "You have not entered a Task.", [
        // {
        //   text: "Cancel",
        //   style: "cancel",
        // },
        {
          text: "OK",
          // onPress: () => {
          //   // Add todo with empty title
          //   addTodo(
          //     "",
          //     task,
          //     selectedIteration,
          //     statusTodo,
          //     selectedDependency,
          //     selectedCategory
          //   )
          //   // Reset fields and hide modal form
          //   setTask("")
          //   setTitle("")
          //   setSelectedDependency(null)
          //   setModalFormVisible(false)
          // },
        },
      ])
      return
    }
  } // END OF handleAddTodo * * * * * * * * * * *


  // Function to handle updating a plan/task by its ID
  const handleupdateTodo = (id) => {
    // Check if the title is not empty
    if (modalTitle.trim() !== "") {
      // If title is not empty, update the plan/task with the provided ID, title, and task
      updateTodo(id, modalTitle, modalTask, selectedDependency)
      // Hide the update modal
      setModalUpdateVisible(false)
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
            updateTodo(id, "", modalTask, selectedDependency)
            // Hide the update modal
            setModalUpdateVisible(false)
          },
        },
      ])
    }
  } // END OF handleupdateTodo * * * * * * * * * * * * *


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
            deleteTodo(id)
            console.log("Task deleted successfully")
          },
        },
      ]
    )
  } // END OF handleDeleteTodo * * * * * * * * * * *


  const [statusMap, setStatusMap] = React.useState({})
  const handleUpdateStatusTodo = (id, status) => {

    try {
      const currentTask = todo_list.find((task) => task.id === id)
      // Assuming statusMap is defined elsewhere
      let updatedStatusMap = { ...statusMap }
      if (status === "Done") {
        // Assuming currentTask is defined elsewhere
        const dependentTask = currentTask.dependentTaskId
        // if (dependentTask != null && dependentTask.value != null) {
        if (dependentTask != null) {
          if (dependentTask.value != null) {
            if (statusMap.hasOwnProperty(dependentTask.value.toString())) {

              // Create a new object reference with updated statusMap
              updatedStatusMap = {
                ...statusMap,
                [id]: status,
              }

              const updatedPoints = totalPoints + 10
              updateTotalPoints(updatedPoints)

              // Update the statusMap state
              setStatusMap(updatedStatusMap)
              setModalUpdateVisible(false)

            } else {
              //if there is a dependency and status != done
              Alert.alert("Alert", "The primary task must be completed first.", [
                {
                  text: "OK",
                  onPress: () => {
                    setModalUpdateVisible(false)
                  },
                },
              ])
              return // Exit early if dependency is not completed
            }
          }

        }
        // Call the updateStatusTodo function with the new status
        updateStatusTodo(id, status)

        updatedStatusMap = {
          ...statusMap,
          [id]: status,
        }

        const updatedPoints = totalPoints + 10
        updateTotalPoints(updatedPoints)

        setModalUpdateVisible(false)
      } else {
        updatedStatusMap = {
          ...statusMap,
          [id]: "Due",
        }
      }

      const updatedPoints = totalPoints > 10 ? totalPoints - 10 : 0
      updateTotalPoints(updatedPoints)

      setStatusMap(updatedStatusMap)
    } catch (error) {
      console.error("Error updating task status:", error)
    }

  } // END OF handleUpdateStatusTodo * * * * * * * * * * *


  //get task list to the dropdown
  const generateDropdownData = (todoList) => {
    const dropdownData = todoList.map((todo) => ({
      label: todo.title || "[ No Title ]",
      value: todo.id,
    }))

    dropdownData.unshift({
      label: "No Dependency",
      value: null,
    })
    return dropdownData
  } // END OF generateDropdownData * * * * * * * * * * *


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
    ]
  } // END OF generateCategoryDropdownData * * * * * * * * * * *


  // Function to get the corresponding icon based on the selected category
  const getIconForCategory = (category) => {
    const categoryValue = category?.value || ""
    switch (categoryValue) {
      case "Work":
        return "briefcase"
      case "Personal":
        return "street-view"
      case "School":
        return "graduation-cap"
      case "Fitness":
        return "bicycle"
      case "Health":
        return "heartbeat"
      case "Family":
        return "users"
      case "Finance":
        return "dollar"
      case "Home":
        return "building-o"
      case "Hobbies":
        return "paint-brush"
      case "Travel":
        return "plane"
      case "Entertainment":
        return "film"
      default:
        return "sticky-note"
    }
  } // END OF getIconForCategory * * * * * * * * * * *


  // Custom Icon Component
  const CustomIcon = ({ category, size, color }) => {
    const iconName = getIconForCategory(category)

    return (
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <Icon name={iconName} size={size} color={color} />
      </View>
    )
  } // END OF CustomIcon * * * * * * * * * * *


  // Function to open the modal for updating a selected plan/task
  const openModal = (item) => {
    // Set the selected item to the one passed as parameter
    setSelectedItem(item)
    // Set the modal task to the task of the selected item
    setModalTask(item.task)
    // Set the modal title to the title of the selected item
    setModalTitle(item.title)
    // Set the modal dependency to the dependency ID of the selected item
    setSelectedDependency(item.dependencyId)
    // Set the visibility of the update modal to true, thus opening the modal
    setModalUpdateVisible(true)
    // Set the mode of the modal
    setModalEditMode(true)
  } // END OF openModal * * * * * * * * * * *


  // Function for Selected Iterations
  const handlePress = (option) => {
    setSelectedIteration(option)
    console.log("User selected iteration : ", option)
  } // END OF handlePress * * * * * * * * * * *


  const filterClicked = () => {
    const filtered = todo_list.filter((task) => {
      const status = statusMap[task.id] || "On going"
      return status === _.get(filterType, "value")
    })
    setFilteredTasks(filtered)
  } // END OF filterClicked * * * * * * * * * * *


  const resetFilter = () => {
    setFilteredTasks([])
  } // END OF filterClicked * * * * * * * * * * *


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Spacer />
        <View style={[styles.flatList]}>
          <FlatList
            data={filteredTasks.length > 0 ? filteredTasks : todo_list}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const status = item.status
              const cardTitle = (
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }} >
                  {" "} {item.title || "[ No Title ]"}
                </Text>
              )
              const cardSubTitleColor = status === "Done" ? "green" : "gray"
              const cardSubTitle = (
                <Text style={{ color: cardSubTitleColor, fontSize: 15 }}>
                  Status : {status}{" "}
                  {status === "On going" ? (
                    <Icon name="hourglass-2" size={12} color={iconColor} />
                  ) : (
                    <Icon name="calendar-check-o" size={17} color={iconColor} />
                  )}
                </Text>
              )
              const iconColor = status === "Done" ? "green" : "gray"
              const dependentOn = (
                <Paragraph style={{ marginTop: 10, color: "tomato", fontSize: 12 }} >
                  {/* To Do = Imasha */}
                  Dependent on :{" "}
                  {item.dependentTaskId != null ? item.dependentTaskId.label : "None"}
                </Paragraph>
              )

              const period = item.iteration || "No Iteration Selected"

              const pointsLabel = (
                <View style={styles.pointsContainer}>
                  <View style={styles.pointsCard}>
                    <Icon name="trophy" size={20} color="tomato" style={{ padding: 3 }} />
                    <Text style={styles.pointsText}>{item.points || 0}</Text>
                  </View>
                </View>
              )

              return (
                <>
                  <Pressable key={item.id} onPress={() => openModal(item)}>
                    <Card style={{ width: 365, marginTop: 12, margin: 6 }}>
                      <Card.Title title={<>{cardTitle}</>} subtitle={<>{cardSubTitle}</>} left={(props) => (
                        <CustomIcon category={item.category} size={30} color={iconColor} />
                      )}
                        right={(props) => (
                          <ButtonIcon iconName="close" color="red" onPress={() => handleDeleteTodo(item.id)} />
                        )} />
                      <Card.Content>
                        <Paragraph style={{ paddingTop: 5, paddingBottom: 5 }}>
                          {item.task}
                        </Paragraph>
                        <View style={{ flexDirection: "column", justifyContent: "start",  }} >
                          {/* {dependentOn} */}
                          <View>{dependentOn}</View>
                          <View>
                            <Text style={{ color: "tomato", fontSize: 12, }} >
                              Iteration : {period}
                            </Text>
                          </View>
                        </View>

                        <Text style={{ position: "absolute", bottom: -35, left: 15, color: "gray", fontSize: 10, }} >
                          Tap to edit{" "}
                          <Icon name="pencil" size={12} color="gray" />
                        </Text>
                      </Card.Content>
                      {/* display points */}
                      <Card.Actions style={{ justifyContent: "flex-end", paddingRight: 10, paddingBottom: 10, }} >
                        {pointsLabel}
                      </Card.Actions>
                    </Card>
                  </Pressable>
                </>
              )
            }}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button labelStyle={{ fontWeight: "bold", color: "white" }} style={{ backgroundColor: "tomato" }} onPress={() => {
            setModalFormVisible(true)
            setModalEditMode(false)
            setTitle("")
            setTask("")
            setSelectedDependency(null)
          }}
        >
          Create a Task
        </Button>
        <Button icon="filter" mode="contained" style={{ marginLeft: 10 }} onPress={() => setFilterModalVisible(true)} >
          Filter
        </Button>
      </View>

      {/* Modal for filter tasks */}
      <Modal animationType="slide" transparent={true} visible={filterModalVisible} >
        <View style={styles.centeredView}>
          <View style={styles.filterModalView}>
            <View style={{ flexDirection: "row", marginBottom: 30 }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text style={[ styles.modalTitle, { paddingLeft: 10, paddingTop: 3 }, ]} >
                  Filter by status
                </Text>
              </View>
              <View>
                <Pressable onPress={() => setFilterModalVisible(!filterModalVisible)} >
                  <Icon name="close" size={24} color="red" />
                </Pressable>
              </View>
            </View>
            <View style={{ paddingBottom: 10 }}>
              <Dropdown style={styles.dropdown} label="No Dependency"
                data={[
                  { label: "On going", value: "On going" },
                  { label: "Done", value: "Done" },
                ]}
                value={filterType}
                labelField="label"
                valueField="value"
                onChange={(value) => setSelectedFilterType(value)} />
            </View>
            <View style={styles.filterButtonsContainer}>
              <Button onPress={resetFilter}>
                Reset Filter
              </Button>
              <Button mode="contained" style={{ marginLeft: 10 }} onPress={filterClicked} >
                Filter
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal form for creating and updating tasks */}
      <Modal animationType="fade" transparent={true} visible={modalFormVisible || modalUpdateVisible}
        onRequestClose={() => {
          setModalFormVisible(false)
          setModalUpdateVisible(false)
        }} >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <CustomIcon name="sticky-note" size={23} color={"tomato"} />
                <Text style={[ styles.modalTitle, { paddingLeft: 10, paddingTop: 3 }, ]} >
                  {modalEditMode ? "Update Task" : "New Task"}
                </Text>
              </View>

              <View>
                <Pressable onPress={() => { setModalFormVisible(false), setModalUpdateVisible(false) }} >
                  <Icon name="close" size={24} color="red" />
                </Pressable>
              </View>
            </View>
            <View>
              <View>
                <TextInput style={styles.txtInput} label="Title" value={modalEditMode ? modalTitle : title}
                 onChangeText={(text) => modalEditMode ? setModalTitle(text) : setTitle(text) } />
                <TextInput style={styles.txtInput} label="Task" value={modalEditMode ? modalTask : task}
                  onChangeText={(text) => modalEditMode ? setModalTask(text) : setTask(text) } />
              </View>
              {!modalEditMode && (
                <View>
                  <View style={styles.separator}></View>
                  <Text style={styles.label}>Select Iteration</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Pressable style={({ pressed }) => [styles.iterationPress,
                        selectedIteration === "Once" ? styles.selected : null,
                        {
                          backgroundColor: pressed
                            ? "lightcoral"
                            : selectedIteration === "Once"
                              ? "tomato"
                              : "lightgray",
                        },
                      ]}
                      onPress={() => handlePress("Once")} >
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        Once
                      </Text>
                    </Pressable>

                    <Pressable style={({ pressed }) => [styles.iterationPress,
                        selectedIteration === "Daily" ? styles.selected : null,
                        {
                          backgroundColor: pressed
                            ? "lightcoral"
                            : selectedIteration === "Daily"
                              ? "tomato"
                              : "lightgray",
                        },
                      ]}
                      onPress={() => handlePress("Daily")} >
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        Daily
                      </Text>
                    </Pressable>

                    <Pressable style={({ pressed }) => [styles.iterationPress,
                        selectedIteration === "Weekly" ? styles.selected : null,
                        {
                          backgroundColor: pressed
                            ? "lightcoral"
                            : selectedIteration === "Weekly"
                              ? "tomato"
                              : "lightgray",
                        },
                      ]}
                      onPress={() => handlePress("Weekly")} >
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        Weekly
                      </Text>
                    </Pressable>

                    <Pressable style={({ pressed }) => [ styles.iterationPress,
                        selectedIteration === "Monthly"
                          ? styles.selected
                          : null,
                        {
                          backgroundColor: pressed
                            ? "lightcoral"
                            : selectedIteration === "Monthly"
                              ? "tomato"
                              : "lightgray",
                        },
                      ]} onPress={() => handlePress("Monthly")} >
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        Monthly
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.separator}></View>
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

                  <View style={styles.separator}></View>
                  <Text style={styles.label}>Select Dependency</Text>
                  <Dropdown
                    style={styles.dropdown}
                    label="No Dependency"
                    data={generateDropdownData(todo_list ?? [])}
                    value={selectedDependency}
                    search
                    labelField="label"
                    valueField="value"
                    placeholder="No Dependency"
                    searchPlaceholder="Search..."
                    onChange={(value) => setSelectedDependency(value)}
                  />
                </View>
              )}
            </View>

            <View style={styles.separator}></View>
            <View style={{ flexDirection: "row" }}>
              {modalEditMode && (
                <View style={{ flex: 1 }}>
                  <Button
                    labelStyle={{ fontWeight: "bold", color: "white" }}
                    style={{ backgroundColor: "green" }}
                    onPress={() => {
                      handleUpdateStatusTodo(selectedItem.id, "Done")
                      console.log("SELECTED : ", selectedItem.id)
                    }}

                  >
                    <Text> Done Task </Text>
                  </Button>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Button style={{ alignSelf: "center" }} icon={modalEditMode ? "note" : "note-plus"}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    // paddingTop: Constants.statusBarHeight,
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
    paddingTop: 20
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pointsText: {
    color: "black",
    padding: 4,
    fontWeight: "bold",
  },
})

const mapStateToProps = (state, ownProps) => {
  return {
    todo_list: state.todos.todo_list,
    totalPoints: state.todos.totalPoints
  }
}

const mapDispatchToProps = { addTodo, deleteTodo, updateTodo, updateTotalPoints, updateStatusTodo }

export default connect(mapStateToProps, mapDispatchToProps)(Tasks)
