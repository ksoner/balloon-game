const gameArea = document.getElementById("game-area");
const timerElement = document.getElementById("timer");

let nextNumber = 1;
let poppedCount = 0;
let positions = [];
let startTime;
let timerInterval;

// Başlangıçta 1-25 arası balonları oluştur
function startGame() {
    positions = [];
    gameArea.innerHTML = "";
    nextNumber = 1;
    poppedCount = 0;
    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 100);

    for (let i = 1; i <= 25; i++) {
        createBalloon(i);
    }
}

// Rastgele konum bulma algoritması
function getRandomPosition() {
    let pos, overlap, attempt = 0;

    do {
        attempt++;
        overlap = false;
        pos = {
            x: Math.random() * (gameArea.clientWidth - 60),
            y: Math.random() * (gameArea.clientHeight - 60)
        };

        for (let p of positions) {
            let distance = Math.hypot(p.x - pos.x, p.y - pos.y);
            if (distance < 50) {
                overlap = true;
                break;
            }
        }

        if (attempt > 50) break; // Çok uzun deneme yapmasın
    } while (overlap);

    positions.push(pos);
    return pos;
}

// Balon oluşturma fonksiyonu
function createBalloon(number) {
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");
    balloon.textContent = number;

    let pos = getRandomPosition();
    balloon.style.left = `${pos.x}px`;
    balloon.style.top = `${pos.y}px`;

    let indexInPositions = positions.length - 1;

    balloon.addEventListener("click", function() {
        if (parseInt(balloon.textContent) === nextNumber) {
            popBalloon(balloon, indexInPositions);
        }
    });

    gameArea.appendChild(balloon);
}

// Balon patlatma fonksiyonu
function popBalloon(balloon, indexInPositions) {
    balloon.remove();
    positions.splice(indexInPositions, 1); // Pozisyonu temizle

    poppedCount++;
    nextNumber++;

    if (poppedCount <= 25) {
        let newNumber = getRandomNumber(26, 50);
        createBalloon(newNumber);
    }

    if (poppedCount === 50) {
        clearInterval(timerInterval);
        alert(`🎉 Congrats! You finished in ${timerElement.textContent} seconds!`);
    }
}

// 26-50 arasından rastgele yeni sayı seçme fonksiyonu
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Timer'ı güncelleme fonksiyonu
function updateTimer() {
    let elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
    timerElement.textContent = elapsedTime;
}

// Oyunu başlat
startGame();
