import { useEffect, useState } from "react";
import axios from 'axios'
import {Buffer} from 'buffer';
import Navbar from './Navbar';
Buffer.from('anything','base64');


export default function Table() {
    const [camera_Image2, setTablea2Data] = useState([]);
    const [parking_space, setTablea3Data] = useState([]);
    const [selectedTable, setSelectedTable] = useState('table1');
    
    useEffect(() =>{
        axios.get(process.env.REACT_APP_Table1)
        .then(camera_Image2 => setTablea2Data(camera_Image2.data))
        .catch(err => console.log(err))
    }, [])


    useEffect(() =>{
        axios.get(process.env.REACT_APP_Table2)
        .then(parking_space => setTablea3Data(parking_space.data))
        .catch(err => console.log(err))
    }, [])


      
        const showTable = (event) => {
          setSelectedTable(event.target.value);
        };


    return <>
    <Navbar />
        <div className="table-container">
            <label htmlFor="tableSelector">Select a Table:</label>
        <select id="tableSelector" value={selectedTable} onChange={showTable}>
            <option value="table1">Table 1</option>
            <option value="table2">Table 2</option>
        </select>
        
        
                <div id="table1" style={{ display: selectedTable === 'table1' ? 'block' : 'none' }}>
                <h1>Car Park Detect</h1>
                    <div class="table-wrapper">
                        <table className="tableCenter">
                        <thead>
                            <tr>
                                <th>
                                ID
                                </th>
                                <th>
                                Time
                                </th>
                                <th>
                                    Motion Detect
                                </th>
                                <th>
                                    Image
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                camera_Image2.map(t2 => {
                                    return <tr key={t2._id}>
                                        <td>{t2._id}</td>
                                        <td>{t2.timestamp}</td>
                                        <td>test</td>
                                        <td>
                                        {t2.image_data ? (
                                                <img
                                                src={`data:image/jpeg;base64,${Buffer.from(t2.image_data).toString('base64')}`}
                                                alt="Camera"
                                                width="100"
                                                height="100"
                                                />
                                            ) : (
                                                <span>No image available</span>
                                            )}
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    </div>
                    
                </div>
                <div id="table2" style={{ display: selectedTable === 'table2' ? 'block' : 'none' }}>
                    <h1>Car Park Detail</h1>
                    <div class="table-wrapper">
                        <table className="tableCenter">
                        <thead>
                            <tr>
                                <th>
                                    Space ID
                                </th>
                                <th>
                                    Lot ID
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Space Type
                                </th>
                                <th>
                                    GPS Latitude
                                </th>
                                <th>
                                    GPS Longitude
                                </th>
                                <th>
                                    Space Name
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                parking_space.map(t3 => {
                                    return <tr key={t3._id}>
                                        <td>{t3.space_id}</td>
                                        <td>{t3.lot_id}</td>
                                        <td>{t3.status}</td>
                                        <td>{t3.space_type}</td>
                                        <td>{t3.gps_latitude}</td>
                                        <td>{t3.gps_longitude}</td>
                                        <td>{t3.space_name}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    </div>
                    
                </div>
                </div>
    </>
    
}
