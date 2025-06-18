import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import './MapaMundi360.css';

const puntosReservas = [
  {
    name: 'Reserva del Toro',
    lat: 39.4906,
    lng: 2.5893,
    link: 'https://drive.google.com/file/d/EXAMPLE_TORO/view',
    description: 'Reserva marina protegida en las aguas cristalinas de Mallorca',
    depth: '15-40m',
    species: 'Posidonia, Mero, Corvina'
  },
  {
    name: 'Reserva de Cabrera',
    lat: 39.1514,
    lng: 2.9639,
    link: 'https://drive.google.com/file/d/EXAMPLE_CABRERA/view',
    description: 'Parque Nacional Marítimo-Terrestre del Archipiélago de Cabrera',
    depth: '5-60m',
    species: 'Coral rojo, Langosta, Dentón'
  }
];

const MapaMundi360: React.FC = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstance = useRef<any>(null);
  const [selectedReserva, setSelectedReserva] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!globeRef.current) return;

    const world = Globe()(globeRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .backgroundColor('rgba(0, 29, 61, 0)')
      .showAtmosphere(true)
      .atmosphereColor('#00d4ff')
      .atmosphereAltitude(0.15)
      .pointOfView({ lat: 39.6, lng: 3.0, altitude: 1.2 }, 2000)
      .pointsData(puntosReservas)
      .pointLat('lat')
      .pointLng('lng')
      .pointColor(() => '#ff6b35')
      .pointAltitude(0.01)
      .pointRadius(0.3)
      .onPointClick((point) => {
        setSelectedReserva(point);
      })
      .onPointHover((point) => {
        globeRef.current!.style.cursor = point ? 'pointer' : 'grab';
      });

    const controls = world.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 20;
    controls.maxDistance = 2000;
    controls.zoomSpeed = 1.2;
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;

    globeInstance.current = world;

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      if (globeRef.current) {
        globeRef.current.innerHTML = '';
      }
    };
  }, []);

  const closeModal = () => {
    setSelectedReserva(null);
  };

  const openLink = (link: string) => {
    window.open(link, '_blank');
  };

  const focusOnMallorca = () => {
    if (globeInstance.current) {
      globeInstance.current.pointOfView({
        lat: 39.6,
        lng: 2.9,
        altitude: 0.02
      }, 2000);
    }
  };

  const globalView = () => {
    if (globeInstance.current) {
      globeInstance.current.pointOfView({
        lat: 39.6,
        lng: 3.0,
        altitude: 1.2
      }, 2000);
    }
  };

  const focusOnReserva = (reserva: any) => {
    if (globeInstance.current) {
      globeInstance.current.pointOfView({
        lat: reserva.lat,
        lng: reserva.lng,
        altitude: 0.015
      }, 2000);
    }
  };

  return (
    <div className="mapa-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="wave-loader">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
            </div>
            <h2>Cargando Portal Submarino...</h2>
            <p>Preparando las profundidades marinas</p>
          </div>
        </div>
      )}

      <header className="portal-header">
        <div className="header-content">
          <h1 className="portal-title">
            <span className="wave-icon">🌊</span>
            Portal Submarino
          </h1>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">{puntosReservas.length}</span>
              <span className="stat-label">Reservas</span>
            </div>
          </div>
        </div>
      </header>

      <div className="globe-container">
        <div ref={globeRef} className="globe-canvas" />
        
        <div className="controls-panel">
          <div className="control-item">
            <span className="control-icon">🖱️</span>
            <span>Arrastra para rotar</span>
          </div>
          <div className="control-item">
            <span className="control-icon">🔍</span>
            <span>Scroll para zoom</span>
          </div>
        </div>

        <div className="navigation-panel">
          <h3>🏝️ Mallorca</h3>
          <button className="nav-button" onClick={globalView}>
            🌍 Vista Global
          </button>
          <button className="nav-button" onClick={focusOnMallorca}>
            ✈️ Vista Aérea
          </button>
          {puntosReservas.map((reserva, index) => (
            <button 
              key={index}
              className="nav-button small"
              onClick={() => focusOnReserva(reserva)}
            >
              🤿 {reserva.name}
            </button>
          ))}
        </div>
      </div>

      {selectedReserva && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <h2>{selectedReserva.name}</h2>
              <div className="coordinates">
                📍 {selectedReserva.lat.toFixed(4)}°, {selectedReserva.lng.toFixed(4)}°
              </div>
            </div>

            <div className="modal-body">
              <p className="description">{selectedReserva.description}</p>
              
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-icon">🏊‍♂️</span>
                  <div>
                    <strong>Profundidad</strong>
                    <p>{selectedReserva.depth}</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🐠</span>
                  <div>
                    <strong>Especies</strong>
                    <p>{selectedReserva.species}</p>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="explore-button"
                  onClick={() => openLink(selectedReserva.link)}
                >
                  🔍 Explorar en 360°
                </button>
                <button 
                  className="focus-button"
                  onClick={() => {
                    focusOnReserva(selectedReserva);
                    closeModal();
                  }}
                >
                  🎯 Enfocar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaMundi360;