document.addEventListener("DOMContentLoaded", function () {
    const gameArea = document.getElementById("game-area");
    const timerElement = document.getElementById("timer");

    let nextNumber = 1;
    let poppedCount = 0;
    let startTime;
    let positions = [];
    let remainingNumbers = Array.from({ length: 25 }, (_, i) => i + 26); // 26-50 arası sayılar

    function getRandomPosition() {
        let overlap;
        let pos;
        do {
            overlap = false;
            pos = {
                x: Math.random() * (gameArea.clientWidth - 60),
                y: Math.random() * (gameArea.clientHeight - 60)
            };
            for (let p of positions) {
                let distance = Math.hypot(p.x - pos.x, p.y - pos.y);
                if (distance < 70) { 
                    overlap = true;
                    break;
                }
            }
        } while (overlap);
        positions.push(pos);
        return pos;
    }

    function createBalloon(number) {
        const balloon = document.createElement("div");
        balloon.classList.add("balloon");
        balloon.textContent = number;

        let pos = getRandomPosition();
        balloon.style.left = `${pos.x}px`;
        balloon.style.top = `${pos.y}px`;

        balloon.addEventListener("click", function () {
            if (parseInt(balloon.textContent) === nextNumber) {
                balloon.remove();
                poppedCount++;
                nextNumber++;

                if (poppedCount < 25) {
                    // Eğer hala 25'ten az balon patlatılmışsa, yerine 26-50 arasından rastgele biri gelsin
                    if (remainingNumbers.length > 0) {
                        let randomIndex = Math.floor(Math.random() * remainingNumbers.length);
                        let newNumber = remainingNumbers.splice(randomIndex, 1)[0];
                        let newBalloon = createBalloon(newNumber);
                        gameArea.appendChild(newBalloon);
                    }
                }

                if (poppedCount === 50) {
                    alert(`Game Over! Time: ${timerElement.textContent} seconds`);
                }
            }
        });

        return balloon;
    }

    function startGame() {
        startTime = Date.now();
        setInterval(() => {
            timerElement.textContent = Math.floor((Date.now() - startTime) / 1000);
        }, 1000);

        for (let i = 1; i <= 25; i++) {
            let balloon = createBalloon(i);
            gameArea.appendChild(balloon);
        }
    }

    startGame();
});
