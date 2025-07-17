// Lista de itens de cozinha para o sorteio
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

// Variáveis globais do sorteio
let itensDisponiveis = [...itensCozinha];
let itensSorteados = [];
let sorteioAtivo = false;

// Elementos do DOM
const botaoIniciar = document.getElementById('iniciarSorteio');
const botaoSortear = document.getElementById('sortearItem');
const botaoReiniciar = document.getElementById('reiniciarSorteio');
const itemAtual = document.getElementById('itemAtual');
const contadorAtual = document.getElementById('contadorAtual');
const totalItens = document.getElementById('totalItens');
const contadorSorteados = document.getElementById('contadorSorteados');
const listaSorteados = document.getElementById('listaSorteados');
const progressoFill = document.getElementById('progressoFill');
const progressoTexto = document.getElementById('progressoTexto');

// Função para embaralhar array
function embaralharArray(array) {
    const novoArray = [...array];
    for (let i = novoArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
    }
    return novoArray;
}

// Função para iniciar o sorteio
function iniciarSorteio() {
    if (sorteioAtivo) {
        mostrarMensagem('⚠️ Sorteio já está ativo!', 'warning');
        return;
    }
    
    sorteioAtivo = true;
    itensDisponiveis = embaralharArray(itensCozinha);
    itensSorteados = [];
    
    botaoIniciar.disabled = true;
    botaoSortear.disabled = false;
    
    itemAtual.textContent = 'Pronto para sortear! Clique em "Sortear Próximo"';
    
    atualizarContadores();
    atualizarListaSorteados();
    atualizarProgresso();
    
    mostrarMensagem('🎲 Sorteio iniciado! Boa sorte!', 'success');
    
    // Vibração no celular (se suportado)
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
}

// Função para sortear próximo item
function sortearItem() {
    if (!sorteioAtivo) {
        mostrarMensagem('⚠️ Inicie o sorteio primeiro!', 'warning');
        return;
    }
    
    if (itensDisponiveis.length === 0) {
        finalizarSorteio();
        return;
    }
    
    // Efeito de "roleta" - mostrar vários itens rapidamente
    let contador = 0;
    const maxContador = 10;
    
    const intervalo = setInterval(() => {
        const itemAleatorio = itensDisponiveis[Math.floor(Math.random() * itensDisponiveis.length)];
        itemAtual.textContent = itemAleatorio;
        contador++;
        
        if (contador >= maxContador) {
            clearInterval(intervalo);
            
            // Sortear item definitivo
            const itemSorteado = itensDisponiveis.shift();
            itensSorteados.push(itemSorteado);
            
            itemAtual.textContent = itemSorteado;
            
            atualizarContadores();
            atualizarListaSorteados();
            atualizarProgresso();
            
            mostrarMensagem(`✅ Sorteado: ${itemSorteado}`, 'success');
            
            // Vibração no celular
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            
            // Verificar se acabaram os itens
            if (itensDisponiveis.length === 0) {
                setTimeout(finalizarSorteio, 1000);
            }
        }
    }, 100);
}

// Função para finalizar o sorteio
function finalizarSorteio() {
    sorteioAtivo = false;
    botaoSortear.disabled = true;
    
    itemAtual.textContent = '🎉 Sorteio Finalizado! Todos os itens foram sorteados!';
    
    mostrarMensagem('🎉 Parabéns! Sorteio concluído!', 'success');
    
    // Vibração longa
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
    }
}

// Função para reiniciar o sorteio
function reiniciarSorteio() {
    if (confirm('Tem certeza que deseja reiniciar o sorteio? Todos os itens sorteados serão perdidos.')) {
        sorteioAtivo = false;
        itensDisponiveis = [...itensCozinha];
        itensSorteados = [];
        
        botaoIniciar.disabled = false;
        botaoSortear.disabled = true;
        
        itemAtual.textContent = 'Clique em "Iniciar Sorteio" para começar';
        
        atualizarContadores();
        atualizarListaSorteados();
        atualizarProgresso();
        
        mostrarMensagem('🔄 Sorteio reiniciado!', 'info');
    }
}

// Função para atualizar contadores
function atualizarContadores() {
    contadorAtual.textContent = itensSorteados.length;
    totalItens.textContent = itensCozinha.length;
    contadorSorteados.textContent = itensSorteados.length;
}

// Função para atualizar lista de sorteados
function atualizarListaSorteados() {
    if (itensSorteados.length === 0) {
        listaSorteados.innerHTML = '<p class="lista-vazia">Nenhum item sorteado ainda</p>';
        return;
    }
    
    let html = '';
    itensSorteados.forEach((item, index) => {
        html += `
            <div class="item-sorteado">
                <span>${item}</span>
                <span class="item-numero">${index + 1}</span>
            </div>
        `;
    });
    
    listaSorteados.innerHTML = html;
    
    // Scroll para o último item
    listaSorteados.scrollTop = listaSorteados.scrollHeight;
}

// Função para atualizar progresso
function atualizarProgresso() {
    const porcentagem = (itensSorteados.length / itensCozinha.length) * 100;
    progressoFill.style.width = `${porcentagem}%`;
    progressoTexto.textContent = `${Math.round(porcentagem)}% concluído`;
}

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo) {
    // Remove mensagem anterior se existir
    const mensagemExistente = document.querySelector('.mensagem-toast');
    if (mensagemExistente) {
        mensagemExistente.remove();
    }
    
    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem-toast';
    mensagem.textContent = texto;
    
    // Estilos da mensagem
    mensagem.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 20px;
        border-radius: 25px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
        font-size: 0.9rem;
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
        mensagem.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => mensagem.remove(), 300);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Configurar total de itens
    totalItens.textContent = itensCozinha.length;
    
    // Event listeners dos botões
    botaoIniciar.addEventListener('click', iniciarSorteio);
    botaoSortear.addEventListener('click', sortearItem);
    botaoReiniciar.addEventListener('click', reiniciarSorteio);
    
    // Adicionar estilos de animação ao CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { 
                opacity: 0; 
                transform: translateX(-50%) translateY(-20px); 
            }
            to { 
                opacity: 1; 
                transform: translateX(-50%) translateY(0); 
            }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 1; 
                transform: translateX(-50%) translateY(0); 
            }
            to { 
                opacity: 0; 
                transform: translateX(-50%) translateY(-20px); 
            }
        }
    `;
    document.head.appendChild(style);
    
    // Inicializar contadores
    atualizarContadores();
    atualizarProgresso();
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        mostrarMensagem('📱 Sorteio mobile pronto! Vamos começar?', 'info');
    }, 500);
    
    // Prevenir zoom acidental no iOS
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
});

// Adicionar suporte a gestos de toque
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    
    // Gesto para baixo para sortear (apenas se o sorteio estiver ativo)
    if (touchStartY - touchEndY > 50 && sorteioAtivo && !botaoSortear.disabled) {
        sortearItem();
    }
});

// Atalhos de teclado para facilitar uso
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case ' ': // Espaço para sortear
        case 'Enter':
            e.preventDefault();
            if (sorteioAtivo && !botaoSortear.disabled) {
                sortearItem();
            } else if (!sorteioAtivo && !botaoIniciar.disabled) {
                iniciarSorteio();
            }
            break;
        case 'r':
        case 'R':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                reiniciarSorteio();
            }
            break;
    }
});
