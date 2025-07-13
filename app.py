from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import time

app = Flask(__name__)

# Load the trained model
try:
    model = joblib.load("personality_model.pkl")
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Personality facts
PERSONALITY_FACTS = {
    'Introvert': [
        "<strong>Energy Source:</strong> You recharge by spending time alone and in quiet environments.",
        "<strong>Social Preference:</strong> You prefer smaller groups and one-on-one conversations.",
        "<strong>Processing Style:</strong> You think before speaking and process information internally.",
        "<strong>Strengths:</strong> Deep thinking, listening skills, independence, and creativity.",
        "<strong>Famous Introverts:</strong> Albert Einstein, Bill Gates, Emma Watson, Warren Buffett."
    ],
    'Extrovert': [
        "<strong>Energy Source:</strong> You gain energy from being around people and external stimulation.",
        "<strong>Social Preference:</strong> You thrive in social situations and enjoy meeting new people.",
        "<strong>Processing Style:</strong> You think out loud and process information externally.",
        "<strong>Strengths:</strong> Communication skills, enthusiasm, leadership, and adaptability.",
        "<strong>Famous Extroverts:</strong> Oprah Winfrey, Steve Jobs, Ellen DeGeneres, Barack Obama."
    ]
}

@app.route('/')
def index():
    return render_template('form.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        print("Received form data:", request.form)
        
        # Add delay for loading animation
        time.sleep(2)
        
        data = request.form

        # Prepare input data
        input_data = np.array([[
            int(data['alone']),
            int(data['stage_fear']),
            int(data['social_events']),
            int(data['outside']),
            int(data['drained']),
            int(data['friends']),
            int(data['posts']),
        ]])
        
        print("Input data:", input_data)

        # Check if model is loaded
        if model is None:
            raise Exception("Model not loaded properly")

        # Predict
        result = model.predict(input_data)[0]
        personality = "Extrovert" if result == 1 else "Introvert"
        
        print("Prediction result:", result, "Personality:", personality)
        
        # Get personality facts
        facts = PERSONALITY_FACTS[personality]

        response_data = {
            'success': True,
            'personality': personality,
            'facts': facts
        }
        
        print("Sending response:", response_data)
        return jsonify(response_data)
        
    except Exception as e:
        print("Error occurred:", str(e))
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True)