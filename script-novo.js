// MAPEAMENTO CHAVE-VALOR DOS ITENS (para QR codes compactos)
const itensMap = {
    // Talheres Básicos (A1-A6)
    "A1": "Garfo", "A2": "Faca", "A3": "Colher", "A4": "Colher de chá", "A5": "Faca de pão", "A6": "Garfo de sobremesa",
    
    // Panelas e Frigideiras (B1-B6)
    "B1": "Panela de pressão", "B2": "Panela", "B3": "Frigideira", "B4": "Caçarola", "B5": "Leiteira", "B6": "Chaleira",
    
    // Utensílios Básicos de Cozinha (C1-C15)
    "C1": "Concha", "C2": "Escumadeira", "C3": "Espátula", "C4": "Colher de pau", "C5": "Batedor de ovos", "C6": "Pegador",
    "C7": "Abridor de latas", "C8": "Saca-rolhas", "C9": "Descascador", "C10": "Ralador", "C11": "Peneira", "C12": "Coador",
    "C13": "Tábua de corte", "C14": "Rolo de massa", "C15": "Funil",
    
    // Assadeiras e Formas (D1-D5)
    "D1": "Assadeira", "D2": "Forma de bolo", "D3": "Forma de pizza", "D4": "Forma de pão", "D5": "Refratário",
    
    // Eletrodomésticos Comuns (E1-E6)
    "E1": "Liquidificador", "E2": "Batedeira", "E3": "Torradeira", "E4": "Cafeteira", "E5": "Micro-ondas", "E6": "Mixer",
    
    // Recipientes e Potes (F1-F5)
    "F1": "Tigela", "F2": "Jarra", "F3": "Potes", "F4": "Tupperware", "F5": "Garrafa térmica",
    
    // Itens para Servir (G1-G7)
    "G1": "Pratos", "G2": "Xícaras", "G3": "Copos", "G4": "Canecas", "G5": "Travessa", "G6": "Açucareiro", "G7": "Bule",
    
    // Utensílios de Medição (H1-H3)
    "H1": "Balança", "H2": "Xícaras medidoras", "H3": "Timer",
    
    // Itens Diversos (I1-I10)
    "I1": "Avental", "I2": "Luvas de forno", "I3": "Panos de prato", "I4": "Escorredor de louças", "I5": "Porta-talheres",
    "I6": "Descanso de panela", "I7": "Guardanapos", "I8": "Papel toalha", "I9": "Papel alumínio", "I10": "Filme plástico"
};

// Array dos itens (para compatibilidade com código existente)
const itensCozinha = Object.values(itensMap);

// Função para obter chave do item
function obterChaveItem(item) {
    return Object.keys(itensMap).find(chave => itensMap[chave] === item);
}

// Função para obter item da chave
function obterItemChave(chave) {
    return itensMap[chave];
}

function embaralharArray(array) {
    const novoArray = [...array];
    for (let i = novoArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
    }
    return novoArray;
}

function gerarCartela(numeroCartela) {
    console.log(`Gerando cartela número ${numeroCartela}`);
    const itensEmbaralhados = embaralharArray(itensCozinha);
    const itensCartela = itensEmbaralhados.slice(0, 24);
    
    const cartela = document.createElement('div');
    cartela.className = 'cartela';
    
    cartela.innerHTML = `
        <div class="cartela-numero">Cartela ${numeroCartela}</div>
        <div class="cartela-header">
            <div class="cartela-decoracao">
                <span class="estrela">✨</span>
                <div>
                    <div class="cartela-titulo">Chá de Panela da Mari</div>
                    <div class="cartela-subtitulo">BINGO</div>
                </div>
                <span class="estrela">✨</span>
                <span class="coracao">❤️</span>
            </div>
        </div>
        <div class="bingo-grid">
            ${gerarCelulas(itensCartela, numeroCartela)}
        </div>
    `;
    
    // Armazenar itens da cartela para usar no QR code
    cartela.dataset.itens = JSON.stringify(itensCartela);
    
    return cartela;
}

function gerarCelulas(itens, numeroCartela) {
    let celulas = '';
    let itemIndex = 0;
    
    for (let i = 0; i < 25; i++) {
        if (i === 12) {
            celulas += `<div class="bingo-cell free-space qr-center" id="qr-cell-${numeroCartela}">
                <div class="qr-code-mini" id="qr-mini-${numeroCartela}"></div>
            </div>`;
        } else {
            celulas += `<div class="bingo-cell">${itens[itemIndex]}</div>`;
            itemIndex++;
        }
    }
    
    return celulas;
}

// BASE DE DADOS DAS CARTELAS (para validação)
window.cartelasDatabase = window.cartelasDatabase || {};

// FUNÇÃO SUPER SIMPLES PARA QR CODE
function gerarQRCodeMini(numeroCartela) {
    const elemento = document.getElementById(`qr-mini-${numeroCartela}`);
    if (!elemento) return;
    
    // Buscar os itens da cartela
    const cartelaElemento = elemento.closest('.cartela');
    const itensCartela = JSON.parse(cartelaElemento.dataset.itens);
    
    // Converter para chaves simples
    const chaves = itensCartela.map(item => obterChaveItem(item)).filter(chave => chave);
    
    // QR CODE SUPER SIMPLES - só as chaves
    const textoQR = chaves.join(',');
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=${encodeURIComponent(textoQR)}`;
    
    elemento.innerHTML = `<img src="${url}" style="width:40px;height:40px;">`;
}

function gerarTodasCartelas() {
    const container = document.getElementById('cartelas-container');
    if (!container) return;
    
    const quantidadeCartelas = 35;
    container.innerHTML = '';
    
    // Criar todas as cartelas
    for (let i = 1; i <= quantidadeCartelas; i++) {
        const cartela = gerarCartela(i);
        container.appendChild(cartela);
    }
    
    // Gerar todos os QR codes
    for (let i = 1; i <= quantidadeCartelas; i++) {
        gerarQRCodeMini(i);
    }
    
    // Habilitar botões de download
    ['gerarPDF', 'gerarPDFDireto', 'imprimirCartelas'].forEach(id => {
        const botao = document.getElementById(id);
        if (botao) {
            botao.disabled = false;
            botao.style.opacity = '1';
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const botaoGerar = document.getElementById('gerarCartelas');
    const botaoNovas = document.getElementById('novasCartelas');
    
    if (botaoGerar) {
        botaoGerar.addEventListener('click', gerarTodasCartelas);
    }
    
    if (botaoNovas) {
        botaoNovas.addEventListener('click', gerarTodasCartelas);
    }
    
    // Desabilitar botões inicialmente
    ['gerarPDF', 'gerarPDFDireto', 'imprimirCartelas'].forEach(id => {
        const botao = document.getElementById(id);
        if (botao) botao.disabled = true;
    });
});
