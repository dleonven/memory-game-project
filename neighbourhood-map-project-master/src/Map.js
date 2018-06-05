import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ListView from './ListView.js';
import './ListView.css';



class Map extends Component {

  /*The foursquareID is the id of the venue (place) in foursquare...i added as
  an attribute just to avoid making one more api call with the place name to get the id
  (there was no call that directly returned the image just with the place name)*/
  state = {
      places: [
        { name: "Namaste Restaurant", location: {lat: -33.889350, lng: 151.270787}, foursquareID: '50c43ab5e4b09f38ad37bf00', marker: {} },
        { name: "Beach Road Hotel", location: {lat: -33.886235, lng: 151.272530}, foursquareID: '4b0a4a43f964a520062323e3', marker: {} },
        { name: "Bondi Junction Station", location: {lat: -33.891039, lng: 151.248469}, foursquareID: '4b08c7ccf964a5202a1223e3', marker: {} },
        { name: "Waverley Library", location: {lat: -33.892960, lng: 151.244995}, foursquareID: '4b78b5d4f964a520e1de2ee3', marker: {} },
        { name: "Bondi Icebergs", location: {lat: -33.894996, lng: 151.274340}, foursquareID: '4b058771f964a5206b9322e3', marker: {} },
      ],

      /*I added the infowindow to the state because it was the onle way i
      found to access it and be able to pass it to child components*/
      infowindow: [],

      listViewVisible: false
    }

  componentDidMount() {
    //Call loadMap function to load the google map
    this.loadMap();
  }

  /*Part of the logic to load the map I took it from google. At the moment of writing
  this comments i couldn't find the site i took it from*/
  loadMap() {
          if (this.props && this.props.google) { // checks to make sure that props have been passed
            const {google} = this.props; // sets props equal to google
            const maps = google.maps; // sets maps to google maps props

            const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
            const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node

            const mapConfig = Object.assign({}, {
              center: {lat: -33.889663, lng: 151.273881}, // sets center of google map to NYC.
              zoom: 14.3, // sets zoom. Lower numbers are zoomed further out.
              mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
            })

            // creates a new Google map on the specified node (ref='map') with the specified configuration set above.
            this.map = new maps.Map(node, mapConfig);


            // ==================
            // ADD MARKERS TO MAP
            // ==================
            /*Pass the InfoWindow as state, so to be able to pass it to
            child components (it has to be the same object used through the
            entire app)*/
            let infowindow = new google.maps.InfoWindow()
            this.setState({ infowindow: infowindow })

            // iterate through places saved in state
            this.state.places.forEach( place => {
              const marker = new google.maps.Marker({ // creates a new Google maps Marker object.
                position: {lat: place.location.lat, lng: place.location.lng}, // sets position of marker to specified location
                map: this.map, // sets markers to appear on the map we just created on line 35
                title: place.name, // the title of the marker is set to the name of the place
                animation: google.maps.Animation.DROP
              });

              /*Asign the new marker object to it's place
              This assigns it in the state (can be accesed globaly)
              */
              place.marker = marker


              /*when a marker is clicked, then call the function to populate
              the infowindow (arrow function used so to not have problems with
              the 'this' scope)*/
              marker.addListener('click', () => {

                console.log(this.map)
                this.map.setCenter(marker.getPosition())

                this.animateMarker(marker, google)
                this.populateInfowindow(place, infowindow)
              });

            })

          }
    }

  /*Handler to toggle the state to be able to know when the to display
  the ListView*/
  handleToggleList = () => {
      this.setState({ listViewVisible: !this.state.listViewVisible })
    }

  //Self explicative
  animateMarker = (marker, google) => {

    /*Start bouncing with the click*/
    marker.setAnimation(google.maps.Animation.BOUNCE)

    /*Stop the bouncing after the first cicle*/
    setTimeout(() => { marker.setAnimation(null) }, 600);
  }

  /*I partly based myself on the Udacity classes logic to populate the infowindow*/
  populateInfowindow = (place, infowindow) => {

      const marker = place.marker

      // Check to make sure the infowindow is not already opened on this marker.
      if(infowindow.marker !== marker) {
        infowindow.marker = marker;

        //Foursquare data needed to the API call
        const clientID = 'client_id=I4HL4OWMDNTMOH2RFXVMERZ1TETMUEPQM3R0DCTSZJVDLXBY'
        const clientSecret = 'client_secret=W2FIUMMOOOBC2LZPYYIUAO5OD1AE3A0J0L2GZ4JOQNBXC4JD'
        const version = 'v=20181010'
        const requestUrl = 'https://api.foursquare.com/v2/venues/'+place.foursquareID+'/photos?'+clientID+'&'+clientSecret+'&'+version

        /*Async Foursquare API call. Partly based on Udacity classes*/
        fetch(requestUrl)
        .then(response => response.json())
        .then((data) => this.setInfowindowContent(data, infowindow))
        .catch(e => {this.requestError(e, 'image')});


        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', () => {
          infowindow.marker = null;
        });
      }
    }

  /*Works with the API response data and sets the infowindow content*/
  setInfowindowContent = (data, infowindow) => {
    const prefix = data.response.photos.items[0].prefix
    const suffix = data.response.photos.items[0].suffix

    //Size I want for the image
    const width = 120
    const height = 100
    const src = prefix+width+"x"+height+suffix

    const placeName = infowindow.marker.title

    //Added alt and title to the img for accesibility
    const content = '<div>' + placeName + '</div>' +
                    '<img src=' + src + ' alt="Image of ' + placeName +'" title="'+ placeName +'"></img>'

    infowindow.setContent(content);

    infowindow.open(this.map, infowindow.marker);

  }

  requestError = (e,part) => {
    console.log(e);
  }

  render() {
    let mapNavContainerStyle

    /*If the ListView is displayed, give this left padding to the container
    of the nav+map*/
    if(this.state.listViewVisible === true){
      mapNavContainerStyle = {
        paddingLeft: '230px'
      }
    }

    return (
      <div>
        <div id="map-nav-container" style={mapNavContainerStyle}>
          <div className="nav" role="navigation">
            {/*Added tabindex to be able to focus it with tab,
            and accesibility attributes*/}
            <div className="menu-icon"
            role="button"
            tabIndex="0"
            aria-label="Menu Icon"
            onClick={this.handleToggleList}
            onKeyPress={this.handleToggleList}
              >
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </div>
          {/*Added accesibility role*/}
          <div className="map" ref="map" role="application">
            loading map...
          </div>
        </div>

        {/*If the list should display*/}
        {this.state.listViewVisible === true &&
          <div>
            <ListView
              places={this.state.places}
              populateInfowindow={this.populateInfowindow}
              infowindow={this.state.infowindow}
              map={this.map}
              animateMarker={this.animateMarker}
              google={this.props.google}
            />
          </div>



        }






      </div>


    );
  }
}

export default Map;
