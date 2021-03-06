import React from "react";
import firebase from "../../firebase";
import { Grid, Header, Icon, Dropdown, Image, Modal, Input ,Button } from "semantic-ui-react";
import AvatarEditor from 'react-avatar-editor';
class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser,
    modal:false,
    previewImage:'',
    
  };

  openModal = () => this.setState({ modal:true });
  closeModal = () => this.setState({ modal:false });
  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span onClick={this.openModal}>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignout}>Sign Out</span>
    }
  ];

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signed out!"));
  };

  handleChange = event => { 
    const file =event.target.file[0];
    const reader = new FileReader();

    if(file){
        reader.readAsDataURL(file);
        reader.addEventListener('load',()=>{
            this.setState({ previewImage: reader.result })
        })
    }
  }
  render() {
    const { user, previewImage } = this.state;
    const {primaryColor} = this.props;

    return (
      <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>ChitChat</Header.Content>
            </Header>

            {/* User Dropdown  */}
            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image src={user.photoURL} spaced ='right' avatar/>
                    {user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
          <Modal basic open={this.state.modal} onClose={this.closeModal}>
              <Modal.Content>
                  <Input 
                    onChange={this.handleChange}
                    fluid
                    type='file'
                    label='New Avatar'
                    name='previewImage'
                  />
                  <Grid centered stackable columns={2}>
                     <Grid.Row centered>
                       <Grid.Column className='ui center aligned grid'>
                          {previewImage && (
                              <AvatarEditor
                                image={previewImage}
                                width={120}
                                height={120}
                                border={50}
                                scale={1.2}

                                />
                          )}
                       </Grid.Column>
                       <Grid.Column>
                           {/* {cropped image preview} */}
                       </Grid.Column>
                     </Grid.Row> 
                  </Grid>
              </Modal.Content>
              <Modal.Actions>
                  <Button color='green' inverted>
                      <Icon name='save' />Change Avatar
                  </Button>
                  {/* <Button color='yellow' inverted onClick={this.handleCropImage}>
                      <Icon name='image' />preview
                  </Button> */}
                  <Button color='red' inverted onClick={this.closeModal}> 
                      <Icon name='remove' />Cancel
                  </Button>
              </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
