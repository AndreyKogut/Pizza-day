import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import Controls from '../components/Controls';

const propTypes = {
  id: PropTypes.string,
  user: PropTypes.objectOf(Object),
  userDataLoading: PropTypes.bool,
};

const UserCabinet = (props) => {
  const editable = props.id === Meteor.userId();

  function updateUserData(obj) {
    Meteor.call(
      'user.update',
      obj,
      handleMethodsCallbacks(),
    );
  }

  function enterData(func) {
    return (event) => {
      if (event.key.toLowerCase() === 'enter') {
        func();
      }

      return true;
    };
  }

  if (props.userDataLoading) {
    return (<div>Loading..</div>);
  }

  return (<div className="content page-content">
    <div className="mdl-grid">
      <h4>{ props.user.profile.name } { editable &&
      <span className="correct-indent mdl-textfield mdl-js-textfield mdl-textfield--expandable">
        <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="name">
          <i className="material-icons">edit</i>
        </label>
        <div className="mdl-textfield__expandable-holder">
          <input
            type="text"
            ref={(name) => {
              this.userName = name;
            }}
            id="name"
            onKeyPress={enterData(() => {
              updateUserData({ name: this.userName.value });
              this.userName.value = '';
            })}
            className="mdl-textfield__input"
          />
          <label className="mdl-textfield__label" htmlFor="name">New name</label>
        </div>
      </span> }</h4>
      <div className="mdl-layout-spacer" />
      { editable && <div className="controls">
        <a
          id="create-group"
          href="/create-group"
          className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--accent"
        >
          <i className="material-icons">group</i>
        </a>
        <Controls
          controls={{ avatar: true }}
          updateImage={(imageUrl) => { updateUserData({ avatar: imageUrl }); }}
        />
        <div className="mdl-tooltip" data-mdl-for="create-group">
          Create group
        </div>
      </div> }
    </div>
    <div className="mdl-grid">

      <div className="ta-c mdl-cell mdl-cell--6-col">
        <img
          src={props.user.profile.avatar}
          alt={props.user.profile.name}
          className="avatar--big"
        />
      </div>
      <div className="mdl-cell mdl-cell--6-col">
        <p>Company: { props.user.profile.company } { editable && <span className="correct-indent mdl-textfield mdl-js-textfield mdl-textfield--expandable">
          <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="company">
            <i className="material-icons">edit</i>
          </label>
          <span className="mdl-textfield__expandable-holder">
            <input
              type="text"
              ref={(name) => {
                this.company = name;
              }}
              id="company"
              onKeyPress={enterData(() => {
                updateUserData({ company: this.company.value });
                this.company.value = '';
              })}
              className="mdl-textfield__input"
            />
            <label className="mdl-textfield__label" htmlFor="company">Company name</label>
          </span>
        </span> }</p>
        <p>Position: { props.user.profile.position }{ editable && <span className="correct-indent mdl-textfield mdl-js-textfield mdl-textfield--expandable">
          <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="position">
            <i className="material-icons">edit</i>
          </label>
          <span className="mdl-textfield__expandable-holder">
            <input
              type="text"
              ref={(name) => {
                this.position = name;
              }}
              id="position"
              onKeyPress={enterData(() => {
                updateUserData({ position: this.position.value });
                this.position.value = '';
              })}
              className="mdl-textfield__input"
            />
            <label className="mdl-textfield__label" htmlFor="position">Company name</label>
          </span>
        </span> }</p>
        <p>Email: { props.user.emails[0].address }{ editable && <span className="correct-indent mdl-textfield mdl-js-textfield mdl-textfield--expandable">
          <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="address">
            <i className="material-icons">edit</i>
          </label>
          <span className="mdl-textfield__expandable-holder">
            <input
              type="email"
              ref={(name) => {
                this.email = name;
              }}
              id="address"
              onKeyPress={enterData(() => {
                updateUserData({ email: this.email.value });
                this.email.value = '';
              })}
              className="mdl-textfield__input"
            />
            <label className="mdl-textfield__label" htmlFor="address">Company name</label>
          </span>
        </span> }</p>
        <p>About: { props.user.profile.about }{ editable && <span className="correct-indent mdl-textfield mdl-js-textfield mdl-textfield--expandable">
          <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="about">
            <i className="material-icons">edit</i>
          </label>
          <span className="mdl-textfield__expandable-holder">
            <input
              type="text"
              ref={(name) => {
                this.about = name;
              }}
              id="about"
              onKeyPress={enterData(() => {
                updateUserData({ about: this.about.value });
                this.about.value = '';
              })}
              className="mdl-textfield__input"
            />
            <label className="mdl-textfield__label" htmlFor="about">Company name</label>
          </span>
        </span> }</p>
      </div>
    </div>
  </div>);
};

UserCabinet.propTypes = propTypes;

const UserCabinetContainer = createContainer(({ id }) => {
  const handleUser = Meteor.subscribe('user', id);

  const user = Meteor.users.findOne(id) || {};

  _.defaults(user, {
    profile: {
      name: '',
      avatar: '',
      about: '',
      company: '',
      position: '',
    },
    emails: [{
      address: '',
    }],
  });

  return {
    id,
    user,
    userDataLoading: !handleUser.ready(),
  };
}, UserCabinet);

export default UserCabinetContainer;
