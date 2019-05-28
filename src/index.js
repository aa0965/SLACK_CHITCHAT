import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Auth/Login.js';
import Register from './components/Auth/Register.js';
import registerServiceWorker from './registerServiceWorker';
import firebase from './firebase';
import rootreducer from './reducers/index.js';
import { BrowserRouter as Router , Switch , Route, withRouter} from 'react-router-dom';
import { createStore } from 'redux';
import {Provider,connect} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import 'semantic-ui-css/semantic.min.css';
import {setUser ,clearUser} from './actions';
import Spinner from './spinner';

const store = createStore(rootreducer, composeWithDevTools());

class Root extends React.Component {
    componentDidMount(){
        console.log(this.props.isLoading);
        firebase.auth().onAuthStateChanged(user => {      //to check if there is user in app
            if(user){
                this.props.setUser(user);
                this.props.history.push('/');
            }else{
                this.props.history.push('/login');
                this.props.clearUser();         //to clear from edux state
            } 
        })
    }
    render() {
        return this.props.isLoading ? <Spinner /> : (
   <Switch>
        <Route exact component={App} path='/'></Route>
        <Route component={Login} path='/login'></Route>
        <Route component={Register} path='/register'></Route>
    </Switch>
        )}
}
const mapStateToProps = state => ({
    isLoading: state.user.isLoading
})
const Routewith = withRouter(connect(mapStateToProps,{setUser,clearUser})(Root));
ReactDOM.render(<Provider store={store}><Router><Routewith /></Router></Provider>, document.getElementById('root'));
registerServiceWorker();
