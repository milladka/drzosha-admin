"use client"
import { Map, Marker } from "pigeon-maps";

export default function MapComponent({ latitude, longitude, onClick }) {
    return (
        <Map onClick={onClick} defaultCenter={[Number(latitude), Number(longitude)]} defaultZoom={15}>
            <Marker width={50} anchor={[Number(latitude), Number(longitude)]} />
        </Map>
    )
}
