import * as actiontypes from './types';

export const setUser = user => {
    return {
        type: actiontypes.SET_USER,
        payload: {
            currentUser: user
        }
    }
}

export const clearUser = () => {
    return {
        type: actiontypes.CLEAR_USER,
        payload: {
            currentUser: null
        }
    }
}

export const setCurrentChannel = channel =>{
    return {
        type: actiontypes.SET_CURRENT_CHANNEL,
        payload:{
            currentChannel:channel
        }
    }
}

export const isPrivateChannel = isPrivate =>{
    return {
        type: actiontypes.SET_PRIVATE_CHANNEL,
        payload:{
            isPrivate
        }
    }
}

export const setColors = (primaryColor,secondaryColor) =>{
    return {
        type: actiontypes.SET_COLORS,
        payload:{
            primaryColor,
            secondaryColor
        }
    }
}
