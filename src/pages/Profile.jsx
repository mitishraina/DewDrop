import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Users, Droplets, ChevronRight } from "lucide-react";
import Layout from '../components/Layout';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: "",
    roofArea: "",
    roofSlope: "",
    roofMaterial: "",
    openSpace: "",
    dwellers: "",
    waterDemand: "",
    groundwaterDepth: "",
    budget: "",
    latitude: null,
    longitude: null,
  });

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const currentAddress = res.data.display_name;
          console.log("Current Location:", currentAddress);

          updateFormData("address", currentAddress);
          updateFormData("latitude", latitude);
          updateFormData("longitude", longitude);
        } catch (error) {
          console.error("Error getting address from coordinates:", error);
          alert("Failed to get location details.");
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Permission denied or location not available.");
      }
    );
  };


  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const generateRecommendations = async () => {
    try {
      // Try the AI-powered endpoint first
      const response = await axios.post('http://localhost:3001/api/recommendations', formData);
      localStorage.setItem('recommendations', JSON.stringify(response.data));
      console.log('AI Recommendations generated:', response.data);
    } catch (error) {
      console.error('AI recommendations failed, trying simple fallback:', error);
      try {
        // Fallback to simple calculations
        const response = await axios.post('http://localhost:3001/api/recommendations-simple', formData);
        localStorage.setItem('recommendations', JSON.stringify(response.data));
        console.log('Simple recommendations generated:', response.data);
      } catch (fallbackError) {
        console.error('Both recommendation methods failed:', fallbackError);
        // Continue even if recommendations fail
      }
    }
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      localStorage.setItem('profileData', JSON.stringify(formData));
      localStorage.setItem("dewdrop_onboarded", "true");

      await generateRecommendations();
      navigate("/user-dashboard");
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.address.trim() !== "";
      case 2:
        return formData.roofArea && formData.roofSlope && formData.roofMaterial;
      case 3:
        return formData.dwellers && formData.waterDemand;
      case 4:
        return formData.groundwaterDepth && formData.budget;
      default:
        return false;
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="text-center mb-6">
              <MapPin size={48} className="mx-auto" />
              <h2 className="text-xl font-bold">Location Information</h2>
              <p className="text-gray-500 text-lg">Enter your property address here</p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block font-medium">Enter your Address:</label>
                <textarea
                  id="address"
                  placeholder="Enter your complete address..."
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                  rows={4}
                />
              </div>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="w-full py-2 duration-200 bg-blue-400 border rounded-lg text-black text-bold border-[#4AA3E5] hover:bg-blue-50"
              >
                <MapPin size={16} className="inline-block mr-2" />
                Auto detect Location
              </button>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <div className="text-center mb-6">
              <Home size={48} className="mx-auto" />
              <h2 className="text-xl font-bold">Roof Characteristics</h2>
              <p className="text-gray-500 text-lg">Tell us about your rooftop specifications</p>
            </div>
            <div className="space-y-4">
              <div>
                <label>Roof Area (sq ft)</label>
                <input
                  type="number"
                  value={formData.roofArea}
                  onChange={(e) => updateFormData("roofArea", e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label>Roof Slope</label>
                <select
                  value={formData.roofSlope}
                  onChange={(e) => updateFormData("roofSlope", e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select slope range</option>
                  <option value="flat">Flat (0-2%)</option>
                  <option value="low">Low Slope (2-9%)</option>
                  <option value="steep">Steep (&gt;9%)</option>
                </select>
              </div>
              <div>
                <label>Roof Material</label>
                <select
                  value={formData.roofMaterial}
                  onChange={(e) => updateFormData("roofMaterial", e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select material</option>
                  <option value="concrete">Concrete</option>
                  <option value="tile">Tile</option>
                  <option value="metal">Metal Sheet</option>
                  <option value="asbestos">Asbestos</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label>Available Open Space (sq ft)</label>
                <input
                  type="number"
                  value={formData.openSpace}
                  onChange={(e) => updateFormData("openSpace", e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="text-center mb-6">
              <Users size={48} className="mx-auto" />
              <h2 className="text-xl font-bold">Water Requirements</h2>
              <p className="text-gray-500 text-lg">Help us estimate your water needs</p>
            </div>
            <div className="space-y-4">
              <div>
                <label>Number of Dwellers</label>
                <input
                  type="number"
                  value={formData.dwellers}
                  onChange={(e) => updateFormData("dwellers", e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label>Daily Water Demand (liters)</label>
                <input
                  type="number"
                  value={formData.waterDemand}
                  onChange={(e) => updateFormData("waterDemand", e.target.value)}
                  className="w-full border rounded p-2"
                />
                <p className="text-sm text-gray-700">Average: 150-200L per person per day</p>
              </div>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div className="text-center mb-6">
              <Droplets size={48} className="mx-auto" />
              <h2 className="text-xl font-bold">Site Conditions & Budget</h2>
              <p className="text-gray-500 text-lg">Final details for system design</p>
            </div>
            <div className="space-y-4">
              <div>
                <label>Groundwater Depth</label>
                <select
                  value={formData.groundwaterDepth}
                  onChange={(e) => updateFormData("groundwaterDepth", e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select depth range</option>
                  <option value="shallow">Shallow (0-10m)</option>
                  <option value="medium">Medium (10-30m)</option>
                  <option value="deep">Deep (&gt;30m)</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
              <div>
                <label>Budget Range (INR)</label>
                <select
                  value={formData.budget}
                  onChange={(e) => updateFormData("budget", e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select budget range</option>
                  <option value="low">₹50,000 - ₹1,00,000</option>
                  <option value="medium">₹1,00,000 - ₹2,50,000</option>
                  <option value="high">₹2,50,000 - ₹5,00,000</option>
                  <option value="premium">₹5,00,000+</option>
                </select>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className='min-h-[700px] bg-white/50 rounded-3xl flex items-center justify-center mt-4'>
        <div className='w-full max-w-4xl rounded-lg p-6'>
          <div className='text-center mb-4'>
            <h1 className='text-2xl font-bold'>Profile Onboarding</h1>
            <p>Step {step} of 4</p>
            <div className='w-full rounded-full bg-gray-200 h-2 mt-4'>
              <div className='bg-blue-500 h-2 rounded-full transition-all duration-300' style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>

          {/* steps render bar */}
          <div className='mt-6'>
            {renderStep()}
          </div>

          {/* prev next wale button */}
          <div className='flex justify-between mt-8'>
            <button
              type='button'
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className={`px-4 py-2 rounded ${step === 1 ? "bg-gray-300 text-black cursor-not-allowed" : "bg-white text-black hover:bg-gray-100"}`}
            >
              Previous
            </button>

            <button
              type='button'
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`px-4 py-2 rounded text-white flex items-center ${isStepValid() ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
                }`}
            >
              {step === 4 ? "Finish" : "Next"}
              <ChevronRight size={16} className='ml-2' />
            </button>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Profile