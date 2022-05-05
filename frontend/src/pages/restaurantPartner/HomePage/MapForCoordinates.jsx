import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { OrderState } from '../../../components/Context'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY

const MapForCoordinates = ({ setLatitude, setLongitude, setAddress }) => {
  const mapContainerRef = useRef(null)
  const [location, setLocation] = useState(null)

  async function mapClickFn (coordinates) {
    const url = `https://open.mapquestapi.com/nominatim/v1/reverse.php?key=${process.env.REACT_APP_MAPQUESTAPI_KEY}&format=json&lat=${coordinates.lat}&lon=${coordinates.lng}`
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setAddress(data.display_name)
      })
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(loc =>
      setLocation({
        longitude: loc.coords.longitude,
        latitude: loc.coords.latitude
      })
    )
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: location
        ? [location.longitude, location.latitude]
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
      mapClickFn(e.lngLat)
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
      <div
        ref={mapContainerRef}
        style={{ width: '80vw', height: '80vh' }}
      ></div>
    </div>
  )
}

export default MapForCoordinates
