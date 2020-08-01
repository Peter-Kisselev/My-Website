let myInterval;
let speed = 10;
let on_off = -1;
let Selectedpaint;
const  log_width = 20;
const log_height = 20;
const cell_width = 30;
const cell_height = 30;
let game_field = [];
const NN = "No";
const Alive = "black";
const Dead = "white";
const Predator = "red";
const Diffusion_Density =0.3;
const Diffusion_Predator=0.01;
let temp_field_leap = [];

function draw_field() {
    let drawingCanvas = document.getElementById('CANVAS');
    if(drawingCanvas && drawingCanvas.getContext) {
        let context = drawingCanvas.getContext('2d');

        for(let i=0; i<log_height; i++) {
            for(let j=0; j<log_width; j++) {
                context.fillStyle=game_field[i][j];
                context.fillRect(i*cell_width+1, j*cell_height+1, cell_width-2, cell_height-2);
            }
        }
    }
}

function initgame() {
    CreateGrid();
    for(let i=0; i<log_height; i++) {
        game_field[i]=[];
        temp_field_leap[i]=[];
        for(let j=0; j<log_width; j++) {
            game_field[i][j]=Dead;
            temp_field_leap[i][j]=NN;
        }
    }

    draw_field();

    let canvas = document.getElementById("CANVAS");

    canvas.addEventListener("click", function(e) {

        ChangeCellState(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)

    });

}


function step() {
    let temp_field = [];

    for(let i=0; i<log_height; i++){
        temp_field[i]=[];
        for(let j=0; j<log_width; j++){
            temp_field[i][j]=Dead;
        }
    }


    for(let i=0; i<log_height; i++){
        for(let j=0; j<log_width; j++) {
                temp_field[i][j]=rule(i,j);
        }
    }

    for(let i=0; i<log_height; i++){
        for(let j=0; j<log_width; j++){
            if (temp_field_leap[i][j]===Predator) {
                game_field[i][j]= temp_field_leap[i][j];
            } else {
                game_field[i][j]=temp_field[i][j];
            }
        }
    }

    draw_field();
}
function rule(x,y) {
    let neigh = GetNeighborsQuantity(x,y);
    let reslt;
    let cur_val = game_field[x][y];
    let targets = predator_vision(x, y);
    if (cur_val === Alive) {
        if(neigh===2 || neigh===3) {
            reslt = Alive;
        } else {
            reslt = Dead;
        }
    } else {
        if(cur_val===Dead) {
            if(neigh===3) {
                reslt = Alive;
            } else {
                reslt = Dead;
            }
        } else {
            if(cur_val===Predator) {
                if(targets===0){
                        ran_move(x,y);
                        reslt=Dead;
                } else {
                    leap(x,y);
                    reslt=Dead;
                }
            }
        }
    }
    return reslt;
}

