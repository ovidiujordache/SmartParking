import React, { useState, useEffect } from 'react';
import PubNub from 'pubnub';
import Papa from 'papaparse';
import Navbar from './Navbar';

export default function Map() {
    const [rectangles, setRectangles] = useState([]);
    const [selectedRect, setSelectedRect] = useState(null);

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

          

    return <>
                  <Navbar />
                <main className="main">
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
                        fill={rect.color}
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
            </div>
            
        </section>
        </main>
        {selectedRect && (
        <div className="popup-box" onClick={handleClosePopUp}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <p>{selectedRect.id}</p>
            <button onClick={() => handleButtonClick(selectedRect.lat, selectedRect.lng)}>Guide</button>
            <button onClick={handleClosePopUp}>Close</button>
          </div>
        </div>
      )}
        <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    
    
    
    </>
}
