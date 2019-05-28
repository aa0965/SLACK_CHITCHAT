import React from 'react';
import {Modal, Icon, Input, Button} from 'semantic-ui-react';
import mime from 'mime-types';
class FileModal extends React.Component{
    
        state ={
            file:null,
            authorised: ['images/jpeg', 'image/png']
        }
        addFile = event => {
            const file = event.target.files[0];
            if(file){
                this.setState({ file });
            }
        }

        sendFile =()=>{
            const {file,authorised} =this.state;
            console.log(file);
            const {uploadFile,closeModal} =this.props;
            if(file !== null ){
                console.log(file);
               // if(this.isAuthorised(file.name)){
                //     console.log(file);
                   const metadata = { contentType: mime.lookup(file.name)};
                   uploadFile(file,metadata);
                   closeModal();
                   this.clearFile();
                // }
            }
        }

       // isAuthorised = filename =>this.state.authorised.includes(mime.lookup(filename));   
        
        clearFile = () => this.setState({ file:null });
        render(){
        const {modal, closeModal} = this.props;
      
        return(
          <React.Fragment>
              <Modal basic open={modal} onClose={closeModal}>
                  <Modal.Header>Select an Imaga</Modal.Header>
                  <Modal.Content>
                      <Input
                        fluid
                        onChange={this.addFile}
                        label='File types: jpg, png'
                        name='file'
                        type='file'
                      />
                  </Modal.Content>
                  <Modal.Actions>
                      <Button color='green' inverted onClick={this.sendFile}>
                        <Icon name='checkmark'/>Send
                      </Button>
                      <Button
                        color='red'
                        inverted
                        onClick={closeModal}
                      >
                          <Icon name='remove'/>Cancel
                      </Button>
                  </Modal.Actions>
              </Modal>
          </React.Fragment>
        )
    }
}

export default FileModal;