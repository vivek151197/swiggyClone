import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { OrderState } from '../../../components/Context'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY

const MapForCoordinates = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude
}) => {
  const mapContainerRef = useRef(null)
  const { restaurant, mylocation } = OrderState()

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: mylocation.length
        ? [mylocation.longitude, mylocation.latitude]
        : [77.644101, 12.961524],
      zoom: 18
    })

    const marker = new mapboxgl.Marker()

    function addMarker (event) {
      const coordinates = event.lngLat
      marker.setLngLat(coordinates).addTo(map)
    }

    map.on('click', e => {
      addMarker(e)
      setLatitude(e.lngLat.lat)
      setLongitude(e.lngLat.lng)
    })

    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    )

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  }, [])

  return (
    <div>
      <div>
        [{longitude}, {latitude}]
      </div>
      <div
        ref={mapContainerRef}
        style={{ width: '80vw', height: '80vh' }}
      ></div>
    </div>
  )
}

export default MapForCoordinates
