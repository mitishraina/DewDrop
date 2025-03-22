from flask import Flask, jsonify
import fog_detection  # Import the converted Python script

app = Flask(__name__)

# Function to get fog density using the ML model
def get_fog_density():
    # Assuming fog_detection.py has a function named predict_fog_density
    density = fog_detection.predict_fog_density()
    return density

@app.route('/api/fog-density', methods=['GET'])
def fog_density():
    density = get_fog_density()
    return jsonify({
        'fog_density': density,
        'message': 'Fog density is high!' if density == 'High' else 'Fog density is normal.'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)