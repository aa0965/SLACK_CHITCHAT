import React from 'react';
import {Menu, Item, Icon} from 'semantic-ui-react';
import firebase from '../../firebase';
import {connect } from 'react-redux';
import {setCurrentChannel, isPrivateChannel} from '../../actions';
class DirectMessages extends React.Component {
    state = {
        activeChannel: '',
        users: [],
        user: this.props.currentUser,
        userRef : firebase.database().ref('users'),
        connectedRef :  firebase.database().ref('.info/connected'),
        presenceRef : firebase.database().ref('presence')
    }

    componentDidMount () {
        if(this.state.user){
            this.addListeners(this.state.user.uid);
        }
    }
    componentWillUnmount(){
        this.removeListeners();
    }
    removeListeners = () => {
        this.state.userRef.off();
        this.state.presenceRef.off();
        this.state.connectedRef.off();
    }
    addListeners = currentUserUid => {
        let loadedUsers = [];
        this.state.userRef.on('child_added', snap => {
            if(currentUserUid !== snap.key){
                let user = snap.val();
                user['uid']= snap.key;
                user['status']= 'offline';
                loadedUsers.push(user);
                this.setState({ users: loadedUsers })
               
            }
        });
        this.state.connectedRef.on('value', snap=> {
            if(snap.val() === true){
              const ref = this.state.presenceRef.child(currentUserUid);
              ref.set(true);
              ref.onDisconnect().remove(err => {
                  if(err !== null){
                      console.log(err);;
                  }
              })
            }
        });

        this.state.presenceRef.on('child_added', snap => {
            if(currentUserUid!==snap.key){
              this.addStatusToUser(snap.key);
            }
        })

        this.state.presenceRef.on('child_removed', snap => {
            if(currentUserUid!==snap.key){
                this.addStatusToUser(snap.key, false);

            }
        })
        console.log(loadedUsers);
        
    }

    addStatusToUser =(userId, connected=true) => {
      const updatedUsers = this.state.users.reduce((acc, user) => {
          if(user.uid === userId){
              user['status']= `${connected ? 'online' : 'offline'}`;
          }
          return acc.concat(user);
      },[]);
      this.setState({ users:updatedUsers });
    }

    isUserOnline=user => user.status =='online';

    setPrivateChannel = user => {
        const userId = user.uid;
        const currentUserId = this.state.user.uid;
        const channelId = userId < currentUserId ? `${currentUserId}/${userId}` : `${userId}/${currentUserId}`;
        const channelData = {
            id: channelId,
            name: user.name
        }
        this.props.setCurrentChannel(channelData);
        this.props.isPrivateChannel(true);
        this.activateChannel(user.uid);
    }

    activateChannel = userUid => {
        this.setState({ activeChannel: userUid })
    }
    render(){
       
        return(
          <Menu.Menu  className ='menu'>
              <Menu.Item>
                  <span>
                     <Icon name='mail'/>DIRECT MSG

                  </span>{' '}
                  ({ this.state.users.length })
              </Menu.Item>
              {this.state.users.map(user => (
              
                  <Menu.Item
                  active ={user.uid === this.state.activeChannel}
                  key ={user.uid}
                  onClick ={()=> {this.setPrivateChannel(user)}}
                  style={{opacity: 0.7, fontStyle: 'italic'}}
              > 
              <Icon  
                name='circle'
                color={this.isUserOnline(user) ? 'blue' : 'red'}

              />
              @{user.name}
            </Menu.Item>
              ))
            }
          </Menu.Menu>
        )
    }
}

export default connect(null,{setCurrentChannel, isPrivateChannel})(DirectMessages);