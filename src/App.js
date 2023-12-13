import React, { createContext, useContext, useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, useHits, RefinementList } from 'react-instantsearch';

import { Icon } from 'leaflet';
import { MapContainer, CircleMarker, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Card, Grid, Header, Segment } from 'semantic-ui-react';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import './App.css';

const searchClient = algoliasearch('U7CZJ2RARB', '121ea5cc1f8952b995a6c00076876143');

const UserContext = createContext();

function Hit({ hit }) {
  const { updateGeoloc } = useContext(UserContext);
  const _geoloc = [hit.Latitude, hit.Longitude];

  const handleClick = () => {
    console.log('Clicked on hit:', hit);
    updateGeoloc(_geoloc);
  };  

  return (
    <Card onClick={handleClick} style={{ padding: '5px', marginBottom: '10px' }} className='hoverable-card'>
      <Card.Content>
        <Card.Header>{hit.Country}</Card.Header>
        <Card.Meta>{hit.Lands}</Card.Meta>
        <Card.Description>
          <p>Depth: {hit.Depth}</p>
          <p>Magnitude: {hit.Magnitude}</p>
          <p>Date & Time: {hit['Date & Time']}</p>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}


function Markers({ hit }) {
  const _geoloc = [hit.Latitude, hit.Longitude];
  return (
    <Marker icon={new Icon({ iconUrl: markerIconPng })} position={_geoloc}>
      <Popup>
        <strong>Magnitude: {hit.Magnitude}</strong>
        <br />
        Country: {hit.Country},
        <br />
        Lands: {hit.Lands}
        <br />
        Date: {hit['Date & Time']}
      </Popup>
      <CircleMarker center={_geoloc} radius={hit.Depth} />
    </Marker>

  );
}


function MapEvents() {
  const { geoloc } = useContext(UserContext);
  const map = useMapEvents({
    click() {
      console.log("cool")
    },
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    // This will be triggered whenever geoloc is updated
    // Perform actions based on the updated geoloc value
    console.log('Geoloc updated:', geoloc);
    if (geoloc) {
      map.flyTo(geoloc, 10);
    }
  }, [geoloc]); // Dependency array ensures this effect runs when geoloc changes

  return null;
}





function App() {
  const [geoloc, setGeoloc] = useState(null);

  const updateGeoloc = (newGeoloc) => {
    // Check if the newGeoloc is different from the current geoloc
    if (!geoloc || newGeoloc[0] !== geoloc[0] || newGeoloc[1] !== geoloc[1]) {
      setGeoloc(newGeoloc);
    }
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="Earthquakes" insights={true}>
      <UserContext.Provider value={{ geoloc, updateGeoloc }}>
        <Segment textAlign="center" style={{ padding: '10px', border: 'none' }}>
          <Header as="h1">2023 Earthquake Search</Header>
          <SearchBox placeholder='Search for Earthquakes' />
        </Segment>
        <Grid columns={3} divided={false} stackable style={{ margin: '0 -10px' }}>
          <Grid.Column width={3} style={{ padding: '10px', maxHeight: '90vh', overflowY: 'auto' }}>
            <Hits hitComponent={(props) => <Hit {...props} />} />
          </Grid.Column>
          <Grid.Column width={3} style={{ padding: '10px' }}>
            <Segment style={{ border: '1px solid rgba(34,36,38,.1)', borderRadius: '7px' }}>
              <Header as="h3">Lands</Header>
              <RefinementList attribute="Lands" />
              <Header as="h3">Country</Header>
              <RefinementList attribute="Country" />
              <Header as="h3">Magnitude</Header>
              <RefinementList attribute="Magnitude" />
            </Segment>
          </Grid.Column>
          <Grid.Column width={9} style={{ padding: '10px' }}>
            <MapContainer
              center={[51.505, -0.09]}
              zoom={3}
              scrollWheelZoom={false}
              style={{
                height: '50vh',
                width: '100%',
                border: '1px solid rgba(34,36,38,.1)',
                borderRadius: '7px',
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Hits hitComponent={Markers} />
              <MapEvents />
            </MapContainer>
          </Grid.Column>
        </Grid>
      </UserContext.Provider>
    </InstantSearch>
  );
}

export default App;
