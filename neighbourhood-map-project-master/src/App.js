import React, { Component } from 'react';
import Map from './Map.js'
import './ListView.css';



//https://medium.com/front-end-hacking/simplified-google-maps-api-in-a-react-app-46981441d2c9


// import the Google Maps API Wrapper from google-maps-react
import { GoogleApiWrapper } from 'google-maps-react'


class App extends Component {






  render() {
    return (
      <div>
      <div className="App">
        <Map google={this.props.google}/>
      </div>

      </div>

    );
  }
}

// OTHER MOST IMPORTANT: Here we are exporting the App component WITH the GoogleApiWrapper. You pass it down with an object containing your API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAgaeRT4AeIOkYMjFqUqMqXQMtczkvel44&v=3',
})(App)
