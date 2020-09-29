import React from 'react'
import { Map as LeafletMap, TileLayer} from "react-leaflet"
import './Map.css'
import { showDataOnMap } from './util'

function Map({countries, center, casesType, zoom}) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attributes='&copy; <a href="https://osm.org/copyright">OpenStreet</a> contributors'
                />
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>


    )
}

export default Map
