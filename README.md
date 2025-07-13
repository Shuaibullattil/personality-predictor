# 🧠 Personality Predictor

This web application predicts whether you are an Introvert or Extrovert based on your answers to a short quiz. It uses a machine learning model trained on personality data to provide instant results and fun facts about your personality type.

## Features
- Interactive quiz with 7 questions
- Animated progress and loading screens
- Instant personality prediction (Introvert or Extrovert)
- Fun facts and famous personalities for each type
- Modern, responsive UI

## Tech Stack
- **Backend:** Python, Flask, scikit-learn, joblib
- **Frontend:** HTML, CSS, JavaScript

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd introvert_or_extrovert
   ```

2. **Create and activate a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Ensure the model file is present:**
   - The file `personality_model.pkl` should be in the project root. If not, train or obtain the model as needed.

5. **Run the application:**
   ```bash
   python app.py
   ```
   The app will be available at [http://localhost:5000](http://localhost:5000)

## File Structure
```
introvert_or_extrovert/
├── app.py                  # Flask backend
├── personality_model.pkl   # Trained ML model
├── requirements.txt        # Python dependencies
├── static/
│   ├── script.js           # Frontend JS
│   └── styles.css          # Frontend CSS
├── templates/
│   └── form.html           # Main HTML template
└── venv/                   # (Optional) Python virtual environment
```

## Usage
1. Open the app in your browser.
2. Answer the quiz questions.
3. View your predicted personality type and fun facts!

## License
This project is for educational/demo purposes.