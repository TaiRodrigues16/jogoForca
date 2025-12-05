// ===================================
// DADOS DO JOGO
// ===================================

// Objeto contendo todas as categorias e suas palavras
const categorias = {
    frutas: ["BANANA", "MAÇÃ", "MELANCIA", "ABACAXI", "UVA"],
    animais: ["CACHORRO", "GATO", "ELEFANTE", "GIRAFA", "CAVALO"],
    objetos: ["CADEIRA", "MOCHILA", "GARRAFA", "ESPELHO", "TESOURA"],
    profissoes: ["MÉDICO", "PROFESSOR", "BOMBEIRO", "ENGENHEIRO", "FOTÓGRAFO"],
    cores: ["AZUL", "VERMELHO", "AMARELO", "VERDE", "PRETO"]
};

// ===================================
// VARIÁVEIS DE ESTADO
// (Variáveis que mudam durante o jogo)
// ===================================

let palavraSecreta = "";     // Armazena a palavra sorteada
let palavraExibida = [];     // Armazena os "_" e as letras descobertas
let erros = 0;               // Contador de erros
const maxErros = 6;          // Máximo de erros permitido

// ===================================
// ELEMENTOS DO DOM
// (Pegamos os elementos HTML para manipular depois)
// ===================================

const elPalavra = document.getElementById("palavra");
const elErros = document.getElementById("erros");
const elBoneco = document.getElementById("boneco");
const elTeclado = document.getElementById("teclado");
const elCategoria = document.getElementById("categoria");
const elMensagemFinal = document.getElementById("mensagem-final");
const elCategoriaAtual = document.getElementById("categoria-atual");

// ===================================
// FUNÇÕES PRINCIPAIS DO JOGO
// ===================================

function iniciarJogo() {
    // Reinicia erros e limpa mensagens
    erros = 0;
    elErros.innerText = erros;
    elMensagemFinal.innerHTML = "";
    elPalavra.classList.remove("vitoria", "derrota");

    // --- Seleciona a categoria escolhida ---
    const categoriaEscolhida = elCategoria.value;              // pega o value do select
    const listaPalavras = categorias[categoriaEscolhida];      // acessa a lista correspondente no objeto
    palavraSecreta = listaPalavras[Math.floor(Math.random() * listaPalavras.length)]; // palavra aleatória

    // Mostra a categoria escolhida na tela
    const nomeCategoria = elCategoria.options[elCategoria.selectedIndex].text;
    elCategoriaAtual.innerText = nomeCategoria.toUpperCase();

    // --- Monta os "_" para representar a palavra ---
    palavraExibida = Array(palavraSecreta.length).fill("_");
    elPalavra.innerText = palavraExibida.join(" ");

    // Reinicia o boneco da forca
    elBoneco.src = `img/forca0.jpg`;

    // Cria o teclado virtual
    gerarTeclado();
}

function gerarTeclado() {
    // Limpa o teclado antes de gerar novamente
    elTeclado.innerHTML = "";

    // Letras usadas no teclado do jogo
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZÇÁÉÍÓÚÂÊÔÃÕ";

    // Para cada letra, cria um botão
    alfabeto.split("").forEach(letra => {
        const btn = document.createElement("button");

        btn.classList.add("btn", "btn-sm", "btn-letra");
        btn.innerText = letra;

        // Quando clicar, chama verificarLetra()
        btn.onclick = () => verificarLetra(letra, btn);

        elTeclado.appendChild(btn);
    });
}

function verificarLetra(letra, btn) {
    // Impede que o botão seja clicado novamente
    btn.disabled = true;

    // --- Se a letra existe na palavra ---
    if (palavraSecreta.includes(letra)) {
        btn.classList.add("btn-acerto");

        // Revela todas as posições onde a letra aparece
        for (let i = 0; i < palavraSecreta.length; i++) {
            if (palavraSecreta[i] === letra) {
                palavraExibida[i] = letra;
            }
        }

        // Atualiza exibição da palavra
        elPalavra.innerText = palavraExibida.join(" ");

        // Se não existe mais "_" → vitória
        if (!palavraExibida.includes("_")) {
            finalizarJogo(true);
        }

    } else {
        // --- Se errou ---
        btn.classList.add("btn-erro");

        erros++;
        elErros.innerText = erros;

        // Atualiza imagem do boneco
        elBoneco.src = `img/forca${erros}.jpg`;

        // Se passou do limite → derrota
        if (erros === maxErros) {
            finalizarJogo(false);
        }
    }
}

function finalizarJogo(vitoria) {
    // Desativa todas as teclas
    Array.from(elTeclado.children).forEach(btn => (btn.disabled = true));

    if (vitoria) {
        elPalavra.classList.add("vitoria");
        elMensagemFinal.innerHTML = `
            <h3 class="msg-vitoria fw-bold">🎉 PARABÉNS! VOCÊ VENCEU! 🎉</h3>
        `;
        dispararConfete();

    } else {
        elPalavra.classList.add("derrota");

        // Revela a palavra completa
        elPalavra.innerText = palavraSecreta.split("").join(" ");

        elMensagemFinal.innerHTML = `
            <h3 class="derrota fw-bold">💀 GAME OVER! A palavra era: ${palavraSecreta}</h3>
        `;
    }
}

// Função para efeito de confete ao vencer
function dispararConfete() {
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
    });
}

// ===================================
// EVENTOS E CONFIGURAÇÃO AO CARREGAR A PÁGINA
// ===================================

document.addEventListener('DOMContentLoaded', () => {

    // Atualiza o nome da categoria sempre que o usuário troca no select
    elCategoria.addEventListener("change", () => {
        const nomeCategoria = elCategoria.options[elCategoria.selectedIndex].text;
        elCategoriaAtual.innerText = nomeCategoria.toUpperCase();
    });

    // Categoria padrão ao abrir
    elCategoria.value = "frutas";
    elCategoriaAtual.innerText = "FRUTAS";

    // Começa o jogo automaticamente
    iniciarJogo();

    // Botão do modal → iniciar jogo
    const btnIniciarModal = document.getElementById("btnIniciarModal");
    btnIniciarModal.addEventListener("click", () => iniciarJogo());

    // Botão reiniciar → iniciar jogo
    const btnReiniciar = document.getElementById("btnReiniciar");
    btnReiniciar.addEventListener("click", () => iniciarJogo());

    // Limpa mensagem final ao abrir modal
    const btnMudar = document.querySelector('[data-bs-target="#modalCategoria"]');
    if (btnMudar) {
        btnMudar.addEventListener("click", () => {
            elMensagemFinal.innerHTML = "";
        });
    }

    // Abre o modal automaticamente ao carregar
    const modalElement = document.getElementById('modalCategoria');
    if (modalElement && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
});
