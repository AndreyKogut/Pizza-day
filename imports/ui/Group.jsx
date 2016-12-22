import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Groups from '../api/groups';

class GroupPage extends Component {

  render() {
    return (<ul className="groups">
      <img src={this.props.avatar} className="avatar" alt="" />
      <div>Name: { this.props.name }</div>
      <div>Description: { this.props.description }</div>
    </ul>);
  }
}

GroupPage.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  avatar: PropTypes.string,
};

const GroupPageContainer = createContainer(({ id }) => {
  Meteor.subscribe('Group', id);
  const { name, avatar, description } = Groups.findOne(id) || {};

  return {
    name,
    description,
    avatar,
  };
}, GroupPage);

export default GroupPageContainer;
