import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
  state = {
    isPrivate: this.props.isPrivate,
    messagesRef: firebase.database().ref("messages"),
    privateMessageRef: firebase.database().ref('privateMessages'),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
    usersRef: firebase.database().ref('users'),
    listeners: []
  };

  componentDidMount() {
    const { channel, user, listeners } = this.state;

    if (channel && user) {
        this.removeListeners(listeners);
      this.addListeners(channel.id);
      this.starChannelListener(channel.id, user.uid);
    }
  }

  addToListeners = (id, ref, event) => {
     const index = this.state.listeners.findIndex(listener => {
        return listener.id === id && listener.ref === ref && listener.event ===event;
     })

     if(index !== -1){
         const newListener = {id, ref, event};
         this.setState({ listeners: this.state.listeners.concat(newListener) });
     }
     

  }
  componentWillUnmount () {
      this.removeListeners(this.state.listeners);
    //   this.starChannel.connectedRef.off();
  }

  
  starChannelListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child('starred')
      .once('value')
      .then(data => {
          if(data.val() !== null){
              const channelIds = Object.keys(data.val());
              const prevStarred = channelIds.includes(channelId);
              this.setState({ isChannelStarred: prevStarred });
          }
      })
}
  addListeners = channelId => {
    this.addMessageListener(channelId);
    
  };
  removeListeners = listeners => {
      listeners.forEach(listener => {
          listener.ref.child(listener.id).off(listener.event);
      })
  }
  getMessageref = () => { 
      const {isPrivate, messagesRef, privateMessageRef
    } = this.state;
    return isPrivate ? privateMessageRef : messagesRef;
  }

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessageref();
    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
    });
    this.addToListeners(channelId, ref, 'child_added');
  };

  countUniqueUsers = messages => {
      const uniqueUsers = messages.reduce((acc, message) => {
          if(!acc.includes(message.user.name)){
              acc.push(message.user.name);
          }
          return acc;
      },[]);
      const numUniqueUsers = `${uniqueUsers.length} Users`;
      this.setState({ uniqueUsers : numUniqueUsers });
  }

  handleSearchChange = event => {
    this.setState({ searchLoading:true, searchTerm: event.target.value },
        () => this.handleSearchMessages());
   }

  handleSearchMessages = () => {
      const channelMessages = [...this.state.messages];
      const regex = new RegExp(this.state.searchTerm, 'gi');
      const searchResults = channelMessages.reduce((acc, message) => {
          if(message.content && message.content.match(regex) || message.user.name.match(regex)){
              acc.push(message);
          }
          return acc;
      }, []);
      this.setState({ searchResults });
      setTimeout(() => this.setState({ searchLoading:false }),1000);
  }

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = channel => channel ? `#${channel.name}` : ''; 
  handleStar = () =>{
      this.setState(prevstate => ({
        isChannelStarred: !prevstate.isChannelStarred
      })
      ,() => this.starChannel() );
  }

  starChannel = () => {
      if(this.state.isChannelStarred){
         this.state.usersRef
           .child(`${this.state.user.uid}/starred`)
           .update({
               [this.state.channel.id] : {
                   name: this.state.channel.name,
                   details: this.state.channel.details,
                   createdBy:{
                       name: this.state.channel.createdBy.name,
                       avatar: this.state.channel.createdBy.avatar
                   }
               }
           })
      }
      else{
         this.state.usersRef
           .child(`${this.state.user.uid}/starred`)
           .child(this.state.channel.id)
           .remove(err => {
               if(err !== null){
                   console.error(err)
               }
           })
      }
  }
  
  render() {
    const { messagesRef, messages, channel, user, searchResults, searchTerm } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader
          displayChannelName = {this.displayChannelName(channel)}
          uniqueUsers = {this.state.uniqueUsers}
          handleSearchChange = {this.handleSearchChange}
          searchLoading = {this.state.searchLoading}
          isPrivate = {this.props.isPrivate}
          isChannelStarred={this.state.isChannelStarred}
          handleStar = {this.handleStar}
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isPrivate={this.props.isPrivate}
          getMessageref ={this.getMessageref}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
