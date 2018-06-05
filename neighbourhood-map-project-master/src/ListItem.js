import React, { Component } from 'react';

class ListItem extends Component {

  /*State to be able to know when the mouse is over the item*/
  state = {
    hover: false
  }

  //Self explicative
  toggleHover = () => {
    this.setState({ hover: !this.state.hover })
  }

  /*Populates infowindow calling callback functions from
  grandparent Map component*/
  handleOnClickListItem = (place) => {

    this.props.map.setCenter(place.marker.getPosition())
    this.props.animateMarker(place.marker, this.props.google)


    const clickedPlaceName = place.name
    let infowindow = this.props.infowindow

    //find which of the markers have to open the infowindow
    this.props.places.forEach(
      place => {
        if(place.name === clickedPlaceName){
          this.props.populateInfowindow(place, infowindow)
        }
      }
    )
  }


  render() {

    const place = this.props.place

    return(

      /*Toggle className depending on state, to be able to style it differently
      Added tabindex=0 to be able to focus it on tab*/
      <li
        className={this.state.hover ? "li-on-hover" : "li"}
        onMouseOver={this.toggleHover}
        onMouseLeave={this.toggleHover}
        onClick={() => this.handleOnClickListItem(place)}
        onKeyPress={() => this.handleOnClickListItem(place)}
        tabIndex="0"
      >
        {place.name}
      </li>

    )
  }


}

export default ListItem;
