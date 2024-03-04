import React from "react";
import { Text, View, ScrollView } from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from 'react-redux';

const ActivityLog = ({ activityLog }) => {
  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
      {activityLog.map((item, index) => (
        <ListItem key={index} bottomDivider containerStyle={{ width: '100%' }}>
          <ListItem.Content>
            <ListItem.Title style={{ color: getTaskTypeColor(item.type) }}>{item.type}</ListItem.Title>
            <ListItem.Subtitle>{`Title: ${item.title}`}</ListItem.Subtitle>
            <ListItem.Subtitle>{`Task: ${item.task}`}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
  );
};

const mapStateToProps = (state) => {
  return {
    activityLog: state.todos.activityLog || [],
  };
};

const getTaskTypeColor = (type) => {
  switch (type) {
    case 'Updated Task':
      return 'orange'; // Color for updated tasks
    case 'Added Task':
      return 'green'; // Color for added tasks
    case 'Deleted Task':
      return 'red'; // Color for deleted tasks
    default:
      return 'black'; // Default color if the type doesn't match any of the cases
  }
};



export default connect(mapStateToProps)(ActivityLog);
