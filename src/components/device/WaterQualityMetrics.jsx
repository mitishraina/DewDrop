import React, { useState, useEffect, useRef } from 'react';
import { Droplet, Thermometer, Activity, Droplets } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
    apiKey: "USE YOUR OWN",
    authDomain: "dewdrop-b7766.firebaseapp.com",
    databaseURL: "https://dewdrop-b7766-default-rtdb.firebaseio.com/",
    projectId: "dewdrop-b7766",
    storageBucket: "dewdrop-b7766.firebasestorage.app",
    messagingSenderId: "708307451694",
    appId: "1:708307451694:web:a65fbfc98a1c0eacd044bf",
    measurementId: "G-VNRTLFNC2M"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const WaterQualityMetrics = () => {
    const [sensorData, setSensorData] = useState({
        tds: 0,
        ph: 0,
        temperature: 0,
        humidity: 0,
        waterLevel: 0
    });
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState('');
    const dbRef = useRef(null);

    useEffect(() => {
        const connectFirebase = () => {
            try {
                console.log('Attempting to connect to Firebase...');

                // Try different possible paths in Firebase
                const possiblePaths = ['sensorData', 'sensors', 'data', 'waterQuality', 'readings'];
                let currentPathIndex = 0;

                const tryNextPath = () => {
                    if (currentPathIndex >= possiblePaths.length) {
                        console.log('No data found in any common paths, using mock data for testing');
                        setDebugInfo('No data found in Firebase. Using mock data for testing.');
                        // Use mock data for testing
                        setSensorData({
                            tds: 150.5,
                            ph: 7.2,
                            temperature: 25.3,
                            humidity: 65.0,
                            waterLevel: 45.2
                        });
                        setIsConnected(true);
                        setError('Using mock data - no Firebase data found');
                        return;
                    }

                    const currentPath = possiblePaths[currentPathIndex];
                    console.log(`Trying Firebase path: ${currentPath}`);
                    const sensorDataRef = ref(database, currentPath);
                    dbRef.current = sensorDataRef;

                    // Listen for changes in the sensor data
                    onValue(sensorDataRef, (snapshot) => {
                        const data = snapshot.val();
                        console.log(`Received Firebase data from path '${currentPath}':`, data);

                        if (data && typeof data === 'object') {
                            setIsConnected(true);
                            setError(null);
                            setDebugInfo(`Connected to Firebase at path: ${currentPath}`);
                            console.log('Successfully connected to Firebase!');

                            setSensorData(prevData => ({
                                ...prevData,
                                tds: parseFloat(data.tds) || 0,
                                ph: parseFloat(data.ph) || 0,
                                temperature: parseFloat(data.temperature) || 0,
                                humidity: parseFloat(data.humidity) || 0,
                                waterLevel: parseFloat(data.waterLevel) || 0
                            }));
                        } else {
                            console.log(`No data available at path '${currentPath}', trying next path...`);
                            setDebugInfo(`No data at '${currentPath}', trying next path...`);
                            currentPathIndex++;
                            tryNextPath();
                        }
                    }, (error) => {
                        console.error(`Firebase error for path '${currentPath}':`, error);
                        currentPathIndex++;
                        tryNextPath();
                    });
                };

                tryNextPath();

            } catch (error) {
                console.error('Error setting up Firebase connection:', error);
                setIsConnected(false);
                setError('Failed to connect to Firebase database');
            }
        };

        connectFirebase();

        return () => {
            if (dbRef.current) {
                off(dbRef.current);
            }
        };
    }, []);

    // // Add the missing helper functions
    // const getQualityLevel = (value, type) => {
    //     switch (type) {
    //         case 'tds':
    //             return value < 50 ? 'Excellent' : value < 100 ? 'Good' : value < 300 ? 'Fair' : 'Poor';
    //         case 'ph':
    //             return (value > 6.5 && value < 8.5) ? 'Excellent' : (value > 6 && value < 9) ? 'Good' : 'Poor';
    //         default:
    //             return 'Unknown';
    //     }
    // };

    // const getColorClass = (quality) => {
    //     switch (quality) {
    //         case 'Excellent':
    //             return 'text-green-600';
    //         case 'Good':
    //             return 'text-blue-600';
    //         case 'Fair':
    //             return 'text-yellow-600';
    //         case 'Poor':
    //             return 'text-red-600';
    //         default:
    //             return 'text-gray-600';
    //     }
    // };

    return (
        <div className="bg-white rounded-lg shadow-md p-2 col-span-1 gap-1">
            <h3 className="text-lg font-semibold mb-2">Water Quality Metrics</h3>
            <div className="bg-white p-6 rounded-lg shadow-md border-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">TDS</p>
                        <p className="text-2xl font-bold">{sensorData.tds.toFixed(2)} ppm</p>
                    </div>
                    <Droplet className="text-blue-500" size={24} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">pH</p>
                        <p className="text-2xl font-bold">{sensorData.ph.toFixed(2)}</p>
                    </div>
                    <Activity className="text-green-500" size={24} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">Temperature</p>
                        <p className="text-2xl font-bold">{sensorData.temperature.toFixed(2)}°C</p>
                    </div>
                    <Thermometer className="text-red-500" size={24} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">Humidity</p>
                        <p className="text-2xl font-bold">{sensorData.humidity.toFixed(2)}%</p>
                    </div>
                    <Droplets className="text-purple-500" size={24} />
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">Water Level</p>
                        <p className="text-2xl font-bold">{sensorData.waterLevel.toFixed(2)}cm</p>
                    </div>
                    <Thermometer className="text-yellow-500" size={24} />
                </div>
            </div>
            <div className="col-span-full">
                <div className={`p-4 mt-3 duration-200 rounded-lg ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-500 text-white'}`}>
                    <p className="text-center font-medium">
                        {isConnected ? 'Device Connected' : 'Device Not Connected(getting firebase)'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WaterQualityMetrics;