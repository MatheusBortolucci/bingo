
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

// Função para embaralhar array
function embaralharArray(array) {
    const novoArray = [...array];
    for (let i = novoArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
    }
    return novoArray;
}

// Função para gerar uma cartela única
function gerarCartela(numeroCartela) {
    console.log(`Gerando cartela número ${numeroCartela}`);
    const itensEmbaralhados = embaralharArray(itensCozinha);
    const itensCartela = itensEmbaralhados.slice(0, 24); // 24 itens + 1 espaço livre no centro
    console.log(`Itens selecionados para cartela ${numeroCartela}:`, itensCartela);
    
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
            ${gerarCelulas(itensCartela)}
        </div>
    `;
    
    console.log(`Cartela ${numeroCartela} criada com sucesso`);
    return cartela;
}

// Função para gerar as células da cartela (5x5)
function gerarCelulas(itens) {
    let celulas = '';
    let itemIndex = 0;
    
    for (let i = 0; i < 25; i++) {
        if (i === 12) { // Posição central (espaço livre)
            celulas += '<div class="bingo-cell free-space">❤️<br></div>';
        } else {
            celulas += `<div class="bingo-cell">${itens[itemIndex]}</div>`;
            itemIndex++;
        }
    }
    
    return celulas;
}

// Função para gerar todas as 35 cartelas
function gerarTodasCartelas() {
    console.log('Iniciando geração de cartelas...');
    const container = document.getElementById('cartelas-container');
    
    if (!container) {
        console.error('Container cartelas-container não encontrado!');
        mostrarMensagem('❌ Erro: Container não encontrado!', 'warning');
        return;
    }
    
    container.innerHTML = ''; // Limpar cartelas existentes
    
    // Mostrar loading
    container.innerHTML = '<div style="text-align: center; color: #d81b60; font-size: 1.5rem;">🎲 Gerando cartelas... 🎲</div>';
    console.log('Loading exibido');
    
    // Simular um pequeno delay para mostrar o loading
    setTimeout(() => {
        console.log('Iniciando geração das 35 cartelas...');
        container.innerHTML = '';
        
        for (let i = 1; i <= 35; i++) {
            console.log(`Gerando cartela ${i}`);
            const cartela = gerarCartela(i);
            container.appendChild(cartela);
        }
        
        console.log('Todas as cartelas foram geradas');
        
        // Habilitar botão de impressão
        const botaoImprimir = document.getElementById('imprimirCartelas');
        
        if (botaoImprimir) {
            botaoImprimir.disabled = false;
            console.log('Botão de impressão habilitado');
        }
        
        // Scroll suave para as cartelas
        container.scrollIntoView({ behavior: 'smooth' });
        
        // Mostrar mensagem de sucesso
        mostrarMensagem('✅ 35 cartelas geradas com sucesso!', 'success');
    }, 500);
}

// Função para gerar PDF sem cortes
function salvarComoPDF() {
    const cartelas = document.querySelectorAll('.cartela');
    if (cartelas.length === 0) {
        mostrarMensagem('⚠️ Gere as cartelas primeiro!', 'warning');
        return;
    }
    
    mostrarMensagem('📄 Gerando PDF... Aguarde um momento!', 'info');
    
    // Aguardar um pouco para garantir que tudo esteja renderizado
    setTimeout(() => {
        // Usar o container existente em vez de criar um novo
        const containerOriginal = document.getElementById('cartelas-container');
        
        // Temporariamente esconder outros elementos
        const header = document.querySelector('header');
        const controls = document.querySelector('.controls');
        
        header.style.display = 'none';
        controls.style.display = 'none';
        
        // Configurações do PDF simplificadas e mais compatíveis
        const opcoesPDF = {
            margin: 0.5,
            filename: 'Cartelas_Bingo_Cha_de_Panela_Mari.pdf',
            image: { 
                type: 'jpeg', 
                quality: 0.95 
            },
            html2canvas: { 
                scale: 1.2,
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#ffffff',
                logging: true,
                letterRendering: true,
                height: window.innerHeight,
                width: window.innerWidth,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait'
            }
        };
        
        // Gerar PDF diretamente do container existente
        html2pdf()
            .set(opcoesPDF)
            .from(containerOriginal)
            .save()
            .then(() => {
                mostrarMensagem('✅ PDF salvo com sucesso!', 'success');
                // Restaurar elementos
                header.style.display = '';
                controls.style.display = '';
            })
            .catch((erro) => {
                console.error('Erro ao gerar PDF:', erro);
                mostrarMensagem('❌ Erro ao gerar PDF. Tentando método alternativo...', 'warning');
                
                // Método alternativo: usar window.print()
                setTimeout(() => {
                    header.style.display = '';
                    controls.style.display = '';
                    window.print();
                    mostrarMensagem('💡 Use "Salvar como PDF" na janela de impressão', 'info');
                }, 1000);
            });
    }, 300);
}

// Função para imprimir/salvar como PDF
function imprimirCartelas() {
    const cartelas = document.querySelectorAll('.cartela');
    if (cartelas.length === 0) {
        mostrarMensagem('⚠️ Gere as cartelas primeiro!', 'warning');
        return;
    }
    
    // Esconder todas as mensagens antes de imprimir
    const mensagens = document.querySelectorAll('.mensagem');
    mensagens.forEach(msg => msg.style.display = 'none');
    
    // Configurar impressão com delay para garantir aplicação dos estilos
    setTimeout(() => {
        window.print();
        
        // Restaurar mensagens após a impressão
        setTimeout(() => {
            mensagens.forEach(msg => msg.style.display = '');
        }, 1000);
    }, 200);
}

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo) {
    // Remove mensagem anterior se existir
    const mensagemExistente = document.querySelector('.mensagem');
    if (mensagemExistente) {
        mensagemExistente.remove();
    }
    
    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem';
    mensagem.textContent = texto;
    
    // Estilos da mensagem
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
    
    // Cores baseadas no tipo
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
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        mensagem.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => mensagem.remove(), 300);
    }, 3000);
}

// Função para verificar se as cartelas já foram geradas
function verificarCartelas() {
    const cartelas = document.querySelectorAll('.cartela');
    const botaoImprimir = document.getElementById('imprimirCartelas');
    
    if (cartelas.length > 0) {
        if (botaoImprimir) botaoImprimir.disabled = false;
    } else {
        if (botaoImprimir) botaoImprimir.disabled = true;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, configurando event listeners...');
    
    const botaoGerar = document.getElementById('gerarCartelas');
    const botaoImprimir = document.getElementById('imprimirCartelas');
    const botaoNovas = document.getElementById('novasCartelas');
    
    console.log('Botões encontrados:', {
        gerar: !!botaoGerar,
        imprimir: !!botaoImprimir,
        novas: !!botaoNovas
    });
    
    // Inicialmente desabilitar botão de impressão
    if (botaoImprimir) botaoImprimir.disabled = true;
    
    if (botaoGerar) {
        botaoGerar.addEventListener('click', function() {
            console.log('Botão Gerar Cartelas clicado!');
            gerarTodasCartelas();
        });
    }
    
    if (botaoImprimir) {
        botaoImprimir.addEventListener('click', imprimirCartelas);
    }
    
    if (botaoNovas) {
        botaoNovas.addEventListener('click', function() {
            console.log('Botão Novas Cartelas clicado!');
            gerarTodasCartelas();
        });
    }
    
    // Adicionar estilos de animação ao CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .cartelas-grid {
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        mostrarMensagem('🎉 Bem-vinda ao Gerador de Bingo da Mari!', 'info');
    }, 500);
});

// Verificar periodicamente se as cartelas foram geradas
setInterval(verificarCartelas, 1000);
