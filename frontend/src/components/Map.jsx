import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
import { OrderState } from '../components/Context'
import { io } from 'socket.io-client'

const ENDPOINT = process.env.ENDPOINT
const socket = io.connect(ENDPOINT)

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY

const Map = () => {
  const mapContainerRef = useRef(null)
  const { restaurant, mylocation } = OrderState()

  // initialize map when component mounts
  useEffect(() => {
    let location = [77.6, 12.9]
    socket.on('sendLocation', loc => {
      location = loc
      console.log(location)
    })

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: mylocation.length
        ? [mylocation.longitude, mylocation.latitude]
        : [77.644101, 12.961524],
      zoom: 13
    })

    // Creates new directions control instance
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      interactive: false,
      unit: 'metric',
      profile: 'mapbox/driving',
      controls: {
        inputs: true,
        instructions: false
      }
    })

    // Set origin and destination
    map.on('load', function () {
      if (restaurant) {
        directions.actions.setDestinationFromCoordinates([
          restaurant.coords.longitude,
          restaurant.coords.latitude
        ])
        directions.actions.setOriginFromCoordinates([
          mylocation.longitude,
          mylocation.latitude
        ])
      }
    })

    map.on('load', async () => {
      // Get the initial location of the International Space Station (ISS).
      const geojson = await getLocation()
      // Add the ISS location as a source.
      map.addSource('iss', {
        type: 'geojson',
        data: geojson
      })
      // Add the rocket symbol layer to the map.
      map.addLayer({
        id: 'iss',
        type: 'symbol',
        source: 'iss',
        layout: {
          'icon-image': 'rocket-15',
          'icon-size': 1.5
        }
      })

      // Update the source from the API every 2 seconds.
      const updateSource = setInterval(async () => {
        const geojson = await getLocation(updateSource)
        map.getSource('iss').setData(geojson)
      }, 2000)

      async function getLocation (updateSource) {
        // Make a GET request to the API and return the location of the ISS.
        try {
          const response = {
            latitude: location[1],
            longitude: location[0]
          }

          // console.log(response)
          const { latitude, longitude } = response
          // Fly the map to the location.
          map.flyTo({
            center: [longitude, latitude],
            speed: 2
          })
          // Return the location of the ISS as GeoJSON.
          return {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude]
                }
              }
            ]
          }
        } catch (err) {
          // If the updateSource interval is defined, clear the interval to stop updating the source.
          if (updateSource) clearInterval(updateSource)
          throw new Error(err)
        }
      }
    })

    // Integrates directions control with map
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
    map.addControl(directions, 'top-left')

    // clean up on unmount
    return () => map.remove()
  }, [])
  return <div ref={mapContainerRef} style={{ width: '75vw', height: '75vh' }} />
}

export default Map
