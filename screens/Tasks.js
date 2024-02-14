import React from "react"
import ButtonIcon from '../components/ButtonIcon'
import Spacer from '../components/Spacer'
import Constants from 'expo-constants'

import { Text, View, StyleSheet, Modal, FlatList, Pressable, Alert } from "react-native"
import { Dropdown } from 'react-native-element-dropdown'
import { Button, TextInput, Card, Paragraph } from "react-native-paper"
import { FontAwesome as Icon } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { addTodo, deleteTodo, updateTodo } from '../redux/actions'



const Tasks = ({ todo_list, addTodo, deleteTodo, updateTodo }) => {

  const [modalFormVisible, setModalFormVisible] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [task, setTask] = React.useState('')
  const [selectedDependency, setSelectedDependency] = React.useState(null)
  const [modalEditMode, setModalEditMode] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState(null)
  const [modalTask, setModalTask] = React.useState('')
  const [modalTitle, setModalTitle] = React.useState('')
  const [modalUpdateVisible, setModalUpdateVisible] = React.useState(false)

  const handleAddTodo = () => {
    if (task.trim() !== '') {
      if (title.trim() !== '') {
        addTodo(title, task, selectedDependency)
        setTask('')
        setTitle('')
        setSelectedDependency(null)
        setModalFormVisible(false)
      } else {
        // If the title is empty, prompt the user
        Alert.alert('Alert', 'Do you want to add the task without a title?', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              addTodo('', task, selectedDependency)
              setTask('')
              setTitle('')
              setSelectedDependency(null)
              setModalFormVisible(false)
            },
          },
        ])
      }
    } else {
      // If both fields are empty, show an alert
      Alert.alert('Alert', 'Task Name cannot be empty', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            addTodo('', task, selectedDependency)
            setTask('')
            setTitle('')
            setSelectedDependency(null)
            setModalFormVisible(false)
          },
        },
      ])
    }
  }

  // Function to handle updating a plan/task by its ID
  const handleupdateTodo = (id) => {
    // Check if the title is not empty
    if (modalTitle.trim() !== '') {
      // If title is not empty, update the plan/task with the provided ID, title, and task
      updateTodo(id, modalTitle, modalTask, selectedDependency)
      // Hide the update modal
      setModalUpdateVisible(false)
    } else {
      // If title is empty, prompt the user with an alert
      Alert.alert('Alert', 'Do you want to update without a title?', [
        // Options to cancel or proceed without a title
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            // If the user chooses to proceed without a title, update the plan/task with an empty title and the provided task
            updateTodo(id, '', modalTask, selectedDependency)
            // Hide the update modal
            setModalUpdateVisible(false)
          },
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
    }))

    dropdownData.unshift({
      label: 'No Dependency',
      value: null,
    })
    return dropdownData
  }

  // Custom Icon Component
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

  const [statusMap, setStatusMap] = React.useState({})
  const taskStat = ( id, stat ) => {

    const currentTask = todo_list.find(task => task.id === id)

    if ( stat === 'Done') {
      const dependentTask = currentTask.dependentTaskId
      if(dependentTask != null) {

        if(dependentTask.value != null) {
          if (statusMap.hasOwnProperty(dependentTask.value.toString())) {
            //if there is a dependency and status == done
            setStatusMap(prevStatusMap => ({
              ...prevStatusMap,
              [id]: stat,
            }))
            setModalUpdateVisible(false)
          } else {
            //if there is a dependency and status != done
            Alert.alert('Alert', 'The primary task must be completed first.', [
              {
                text: 'OK',
              },
            ])
          }
        } else {
          //if there is no dependency
          setStatusMap(prevStatusMap => ({
            ...prevStatusMap,
            [id]: stat,
          }))
          setModalUpdateVisible(false)
        }
        
      } else {
        //if there is no dependency
        setStatusMap(prevStatusMap => ({
          ...prevStatusMap,
          [id]: stat,
        }))
        setModalUpdateVisible(false)
      }
      
    } else {

      setStatusMap( ( prevStatusMap ) => ({

        ...prevStatusMap,
        [ id ] : 'Due',

      }))
    } 
  }

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
  }



  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Spacer />
        <View style={[styles.flatList]}>
          <FlatList
            data={todo_list}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const status = statusMap[item.id] || 'On going'
              const cardTitle = (<Text style={{ color: 'black', fontWeight: 'bold', fontSize: 22 }}> {item.title || '[ No Title ]'}</Text>)
              const cardSubTitleColor = status === 'Done' ? 'green' : 'gray'
              const cardSubTitle = (<Text style={{ color: cardSubTitleColor, fontSize: 15 }} > Status : {status}</Text>)
              const iconColor = status === 'Done' ? 'green' : 'gray'
              const dependentOn = (<Paragraph style={{ marginTop: 10, color: 'gray', fontSize: 12 }}>
                {/* To Do = Imasha */}
                Dependent on: { item.dependentTaskId != null ? item.dependentTaskId.label : "None"}
              </Paragraph>
              )

              return (
                <>
                  <Pressable key={item.id} onPress={() => openModal(item)}>
                    <Card style={{ width: 350, marginTop: 10 }}> 
                      <Card.Title
                        // title={`${item.title}` || cardTitle}
                        title={<>{cardTitle}</>}
                        subtitle={<>{cardSubTitle}</>}
                        left={(props) => (<CustomIcon name="sticky-note" size={50} color={iconColor} />)}
                        right={(props) => (<ButtonIcon iconName="close" color="red" onPress={() => handleDeleteTodo(item.id)} />)}
                      />
                      <Card.Content >
                        <Paragraph style={{ paddingTop: 5, paddingBottom: 5 }}>{item.task}</Paragraph>
                        {dependentOn}
                        <Paragraph style={{ marginTop: 10, color: 'tomato', fontSize: 12 }}>
                          Tap to edit {' '}
                          <Icon name="pencil" size={12} color="tomato" />
                        </Paragraph>
                      </Card.Content>
                    </Card>
                  </Pressable>
                </>
              )
            }}
          />

        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          labelStyle={{ fontWeight: 'bold', color: 'white' }}
          style={{ backgroundColor: 'tomato' }}
          onPress={() => {
            setModalFormVisible(true)
            setModalEditMode(false)
            setTitle('')
            setTask('')
            setSelectedDependency(null)
          }}
        >
          Create a Task
        </Button>
      </View>

      {/* Modal form for creating and updating tasks */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalFormVisible || modalUpdateVisible}
        onRequestClose={() => {
          setModalFormVisible(false)
          setModalUpdateVisible(false)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <CustomIcon name="sticky-note" size={25} color={'tomato'} />
                <Text style={[styles.modalTitle, { paddingLeft: 10, paddingTop: 3 }]}>
                  {modalEditMode ? 'Update Task' : 'New Task'}
                </Text>
              </View>

              <View>
                <Pressable onPress={() => { setModalFormVisible(false), setModalUpdateVisible(false) }}>
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
                onChangeText={(text) => (modalEditMode ? setModalTitle(text) : setTitle(text))}
              />
              <TextInput
                style={styles.txtInput}
                label="Task"
                value={modalEditMode ? modalTask : task}
                onChangeText={(text) => modalEditMode ? setModalTask(text) : setTask(text)}
              />
              
            </View>
            {!modalEditMode && (
              <View>
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
            <View style={{ flexDirection: 'row', }}>
              {modalEditMode && (
                <View style={{ flex: 1 }}>
                  <Button
                    labelStyle={{ fontWeight: 'bold', color: 'white' }}
                    style={{ backgroundColor: 'green' }}
                    onPress={ () => taskStat( selectedItem.id, 'Done' ) } >
                    <Text> Done Task </Text>
                  </Button>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Button
                  style={{ alignSelf: "center" }}
                  icon={modalEditMode ? "note" : "note-plus"}
                  onPress={() => (modalEditMode ? handleupdateTodo(selectedItem.id) : handleAddTodo())} >
                  {modalEditMode ? 'Update Task' : 'Save Task'}
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
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 5
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