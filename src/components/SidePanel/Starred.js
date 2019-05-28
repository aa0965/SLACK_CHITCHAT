import React from "react";
import { connect } from "react-redux";
import { setCurrentChannel, isPrivateChannel } from "../../actions";
import { Menu, Icon } from "semantic-ui-react";
import firebase from '../../firebase';
 
class Starred extends React.Component {
  state = {
    currentUser: this.props.currentUser,
    activeChannel: "",
    starredChannels: [],
    usersRef: firebase.database().ref('users')
  };

  componentDidMount () {
      if(this.state.currentUser){
          this.addListeners(this.state.currentUser.uid);
      }

  }
  componentWillUnmount () {
      this.removeListeners();
  }
  removeListeners = () => {
      this.state.usersRef.child(`${this.state.usersRef.uid}/starred`).off();
  }
  addListeners = userUid => {
      this.state.usersRef
        .child(userUid)
        .child('starred')
        .on('child_added', snap=> {
            const starredChannel = {id: snap.key, ...snap.val()};
            this.setState({
                starredChannels: [...this.state.starredChannels, starredChannel]
            })
        })
        this.state.usersRef
          .child(userUid)
          .child('starred')
          .on('child_removed' , snap => {
              const channelToRemove = {id: snap.key, ...snap.val()};
              const filterdChannels = this.state.starredChannels.filter(channel => {
                  return channel.id !== channelToRemove.id;
              })
              this.setState({ starredChannels:filterdChannels })
          })
  }
  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.isPrivateChannel(false);
  };

  displayChannels = starredChannels =>
    starredChannels.length > 0 &&
    starredChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  render() {
    const { starredChannels } = this.state;


    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="star" /> STARRED
          </span>{" "}
          ({starredChannels.length})
        </Menu.Item>
        {this.displayChannels(starredChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, isPrivateChannel }
)(Starred);
