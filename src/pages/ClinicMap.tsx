import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { clinicLocations } from '../services/mockData';
import type { ClinicLocation } from '../types';
import Badge from '../components/ui/Badge';

const COLORS: Record<ClinicLocation['type'], string> = { Hospital:'#2A4CDB', Clinic:'#1F9D66', Lab:'#E8A33D', Pharmacy:'#D64545' };

function FlyTo({ loc }:{ loc: ClinicLocation | null }){
  const map=useMap();
  if(loc) map.flyTo([loc.lat,loc.lng], 14, { duration:0.8 });
  return null;
}

export default function ClinicMap(){
  const [selected,setSelected]=useState<ClinicLocation|null>(null);

  return (
    <div className="space-y-4">
      <div>
        <span className="ticket-tag">LOCATIONS · OPENSTREETMAP</span>
        <h1 className="font-display text-2xl font-semibold mt-2">Find Us</h1>
        <p className="text-slate text-sm mt-1">MediCare network across Bengaluru — click a card to fly the map.</p>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-4 items-start">
        <div className="card !p-2">
          <MapContainer center={[12.9716,77.5946]} zoom={12} scrollWheelZoom className="h-[420px] rounded-lg z-0">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyTo loc={selected}/>
            {clinicLocations.map(loc=>(
              <CircleMarker key={loc.id} center={[loc.lat,loc.lng]} radius={10}
                pathOptions={{ color:'#fff', weight:2, fillColor:COLORS[loc.type], fillOpacity:0.95 }}
                eventHandlers={{ click:()=>setSelected(loc) }}>
                <Tooltip direction="top" offset={[0,-8]}>{loc.name}</Tooltip>
                <Popup>
                  <div style={{fontFamily:'Inter,sans-serif', minWidth:180}}>
                    <strong>{loc.name}</strong><br/>
                    <span style={{fontSize:12,color:'#666'}}>{loc.address}</span><br/>
                    <span style={{fontSize:12}}>☎ {loc.phone} · {loc.hours}</span>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="grid gap-3">
          {clinicLocations.map(loc=>(
            <button key={loc.id} onClick={()=>setSelected(loc)}
              className={`card text-left py-4 transition-all ${selected?.id===loc.id ? 'ring-2 ring-cobalt' : 'hover:border-ink dark:hover:border-paperdark'}`}>
              <div className="flex justify-between gap-3 items-center">
                <p className="font-medium text-sm">{loc.name}</p>
                <Badge variant={loc.type==='Hospital'?'default':loc.type==='Clinic'?'success':loc.type==='Lab'?'warning':'danger'}>{loc.type}</Badge>
              </div>
              <p className="text-xs text-slate mt-1">{loc.address}</p>
              <p className="text-xs text-slate mt-0.5">☎ {loc.phone} · {loc.hours}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate">
        {Object.entries(COLORS).map(([t,c])=>(
          <span key={t} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background:c}}/> {t}</span>
        ))}
        <span className="ml-auto mini-tag">Map data © OpenStreetMap contributors</span>
      </div>
    </div>
  );
}
