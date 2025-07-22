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
    console.log(`🚀 Gerando QR para cartela ${numeroCartela}`);
    
    const elemento = document.getElementById(`qr-mini-${numeroCartela}`);
    if (!elemento) {
        console.error(`❌ Elemento qr-mini-${numeroCartela} não encontrado!`);
        return;
    }
    
    // Buscar os itens da cartela
    const cartelaElemento = elemento.closest('.cartela');
    const itensCartela = JSON.parse(cartelaElemento.dataset.itens);
    
    console.log(`✅ Elemento encontrado para cartela ${numeroCartela}`);
    
    // FORÇAR VISIBILIDADE DO ELEMENTO
    elemento.style.display = 'block';
    elemento.style.visibility = 'visible';
    elemento.style.opacity = '1';
    elemento.style.width = '50px';
    elemento.style.height = '50px';
    elemento.style.position = 'relative';
    elemento.style.zIndex = '999';
    
    // CRIAR ID ÚNICO SIMPLES
    const cartelaId = `MARI${numeroCartela.toString().padStart(2, '0')}${Date.now().toString().slice(-4)}`;
    
    // CRIAR DADOS COMPLETOS PARA O QR CODE
    const dadosCompletos = {
        id: cartelaId,
        numero: numeroCartela,
        itens: itensCartela,
        evento: 'Chá de Panela da Mari',
        criadaEm: new Date().toISOString()
    };
    
    // ARMAZENAR NA BASE DE DADOS LOCAL (para uso no mesmo dispositivo)
    window.cartelasDatabase[cartelaId] = dadosCompletos;
    
    // QR CODE COM CHAVES SIMPLES
    const chavesItens = itensCartela.map(item => obterChaveItem(item)).filter(chave => chave);
    const textoQR = JSON.stringify(chavesItens);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(textoQR)}`;
    
    // REMOVER BORDAS DE DEBUG E USAR COR PRETA
    elemento.style.border = 'none';
    elemento.style.backgroundColor = 'transparent';
    elemento.innerHTML = `<img src="${url}" style="width:50px!important;height:50px!important;display:block!important;" onload="console.log('✅ QR ${numeroCartela} (${textoQR.length} chars)')" onerror="console.error('❌ QR ${numeroCartela} falhou')">`;
    
    console.log(`📡 Cartela ${numeroCartela} - QR com ${chavesItens.length} chaves`);
    console.log(`📏 Tamanho dos dados: ${textoQR.length} caracteres`);
    console.log(`🔑 Chaves: ${chavesItens.join(', ')}`);
    
    // Verificar se o elemento pai tem problemas de CSS
    const pai = elemento.parentElement;
    if (pai) {
        pai.style.overflow = 'visible';
        pai.style.display = 'flex';
        pai.style.alignItems = 'center';
        pai.style.justifyContent = 'center';
    }
}

function gerarTodasCartelas() {
    console.log('🎯 FUNÇÃO CHAMADA!');
    
    const container = document.getElementById('cartelas-container');
    if (!container) {
        console.error('Container não encontrado!');
        alert('Container não encontrado!');
        return;
    }
    
    // Quantidade fixa de 35 cartelas (como indica o botão)
    const quantidadeCartelas = 35;
    console.log('Quantidade:', quantidadeCartelas);
    
    console.log(`Iniciando geração de ${quantidadeCartelas} cartelas...`);
    container.innerHTML = '';
    
    // Primeiro criar todas as cartelas
    for (let i = 1; i <= quantidadeCartelas; i++) {
        console.log(`Criando cartela ${i}...`);
        const cartela = gerarCartela(i);
        container.appendChild(cartela);
    }
    
    console.log('Todas as cartelas foram adicionadas ao DOM');
    
    // Agora gerar todos os QR codes
    for (let i = 1; i <= quantidadeCartelas; i++) {
        console.log(`Gerando QR code para cartela ${i}`);
        gerarQRCodeMini(i);
    }
    
    // HABILITAR BOTÕES DE DOWNLOAD/PDF
    ['gerarPDF', 'gerarPDFDireto', 'imprimirCartelas'].forEach(id => {
        const botao = document.getElementById(id);
        if (botao) {
            botao.disabled = false;
            botao.style.opacity = '1';
        }
    });
    
    // MOSTRAR BASE DE DADOS DAS CARTELAS
    console.log('📊 BASE DE DADOS DAS CARTELAS CRIADA:');
    console.log(window.cartelasDatabase);
    
    // SALVAR NO LOCALSTORAGE PARA USAR NO SORTEIO
    localStorage.setItem('cartelasDatabase', JSON.stringify(window.cartelasDatabase));
    
    console.log('Processo de geração completado! Botões habilitados.');
    console.log('💾 Dados salvos no localStorage para uso no sorteio.');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎲 Script carregado!');
    
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
