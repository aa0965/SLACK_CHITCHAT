import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import '../App.css';

import firebase from '../../firebase.js'

class Login extends React.Component {
    state ={
        email: '',
        password: '',
        errors: [],
        loading:false,

    };

   

    isFormValid = ({email,password}) => email && password;
        
    


   
   

    displayErrors = errors => 
        errors.map((error, i)=><p key={i}>{error.message}</p>);
    
    
    
    handleSubmit =event =>{
        event.preventDefault();
        if(this.isFormValid(this.state)){
        this.setState({ loading: true, errors:[]});
        firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email,this.state.password)
          .then(signedInUser => {
              console.log(signedInUser);
              this.setState({loading:false})
          })
          .catch(err=>{
              this.setState({errors:this.state.errors.concat(err), loading:false})
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
                  <Header as='h2' icon color='orange' textAlign='center'>
                      <Icon name='puzzle piece' color='orange'/>
                      Login for Chitchat
                  </Header>
                  <Form size='large' onSubmit={this.handleSubmit}>
                      <Segment stacked>

                          <Form.Input fluid name='email' icon='mail' iconPosition='left' placeholder='email address' onChange={this.handleChange} type='text' value={email}/>

                          <Form.Input fluid name='password' icon='lock' iconPosition='left' placeholder='password' onChange={this.handleChange} type='password' value={password}/>


                          <Button disabled= {loading } className={loading ? 'loading' : ''} color='orange' fluid size='large'>
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
                              Don't have a account?<Link to='/register'>click here</Link>
                          </Message>
              </Grid.Column>
            </Grid>
        )
    }
}
export default Login;