function leap(x,y) {
    temp_field_leap[x][y] = NN;
    let tars = []
    let np;
    let ep;
    let sp;
    let wp;
    let nn;
    let ee;
    let ss;
    let ww;
    let y_nn;
    let y_ss;
    let x_ee;
    let x_ww;
    let y_np = (y === 0) ? log_height - 1 : y - 1;
    let y_sp = (y === log_height - 1) ? 0 : y + 1;
    let x_ep = (x === log_width - 1) ? 0 : x + 1;
    let x_wp = (x === 0) ? log_width - 1 : x - 1;
    if (y === 0) {
        y_nn = log_height - 2;
    } else {
        if (y === 1) {
            y_nn = log_height - 1;
        } else {
            y_nn = y - 2;
        }
    }
    if (y === log_height - 2) {
        y_ss = 0;
    } else {
        if (y === log_height - 1) {
            y_ss = 1;
        } else {
            y_ss = y + 2;
        }
    }
    if (x === 0) {
        x_ww = log_width - 2;
    } else {
        if (x === 1) {
            x_ww = log_width - 1;
        } else {
            x_ww = x - 2;
        }
    }
    if (x === log_width - 2) {
        x_ee = 0;
    } else {
        if (x === log_width - 1) {
            x_ee = 1;
        } else {
            x_ee = x + 2;
        }
    }
    np = game_field[x][y_np];
    ep = game_field[x_ep][y];
    sp = game_field[x][y_sp];
    wp = game_field[x_wp][y];

    nn = game_field[x][y_nn];
    ee = game_field[x_ee][y];
    ss = game_field[x][y_ss];
    ww = game_field[x_ww][y];

    let nep = game_field[x_ep][y_np];
    let nwp = game_field[x_wp][y_np];
    let sep = game_field[x_ep][y_sp];
    let swp = game_field[x_wp][y_sp];

    if (np === Alive) {
        tars.push(1);
    } else {
        if (ep === Alive) {
            tars.push(2);
        } else {
            if (sp === Alive) {
                tars.push(3);
            } else {
                if (wp === Alive) {
                    tars.push(4);
                } else {
                    if (nn === Alive) {
                        tars.push(5);
                    } else {
                        if (ee === Alive) {
                            tars.push(6);
                        } else {
                            if (ss === Alive) {
                                tars.push(7);
                            } else {
                                if (ww === Alive) {
                                    tars.push(8);
                                } else {
                                    if (nep === Alive) {
                                        tars.push(9);
                                    } else {
                                        if (nwp === Alive) {
                                            tars.push(10);
                                        } else {
                                            if (sep === Alive) {
                                                tars.push(11);
                                            } else {
                                                if (swp === Alive) {
                                                    tars.push(12);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    let ran_leap = tars[Math.floor(Math.random()*tars.length)];
    if(ran_leap===1) {
        temp_field_leap[x][y_np]=Predator
    } else {
        if(ran_leap===2) {
            temp_field_leap[x_ep][y]=Predator
        } else {
            if(ran_leap===3) {
                temp_field_leap[x][y_sp]=Predator
            } else {
                if(ran_leap===4) {
                    temp_field_leap[x_wp][y]=Predator
                } else {
                    if(ran_leap===5) {
                        temp_field_leap[x][y_nn]=Predator
                    } else {
                        if(ran_leap===6) {
                            temp_field_leap[x_ee][y]=Predator
                        } else {
                            if(ran_leap===7) {
                                temp_field_leap[x][y_ss]=Predator
                            } else {
                                if(ran_leap===8) {
                                    temp_field_leap[x_ww][y]=Predator
                                } else {
                                    if(ran_leap===9) {
                                        temp_field_leap[x_ep][y_np]=Predator
                                    } else {
                                        if(ran_leap===10) {
                                            temp_field_leap[x_wp][y_np]=Predator
                                        } else {
                                            if(ran_leap===11) {
                                                temp_field_leap[x_ep][y_sp]=Predator
                                            } else {
                                                if(ran_leap===12) {
                                                    temp_field_leap[x_wp][y_sp]=Predator
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function ran_move(x,y) {
    temp_field_leap[x][y] = NN;
    let y_n = (y === 0) ? log_height - 1 : y - 1;
    let y_s = (y === log_height - 1) ? 0 : y + 1;
    let x_e = (x === log_width - 1) ? 0 : x + 1;
    let x_w = (x === 0) ? log_width - 1 : x - 1;
    let ran_moved = RANDOM(0,7);
    temp_field_leap[x][y]=NN;
    if(ran_moved===0) {
        if (temp_field_leap[x][y_n] === Predator) {
            ran_moved = 1
        } else {
            temp_field_leap[x][y_n] = Predator;
        }
    }
    if(ran_moved===1) {
        if (temp_field_leap[x_e][y_n] === Predator) {
            ran_moved = 2
        } else {
            temp_field_leap[x_e][y_n] = Predator;
        }
    }
    if(ran_moved===2) {
        if (temp_field_leap[x_e][y] === Predator) {
            ran_moved = 3
        } else {
            temp_field_leap[x_e][y] = Predator;
        }
    }
    if(ran_moved===3) {
        if (temp_field_leap[x_e][y_s] === Predator) {
            ran_moved = 4
        } else {
            temp_field_leap[x][y_n] = Predator;
        }
    }
    if(ran_moved===4) {
        if (temp_field_leap[x][y_n] === Predator) {
            ran_moved = 5
        } else {
            temp_field_leap[x][y_n] = Predator;
        }
    }
    if(ran_moved===5) {
        if (temp_field_leap[x][y_n] === Predator) {
            ran_moved = 6
        } else {
            temp_field_leap[x][y_n] = Predator;
        }
    }
    if(ran_moved===6) {
        if (temp_field_leap[x][y_n] === Predator) {
            ran_moved = 7
        } else {
            temp_field_leap[x][y_n] = Predator;
        }
    }
    if(ran_moved===7) {
        if(temp_field_leap[x][y_n]===Predator) {
            temp_field_leap[x][y]=NN;
        } else {
            temp_field_leap[x][y_n]=Predator;
        }
    }
}



function GetNeighborsQuantity(x,y) {
    let n;
    let e;
    let s;
    let w;
    let quantity;

    let y_n = (y===0)?log_height-1:y-1;
    let y_s = (y===log_height-1)?0:y+1;
    let x_e = (x===log_width-1)?0:x+1;
    let x_w = (x===0)?log_width-1:x-1;

    n = game_field[x][y_n];
    e = game_field[x_e][y];
    s = game_field[x][y_s];
    w = game_field[x_w][y];

    let ne = game_field[x_e][y_n];
    let nw = game_field[x_w][y_n];
    let se = game_field[x_e][y_s];
    let sw = game_field[x_w][y_s];

    quantity = (n===Alive)+(e===Alive)+(s===Alive)+(w===Alive)+(ne===Alive)+(nw===Alive)+(se===Alive)+(sw===Alive);
    return quantity;
}

function predator_vision(x,y) {
    let quantitypredator;
    let np;
    let ep;
    let sp;
    let wp;
    let nn;
    let ee;
    let ss;
    let ww;
    let y_nn;
    let y_ss;
    let x_ee;
    let x_ww;
    let y_np = (y===0)?log_height-1:y-1;
    let y_sp = (y===log_height-1)?0:y+1;
    let x_ep = (x===log_width-1)?0:x+1;
    let x_wp = (x===0)?log_width-1:x-1;
    if(y===0) {
        y_nn = log_height-2;
    } else {
        if (y===1) {
            y_nn = log_height-1;
        } else {
            y_nn= y-2;
        }
    }
    if(y===log_height-2) {
        y_ss = 0;
    } else {
        if (y===log_height-1) {
            y_ss = 1;
        } else {
            y_ss= y+2;
        }
    }
    if(x===0) {
        x_ww = log_width-2;
    } else {
        if (x===1) {
            x_ww = log_width-1;
        } else {
            x_ww= x-2;
        }
    }
    if(x===log_width-2) {
        x_ee = 0;
    } else {
        if (x===log_width-1) {
            x_ee = 1;
        } else {
            x_ee = x+2;
        }
    }
    np = game_field[x][y_np];
    ep = game_field[x_ep][y];
    sp = game_field[x][y_sp];
    wp = game_field[x_wp][y];

    nn = game_field[x][y_nn];
    ee = game_field[x_ee][y];
    ss = game_field[x][y_ss];
    ww = game_field[x_ww][y];

    let nep = game_field[x_ep][y_np];
    let nwp = game_field[x_wp][y_np];
    let sep = game_field[x_ep][y_sp];
    let swp = game_field[x_wp][y_sp];


    quantitypredator = (np===Alive)+(ep===Alive)+(sp===Alive)+(wp===Alive)+ (nep===Alive)+ (nwp===Alive)+(sep===Alive)+(swp===Alive)+(nn===Alive)+(ee===Alive)+ (ss===Alive)+(ww===Alive);
    return quantitypredator;
}


function CreateGrid() {
    let CanvasDraw = document.getElementById('CANVAS');

    if(CanvasDraw && CanvasDraw.getContext) {
        let context = CanvasDraw.getContext('2d');
        for(let i=0; i<10; i++) {
            for (let i = 0; i < log_height+1; i++) {
                context.beginPath();
                context.lineWidth = 1;
                context.strokeStyle = "#7a7a7a";
                context.moveTo(0, i * cell_width);
                context.lineTo(log_width * cell_height, i * cell_height);
                context.stroke();
            }

            for (let i = 0; i < log_width+1; i++) {
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

function RANDOM(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function set_primary_soup() {
    let new_val;
    for(let i=0; i<log_height; i++) {
        for(let j=0; j<log_width; j++) {
            let rand = Math.random();
            if(rand<Diffusion_Density) {
                new_val=Alive;
            } else {
                if(rand<Diffusion_Density+Diffusion_Predator) {
                    new_val=Predator;
                } else {
                    new_val=Dead;
                }
            }
            game_field[i][j]=new_val;
        }
    }
    draw_field();
}


function steprepeat() {
    on_off=on_off*-1;
    if(on_off===1) {
        document.getElementById('Button3').innerText = "Stop Animation"
        startgame();
    } else {
        document.getElementById('Button3').innerText = "Start Animation"
        stopgame();
    }
}

function startgame () {
    myInterval = setInterval(step, speed*100);
}

function stopgame () {
    clearInterval(myInterval);
}

function setspeed() {
    speed = document.getElementById("animation_speed").value;
}

function setCurrentColor() {

    let sel = document.getElementById("select_paint");
    let num = sel.options.selectedIndex;

    Selectedpaint = sel.options[num].value;
}

function ChangeCellState(x,y) {
    let xa = x / cell_width;
    let ya = y / cell_height;
    xa = Math.floor(xa);
    ya = Math.floor(ya);

    if (Selectedpaint === "predator") {
        if (game_field[xa][ya] === Alive) {
            game_field[xa][ya] = Predator;
            draw_field();
        } else {
            if (game_field[xa][ya] === Dead) {
                game_field[xa][ya] = Predator;
                draw_field();
            } else {
                temp_field_leap[xa][ya] = NN;
                game_field[xa][ya] = Dead;
                draw_field();
            }
        }
    } else {
        if (Selectedpaint === "prey") {
            if (game_field[xa][ya] === Alive) {
                game_field[xa][ya] = Dead;
                draw_field();
            } else {
                if (game_field[xa][ya] === Dead) {
                    game_field[xa][ya] = Alive;
                    draw_field();
                } else {
                    game_field[xa][ya] = Dead;
                    draw_field();
                }
            }
        } else {
            if (game_field[xa][ya] === Alive) {
                game_field[xa][ya] = Dead;
                draw_field();
            } else {
                game_field[xa][ya] = Alive;
                draw_field();
            }
        }
    }
}
function cleared() {
    for(let i=0; i<log_width; i++) {
        game_field[i]=[];
        temp_field_leap[i]=[];
        for(let j=0; j<log_height; j++) {
            game_field[i][j]=Dead;
            temp_field_leap[i][j]=NN;
        }
    }
    draw_field();
}
