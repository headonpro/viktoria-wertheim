'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { IconMapPin } from '@tabler/icons-react'

interface MapComponentProps {
  latitude: number
  longitude: number
  title?: string
  address?: string
}

function MapComponentInner({ latitude, longitude, title = 'SV Viktoria Wertheim', address }: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [mapView, setMapView] = useState<'street' | 'satellite'>('satellite')
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setMapReady(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!isMounted || !mapReady) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-viktoria-dark dark:to-viktoria-dark-lighter h-96 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <IconMapPin size={48} className="text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Karte wird geladen...
          </p>
        </div>
      </div>
    )
  }

  // Import dynamically to avoid SSR issues
  let MapContainer, TileLayer, Marker, Popup, L
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const leafletComponents = require('react-leaflet')
    MapContainer = leafletComponents.MapContainer
    TileLayer = leafletComponents.TileLayer
    Marker = leafletComponents.Marker
    Popup = leafletComponents.Popup
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    L = require('leaflet')
  } catch (error) {
    console.error('Error loading map components:', error)
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-viktoria-dark dark:to-viktoria-dark-lighter h-96 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <IconMapPin size={48} className="text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Karte konnte nicht geladen werden
          </p>
        </div>
      </div>
    )
  }

  // Fallback to default icon URL if custom icons not available
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  return (
    <div className="relative">
      {/* Map View Toggle */}
      <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-viktoria-dark rounded-lg shadow-lg p-1">
        <button
          onClick={() => setMapView('street')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            mapView === 'street' 
              ? 'bg-viktoria-blue text-white dark:bg-viktoria-yellow dark:text-gray-900' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter'
          }`}
        >
          Straße
        </button>
        <button
          onClick={() => setMapView('satellite')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            mapView === 'satellite' 
              ? 'bg-viktoria-blue text-white dark:bg-viktoria-yellow dark:text-gray-900' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter'
          }`}
        >
          Satellit
        </button>
      </div>

      <MapContainer 
        center={[latitude, longitude]} 
        zoom={19} 
        style={{ height: '400px', width: '100%', borderRadius: '0.75rem' }}
        className="z-0"
      >
        {mapView === 'street' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}
        
        <Marker position={[latitude, longitude]} icon={defaultIcon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-viktoria-blue dark:text-viktoria-yellow">
                {title}
              </h3>
              {address && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {address}
                </p>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs bg-viktoria-blue dark:bg-viktoria-yellow text-white dark:text-gray-900 px-3 py-1 rounded hover:opacity-90 transition-opacity"
              >
                Route planen →
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

// Export as dynamic component with SSR disabled
const MapComponent = dynamic(
  () => Promise.resolve(MapComponentInner),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-viktoria-dark dark:to-viktoria-dark-lighter h-96 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <IconMapPin size={48} className="text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Karte wird geladen...
          </p>
        </div>
      </div>
    )
  }
)

export default MapComponent