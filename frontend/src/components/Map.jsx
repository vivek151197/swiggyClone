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

const Map = ({ room }) => {
  const mapContainerRef = useRef(null)
  const { restaurant, mylocation, deliveryRoom } = OrderState()
  // initialize map when component mounts

  useEffect(() => {
    socket.emit('joinRoom', deliveryRoom)
  }, [deliveryRoom])

  useEffect(() => {
    let location = [77.644, 12.9614]

    if (room) {
      socket.emit('joinRoom', room)
    }

    socket.on('sendLocation', loc => {
      location = loc
    })

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: mylocation.length
        ? [mylocation.longitude, mylocation.latitude]
        : [77.644101, 12.961524],
      zoom: 18
    })

    // Creates new directions control instance
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      interactive: false,
      unit: 'metric',
      profile: 'mapbox/driving',
      controls: {
        inputs: false,
        instructions: false
      }
    })

    // Set origin and destination
    map.on('load', function () {
      if (restaurant) {
        directions.actions.setOriginFromCoordinates([
          mylocation.longitude,
          mylocation.latitude
        ])
        directions.actions.setDestinationFromCoordinates([
          restaurant.coords.longitude,
          restaurant.coords.latitude
        ])
      }
    })

    map.on('load', async () => {
      // Get the initial location of the deliveryPartner.

      map.loadImage(
        'https://res.cloudinary.com/vivekgeekskool/image/upload/v1651041678/ju6sgthzmfdahfzej5qx.png',
        function (error, image) {
          if (error) throw error
          map.addImage('scooter', image)
        }
      )

      const geojson = await getLocation()

      map.addSource('deliveryPartner', {
        type: 'geojson',
        data: geojson
      })

      // Add the rocket symbol layer to the map.
      map.addLayer({
        id: 'deliveryPartner',
        type: 'symbol',
        source: 'deliveryPartner',
        layout: {
          'icon-image': 'scooter',
          'icon-size': 0.75
        }
      })

      // Update the source every 2 seconds.
      const updateSource = setInterval(async () => {
        const geojson = await getLocation(updateSource)
        map.getSource('deliveryPartner').setData(geojson)
      }, 2000)

      async function getLocation (updateSource) {
        try {
          const response = {
            latitude: location[1],
            longitude: location[0]
          }

          const { latitude, longitude } = response

          // Fly the map to the location.
          map.flyTo({
            center: [longitude, latitude],
            speed: 3
          })

          // Return the location of the deliveryPartner as GeoJSON.
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
  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100vw',
        height: '75vh',
        margin: '1%',
        border: 'solid 1px black'
      }}
    />
  )
}

export default Map
