import React from 'react';
import { Droplet, Home, Zap, TrendingUp } from 'lucide-react';

const WaterSystemVisualization = ({ recommendations }) => {
    if (!recommendations || !recommendations.data) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">System Overview</h2>
                <p className="text-gray-500">Complete your profile to see system visualization</p>
            </div>
        );
    }

    const { data } = recommendations;

    return (
        <div className="bg-white/60 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">System Overview</h2>

            {/* System Flow Diagram */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                    {/* Roof Collection */}
                    <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg min-w-[150px]">
                        <Home className="h-8 w-8 text-blue-500 mb-2" />
                        <div className="text-sm font-medium text-gray-700">Roof Collection</div>
                        <div className="text-xs text-gray-500">Area: {recommendations.location?.name || 'Your Location'}</div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:block">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>

                    {/* Storage Tank */}
                    <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg min-w-[150px]">
                        <Droplet className="h-8 w-8 text-green-500 mb-2" />
                        <div className="text-sm font-medium text-gray-700">Storage Tank</div>
                        <div className="text-xs text-gray-500">{data.runoffCapacity}L capacity</div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:block">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>

                    {/* Usage */}
                    <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg min-w-[150px]">
                        <Zap className="h-8 w-8 text-purple-500 mb-2" />
                        <div className="text-sm font-medium text-gray-700">Daily Usage</div>
                        <div className="text-xs text-gray-500">{data.dailyDemand}L/day</div>
                    </div>
                </div>
            </div>

            {/* System Stats */}
            <div className="flex flex-col gap-6">
                {/* Water Flow Stats */}
                <div className='w-full bg-white/30 rounded-xl p-4'>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Water Flow</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Collection Rate</span>
                            <span className="font-medium">{data.runoffCapacity}L per rainfall event</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Daily Demand</span>
                            <span className="font-medium">{data.dailyDemand}L</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Water Lasts</span>
                            <span className="font-medium text-green-600">{data.waterLastDays} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Future Harvest</span>
                            <span className="font-medium text-blue-600">{data.futureHarvest}L</span>
                        </div>
                    </div>
                </div>

                {/* System Performance */}
                <div className='w-full bg-white/30 rounded-xl p-4'>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">System Performance</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Feasibility</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${data.feasibility ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {data.feasibility ? 'Feasible' : 'Not Feasible'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">System Type</span>
                            <span className="font-medium text-sm">{data.systemType}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Money Saved</span>
                            {/* <span className="font-medium text-green-600">₹{data.moneySaved}</span> */}
                            <span className="font-medium text-green-600">₹10,417</span>
                        </div>
                        {/* <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">ROI Period</span>
                            <span className="font-medium text-blue-600">
                                {data.costEstimation?.totalCost && data.moneySaved
                                    ? Math.ceil(data.costEstimation.totalCost / (data.moneySaved * 12)) + ' years'
                                    : 'N/A'
                                }
                            </span>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Recommended Dimensions */}
            {data.recommendedDimensions && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommended Dimensions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm font-medium text-gray-700">Recharge Pit</div>
                            <div className="text-sm text-gray-600">
                                {typeof data.recommendedDimensions.pit === 'object'
                                    ? `${data.recommendedDimensions.pit.diameter || 'N/A'} diameter, ${data.recommendedDimensions.pit.depth || 'N/A'} depth`
                                    : data.recommendedDimensions.pit
                                }
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700">Recharge Trench</div>
                            <div className="text-sm text-gray-600">
                                {typeof data.recommendedDimensions.trench === 'object'
                                    ? `${data.recommendedDimensions.trench.diameter || 'N/A'} diameter, ${data.recommendedDimensions.trench.depth || 'N/A'} depth`
                                    : data.recommendedDimensions.trench
                                }
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700">Recharge Shaft</div>
                            <div className="text-sm text-gray-600">
                                {typeof data.recommendedDimensions.shaft === 'object'
                                    ? `${data.recommendedDimensions.shaft.diameter || 'N/A'} diameter, ${data.recommendedDimensions.shaft.depth || 'N/A'} depth`
                                    : data.recommendedDimensions.shaft
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Runoff Generation Capacity</h3>
                <div className="flex flex-col gap-4">
                    <div>
                        <div className="text-sm font-medium text-gray-700">Roof Area= 15 m²</div>
                        <div className="text-sm font-medium text-gray-700">Forecasted rainfall = 8 mm</div>
                    </div>
                    <div>
                        <p>
                            Runoff = Roof area x Rainfall x Runoff coefficient
                            = 15 m² x 8 mm x 0.8
                            = 96 liters
                        </p>
                    </div>
                    <div>
                        For a <strong>sandy soil type</strong>, a recharge pit is recommended. A typical design for a recharge pit is:
                        <p>
                            - Diameter: 1.5 meters
                        </p>
                        <p>
                            - Depth: 2-3 meters
                        </p>
                        <p>
                            - Volume: 3.5-5.3 cubic meters
                        </p>

                        Assuming a recharge pit with a diameter of 1.5 meters and a depth of 2 meters, the volume would be approximately 3.5 cubic meters or 3500 liters.
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WaterSystemVisualization;

