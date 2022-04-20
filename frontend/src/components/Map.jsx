import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
import { OrderState } from '../components/Context'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY

const Map = () => {
  const mapWrapper = useRef(null)
  const { restaurant, mylocation } = OrderState()

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapWrapper.current,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [77.6441493, 12.9614557],
      zoom: 13
    })

    // Creates new directions control instance
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      controls: {
        inputs: false,
        instructions: false
      }
    })

    // Set origin and destination
    map.on('load', function () {
      directions.actions.setOriginFromCoordinates([
        restaurant.coords.longitude,
        restaurant.coords.latitude
      ])
      directions.actions.setDestinationFromCoordinates([
        mylocation.longitude,
        mylocation.latitude
      ])
    })

    // Integrates directions control with map
    map.addControl(directions, 'top-left')
  }, [])
  return <div ref={mapWrapper} style={{ width: '75vw', height: '75vh' }} />
}

export default Map
