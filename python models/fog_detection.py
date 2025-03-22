import joblib

model = joblib.load('fog_model.pkl')

def predict_fog_density():
    input_data = [model]
    prediction = model.predict([input_data])
    return prediction[0]