const app = document.getElementById('app');
app.width = 500;
app.height = 500;
const block = app.width / 50
const context = app.getContext('2d');

let interval;
let snake = [];
let obstacles = [];
let food = {};
let direction;
let controlBlocked = false;
let speed;
const speedStep = 0.1;

function drawDot(dot) {
    context.fillRect(dot.x * block, dot.y * block, block, block);
}

function drawSnake() {
    context.fillStyle = 'black';
    snake.forEach(drawDot);
}

function drawObstacles() {
    context.fillStyle = 'grey';
    obstacles.forEach(drawDot);
}

function drawFood() {
    if (food) {
        context.fillStyle = 'red';
        context.fillRect(food.x * block, food.y * block, block, block);
    }
}

function generateFood() {
    const x = ~~(Math.random() * app.width / block);
    const y = ~~(Math.random() * app.height / block);

    let newFood = { x: x, y: y };

    if (checkColision(newFood, [...snake, ...obstacles])) {
        newFood = generateFood();
    }

    food = newFood;
}

function generateObstacles() {
    for (let i = 0; i < app.width / block; i++) {
        obstacles.push({x: i, y: 0});
        obstacles.push({x: i, y: app.height / block - 1});
    }

    for (let i = 0; i < app.height / block; i++) {
        obstacles.push({x: 0, y: i});
        obstacles.push({x: app.width / block - 1, y: i});
    }
}

function moveSnake() {
    let head = Object.assign({}, snake[snake.length - 1]);

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    if (food && checkColision(head, [food])) {
        generateFood();
        increaseSpeed();
    } else {
        snake.shift();

        if (!food) {
            generateFood();
        }
    }

    if (checkColision(head, [...snake, ...obstacles])) {
        return false;
    }

    snake.push(head);
    controlBlocked = false;

    return true;
}

function clearBoard() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, app.width, app.height);
}

function checkColision(dot, line) {
    for (let i = 0; i < line.length; i++) {
        if (dot.x == line[i].x && dot.y == line[i].y) return true;
    }

    return false;
}

function gameCycle() {
    clearBoard();
    drawObstacles();

    if (moveSnake()) {
        drawFood();
        drawSnake();
    } else {
        gameOver();
    }

}

function increaseSpeed() {
    speed += speedStep;
    clearTimeout(interval);
    interval = setInterval(gameCycle, 1000 / speed);
}

function gameOver() {
    clearTimeout(interval);

    start();
}

function start() {

    snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }];
    direction = 'right';
    speed = 3;

    document.addEventListener('keydown', event => {
        newDirection = event.code.toLocaleLowerCase().replace('arrow', '');
        if (!controlBlocked &&
            (newDirection == 'up' && direction != 'down' ||
                newDirection == 'down' && direction != 'up' ||
                newDirection == 'right' && direction != 'left' ||
                newDirection == 'left' && direction != 'right')
        ) {
            direction = newDirection;
            controlBlocked = true;
        }
    });

    generateFood();
    generateObstacles();

    interval = setInterval(gameCycle, 1000 / speed);
}

start();
