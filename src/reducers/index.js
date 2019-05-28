import * as actiontypes from '../actions/types';
import { combineReducers } from 'redux';

const initialState = {
  currentUser: null,
  isLoading: true
}

const user_reducer = (state= initialState, action)=>{
    switch(action.type) {
        case actiontypes.SET_USER:
        return {
            currentUser : action.payload.currentUser,
            isLoading: false
        }
        case actiontypes.CLEAR_USER:
            return{
                ...state,
                isLoading: false
            }
        default:
            return state;
    }
}
const initiallstate = {currentChannel : null,
                       isPrivate:false};

const channel_reducer = (state=initiallstate,action)=>{
    switch(action.type){
        case actiontypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }
        case actiontypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivate:action.payload.isPrivate
            }    

        default: 
          return state;
    }
}

const initialColorState ={
    primaryColor: '#4C9A2A',
    secondaryColor: '#eee'
}

const colors_reducer = (state= initialColorState, action)=>{
    switch(action.type) {
        case actiontypes.SET_COLORS:
        return {
           primaryColor: action.payload.primaryColor,
           secondaryColor: action.payload.secondaryColor
        }
        
        default:
            return state;
    }
}

const rootreducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer,
    colors: colors_reducer
});
export default rootreducer;