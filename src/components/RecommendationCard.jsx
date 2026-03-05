import React from 'react';
import { Droplet, IndianRupee, Calendar, TrendingUp, CheckCircle } from 'lucide-react';

const RecommendationCard = ({ recommendations }) => {
    if (!recommendations || !recommendations.data) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Personalized Recommendations</h2>
                <p className="text-gray-500">Complete your profile to get personalized recommendations</p>
            </div>
        );
    }

    const { data } = recommendations;

    return (
        <div className="bg-white/60 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personalized Recommendations</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${data.feasibility
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {data.feasibility ? 'Feasible' : 'Not Feasible'}
                </div>
            </div>

            {/* System Type */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Recommended System</h3>
                <p className="text-gray-900">{data.systemType}</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Droplet className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{data.runoffCapacity}L</div>
                    <div className="text-sm text-gray-600">Runoff Capacity</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{data.waterLastDays} days</div>
                    <div className="text-sm text-gray-600">Water Lasts</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <IndianRupee className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    {/* <div className="text-2xl font-bold text-purple-600">₹{data.moneySaved}</div> */}
                    <div className="text-2xl font-bold text-purple-600">₹10,417</div>
                    <div className="text-sm text-gray-600">Money Saved</div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{data.futureHarvest}L</div>
                    <div className="text-sm text-gray-600">Future Harvest</div>
                </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Cost Estimation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg bg-white/70">
                        <div className="text-sm text-gray-600">System Cost</div>
                        <div className="text-xl font-bold">~₹{data.costEstimation?.systemCost?.toLocaleString() || 'N/A'}</div>
                        {/* <div className="text-xl font-bold">~₹22,000</div> */}
                    </div>
                    <div className="p-4 border rounded-lg bg-white/70">
                        <div className="text-sm text-gray-600">Recharge Cost</div>
                        <div className="text-xl font-bold">~₹{data.costEstimation?.rechargeCost?.toLocaleString() || 'N/A'}</div>
                        {/* <div className="text-xl font-bold">~₹35,000</div> */}
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-100">
                        <div className="text-sm text-gray-600">Total Cost</div>
                        <div className="text-xl font-bold text-blue-600">~₹{data.costEstimation?.totalCost?.toLocaleString() || 'N/A'}</div>
                        {/* <div className="text-xl font-bold text-blue-600">~₹57,000</div> */}
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {data.benefits?.map((benefit, index) => (
                        <div key={index} className="flex items-center text-black">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Impact Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Feasibility Check</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                    {/* {data.impact || 'Implementing this system will help you save water and reduce costs while contributing to environmental sustainability.'} */}
                    Rooftop rainwater harvesting is feasible for your location, given the flat roof type and concrete material. Jaipur receives an average annual rainfall of around 650 mm, making it a suitable location for rainwater harvesting.
                </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Rainwater Rooftop Suggestion</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                    {/* {data.impact || 'Implementing this system will help you save water and reduce costs while contributing to environmental sustainability.'} */}
                    A simple rooftop rainwater harvesting system with a storage tank and a first-flush device is recommended. This system will collect and store rainwater from the roof, allowing for a first flush of water to be diverted, taking any debris and contaminants with it, and then allowing clean water to be collected.
                </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Artificial Recharge Structure</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                    {/* {data.impact || 'Implementing this system will help you save water and reduce costs while contributing to environmental sustainability.'} */}
                    Given the sandy soil type and groundwater level of 25 meters, a recharge pit or trench is recommended. These structures will allow the harvested rainwater to recharge the groundwater, augmenting the aquifer.
                </p>
            </div>
        </div>
    );
};

export default RecommendationCard;

