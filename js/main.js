import { width, height, block, context } from './config.js';
import { drawLine, drawDot } from './draw.js';

let interval;
let snake = [];
let obstacles = [];
let food;
let direction;
let controlBlocked;
let speed;
let speedStep;

function generateFood() {
    let newFood;

    do {
        const x = Math.round(Math.random() * (width / block - 1));
        const y = Math.round(Math.random() * (height / block - 1));

        newFood = { x: x, y: y };
    } while (checkColision(newFood, [...snake, ...obstacles]))

    food = newFood;
}

function generateObstacles() {
    for (let i = 0; i < width / block; i++) {
        obstacles.push({ x: i, y: 0 });
        obstacles.push({ x: i, y: Math.round(height / block - 1) });
    }

    for (let i = 0; i < height / block; i++) {
        obstacles.push({ x: 0, y: i });
        obstacles.push({ x: Math.round(width / block - 1), y: i });
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

    if (checkColision(head, [...snake, ...obstacles])) {
        return false;
    }
    
    snake.push(head);
    
    if (checkColision(head, [food])) {
        generateFood();
        increaseSpeed();
    } else {
        snake.shift();
    }    

    controlBlocked = false;

    return true;
}

function clearBoard() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, app.width, app.height);
}

function checkColision(dot, line) {
    if (!line || !dot) return false;

    for (let i = 0; i < line.length; i++) {
        if (dot.x == line[i].x && dot.y == line[i].y) return true;
    }

    return false;
}

function control() {
    let newDirection;

    const changeDirection = (newDirection) => {
        if (!controlBlocked &&
            (newDirection == 'up' && direction != 'down' ||
                newDirection == 'down' && direction != 'up' ||
                newDirection == 'right' && direction != 'left' ||
                newDirection == 'left' && direction != 'right')
        ) {
            direction = newDirection;
            controlBlocked = true;
        }
    }

    // keyboard
    document.addEventListener('keydown', event => {
        changeDirection(event.code.toLocaleLowerCase().replace('arrow', ''));
    });

    // mobile control
    let touchstartX = 0
    let touchendX = 0
    let touchstartY = 0
    let touchendY = 0

    document.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    })

    document.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;

        let horizontal = Math.abs(touchendX - touchstartX) > Math.abs(touchendY - touchstartY);

        if (touchendX < touchstartX && horizontal) newDirection = 'left';
        if (touchendX > touchstartX && horizontal) newDirection = 'right';
        if (touchendY < touchstartY && !horizontal) newDirection = 'up';
        if (touchendY > touchstartY && !horizontal) newDirection = 'down';

        changeDirection(newDirection);
    })
}

function gameCycle() {
    clearBoard();
    drawLine(obstacles, 'grey');

    if (moveSnake()) {
        drawDot(food, 'red');
        drawLine(snake, 'black');
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

function blockScroll() {
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

    function preventDefault(e) {
        e.preventDefault();
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    // modern Chrome requires { passive: false } when adding event
    var supportsPassive = false;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () { supportsPassive = true; }
        }));
    } catch (e) { }

    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    // call this to Disable
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function start() {
    snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }];
    direction = 'right';
    speed = 3;
    speedStep = 0.1;

    control();
    generateObstacles();
    generateFood();

    interval = setInterval(gameCycle, 1000 / speed);
}

blockScroll();
start();
