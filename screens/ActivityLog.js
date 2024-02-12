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
            <ListItem.Title>{item.type}</ListItem.Title>
            <ListItem.Subtitle>{`Title: ${item.title}`}</ListItem.Subtitle>
            <ListItem.Subtitle>{`Task: ${item.task}`}</ListItem.Subtitle>
            <ListItem.Subtitle>{`Dependent On: ${item.dependencyName}`}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
  );
};

const mapStateToProps = (state) => {
  return {
    activityLog: state.todos.activityLog,
  };
};

export default connect(mapStateToProps)(ActivityLog);
