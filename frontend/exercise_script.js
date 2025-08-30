function hideword(sentence) {
    // Thank you AI for imporving the code and fixing the bug here
    const words = sentence.split(" ").filter(w => w.trim() !== "");
    const randomIndex = Math.floor(Math.random() * words.length);

    let word = words[randomIndex];
    const match = word.match(/^(\w+)(\W*)$/);
    const wordOnly = match ? match[1] : word;
    const punctuation = match ? match[2] : "";

    const hiddenword = wordOnly;
    words[randomIndex] = "_" + punctuation;

    const hiddensentence = words.join(" ");
    return { hiddensentence, hiddenword };
}

let correct = 0;
let wrong = 0;

async function getsets() {
    const response = await fetch("/sets");
    const sets = await response.json();

    const select = document.getElementById('quizset');
    const startButton = document.getElementById('startQuizButton');

    sets.forEach(set => {
        const option = document.createElement('option');
        option.value = set.filename;
        option.innerText = set.filename;
        select.appendChild(option);
    });

    startButton.addEventListener('click', () => {
        const selectedSet = sets.find(s => s.filename === select.value);
        if (selectedSet) {
            correct = 0;
            wrong = 0;
            startQuiz(selectedSet);
        } else {
            alert("Please choose a set first!");
        }
    });
}

function startQuiz(set) {
    const questions = set.data.map(q => {
        const result = hideword(q.german);
        return {
            english: q.english,
            sentence: result.hiddensentence,
            answer: result.hiddenword
        };
    });

    showNextQuestion(questions, 0);
}

function showNextQuestion(questions, index) {
    const container = document.getElementById('question-container');
    container.innerHTML = "";

    // ProgressBar was made by AI
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = (index / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    if (index >= questions.length) {
        progressBar.style.width = `100%`;
        container.innerHTML = `
            <h2>Quiz complete!</h2>
            <canvas id="myPieChart" width="200" height="200"></canvas>
            <button class="startbutton">Return</button>
        `;
        const ctx = document.getElementById('myPieChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Correct', 'Wrong'],
                datasets: [{
                    data: [correct, wrong],
                    backgroundColor: ['green', 'red']
                }]
            },
            options: {
                // AI solved size issue here
                responsive: false,
                maintainAspectRatio: false
            }
        });

        const startButton = container.querySelector('.startbutton');
        startButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        return;
    }

    const q = questions[index];

    const english = document.createElement('div');
    english.innerText = q.english;
    container.appendChild(english);

    const german = document.createElement('div');
    german.innerText = q.sentence;
    container.appendChild(german);

    const input = document.createElement('input');
    input.type = "text";
    input.placeholder = "Type the missing word... (if a . is missing you have to write it)";
    container.appendChild(input);

    const button = document.createElement('button');
    button.innerText = "Submit";
    container.appendChild(button);

    const feedback = document.createElement('div');
    feedback.className = "feedback";
    container.appendChild(feedback);

    button.addEventListener('click', () => {
        if (input.value.trim().toLowerCase() === q.answer.toLowerCase()) {
            correct++;
            feedback.textContent = "Correct!";
            feedback.classList.add("show", "success");

            setTimeout(() => {
                showNextQuestion(questions, index + 1);
            }, 800);
        } else {
            wrong++;
            feedback.textContent = "Wrong answer, try again!";
            feedback.classList.add("show", "error");

            setTimeout(() => {
                feedback.classList.remove("show", "error");
                feedback.textContent = "";
            }, 1200);
        }
    });

}

getsets();
