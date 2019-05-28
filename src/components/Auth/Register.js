import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import '../App.css';

import firebase from '../../firebase.js'
import md5 from 'md5';
class Register extends React.Component {
    state ={
        username:'',
        email: '',
        password: '',
        passwordConfirmation:'',
        errors: [],
        loading:false,
        userref: firebase.database().ref('users')

    };

   

    isFormValid = () =>{
        let errors =[];
        let error ;
      if(this.isFormEmpty(this.state)){
         error = {message: 'fill all the fields'};
         this.setState({errors: errors.concat(error)})
         return false;   
      }  
      else if(!this.isPasswordValid(this.state)){
        error ={message:'passowrd wrong'};
        this.setState({errors: errors.concat(error)})
        return false;
      }
      else{
          return true;
      }
    }

    isFormEmpty=({username, email, password, passwordConfirmation})=>{
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
      
      }
    isPasswordValid=({password, passwordConfirmation})=> {
          if(password.length<5 || passwordConfirmation.length<5){
              return false;
          }
          else if(password !== passwordConfirmation) {
              return false;
          }
          else {
              return true;
          }
      }

    displayErrors = errors => 
        errors.map((error, i)=><p key={i}>{error.message}</p>);
    
    
    saveUser = createUser => {
        return this.state.userref.child(createUser.user.uid).set({
            name: createUser.user.displayName,
            avatar: createUser.user.photoURL
        });
    }
    handleSubmit =event =>{
        event.preventDefault();
        if(this.isFormValid()){
         this.setState({errors: [], loading: true})     
        firebase
          .auth()
          .createUserAndRetrieveDataWithEmailAndPassword(this.state.email,this.state.password)
          .then(createUser => {console.log(createUser);
            createUser.user.updateProfile({
                displayName: this.state.username,
                photoURL: `http://gravatar.com/avatar/${md5(createUser.user.email)}?d=identicon`
            })
            .then(() => {this.saveUser(createUser).then(() => {console.log('user saved'); this.setState({loading:false})})
            })
             .catch(err => {
                 console.error(err);
                 this.setState({errors: this.state.errors.concat(err), loading: false})
             })
           
           })
          .catch(err => {console.log(err);
            this.setState({errors: this.state.errors.concat(err), loading:false}) ;
           })
    
    }
    }
    handleChange= event=>{
      this.setState({[event.target.name ]: event.target.value});
      };

   

    render () {
        const {username, email, password, passwordConfirmation, loading} = this.state;

        return (
            <Grid textAlign='center' verticalalign='middle' className='app'>
              <Grid.Column style={{ maxWidth: 450}}>
                  <Header as='h2' icon color='purple' textAlign='center'>
                      <Icon name='puzzle piece' color='purple'/>
                      Register for Chitchat
                  </Header>
                  <Form size='large' onSubmit={this.handleSubmit}>
                      <Segment stacked>
                          <Form.Input fluid name='username' icon='user' iconPosition='left' placeholder='username' onChange={this.handleChange} type='text' className = {this.state.errors.some(error => error.message.toLowerCase().includes('email')) ? 'error' : ''} value={username}/>

                          <Form.Input fluid name='email' icon='mail' iconPosition='left' placeholder='email address' onChange={this.handleChange} type='text' value={email}/>

                          <Form.Input fluid name='password' icon='lock' iconPosition='left' placeholder='password' onChange={this.handleChange} type='password' value={password}/>

                          <Form.Input fluid name='passwordConfirmation' icon='repeat' iconPosition='left' placeholder='password confirmation' onChange={this.handleChange} type='password' value={passwordConfirmation}/> 

                          <Button disabled= {loading } className={loading ? 'loading' : ''} color='purple' fluid size='large'>
                              Submit
                          </Button>
                         
                      </Segment>
                  </Form>
                  {this.state.errors.length > 0 && (
                      <Message error>
                       <h3>error</h3>
                       {this.displayErrors(this.state.errors)}
                      </Message>
                  )}
                   <Message>
                              Already a user?<Link to='/login'>click here</Link>
                          </Message>
              </Grid.Column>
            </Grid>
        )
    }
}
export default Register;
