const app = document.getElementById('app');
export const width = 500;
export const height = 500;
export const block = width / 50;
export const context = app.getContext('2d');

app.width = width;
app.height = height;