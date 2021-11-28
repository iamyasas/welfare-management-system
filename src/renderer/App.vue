<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  let firebaseConfig = {
    apiKey: "AIzaSyC5xVtresQQRnGBhYWQKZ_tomCUPICtf08",
    authDomain: "welfare-cad1e.firebaseapp.com",
    databaseURL: "https://welfare-cad1e.firebaseio.com",
    projectId: "welfare-cad1e",
    storageBucket: "welfare-cad1e.appspot.com",
    messagingSenderId: "363005105612",
    appId: "1:363005105612:web:8e5519bfab8f78bbc27969",
    measurementId: "G-ZEFQCDX5K5"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default {
    name: 'welfare-mgt-system'
  }
</script>

<style>
  /* CSS */
</style>
