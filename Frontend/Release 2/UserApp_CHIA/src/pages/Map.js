import React, { useState, useEffect, useCallback } from 'react';
import PubNub from 'pubnub';
import Papa from 'papaparse';
import '../assets/css/curtainMenu.css';

export default function Map() {
    const [rectangles, setRectangles] = useState([]);
    const [saveSpace, setSaveSpace] = useState([]);
    const [selectedRect, setSelectedRect] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [savemenuOpen, setSaveMenuOpen] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [nearestLocations, setNearestLocations] = useState([]);
    const [colorChangeActive, setColorChangeActive] = useState(false);

    useEffect(() => {

      const pubnub = new PubNub({
          subscribeKey: process.env.REACT_APP_SUBSCRIBEKEY,
          uuid: 'parktesting'
        });

      pubnub.subscribe({
          channels: [process.env.REACT_APP_CHANNEL],
        });
      
        pubnub.addListener({
          message: (message) => {
            // Assuming the message format is { ids: [id1, id2, ...], booleans: [bool1, bool2, ...] }
            const { id_list, boolean_values } = message.message;
    
            // Update state based on the received message
            const updatedRectangles = rectangles.map((rect) => {
              const index = id_list.indexOf(rect.id);
              // Convert the Python boolean value to lowercase in JavaScript
              if (index !== -1) {
                const lowerCaseBoolean = boolean_values[index] ? 'true' : 'false';
      
                if (rect.type && typeof rect.type === 'string' && rect.type === 'Disabled') {
                    // Set blue color for specific IDs
                    rect.color = lowerCaseBoolean === 'true' ? 'lightskyblue' : 'red';
                  }else if (rect.type && typeof rect.type === 'string' && rect.type === 'Tesla'){
                    rect.color = lowerCaseBoolean === 'true' ? '#FFC000' : 'red';
                  }
                  else {
                  // Change the color based on the boolean value
                  rect.color = lowerCaseBoolean === 'true' ? 'limegreen' : 'red';
                }
            }
    
              return rect;
            });
    
            setRectangles(updatedRectangles);
          },
        });

        return () => {
          pubnub.unsubscribeAll();
          pubnub.stop();
        };
      }, [rectangles]);
      
        useEffect(() => {
            const fetchData = async () => {
              try {
                const response = await fetch('/data/allXYReact.csv'); // Update the path accordingly
                const csvData = await response.text();
        
                // Parse CSV data using papaparse
                Papa.parse(csvData, {
                  header: true,
                  dynamicTyping: true,
                  complete: (result) => {
                    const initialRectangles = result.data.map(({ id, x1, y1, lat, lng, type }) => {
                        let color;
                        let w;
                        let h;

                        if (id && typeof id === 'string' && parseInt(id.substring(1)) >= 137 && parseInt(id.substring(1)) <= 139) {
                            color = 'limegreen';
                            w = 69;  // Set a different color for the specified range
                            h = 23;
                        } else if (type && typeof type === 'string' && type === 'Disabled'){
                            color = 'lightskyblue';
                            w = 25;
                            h = 32;
                        } else if (type && typeof type === 'string' && type === 'Tesla'){
                        color = '#FFC000';
                        w = 25;
                        h = 32;
                        }else {
                            color = 'limegreen';
                            w = 27;
                            h = 32;
                        }

                        return {
                            id,
                            x1,
                            y1,
                            w,
                            h,
                            color,
                            lat,
                            lng,
                            type,
                                };
                    });
                    
                    // Initialize the state with initial rectangles
                    setRectangles(initialRectangles);
                  },
                });
              } catch (error) {
                console.error('Error fetching or parsing data:', error);
              }
            };
        
            fetchData();
          }, []);


          // const handleRectClick = (destLat, destLng) => {
          //   // Check if the browser supports the Geolocation API
          //   if (navigator.geolocation) {
          //     navigator.geolocation.getCurrentPosition(
          //       (position) => {
          //         const { latitude, longitude } = position.coords;
          //         const googleMapsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${destLat},${destLng}`;
          //         window.location.href = googleMapsUrl;
          //       },
          //       (error) => {
          //         console.error('Error getting current location:', error);
          //       }
          //     );
          //   } else {
          //     console.error('Geolocation is not supported by your browser');
          //   }
          // };

          // Function to handle the color change button click
            const handleColorChange = () => {
              setColorChangeActive(!colorChangeActive);
          };

          const handleRectClick = (rect) => {
            setSelectedRect(rect);
          };
        
          const handleClosePopUp = () => {
            setSelectedRect(null);
          };

          const handleButtonClick = (destLat, destLng) => {
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
          
            // Check if it's a mobile device
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          
            if (isMobile) {
              window.location.href = googleMapsUrl;
            } else {
              // If not on a mobile device, provide a fallback behavior (e.g., open in a new tab)
              window.open(googleMapsUrl, '_blank');
            }
          };

          const handleBackClick = () => {
                const url = '/';
                // Change the URL of the current window
                window.location.href = url;
        };

        const openNav = () => {
          setMenuOpen(true);
        };
      
        const closeNav = () => {
          setMenuOpen(false);
        };

        const openSaveNav = () => {
          setSaveMenuOpen(true);
        };
      
        const closeSaveNav = () => {
          setSaveMenuOpen(false);
        };

        const saveSpaceToLocal = (id,lat,lng) => {

          const saveData ={
            id: id,
            lat: lat,
            lng: lng
          };

          //const existingData = JSON.parse(localStorage.getItem('SaveCarPark')) || [];
          const newData = [saveData]; // Replace existing data with new data
          localStorage.setItem('SaveCarPark', JSON.stringify(newData));
          console.log('Car Park data saved to local storage.');
          fetchAndUpdateSpaceData();
          setShowMessage(true);

          // Hide the message box after 2 seconds
          setTimeout(() => {
            setShowMessage(false);
          }, 2000); // 2000 milliseconds = 2 seconds
        };

        const fetchAndUpdateSpaceData = () => {
          // Retrieve saved rectangle data from local storage
          const savedSpace = JSON.parse(localStorage.getItem('SaveCarPark')) || [];
          setSaveSpace(Array.isArray(savedSpace) ? savedSpace : [savedSpace]);
        }; // Empty dependency array ensures this effect runs only once, similar to componentDidMount

        useEffect(() => {
          fetchAndUpdateSpaceData();
        }, []);

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
  if (userLocation && rectangles.length > 0) {
    // Filter out rectangles with red color
    const carParks = rectangles.filter(rect => rect.color !== 'red');

    // Calculate distances from each rectangle to the user's location
    const sortedCarParks = carParks.map(rect => {
      const distance = calculateDistance(userLocation, { lat: rect.lat, lon: rect.lon });
      return { ...rect, distance };
    });

    // Sort the car parks based on distance
    sortedCarParks.sort((a, b) => a.distance - b.distance);

    // Select top 5 nearest car parks
    const nearest = sortedCarParks.slice(0, 5);
    setNearestLocations(nearest);
  }
}, [userLocation, rectangles, calculateDistance]);

    
      



    return <>
                <main className="main">
                   {/* The overlay */}
                    <div id="myNav" className={`overlay ${menuOpen ? 'open' : ''}`}>
                      {/* Button to close the overlay navigation */}
                      <span className="closebtn" onClick={closeNav}>&times;</span>
                      {/* Overlay content */}
                      <div className="overlay-content">
                        <p><img src="/freeSpace.png" alt="freeSpace" /> - Free Space</p>
                        <p><img src="/freeTesla.png" alt="freeTesla" /> - Free Tesla Space</p>
                        <p><img src="/freeDisabled.png" alt="freeDisabled" /> - Free Disabled Space</p>
                        <p><img src="/nearSpace.png" alt="freeNear" /> - Free Nearest Space</p>
                        <p><img src="/takenSpace.png" alt="takenSpace" /> - Space Taken</p>
                        <p><img className="overCimg" src="/saveSpace.png" alt="saveSpace" /> - Saved Park</p>
                        <p><img className="overCimg2" src="/nearest.png" alt="nearSpace" /> - Nearest 5 Parks</p>
                      </div>
                    </div>

                    {/* Use any element to open/show the overlay navigation menu */}
                    <span className="openBtn" onClick={openNav}>?</span>
               
                <section className="section">
                    <div className="parking-area">
                
                    <svg 
                    className='cpMap'
                    width="100%"  // Set the width to 100% to scale with the device width
                    height="100%" // Set the height to 100% to scale with the device height
                    viewBox="0 0 1215 670" // Define the coordinate system and aspect ratio
                    preserveAspectRatio="xMidYMid meet" >
                    {rectangles.map((rect) => (
                       <g key={rect.id}>
                       <rect
                          id={rect.id}
                          x={rect.x1}
                          y={rect.y1}
                          width={rect.w}
                          height={rect.h}
                          fill={colorChangeActive && nearestLocations.some(location => location.id === rect.id)
                                ? 'orange'
                                : rect.color}
                          onClick={() => handleRectClick(rect)}
                       />
                       {rect.type === "Tesla" && (
                           <image
                           xlinkHref="/tesla.png"
                           x={rect.x1 -5}
                           y={rect.y1}
                           width={rect.w + 10}
                           height={rect.h}
                           onClick={() => handleRectClick(rect)}
                           />
                       )}
                       {rect.type === "Disabled" && (
                           <image
                               href="/disabled.png" // Replace with the actual path to your disabled image
                               x={rect.x1 -5}
                               y={rect.y1}
                               width={rect.w +10}
                               height={rect.h}
                               onClick={() => handleRectClick(rect)}
                           />
                       )}
                   </g>
                    ))}
                    </svg>
                
                    <button className="circle-button" onClick={handleBackClick}>X</button>
                    <div className='saveMenu'>
                    {/* The overlay */}
                    <div id="mySaveNav" className={`overlay ${savemenuOpen ? 'open' : ''}`}>
                      {/* Button to close the overlay navigation */}
                      <span className="closebtn" onClick={closeSaveNav}>&times;</span>
                      {/* Overlay content */}
                      <div className="overlay-content">
                          <p>Saved Car Park</p>
                          {saveSpace.map(ss => (
                              <div key={ss.id}> {/* Added a div wrapper */}
                                <p>ID: {ss.id} <br/> Lat: {ss.lat} <br/>Lng: {ss.lng}</p>
                                <button onClick={() => handleButtonClick(ss.lat, ss.lng)}>Guide</button>
                              </div>
                              ))}
                      </div>
                    </div>
                    </div>

                    {/* Use any element to open/show the overlay navigation menu */}
                    <span className="save-openBtn" onClick={openSaveNav}><img src="/saveSpace.png" alt="saveSpace" /></span>
                    {/* Button to toggle color change */}
                    <span className="nearest-openBtn" onClick={handleColorChange}><img src="/nearest.png" alt="nearestSpace" /></span>
            </div>
            
        </section>
        </main>
        {selectedRect && (
        <div className="popup-box" onClick={handleClosePopUp}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <p>{selectedRect.id}</p>
            <button onClick={() => handleButtonClick(selectedRect.lat, selectedRect.lng)}>Guide</button>
            <button className="closeButton" onClick={handleClosePopUp}>x</button>
            <button onClick={() => saveSpaceToLocal(selectedRect.id, selectedRect.lat, selectedRect.lng)}>Save</button>
            {showMessage && <div>Car Park {selectedRect.id} Saved</div>}
          </div>
        </div>
      )}
        <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    
    
    
    </>
}
