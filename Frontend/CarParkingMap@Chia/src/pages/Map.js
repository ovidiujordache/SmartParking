import React, { useState, useEffect } from 'react';
import PubNub from 'pubnub';
import Papa from 'papaparse';
//import { PubNubProvider, usePubNub } from 'pubnub-react';

// const pubnub = new PubNub({
//     publishKey: 'pub-c-c8790175-ae39-4130-a3fb-82813e3223c1',
//     subscribeKey: 'sub-c-2b6af46d-54c7-4768-960e-c203cc8fa80c',
//     uuid: 'parktesting'
//   });

export default function Map() {
    const [rectangles, setRectangles] = useState([]);
        useEffect(() => {

        const pubnub = new PubNub({
            subscribeKey: 'sub-c-2b6af46d-54c7-4768-960e-c203cc8fa80c',
            uuid: 'parktesting'
          });

        pubnub.subscribe({
            channels: ['camerav3_channel'],
          });
        
          pubnub.addListener({
            message: (message) => {
              // Assuming the message format is { ids: [id1, id2, ...], booleans: [bool1, bool2, ...] }
              const { id_list, boolean_values } = message.message;
      
              // Update state based on the received message
              const updatedRectangles = rectangles.map((rect) => {
                const index = id_list.indexOf(rect.id);
                const isBlueID = ['B247', 'B248', 'B249', 'B250', 'B251', 'B252'].includes(rect.id);
                // Convert the Python boolean value to lowercase in JavaScript
                const lowerCaseBoolean = boolean_values[index] ? 'true' : 'false';
      
                if (isBlueID) {
                    // Set blue color for specific IDs
                    rect.color = lowerCaseBoolean === 'true' ? 'lightskyblue' : 'red';
                  } else {
                  // Change the color based on the boolean value
                  rect.color = lowerCaseBoolean === 'true' ? 'limegreen' : 'red';
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
                    const initialRectangles = result.data.map(({ id, x1, y1 }) => {
                        let color;
                        let w;
                        let h;

                        if (id && typeof id === 'string' && parseInt(id.substring(1)) >= 137 && parseInt(id.substring(1)) <= 139) {
                            color = 'limegreen';
                            w = 69;  // Set a different color for the specified range
                            h = 23;
                        } else if (id && typeof id === 'string' && parseInt(id.substring(1)) >= 247 && parseInt(id.substring(1)) <= 252){
                            color = 'lightskyblue';
                            w = 25;
                            h = 32;
                        } else {
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
      




    return <>
                <div className="navbar">Car Park Map Option 1 Large</div>
                <main className="main">
                <section className="section">
                    <div className="parking-area">
                
                    <svg>
                    {rectangles.map((rect) => (
                     <rect
                    key={rect.id}
                    id={rect.id}
                    x={rect.x1}
                    y={rect.y1}
                    width={rect.w}
                    height={rect.h}
                    fill={rect.color}
                    />
      ))}
                    </svg>
                
            </div>
        </section>
        </main>
        <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    
    
    
    </>
}
