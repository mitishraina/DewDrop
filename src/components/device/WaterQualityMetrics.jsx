import React, { useState, useEffect } from 'react';
import { Droplet, Thermometer, Activity, Droplets } from 'lucide-react';
import axios from 'axios';

const WaterQualityMetrics = () => {
    const [sensorData, setSensorData] = useState({
        tds: 0,
        ph: 0,
        temperature: 0,
        humidity: 0
    });

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/sensor-data');
                setSensorData(response.data);
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        };

        // Fetch initially and then every 2 seconds
        fetchSensorData();
        const interval = setInterval(fetchSensorData, 2000);

        return () => clearInterval(interval);
    }, []);

    // Helper function to determine quality level
    const getQualityLevel = (value, type) => {
        switch (type) {
            case 'tds':
                return value < 50 ? 'Excellent' : value < 100 ? 'Good' : value < 300 ? 'Fair' : 'Poor';
            case 'ph':
                return (value > 6.5 && value < 8.5) ? 'Excellent' : (value > 6 && value < 9) ? 'Good' : 'Poor';
            case 'turbidity':
                return value < 1 ? 'Excellent' : value < 5 ? 'Good' : 'Poor';
            default:
                return 'Unknown';
        }
    };

    // Helper function to get color based on quality
    const getColorClass = (quality) => {
        switch (quality) {
            case 'Excellent':
                return 'text-green-600';
            case 'Good':
                return 'text-blue-600';
            case 'Fair':
                return 'text-yellow-600';
            case 'Poor':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 col-span-1">
            <h3 className="text-lg font-semibold mb-4">Water Quality Metrics</h3>

            <div className="space-y-6">
                <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <Droplet className="h-5 w-5 text-water-medium" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <span className="text-gray-600">TDS (Total Dissolved Solids)</span>
                            <span className={`font-medium ${getColorClass(getQualityLevel(sensorData.tds, 'tds'))}`}>
                                {getQualityLevel(sensorData.tds, 'tds')}
                            </span>
                        </div>
                        <div className="mt-1 text-2xl font-semibold">{sensorData.tds} <span className="text-sm font-normal text-gray-500">ppm</span></div>
                        <p className="text-xs text-gray-500 mt-1">Recommended: &lt;50 ppm</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <Thermometer className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <span className="text-gray-600">pH Level</span>
                            <span className={`font-medium ${getColorClass(getQualityLevel(sensorData.ph, 'ph'))}`}>
                                {getQualityLevel(sensorData.ph, 'ph')}
                            </span>
                        </div>
                        <div className="mt-1 text-2xl font-semibold">{sensorData.ph}</div>
                        <p className="text-xs text-gray-500 mt-1">Recommended: 6.5-8.5</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <Thermometer className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Temperature</span>
                        </div>
                        <div className="mt-1 text-2xl font-semibold">{sensorData.temperature} <span className="text-sm font-normal text-gray-500">°C</span></div>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <Droplets className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Humidity</span>
                        </div>
                        <div className="mt-1 text-2xl font-semibold">{sensorData.humidity} <span className="text-sm font-normal text-gray-500">%</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaterQualityMetrics;