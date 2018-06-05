import React, { Component } from 'react';
import './ListView.css';
import ListItem from './ListItem.js';



import escapeRegExp from 'escape-string-regexp'

class ListView extends Component {

  /*Input query state*/
  state = {
    query: ''
  }

  updateQuery = (query) => {
    this.setState({query: query.trim() })
  }

  render() {

    const places = this.props.places
    const query = this.state.query
    const map = this.props.map
    let filteredPlaces

    //if someone typed
    if(query !== ''){

      //Taken from Udacity examples
      const match = new RegExp(escapeRegExp(query), 'i')
      /*Assign to filteredPlaces just the places that match with the query*/
      filteredPlaces = places.filter((place) => match.test(place.name))

      //clean all markers from the map
      places.forEach( place => {
        place.marker.setMap(null)
      })

      //paint only the filtered markers
      filteredPlaces.forEach( place => {
        place.marker.setMap(map)
      })

    }

    /*If the query is empty, paint all the markers*/
    else {
      filteredPlaces = places
      places.forEach( place => {

        /*If the marker object is not empty..
        this 'if' was needed to avoid the problem that this piece of code was
        run before the marker was assigned to the place*/
        if(Object.keys(place.marker).length > 0){
          place.marker.setMap(map)
        }
      })
    }


    return(
        <div className="list-view">
          <h1 className="title">Bondi Places</h1>
          {/*Added accessibility role*/}
          <input
            className='input'
            type='text'
            placeholder='filter places'
            role="textbox"
            value={query}
            onChange={(event) => this.updateQuery(event.target.value)}
          />

          <ol>
            {filteredPlaces.map(
              (place) =>
                <ListItem
                  key={place.name}
                  place={place}
                  places={this.props.places}
                  animateMarker={this.props.animateMarker}
                  google={this.props.google}
                  infowindow={this.props.infowindow}
                  populateInfowindow={this.props.populateInfowindow}
                  map={this.props.map}
                />
            )}
          </ol>

        </div>
    );



  }

}

export default ListView;
