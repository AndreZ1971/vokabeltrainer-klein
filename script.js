let vocabulary = [];
let currentIndex = 0;
let correctAnswer = "";

// Vokabeln aus externer JSON-Datei laden
fetch("vocab.json")
    .then(response => response.json())
    .then(data => {
        vocabulary = data;
        loadQuestion();
    });

function loadQuestion() {
    if (currentIndex >= vocabulary.length) {
        document.getElementById("question").innerText = "Alle Fragen beantwortet!";
        document.getElementById("options").innerHTML = "";
        return;
    }

    let word = vocabulary[currentIndex];
    document.getElementById("question").innerText = `Was bedeutet: '${word.englisch}'?`;
    document.getElementById("options").innerHTML = "";
    correctAnswer = word.deutsch;

    word.optionen.forEach(option => {
        let btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option);
        document.getElementById("options").appendChild(btn);
    });

    document.getElementById("progress").innerText = `Frage ${currentIndex + 1} von ${vocabulary.length}`;
    document.getElementById("nextButton").classList.add("hidden");
}

function checkAnswer(answer) {
    let buttons = document.getElementById("options").getElementsByTagName("button");
    for (let btn of buttons) {
        btn.disabled = true;
        if (btn.innerText === correctAnswer) {
            btn.style.backgroundColor = "green";
        } else {
            btn.style.backgroundColor = "red";
        }
    }
    document.getElementById("nextButton").classList.remove("hidden");
}

document.getElementById("nextButton").addEventListener("click", function() {
    currentIndex++;
    loadQuestion();
});
