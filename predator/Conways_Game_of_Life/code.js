let myInterval;
let speed;
let on_off = -1;
const log_width = 20;
const log_height = 20;
const cell_width = 30;
const cell_height = 30;
let game_field = [];
const Alive = "black";
const Dead = "white";
const Diffusion_Density = 0.4;

function initgame() {
  CreateGrid();
  for (let i = 0; i < log_height; i++) {
    game_field[i] = [];
    for (let j = 0; j < log_width; j++) {
      game_field[i][j] = Dead;
    }
  }

  draw_field();

  let canvas = document.getElementById("CANVAS");
  //let ctx = canvas.getContext("2d");

  canvas.addEventListener("click", function (e) {
    ChangeCellState(
      e.clientX - canvas.offsetLeft,
      e.clientY - canvas.offsetTop
    );
  });
}

function draw_field() {
  let drawingCanvas = document.getElementById("CANVAS");
  if (drawingCanvas && drawingCanvas.getContext) {
    let context = drawingCanvas.getContext("2d");

    for (let i = 0; i < log_height; i++) {
      for (let j = 0; j < log_width; j++) {
        context.fillStyle = game_field[i][j];
        context.fillRect(
          i * cell_width + 1,
          j * cell_height + 1,
          cell_width - 2,
          cell_height - 2
        );
      }
    }
  }
}

function step() {
  let temp_field = [];

  for (let i = 0; i < log_height; i++) {
    temp_field[i] = [];
    for (let j = 0; j < log_width; j++) {
      temp_field[i][j] = Alive;
    }
  }

  for (let i = 0; i < log_height; i++) {
    for (let j = 0; j < log_width; j++) {
      temp_field[i][j] = rule(i, j);
    }
  }

  for (let i = 0; i < log_height; i++) {
    for (let j = 0; j < log_width; j++) {
      game_field[i][j] = temp_field[i][j];
    }
  }

  draw_field();
}
function rule(i, j) {
  let neigh = GetNeighborsQuantity(i, j);
  let reslt;
  let cur_val = game_field[i][j];

  if (cur_val === Alive) {
    if (neigh === 2 || neigh === 3) {
      reslt = Alive;
    } else {
      reslt = Dead;
    }
  } else {
    if (neigh === 3) {
      reslt = Alive;
    } else {
      reslt = Dead;
    }
  }
  return reslt;
}

function set_primary_soup() {
  for (let i = 0; i < log_height; i++) {
    for (let j = 0; j < log_width; j++) {
      let rand = Math.random();
      let new_val = rand < Diffusion_Density ? Alive : Dead;
      game_field[i][j] = new_val;
    }
  }

  draw_field();
}

function CreateGrid() {
  let CanvasDraw = document.getElementById("CANVAS");

  if (CanvasDraw && CanvasDraw.getContext) {
    let context = CanvasDraw.getContext("2d");
    for (let i = 0; i < 10; i++) {
      for (let i = 0; i < log_height + 1; i++) {
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "#7a7a7a";
        context.moveTo(0, i * cell_width);
        context.lineTo(log_width * cell_height, i * cell_height);
        context.stroke();
      }

      for (let i = 0; i < log_width + 1; i++) {
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "#7a7a7a";
        context.moveTo(i * cell_width, 0);
        context.lineTo(i * cell_width, cell_width * log_height);
        context.stroke();
      }
    }
  }
}

function GetNeighborsQuantity(x, y) {
  let n;
  let e;
  let s;
  let w;

  let y_n = y === 0 ? log_height - 1 : y - 1;
  let y_s = y === log_height - 1 ? 0 : y + 1;
  let x_e = x === log_width - 1 ? 0 : x + 1;
  let x_w = x === 0 ? log_width - 1 : x - 1;

  n = game_field[x][y_n];
  e = game_field[x_e][y];
  s = game_field[x][y_s];
  w = game_field[x_w][y];

  let ne = game_field[x_e][y_n];
  let nw = game_field[x_w][y_n];
  let se = game_field[x_e][y_s];
  let sw = game_field[x_w][y_s];

  let quantity =
    (n === Alive) +
    (e === Alive) +
    (s === Alive) +
    (w === Alive) +
    (ne === Alive) +
    (nw === Alive) +
    (se === Alive) +
    (sw === Alive);
  return quantity;
}
function steprepeat() {
  on_off = on_off * -1;
  if (on_off === 1) {
    document.getElementById("Button3").innerText = "Stop Animation";
    startgame();
  } else {
    document.getElementById("Button3").innerText = "Start Animation";
    stopgame();
  }
}
function startgame() {
  myInterval = setInterval(step, speed * 100);
}

function stopgame() {
  clearInterval(myInterval);
}

function ChangeCellState(x, y) {
  let xa = x / cell_width;
  let ya = y / cell_height;
  xa = Math.floor(xa);
  ya = Math.floor(ya);
  if (game_field[xa][ya] === Alive) {
    game_field[xa][ya] = Dead;
    draw_field();
  } else {
    game_field[xa][ya] = Alive;
    draw_field();
  }
}

function setspeed() {
  speed = document.getElementById("animation_speed").value;
}
