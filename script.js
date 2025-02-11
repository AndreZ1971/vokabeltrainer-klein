let vocabulary = [];
let currentIndex = 0;
let correctAnswer = "";
let usedIndices = new Set();

// Funktion zum Mischen eines Arrays (Fisher-Yates Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Vokabeln aus externer JSON-Datei laden
fetch("vocab.json")
    .then(response => response.json())
    .then(data => {
        vocabulary = data;
        loadQuestion();
    })
    .catch(error => console.error("Fehler beim Laden der Vokabeln:", error));

// Funktion zum zufälligen Laden der nächsten Frage
function loadQuestion() {
    if (usedIndices.size >= vocabulary.length) {
        document.getElementById("question").innerText = "Alle Fragen beantwortet!";
        document.getElementById("options").innerHTML = "";
        document.getElementById("progress").innerText = "";
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * vocabulary.length);
    } while (usedIndices.has(randomIndex));
    
    usedIndices.add(randomIndex);
    let word = vocabulary[randomIndex];

    document.getElementById("question").innerText = `Was bedeutet: '${word.englisch}'?`;
    document.getElementById("options").innerHTML = "";
    correctAnswer = word.deutsch;

    let options = [...word.optionen];
    shuffleArray(options);

    options.forEach(option => {
        let btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option, btn);
        document.getElementById("options").appendChild(btn);
    });

    document.getElementById("progress").innerText = `Frage ${usedIndices.size} von ${vocabulary.length}`;
    document.getElementById("nextButton").classList.add("hidden");
}

// Funktion zum Überprüfen der Antwort
function checkAnswer(answer, button) {
    let buttons = document.getElementById("options").getElementsByTagName("button");
    for (let btn of buttons) {
        btn.disabled = true;
        if (btn.innerText === correctAnswer) {
            btn.style.backgroundColor = "green";
        } else if (btn === button) {
            btn.style.backgroundColor = "red";
        }
    }
    document.getElementById("nextButton").classList.remove("hidden");
}

document.getElementById("nextButton").addEventListener("click", function() {
    loadQuestion();
});
