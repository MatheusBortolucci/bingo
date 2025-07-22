const itensCozinha = [
    // Talheres Básicos
    "Garfo", "Faca", "Colher", "Colher de chá", "Faca de pão", "Garfo de sobremesa",
    
    // Panelas e Frigideiras
    "Panela de pressão", "Panela", "Frigideira", "Caçarola", "Leiteira", "Chaleira",
    
    // Utensílios Básicos de Cozinha
    "Concha", "Escumadeira", "Espátula", "Colher de pau", "Batedor de ovos", "Pegador",
    "Abridor de latas", "Saca-rolhas", "Descascador", "Ralador", "Peneira", "Coador",
    "Tábua de corte", "Rolo de massa", "Funil",
    
    // Assadeiras e Formas
    "Assadeira", "Forma de bolo", "Forma de pizza", "Forma de pão", "Refratário",
    
    // Eletrodomésticos Comuns
    "Liquidificador", "Batedeira", "Torradeira", "Cafeteira", "Micro-ondas", "Mixer",
    
    // Recipientes e Potes
    "Tigela", "Jarra", "Potes", "Tupperware", "Garrafa térmica",
    
    // Itens para Servir
    "Pratos", "Xícaras", "Copos", "Canecas", "Travessa", "Açucareiro", "Bule",
    
    // Utensílios de Medição
    "Balança", "Xícaras medidoras", "Timer",
    
    // Itens Diversos
    "Avental", "Luvas de forno", "Panos de prato", "Escorredor de louças", "Porta-talheres",
    "Descanso de panela", "Guardanapos", "Papel toalha", "Papel alumínio", "Filme plástico"
];

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
    
    // QR CODE COM DADOS COMPLETOS (para funcionar entre dispositivos)
    const textoQR = JSON.stringify(dadosCompletos);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(textoQR)}`;
    
    // REMOVER BORDAS DE DEBUG E USAR COR PRETA
    elemento.style.border = 'none';
    elemento.style.backgroundColor = 'transparent';
    elemento.innerHTML = `<img src="${url}" style="width:50px!important;height:50px!important;display:block!important;" onload="console.log('✅ QR ${numeroCartela} ID: ${cartelaId}')" onerror="console.error('❌ QR ${numeroCartela} falhou')">`;
    
    console.log(`📡 Cartela ${numeroCartela} - ID: ${cartelaId} - Dados completos no QR`);
    
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
