const questions = [
    {
        icon: "🕐",
        text: "How many hours do you spend alone daily?",
        type: "scale",
        options: ["0-2", "3-5", "6-8", "9-11"],
        values: [1, 3, 6, 9],
        key: "alone"
    },
    {
        icon: "🎭",
        text: "Do you have stage fear?",
        type: "bubble",
        options: ["Yes", "No"],
        values: [1, 0],
        key: "stage_fear"
    },
    {
        icon: "🎉",
        text: "How many social events do you attend per week?",
        type: "scale",
        options: ["0-1", "2-3", "4-6", "7-10"],
        values: [0, 2, 4, 7],
        key: "social_events"
    },
    {
        icon: "🚶",
        text: "How often do you go outside per week?",
        type: "scale",
        options: ["1-2", "3-4", "5-6", "Daily"],
        values: [1, 3, 5, 7],
        key: "outside"
    },
    {
        icon: "😴",
        text: "Do you feel drained after socializing?",
        type: "bubble",
        options: ["Yes", "No"],
        values: [1, 0],
        key: "drained"
    },
    {
        icon: "👥",
        text: "How many close friends do you have?",
        type: "scale",
        options: ["0-2", "3-5", "6-10", "11+"],
        values: [1, 3, 6, 11],
        key: "friends"
    },
    {
        icon: "📱",
        text: "How often do you post on social media?",
        type: "scale",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        values: [0, 2, 5, 8],
        key: "posts"
    }
];

let currentQuestion = 0;
let answers = {};

function showScreen(screenId) {
    const screens = ['question-screen', 'loading-screen', 'result-screen'];
    screens.forEach(screen => {
        document.getElementById(screen).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('question-counter').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
}

function renderQuestion() {
    const question = questions[currentQuestion];
    
    document.getElementById('question-icon').textContent = question.icon;
    document.getElementById('question-text').textContent = question.text;
    
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';
    
    if (question.type === 'bubble') {
        optionsContainer.className = 'bubble-options';
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'bubble-btn';
            btn.textContent = option;
            btn.onclick = () => selectAnswer(index);
            optionsContainer.appendChild(btn);
        });
    } else {
        optionsContainer.className = 'answer-options';
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.onclick = () => selectAnswer(index);
            optionsContainer.appendChild(btn);
        });
    }
    
    updateProgress();
    updateNavigation();
}

function selectAnswer(optionIndex) {
    const question = questions[currentQuestion];
    answers[question.key] = question.values[optionIndex];
    
    // Update UI
    const buttons = document.querySelectorAll('.option-btn, .bubble-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    buttons[optionIndex].classList.add('selected');
    
    updateNavigation();
}

function updateNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentQuestion === 0;
    
    const currentQuestionKey = questions[currentQuestion].key;
    const hasAnswer = answers.hasOwnProperty(currentQuestionKey);
    
    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = hasAnswer ? 'Get Result 🎯' : 'Next →';
    } else {
        nextBtn.textContent = 'Next →';
    }
    
    nextBtn.disabled = !hasAnswer;
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        submitAnswers();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

function submitAnswers() {
    console.log('Submitting answers:', answers);
    showScreen('loading-screen');
    
    const formData = new FormData();
    Object.keys(answers).forEach(key => {
        formData.append(key, answers[key]);
        console.log(`Adding ${key}: ${answers[key]}`);
    });
    
    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
        if (data.success) {
            displayResult(data.personality, data.facts);
        } else {
            alert('Error: ' + data.error);
            showScreen('question-screen');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
        showScreen('question-screen');
    });
}

function displayResult(personality, facts) {
    document.getElementById('personality-type').textContent = personality.toUpperCase();
    
    const factsContainer = document.getElementById('personality-facts-content');
    factsContainer.innerHTML = facts.map(fact => `<div class="fact-item">${fact}</div>`).join('');
    
    showScreen('result-screen');
}

function resetQuiz() {
    currentQuestion = 0;
    answers = {};
    renderQuestion();
    showScreen('question-screen');
}

// Initialize the quiz
document.addEventListener('DOMContentLoaded', function() {
    renderQuestion();
    showScreen('question-screen');
});