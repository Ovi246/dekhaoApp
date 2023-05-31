const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyD4MFskfQ8DGaO-1zVX3SJdRqt2Ea398_Q",
  authDomain: "dekhaoapp.firebaseapp.com",
  projectId: "dekhaoapp",
  storageBucket: "dekhaoapp.appspot.com",
  messagingSenderId: "588631700890",
  appId: "1:588631700890:web:1d67ff64e0ae512e26b623",
};

firebase.initializeApp(firebaseConfig);

module.exports = firebase;
