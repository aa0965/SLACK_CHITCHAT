import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
var firebaseConfig = {
    apiKey: "AIzaSyAfqyG3Ay6eY_dBtzAH-CvCaONKbec-9F8",
    authDomain: "slack-72e47.firebaseapp.com",
    databaseURL: "https://slack-72e47.firebaseio.com",
    projectId: "slack-72e47",
    storageBucket: "slack-72e47.appspot.com",
    messagingSenderId: "992452679579",
    appId: "1:992452679579:web:4871a256e9eaa322"
  };
  
  firebase.initializeApp(firebaseConfig);

  export default firebase;