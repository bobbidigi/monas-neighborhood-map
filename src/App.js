import React, { Component } from 'react'
import './App.css'

import axios from 'axios'

class App extends Component {


  state = {//per drunkenkismister 12/18/2018
        museums:[],
  map:null,
  infoWindow:null,
  }

  componentDidMount() {
    this.getMuseums();//calls the foursquare API
  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyD1DrDBUd6GNL2EIBCxK-K0OjkTny8kbuA&callback=initMap")
    window.initMap = this.initMap
  }

  getMuseums = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "HIRKFSR3XS50SWWU5FBG4DI4LN5PWI0OKKPWW4UDP13ZPHSN",
      client_secret: "RE4NWN115A1JETCAKMHQTZZ4VOLCMTK2LZNZUPN5K1PEEKOX",
      query: "museums",
      near:"Grand Rapids",
      v:"201849548"
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          museums: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        console.log("ERROR!! " + error)
      })

  }

  initMap = () => {

    // Create A Map
   const map = new window.google.maps.Map(document.getElementById('map'), {
    center: { lat: 42.96, lng: -85.7053 },//my home wyoming, mi
      zoom: 8
    })

    // Create An InfoWindow
   let infowindow = new window.google.maps.InfoWindow()

    // Display Dynamic Markers
    this.state.museums.map(grMuseums => {

      var contentString = `${grMuseums.venue.name}`

      // Create A Marker
      var marker = new window.google.maps.Marker({
        position: {lat: grMuseums.venue.location.lat , lng: grMuseums.venue.location.lng},
        map: map,
        title: grMuseums.venue.name
      })

      // Click on A Marker!
      marker.addListener('click', function() {

        // Change the content
        infowindow.setContent(contentString)

        // Open An InfoWindow
        infowindow.open(map, marker)
      })

    })

    

  }

  render() {
    return (
      <main>
        <div id="map"></div>
      </main>
    )
  }
}

function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;
