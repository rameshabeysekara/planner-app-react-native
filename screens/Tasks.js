import React from "react"
import ButtonIcon from '../components/ButtonIcon'
import Spacer from '../components/Spacer'
import Constants from 'expo-constants'

import { Text, View, StyleSheet, Modal, FlatList, Pressable, Alert } from "react-native"
import { Dropdown } from 'react-native-element-dropdown';
import { Button, TextInput, Card, Paragraph } from "react-native-paper"
import { FontAwesome as Icon } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { addTodo, deleteTodo, updateTodo } from '../redux/actions'



const Tasks = ({ todo_list, addTodo, deleteTodo, updateTodo }) => {

  const [modalFormVisible, setModalFormVisible] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [task, setTask] = React.useState('')
  const [selectedDependency, setSelectedDependency] = React.useState(null);

  const handleAddTodo = () => {
    if (task.trim() !== '') {
      // Validation for not including title
      if (title.trim() !== '') {
        // Adding the task with title, task, and selectedDependency (ID)
        addTodo(title, task, selectedDependency);
        setTask('');
        setTitle('');
        setSelectedDependency(null);
        setModalFormVisible(false);
      } else {
        // If the title is empty, prompt the user
        Alert.alert('Alert', 'Do you want to add the task without a title?', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            // Adding without a title
            onPress: () => {
              addTodo('', task, selectedDependency);
              setTask('');
              setTitle('');
              setSelectedDependency(null);
              setModalFormVisible(false);
            },
          },
        ]);
      }
    } else {
      // If both fields are empty, show an alert
      Alert.alert('Alert', 'Both Fields are empty', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
        },
      ]);
    }
  };

  // Custom Icon Component
  // Renders an icon with a label below it
  const CustomIcon = ({ name, size, color, label }) => {
    return (
      // View containing the icon and its label
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        { /* Icon component with specified name, size, and color */}
        <Icon name={name} size={size} color={color} />
        { /* Text label displayed below the icon */}
        <Text style={{ marginLeft: 2 }}>{label}</Text>
      </View>
    )
  }


  const [selectedItem, setSelectedItem] = React.useState(null)
  const [modalTask, setModalTask] = React.useState('')
  const [modalTitle, setModalTitle] = React.useState('')
  const [modalUpdateVisible, setModalUpdateVisible] = React.useState(false)
  // Function to open the modal for updating a selected plan/task
  const openModal = (item) => {
    // Set the selected item to the one passed as parameter
    setSelectedItem(item)
    // Set the modal task to the task of the selected item
    setModalTask(item.task)
    // Set the modal title to the title of the selected item
    setModalTitle(item.title)
    // Set the modal dependency to the dependency ID of the selected item
    setSelectedDependency(item.dependencyId);
    // Set the visibility of the update modal to true, thus opening the modal
    setModalUpdateVisible(true)
  }

  // Function to handle updating a plan/task by its ID
  const handleupdateTodo = (id) => {
    // Check if the title is not empty
    if (modalTitle.trim() !== '') {
      // If title is not empty, update the plan/task with the provided ID, title, and task
      updateTodo(id, modalTitle, modalTask)
      // Hide the update modal
      setModalUpdateVisible(false)
    } else {
      // If title is empty, prompt the user with an alert
      Alert.alert('Alert', 'Do you want to update without a title?', [
        // Options to cancel or proceed without a title
        {
          text: 'Cancel',
          style: 'Cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            // If the user chooses to proceed without a title, update the plan/task with an empty title and the provided task
            updateTodo(id, '', modalTask)
            // Hide the update modal
            setModalUpdateVisible(false)
          }
        },
      ])
    }
  }


  // Function to handle the deletion of a plan/task by its ID
  // Dispatch action to delete the plan/task with the given ID
  const handleDeleteTodo = (id) => {
    // Display an alert asking for confirmation before deletion
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Deletion canceled')
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // If user confirms deletion, call deleteTodo function
            deleteTodo(id)
            console.log('Task deleted successfully')
          }
        }
      ]
    )
  }

  //get task list to the dropdown
  const generateDropdownData = (todoList) => {
    const dropdownData = todoList.map((todo) => ({
      label: todo.title || '[ No Title ]',
      value: todo.id,
    }));

    dropdownData.unshift({
      label: 'No Dependency',
      value: null,
    });

    return dropdownData;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Spacer />
        <View style={[styles.flatList]}>
          <FlatList data={todo_list} keyExtractor={(item) => item.id} renderItem={({ item, index }) => {
            const cardTitle = (<Text style={{ color: 'gray' }} > {item.title || '[ No Title ]'}</Text>)
            return (
              <>
                <Pressable key={item.id} onPress={() => { openModal(item) }} >
                  <Card style={{ width: 350, marginTop: 10, backgroundColor: '#f7d7d2' }}>
                    <Card.Title title={`${item.title}` || cardTitle}
                      left={(props) => (<CustomIcon name="sticky-note" size={25} color={'gray'} />)}
                      right={(props) => (<ButtonIcon iconName="close" color="red" onPress={() => handleDeleteTodo(item.id)} />)}
                    />
                    <Card.Content>
                      <Paragraph>{item.task}</Paragraph>
                      <Paragraph style={{ marginTop: 10, color: 'gray', fontSize: 12 }}>
                        Tap to edit
                      </Paragraph>
                    </Card.Content>
                  </Card>
                </Pressable>
              </>
            )
          }} />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button labelStyle={{ fontWeight: 'bold', color: 'white' }}
          style={{ backgroundColor: 'tomato' }}
          onPress={() => setModalFormVisible(true)} >
          Create a Task
        </Button>
      </View>

      { /* Modal form start here | Modal Template  [  Added by  : Ronald  ] */}
      <Modal animationType="fade" transparent={true} visible={modalFormVisible} onRequestClose={() => { setModalFormVisible(!modalFormVisible) }}>
      <View style={styles.centeredView} >
        <View style={styles.modalView}>
          <View style={{ flexDirection: "row", alignItems: 'center' }} >
            <View style={{ flex: 1 }} >
              <Text style={styles.modalTitle} >New Task</Text>
            </View>
            <View>
              <Button icon="close-circle-outline" onPress={() => setModalFormVisible(!modalFormVisible)} />
            </View>
          </View>

          <View>
            <TextInput style={styles.txtInput} label="Title" value={title} onChangeText={title => setTitle(title)} />
            <TextInput style={styles.txtInput} label="Task" value={task} onChangeText={task => setTask(task)} />
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

          <Button style={{ alignSelf: "center" }} icon="note-plus" onPress={handleAddTodo} >
            Save Task
          </Button>
        </View>
      </View>

    </Modal>

      { /* Modal for updating tasks */}
      <Modal animationType="fade" transparent={true} visible={modalUpdateVisible} onRequestClose={() => setModalUpdateVisible(false)} >
        {selectedItem && (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              { /*TITLE INPUT */}
              <TextInput style={styles.txtInput} label={`ToDo Title  : `} value={modalTitle} onChangeText={(title) => { setModalTitle(title) }} />
              <View style={{ height: 8 }} />
              { /*TASK INPUT */}
              <TextInput style={styles.txtInput} label={`ToDo Task  : `} value={modalTask} onChangeText={(task) => { setModalTask(task) }} />
              <View style={{ height: 3 }} />
              <View>
                <Text>Update Status  :</Text>
                <View style={{ height: 8 }} />
                <View style={{ flexDirection: 'row', columnGap: 13 }} >
                </View>
                <View style={{ height: 8 }} />
                <Button style={{ backgroundColor: '#3F7CAC' }} onPress={() => handleupdateTodo(selectedItem.id)} >
                  <Text style={{ color: 'white', fontWeight: 'bold' }} > Update </Text>
                </Button>
              </View>
              <Spacer />
              <View>
                <Spacer />
                <Button mode="outlined" onPress={() => setModalUpdateVisible(false)} >
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        )}
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
    paddingTop: Constants.statusBarHeight,
    flexGrows: 1
  },
  separator: {
    height: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginBottom: 10
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: 'tomato'
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5
  },
  txtInput: {
    width: 300,
    margin: 5
  }

})

const mapStateToProps = (state, ownProps) => {
  return {
    todo_list: state.todos.todo_list,
  }
}

const mapDispatchToProps = { addTodo, deleteTodo, updateTodo }

export default connect(mapStateToProps, mapDispatchToProps)(Tasks)