const titulo = document.getElementById("titulo-animado");
let posicao = 0;
let direcao = 1;

setInterval(() => {
    if (posicao > 30 || posicao < 0) direcao *= -3;
    posicao += direcao;
    titulo.style.transform = `translateX(${posicao}px)`;
}, 30);