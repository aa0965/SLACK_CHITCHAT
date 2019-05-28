import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

class MessagesHeader extends React.Component {
  state = {
    channelName: this.props.displayChannelName
  }
  render() {
    const { handleSearchChange, searchLoading, isPrivate, handleStar, isChannelStarred } = this.props;
    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {this.state.channelName}
            {isPrivate ? '' : <Icon 
              
              onClick={handleStar} 
              name={isChannelStarred ? 'star' : 'star outline'} 
              color={isChannelStarred ? 'yellow' : 'black'} />}
          </span>
          <Header.Subheader>{this.props.uniqueUsers}</Header.Subheader>
        </Header>

        {/* Channel Search Input */}
        <Header floated="right">
          <Input
          loading={searchLoading}
            onChange ={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
