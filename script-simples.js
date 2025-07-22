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
    const itensEmbaralhados = embaralharArray(itensCozinha);
    const itensCartela = itensEmbaralhados.slice(0, 24);
    
    const cartela = document.createElement('div');
    cartela.className = 'cartela';
    
    const dadosQR = {
        numero: numeroCartela,
        evento: 'Chá de Panela da Mari',
        timestamp: new Date().toISOString(),
        itens: itensCartela,
        hash: gerarHashCartela(numeroCartela, itensCartela)
    };
    
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
    
    setTimeout(() => {
        gerarQRCodeMini(numeroCartela, JSON.stringify(dadosQR));
    }, 500);
    
    return cartela;
}

function gerarHashCartela(numero, itens) {
    const dados = `${numero}-${itens.sort().join(',')}`;
    let hash = 0;
    for (let i = 0; i < dados.length; i++) {
        const char = dados.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

function gerarQRCodeMini(numeroCartela, dadosQR) {
    const elemento = document.getElementById(`qr-mini-${numeroCartela}`);
    
    if (!elemento) return;

    elemento.innerHTML = '';
    
    if (typeof QRCode !== 'undefined') {
        try {
            new QRCode(elemento, {
                text: dadosQR,
                width: 50,
                height: 50,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        } catch(error) {
            tentarMetodoAPI(elemento, dadosQR);
        }
    } else {
        tentarMetodoAPI(elemento, dadosQR);
    }
}

function tentarMetodoAPI(elemento, dadosQR) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(dadosQR)}`;
    elemento.innerHTML = `<img src="${qrUrl}" alt="QR Code" style="width: 50px; height: 50px;">`;
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

function gerarTodasCartelas() {
    const container = document.getElementById('cartelas-container');
    
    if (!container) {
        mostrarMensagem('❌ Erro: Container não encontrado!', 'warning');
        return;
    }
    
    container.innerHTML = '<div style="text-align: center; color: #d81b60; font-size: 1.5rem;">🎲 Gerando cartelas... 🎲</div>';
    
    setTimeout(() => {
        container.innerHTML = '';
        
        for (let i = 1; i <= 35; i++) {
            const cartela = gerarCartela(i);
            container.appendChild(cartela);
        }
        
        const botaoGerarPDF = document.getElementById('gerarPDF');
        const botaoGerarPDFDireto = document.getElementById('gerarPDFDireto');
        const botaoImprimir = document.getElementById('imprimirCartelas');
        
        if (botaoGerarPDF) botaoGerarPDF.disabled = false;
        if (botaoGerarPDFDireto) botaoGerarPDFDireto.disabled = false;
        if (botaoImprimir) botaoImprimir.disabled = false;
        
        container.scrollIntoView({ behavior: 'smooth' });
        mostrarMensagem('✅ 35 cartelas geradas com sucesso!', 'success');
    }, 500);
}

function mostrarMensagem(texto, tipo) {
    const mensagemExistente = document.querySelector('.mensagem');
    if (mensagemExistente) {
        mensagemExistente.remove();
    }
    
    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem';
    mensagem.textContent = texto;
    
    mensagem.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    switch (tipo) {
        case 'success':
            mensagem.style.background = 'linear-gradient(45deg, #4caf50, #66bb6a)';
            break;
        case 'warning':
            mensagem.style.background = 'linear-gradient(45deg, #ff9800, #ffb74d)';
            break;
        case 'info':
            mensagem.style.background = 'linear-gradient(45deg, #2196f3, #64b5f6)';
            break;
        default:
            mensagem.style.background = 'linear-gradient(45deg, #e91e63, #f06292)';
    }
    
    document.body.appendChild(mensagem);
    
    setTimeout(() => {
        mensagem.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => mensagem.remove(), 300);
    }, 3000);
}

function imprimirCartelas() {
    const cartelas = document.querySelectorAll('.cartela');
    if (cartelas.length === 0) {
        mostrarMensagem('⚠️ Gere as cartelas primeiro!', 'warning');
        return;
    }
    
    const mensagens = document.querySelectorAll('.mensagem');
    mensagens.forEach(msg => msg.style.display = 'none');
    
    setTimeout(() => {
        window.print();
        setTimeout(() => {
            mensagens.forEach(msg => msg.style.display = '');
        }, 1000);
    }, 200);
}
