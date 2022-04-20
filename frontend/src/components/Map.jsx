import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
import { OrderState } from '../components/Context'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY

const Map = () => {
  const mapContainerRef = useRef(null)
  const { restaurant, mylocation } = OrderState()

  // initialize map when component mounts

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
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
      directions.actions.setDestinationFromCoordinates([
        restaurant.coords.longitude,
        restaurant.coords.latitude
      ])
      directions.actions.setOriginFromCoordinates([
        mylocation.longitude,
        mylocation.latitude
      ])
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
