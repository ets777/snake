import { context, block } from './config.js';

export function drawDot(dot, color = 'black') {
    context.fillStyle = color;
    context.fillRect(dot.x * block, dot.y * block, block, block);
}

export function drawLine(line, color) {
    context.fillStyle = color;
    line.forEach(drawDot);
}