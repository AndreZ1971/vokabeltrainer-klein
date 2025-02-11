let vocabulary = [];
let currentIndex = 0;
let correctAnswer = "";
let usedIndices = new Set();
let correctCount = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

fetch("vocab_en_de.json")
    .then(response => response.json())
    .then(data => {
        vocabulary = data;
        loadQuestion();
    })
    .catch(error => console.error("Fehler beim Laden der Vokabeln:", error));

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

function checkAnswer(answer, button) {
    let buttons = document.getElementById("options").getElementsByTagName("button");
    for (let btn of buttons) {
        btn.disabled = true;
        if (btn.innerText === correctAnswer) {
            btn.style.backgroundColor = "green";
            correctCount++;
            checkPraise();
        } else if (btn === button) {
            btn.style.backgroundColor = "red";
        }
    }
    document.getElementById("nextButton").classList.remove("hidden");
}

function checkPraise() {
    if (correctCount % 10 === 0) {
        showPushNotification("Super gemacht! Weiter so! 🎉");
    }
}

function showPushNotification(message) {
    let notification = document.createElement("div");
    notification.innerText = message;
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "#4CAF50";
    notification.style.color = "white";
    notification.style.padding = "15px";
    notification.style.borderRadius = "10px";
    notification.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
    notification.style.fontSize = "18px";
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

document.getElementById("nextButton").addEventListener("click", function() {
    loadQuestion();
});
