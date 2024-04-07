import React, { useState, useEffect, useCallback, useMemo} from 'react';
import Select from 'react-select';
import '../assets/css/tabsContent.css';

export default function Home() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [nearestLocations, setNearestLocations] = useState([]);
    const [activeTab, setActiveTab] = useState('SearchCarPark');

    const options = [
      { value: 'DKITCBPL', label: 'Dundalk Institue of Technology Carrolls(DKIT) Building Parking Lot' },
      { value: 'CA', label: 'Car Park A' },
      { value: 'RB', label: 'Random B' },
      { value: 'TC', label: 'Test C' },
      { value: 'WD', label: 'Whatever D' },
    ];

    const handleChange = selectedOption => {
      setSelectedOption(selectedOption);
    };

    const handleButtonClick = () => {
      if (selectedOption) {
          // Construct the URL for the Map component
          const url = '/map';
          // Change the URL of the current window
          window.location.href = url;
      }
  };


//Nearest Neighbour Algorithm for nearest car park
const calculateDistance = useCallback((userLoc, location) => {
  // Haversine formula to calculate distance between two points
  const earthRadius = 6371; // Radius of the earth in km
  const dLat = deg2rad(location.lat - userLoc.lat);
  const dLon = deg2rad(location.lon - userLoc.lon);
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(userLoc.lat)) *
      Math.cos(deg2rad(location.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c; // Distance in km
  return distance;
}, []);

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

useEffect(() => {
  // Get user's geolocation
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
              setUserLocation({
                  lat: position.coords.latitude,
                  lon: position.coords.longitude
              });
          },
          (error) => {
              console.error('Error getting user location:', error);
          }
      );
  } else {
      console.error('Geolocation is not supported by this browser.');
  }
}, []);

useEffect(() => {
  if (userLocation) {
      // Dummy locations data
      const yourLocations = [
          { name: 'DKIT Parking Lot Carroll Building', lat: 53.982554, lon: -6.392210 },
          { name: 'Marshes Upper Parking Lot 2', lat: 53.983870, lon: -6.394733 },
          { name: 'Marshes Upper Parking Lot 1', lat: 53.984519, lon: -6.395071 },
          { name: 'Marshes Upper Parking Lot 3', lat: 53.984777, lon: -6.391533 },
          { name: 'Marshes Upper Parking Lot 4', lat: 53.985524, lon: -6.392169 },
          { name: 'Marshes Upper Parking Lot 5', lat: 53.986001, lon: -6.395182 },
          { name: 'Marshes Upper Parking Lot 6', lat: 53.986081, lon: -6.394525 },
          { name: 'Marshes Upper Parking Lot 7', lat: 53.986426, lon: -6.393147 },
          { name: 'Marshes Upper Parking Lot 8', lat: 53.980373, lon: -6.389605 },
          { name: 'Marshes Upper Parking Lot 9', lat: 53.980879, lon: -6.388243 },
          { name: 'Marshes Upper Parking Lot 10', lat: 53.981221, lon: -6.388539 },
          { name: 'Mc Grath Rd Parking', lat: 54.121414, lon: -6.738401 },
          { name: 'Onomy Parking Lot', lat: 54.118893, lon: -6.736152 }
          // Add more locations as needed
      ];

      // Calculate distances
      const sortedLocations = yourLocations.sort((a, b) => {
          const distanceA = calculateDistance(userLocation, a);
          const distanceB = calculateDistance(userLocation, b);
          return distanceA - distanceB;
      });

      // Select top 5 nearest locations
      const nearest = sortedLocations.slice(0, 5);
      setNearestLocations(nearest);
  }
}, [userLocation, calculateDistance]);

  const openTab = (tabName) => {
    // Set the active tab
    setActiveTab(tabName);
  };

  const optionsCarPark = useMemo(() => {
    return nearestLocations.map(location => {
        const distance = calculateDistance(userLocation, location).toFixed(2);
        return {
            value: location.name,
            label: `${location.name} - Distance: ${distance} km`
        };
    });
}, [nearestLocations, userLocation, calculateDistance]);
    
    return <>
     <div className="container">
     <img src="/logo.png" alt="logo"  className="image"/>
     <br></br>
    <div className="tab">
    <button className={`tablinks ${activeTab === 'SearchCarPark' ? 'active' : ''}`} onClick={() => openTab('SearchCarPark')}>Search</button>
    <button className={`tablinks ${activeTab === 'NearestCarPark' ? 'active' : ''}`} onClick={() => openTab('NearestCarPark')}>Nearest</button>
    </div>
    <div id="SearchCarPark" className="tabcontent" style={{ display: activeTab === 'SearchCarPark' ? 'block' : 'none' }}>
    <h1><b>Select Car Park</b></h1>
        <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isSearchable={true} // Enables search functionality
        placeholder="Search or select an option..."
        className="react-select-container"
        classNamePrefix="react-select"
      />
      <br></br>
      <button className="search-button" onClick={handleButtonClick}>Car Park Search</button>
      </div>

      <div id="NearestCarPark" className="tabcontent" style={{ display: activeTab === 'NearestCarPark' ? 'block' : 'none' }}>
      <h1><b>Nearest Car Park</b></h1>
      <p>User Location: {userLocation ? `${userLocation.lat}, ${userLocation.lon}` : 'Loading...'}</p>
      <table className='nearestTable'>
        <thead>
          <tr>
            <th>Car Park</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>
        {nearestLocations.map((location, index) => (
            <tr key={index}>
                <td>{location.name}</td>
                <td>{calculateDistance(userLocation, location).toFixed(2)} km</td>
            </tr>
        ))}
      </tbody>
      </table>

      <Select
        value={selectedOption}
        onChange={handleChange}
        options={optionsCarPark}
        menuPlacement="top"
        isSearchable={true} // Enables search functionality
        placeholder="Search or select an option..."
        className="react-select-container"
        classNamePrefix="react-select"
      />
      <br></br>
      <button className="search-button" onClick={handleButtonClick}>Car Park Search</button>


      </div>


    
     </div>
    </>
}
