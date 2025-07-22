
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
    
    // Gerar dados COMPLETOS para QR Code (igual ao teste do sorteio)
    const dadosQR = {
        numero: numeroCartela,
        evento: 'Chá de Panela da Mari',
        timestamp: new Date().toISOString(),
        itens: itensCartela,
        hash: gerarHashCartela(numeroCartela, itensCartela)
    };
    
    console.log(`📦 Dados QR Code para cartela ${numeroCartela}:`, dadosQR);
    
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
    
    // Gerar QR Code após adicionar ao DOM
    setTimeout(() => {
        gerarQRCodeMini(numeroCartela, JSON.stringify(dadosQR));
    }, 500);
    
    console.log(`Cartela ${numeroCartela} criada com sucesso`);
    return cartela;
}

// Função para gerar dados do QR Code
function gerarDadosQRCode(numeroCartela, itensCartela) {
    // Dados completos para validação
    const dados = {
        numero: numeroCartela,
        evento: 'Chá de Panela da Mari',
        timestamp: new Date().toISOString(),
        itens: itensCartela, // Lista completa de itens
        hash: gerarHashCartela(numeroCartela, itensCartela) // Para verificar integridade
    };
    
    console.log(`📦 Dados QR para cartela ${numeroCartela}:`, dados);
    return JSON.stringify(dados);
}

// Função para gerar hash da cartela
function gerarHashCartela(numero, itens) {
    const dados = `${numero}-${itens.sort().join(',')}`;
    let hash = 0;
    for (let i = 0; i < dados.length; i++) {
        const char = dados.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Converter para 32bit integer
    }
    return hash.toString();
}

// Função para detectar dispositivos móveis
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Função para detectar se é iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Função de fallback para mobile - cria QR Code usando canvas nativo
function gerarQRCodeMobileFallback(elemento, dadosQR, numeroCartela) {
    console.log('📱 Tentando fallback mobile...');
    
    // Criar um canvas para desenhar um QR code simples
    const canvas = document.createElement('canvas');
    const tamanho = isMobile() ? 80 : 50;
    canvas.width = tamanho;
    canvas.height = tamanho;
    const ctx = canvas.getContext('2d');
    
    // Fundo branco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tamanho, tamanho);
    
    // Desenhar um padrão simples baseado nos dados
    ctx.fillStyle = '#000000';
    
    // Criar um hash simples dos dados para o padrão
    let hash = 0;
    for (let i = 0; i < dadosQR.length; i++) {
        hash = ((hash << 5) - hash + dadosQR.charCodeAt(i)) & 0xffffffff;
    }
    
    // Desenhar padrão baseado no hash
    const cellSize = Math.floor(tamanho / 10);
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            const index = x * 10 + y;
            if ((hash >> (index % 32)) & 1) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
    
    // Adicionar texto como fallback
    ctx.fillStyle = '#000000';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`#${numeroCartela}`, tamanho/2, tamanho - 2);
    
    // Converter para imagem e adicionar ao elemento
    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    img.style.width = tamanho + 'px';
    img.style.height = tamanho + 'px';
    img.alt = `QR Code cartela ${numeroCartela}`;
    
    elemento.innerHTML = '';
    elemento.appendChild(img);
    
    console.log(`✅ QR Code mobile fallback criado para cartela ${numeroCartela}`);
}

// Função para gerar QR Code mini no centro da cartela
function gerarQRCodeMini(numeroCartela, dadosQR) {
    const elemento = document.getElementById(`qr-mini-${numeroCartela}`);
    const loading = document.querySelector(`#qr-cell-${numeroCartela} .qr-loading`);
    
    console.log(`🧪 Gerando QR Code para cartela ${numeroCartela} - MÉTODO IDÊNTICO AO TESTE`);
    console.log('📍 Elemento encontrado:', !!elemento);
    console.log('📦 QRCode disponível:', typeof QRCode);
    console.log('� QRious disponível:', typeof QRious);
    console.log('�📝 Dados QR:', dadosQR);
    
    if (!elemento) {
        console.error(`❌ Elemento qr-mini-${numeroCartela} não encontrado!`);
        return;
    }

    // Esconder loading primeiro
    if (loading) {
        loading.style.display = 'none';
    }
    
    // Usar dados da cartela no formato JSON (igual ao teste)
    const jsonTeste = JSON.stringify(dadosQR);
    console.log('🧪 Dados do QR da cartela (formato teste):', jsonTeste);
    
    // CÓDIGO EXATAMENTE IGUAL AO SORTEIO.HTML
    // Método 1: qrcode.js (mais compatível)
    if (typeof QRCode !== 'undefined') {
        console.log('✅ Usando qrcode.js');
        elemento.innerHTML = ''; // Limpar primeiro
        try {
            const qrInstance = new QRCode(elemento, {
                text: jsonTeste,
                width: 50,
                height: 50,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
            console.log(`✅ QR Code instance criado para cartela ${numeroCartela}`, qrInstance);
            
            // Verificar se foi criado após um tempo
            setTimeout(() => {
                const qrContent = elemento.innerHTML;
                console.log(`📊 Conteúdo do elemento após 500ms para cartela ${numeroCartela}:`, qrContent.substring(0, 100));
                if (qrContent.length < 10) {
                    console.log(`⚠️ QR parece vazio, tentando API para cartela ${numeroCartela}...`);
                    tentarMetodo2Cartela(elemento, jsonTeste);
                }
            }, 500);
            
        } catch(error) {
            console.error('❌ Erro com qrcode.js:', error);
            tentarMetodo2Cartela(elemento, jsonTeste);
        }
    } else {
        tentarMetodo2Cartela(elemento, jsonTeste);
    }
    
// Função SUPER SIMPLES para gerar QR Code 
function gerarQRCodeMini(numeroCartela, dadosQR) {
    console.log(`🚀 GERANDO QR SIMPLES para cartela ${numeroCartela}`);
    
    const elemento = document.getElementById(`qr-mini-${numeroCartela}`);
    if (!elemento) {
        console.error(`❌ Elemento qr-mini-${numeroCartela} NÃO ENCONTRADO!`);
        return;
    }
    
    console.log(`✅ Elemento encontrado para cartela ${numeroCartela}`);
    
    // USAR SEMPRE API (mais confiável)
    const textoSimples = `Cartela-${numeroCartela}`;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(textoSimples)}&color=000000&bgcolor=ffffff`;
    
    elemento.innerHTML = `<img src="${url}" style="width:50px;height:50px;border:1px solid #000;" onload="console.log('QR ${numeroCartela} OK')" onerror="console.error('QR ${numeroCartela} ERRO')">`;
    
    console.log(`📡 QR ${numeroCartela} URL: ${url.substring(0, 80)}...`);
}

// Função para gerar QR com QRCode library
function tentarGerarQRCodeLib(elemento, dadosQR, numeroCartela, tamanho = 50) {
    console.log(`🔄 Gerando QR para cartela ${numeroCartela} - dados:`, dadosQR.substring(0, 100) + '...');
    
    // Limpar conteúdo anterior
    elemento.innerHTML = '';
    
    // Verificar se QRCode está realmente disponível
    if (typeof QRCode === 'undefined') {
        console.error('❌ QRCode library não está disponível');
        tentarMetodoAPI(elemento, dadosQR, numeroCartela, tamanho);
        return;
    }
    
    try {
        // Usar exatamente o mesmo método do teste que funciona
        console.log(`✅ Criando QR Code com new QRCode() para cartela ${numeroCartela}`);
        new QRCode(elemento, {
            text: dadosQR,
            width: tamanho,
            height: tamanho,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
        
        console.log('✅ QR Code criado com sucesso para cartela', numeroCartela);
        
    } catch (error) {
        console.error(`❌ Erro ao criar QR Code:`, error);
        console.log('🔄 Tentando método API como fallback...');
        tentarMetodoAPI(elemento, dadosQR, numeroCartela, tamanho);
    }
}

function tentarMetodoAPI(elemento, dadosQR, numeroCartela, tamanho) {
    console.log(`🌐 Gerando QR via API para cartela ${numeroCartela}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${tamanho}x${tamanho}&data=${encodeURIComponent(dadosQR)}&color=000000&bgcolor=ffffff`;
    elemento.innerHTML = `<img src="${qrUrl}" alt="QR Code" style="width: ${tamanho}px; height: ${tamanho}px;" onload="console.log('QR API ${numeroCartela} carregado')" onerror="console.error('QR API ${numeroCartela} falhou')">`;
}

// Função para gerar QR com QRious library
function tentarGerarQRCodeQRious(elemento, dadosQR, numeroCartela, tamanho = 50) {
    try {
        // Limpar conteúdo anterior
        elemento.innerHTML = '';
        
        // Criar um canvas específico para o QR Code
        const canvas = document.createElement('canvas');
        canvas.id = `qr-canvas-${numeroCartela}`;
        canvas.width = tamanho;
        canvas.height = tamanho;
        canvas.style.cssText = 'width: 100%; height: 100%; border-radius: 4px;';
        
        // Gerar QR Code com QRious
        const qr = new QRious({
            element: canvas,
            value: dadosQR,
            size: tamanho,
            background: '#ffffff',
            foreground: '#000000'  // COR PRETA
        });
        
        console.log('✅ QR Code QRious gerado com sucesso para cartela', numeroCartela);
        
        // Adicionar o canvas ao elemento
        elemento.appendChild(canvas);
        elemento.classList.add('mostrar');
        
        // Adicionar atributos para debug
        elemento.setAttribute('data-qr-gerado', 'true');
        elemento.setAttribute('data-cartela', numeroCartela);
        
    } catch (error) {
        console.error(`❌ Erro ao criar QR Code com QRious:`, error);
        elemento.innerHTML = '<div style="font-size: 0.6rem; color: #e91e63; font-weight: bold;">QR</div>';
        elemento.classList.add('mostrar');
    }
}

// Função para carregar QR Code library dinamicamente
function carregarQRCodeDinamico(elemento, dadosQR, numeroCartela, tamanho = 50) {
    console.warn('⚠️ Carregando biblioteca QRCode dinamicamente...');
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/davidshimjs-qrcodejs@0.0.2/qrcode.min.js';
    
    script.onload = function() {
        console.log('📚 Biblioteca QRCode carregada dinamicamente!');
        setTimeout(() => {
            if (typeof QRCode !== 'undefined') {
                tentarGerarQRCodeLib(elemento, dadosQR, numeroCartela, tamanho);
            } else {
                console.error('❌ Ainda sem QRCode após carregamento dinâmico');
                // Para mobile, tentar o fallback
                if (isMobile()) {
                    gerarQRCodeMobileFallback(elemento, dadosQR, numeroCartela);
                } else {
                    elemento.innerHTML = '<div style="font-size: 0.6rem; color: #e91e63; font-weight: bold;">QR</div>';
                    elemento.classList.add('mostrar');
                }
            }
        }, 100);
    };
    
    script.onerror = function() {
        console.error('❌ Falha ao carregar QRCode dinamicamente');
        // Para mobile, tentar o fallback
        if (isMobile()) {
            gerarQRCodeMobileFallback(elemento, dadosQR, numeroCartela);
        } else {
            elemento.innerHTML = '<div style="font-size: 0.6rem; color: #e91e63; font-weight: bold;">QR</div>';
            elemento.classList.add('mostrar');
        }
    };
    
    document.head.appendChild(script);
}

// Função para gerar as células da cartela (5x5)
function gerarCelulas(itens, numeroCartela) {
    let celulas = '';
    let itemIndex = 0;
    
    for (let i = 0; i < 25; i++) {
        if (i === 12) { // Posição central (QR Code)
            celulas += `<div class="bingo-cell free-space qr-center" id="qr-cell-${numeroCartela}">
                <div class="qr-code-mini" id="qr-mini-${numeroCartela}"></div>
                <div class="qr-loading">⏳</div>
            </div>`;
        } else {
            celulas += `<div class="bingo-cell">${itens[itemIndex]}</div>`;
            itemIndex++;
        }
    }
    
    return celulas;
}

// Função para gerar todas as 35 cartelas
function gerarTodasCartelas() {
    console.log('🎲 INICIANDO geração de cartelas...');
    const container = document.getElementById('cartelas-container');
    
    if (!container) {
        console.error('❌ Container cartelas-container NÃO encontrado!');
        mostrarMensagem('❌ Erro: Container não encontrado!', 'warning');
        return;
    }
    
    console.log('✅ Container encontrado:', container);
    container.innerHTML = ''; // Limpar cartelas existentes
    
    // Mostrar loading
    container.innerHTML = '<div style="text-align: center; color: #d81b60; font-size: 1.5rem;">🎲 Gerando cartelas... 🎲</div>';
    console.log('✅ Loading exibido');
    
    // Simular um pequeno delay para mostrar o loading
    setTimeout(() => {
        console.log('⏰ Timeout executado, iniciando geração das 35 cartelas...');
        container.innerHTML = '';
        
        try {
            for (let i = 1; i <= 35; i++) {
                console.log(`📝 Gerando cartela ${i}`);
                const cartela = gerarCartela(i);
                if (cartela) {
                    container.appendChild(cartela);
                    console.log(`✅ Cartela ${i} adicionada ao container`);
                } else {
                    console.error(`❌ Cartela ${i} retornou null/undefined`);
                }
            }
        } catch (error) {
            console.error('❌ Erro durante geração das cartelas:', error);
        }
        
        console.log('🏁 Todas as cartelas foram processadas');
        
        // Habilitar botões
        const botaoGerarPDF = document.getElementById('gerarPDF');
        const botaoGerarPDFDireto = document.getElementById('gerarPDFDireto');
        const botaoImprimir = document.getElementById('imprimirCartelas');
        const botaoTeste = document.getElementById('testarCaptura');
        
        if (botaoGerarPDF) {
            botaoGerarPDF.disabled = false;
            console.log('Botão de gerar PDF habilitado');
        }
        
        if (botaoGerarPDFDireto) {
            botaoGerarPDFDireto.disabled = false;
            console.log('Botão de gerar PDF direto habilitado');
        }
        
        if (botaoImprimir) {
            botaoImprimir.disabled = false;
            console.log('Botão de impressão habilitado');
        }
        
        if (botaoTeste) {
            botaoTeste.disabled = false;
            console.log('Botão de teste habilitado');
        }
        
        // Scroll suave para as cartelas
        container.scrollIntoView({ behavior: 'smooth' });
        
        // Mostrar mensagem de sucesso
        mostrarMensagem('✅ 35 cartelas geradas com sucesso!', 'success');
    }, 500);
}

// Função para gerar PDF profissional com 4 cartelas por página
async function gerarPDFProfissional() {
    const cartelas = document.querySelectorAll('.cartela');
    if (cartelas.length === 0) {
        mostrarMensagem('⚠️ Gere as cartelas primeiro!', 'warning');
        return;
    }
    
    mostrarMensagem('📄 Preparando PDF... Aguarde!', 'info');
    
    // Primeiro tentar método com html2canvas
    if (typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined') {
        try {
            await gerarPDFComImagem();
            return;
        } catch (error) {
            console.log('Método com imagem falhou, usando método direto...');
            mostrarMensagem('📄 Tentando método alternativo...', 'info');
        }
    }
    
    // Fallback para método direto
    gerarPDFDireto();
}

// Função para gerar PDF com captura de imagem (método preferido)
async function gerarPDFComImagem() {
    const cartelas = document.querySelectorAll('.cartela');
    
    // Verificar se os QR Codes estão prontos
    const qrCodes = document.querySelectorAll('.qr-code-mini canvas');
    console.log(`QR Codes para PDF: ${qrCodes.length} de ${cartelas.length}`);
    
    if (qrCodes.length < cartelas.length) {
        mostrarMensagem('⏳ Aguardando QR Codes para PDF...', 'info');
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Dimensões A4
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 8;
    const gap = 3;
    const cartelaWidth = (pageWidth - 2 * margin - gap) / 2;
    const cartelaHeight = (pageHeight - 2 * margin - gap) / 2;
    
    let paginaAtual = 0;
    let cartelasPorPagina = 0;
    
    for (let i = 0; i < cartelas.length; i++) {
        // Nova página a cada 4 cartelas
        if (cartelasPorPagina === 0) {
            if (paginaAtual > 0) {
                pdf.addPage();
            }
            paginaAtual++;
        }
        
        const cartela = cartelas[i];
        
        // Calcular posição
        const coluna = cartelasPorPagina % 2;
        const linha = Math.floor(cartelasPorPagina / 2);
        const x = margin + coluna * (cartelaWidth + gap);
        const y = margin + linha * (cartelaHeight + gap);
        
        // Aguardar renderização
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Capturar com configurações otimizadas
        const canvas = await html2canvas(cartela, {
            scale: 2.5, // Alta qualidade
            backgroundColor: '#fef7f7',
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: cartela.offsetWidth,
            height: cartela.offsetHeight,
            onclone: (clonedDoc) => {
                // Aplicar estilos para garantir renderização correta
                const clonedCartela = clonedDoc.querySelector('.cartela');
                if (clonedCartela) {
                    clonedCartela.style.transform = 'none';
                    clonedCartela.style.webkitTransform = 'none';
                }
            }
        });
        
        // Verificar se canvas é válido
        if (canvas.width === 0 || canvas.height === 0) {
            throw new Error(`Canvas vazio para cartela ${i + 1}`);
        }
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        if (imgData === 'data:,' || imgData === '') {
            throw new Error(`Imagem vazia para cartela ${i + 1}`);
        }
        
        // Adicionar ao PDF
        pdf.addImage(imgData, 'JPEG', x, y, cartelaWidth, cartelaHeight);
        
        cartelasPorPagina = (cartelasPorPagina + 1) % 4;
        
        // Progresso
        const progresso = Math.round(((i + 1) / cartelas.length) * 100);
        mostrarMensagem(`📄 Gerando PDF de alta qualidade... ${progresso}%`, 'info');
    }
    
    // Salvar
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = `Bingo_Cha_de_Panela_Mari_HD_${dataAtual}.pdf`;
    
    pdf.save(nomeArquivo);
    mostrarMensagem('✅ PDF de alta qualidade gerado com sucesso!', 'success');
}

// Método alternativo para gerar PDF
async function gerarPDFAlternativo() {
    try {
        mostrarMensagem('📄 Tentando método alternativo...', 'info');
        
        const container = document.getElementById('cartelas-container');
        
        // Scroll para o topo para garantir visibilidade
        window.scrollTo(0, 0);
        container.scrollIntoView();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Usar html2canvas no container inteiro
        const canvas = await html2canvas(container, {
            scale: 1.5,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            logging: true,
            scrollX: 0,
            scrollY: 0
        });
        
        if (canvas.width === 0 || canvas.height === 0) {
            throw new Error('Canvas vazio no método alternativo');
        }
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210 - 16; // A4 width minus margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        pdf.addImage(imgData, 'JPEG', 8, 8, imgWidth, imgHeight);
        
        const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        pdf.save(`Bingo_Alternativo_${dataAtual}.pdf`);
        
        mostrarMensagem('✅ PDF alternativo gerado!', 'success');
        
    } catch (error) {
        console.error('Erro no método alternativo:', error);
        mostrarMensagem('❌ Use o botão "Imprimir Navegador" e salve como PDF', 'warning');
    }
}

// Versão simplificada para debug
async function testarCaptura() {
    const cartela = document.querySelector('.cartela');
    if (!cartela) {
        mostrarMensagem('❌ Nenhuma cartela encontrada', 'warning');
        return;
    }
    
    try {
        console.log('Testando captura da primeira cartela...');
        console.log('html2canvas disponível?', typeof html2canvas);
        
        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas não carregou corretamente');
        }
        
        const canvas = await html2canvas(cartela, {
            scale: 1,
            backgroundColor: '#ffffff',
            logging: true,
            useCORS: true,
            allowTaint: true
        });
        
        console.log('Canvas criado:', canvas.width, 'x', canvas.height);
        
        if (canvas.width > 0 && canvas.height > 0) {
            // Mostrar o canvas na tela para debug
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.body.appendChild(canvas);
                mostrarMensagem('✅ Captura funcionando! Veja a nova janela.', 'success');
            } else {
                // Se não conseguir abrir janela, usar dataURL
                const dataURL = canvas.toDataURL('image/png');
                console.log('Data URL length:', dataURL.length);
                mostrarMensagem('✅ Captura funcionando! Veja no console.', 'success');
            }
        } else {
            mostrarMensagem('❌ Canvas vazio', 'warning');
        }
        
    } catch (error) {
        console.error('Erro no teste:', error);
        mostrarMensagem('❌ Erro na captura: ' + error.message, 'warning');
        
        // Tentar abordagem alternativa
        setTimeout(() => {
            testarSemHtml2Canvas();
        }, 1000);
    }
}

// Função alternativa sem html2canvas
function testarSemHtml2Canvas() {
    mostrarMensagem('🔄 Tentando método sem html2canvas...', 'info');
    
    try {
        // Usar SVG para capturar o conteúdo
        const cartela = document.querySelector('.cartela');
        if (!cartela) {
            mostrarMensagem('❌ Cartela não encontrada', 'warning');
            return;
        }
        
        // Criar representação SVG do conteúdo
        const svgContent = criarSVGDaCartela(cartela);
        
        if (svgContent) {
            // Criar PDF diretamente
            gerarPDFDireto();
        } else {
            mostrarMensagem('❌ Não foi possível processar a cartela', 'warning');
        }
        
    } catch (error) {
        console.error('Erro no método alternativo:', error);
        mostrarMensagem('❌ Use "Imprimir Navegador" como alternativa', 'warning');
    }
}

// Função para criar PDF diretamente sem captura de imagem
async function gerarPDFDireto() {
    const cartelas = document.querySelectorAll('.cartela');
    if (cartelas.length === 0) {
        mostrarMensagem('⚠️ Gere as cartelas primeiro!', 'warning');
        return;
    }
    
    mostrarMensagem('📄 Aguardando QR Codes serem gerados...', 'info');
    
    // Aguardar todos os QR Codes serem gerados
    let tentativas = 0;
    const maxTentativas = 20; // 10 segundos máximo
    
    while (tentativas < maxTentativas) {
        const qrElements = document.querySelectorAll('.qr-code-mini[data-qr-gerado="true"]');
        const canvasElements = document.querySelectorAll('.qr-code-mini canvas');
        
        console.log(`🔄 Verificação ${tentativas + 1}: QR Elements: ${qrElements.length}, Canvas: ${canvasElements.length} de ${cartelas.length}`);
        
        if (canvasElements.length >= cartelas.length) {
            // Verificar se os canvas têm conteúdo
            let canvasComConteudo = 0;
            canvasElements.forEach((canvas, index) => {
                if (canvas.width > 0 && canvas.height > 0) {
                    const ctx = canvas.getContext('2d');
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const hasContent = imageData.data.some(pixel => pixel !== 0 && pixel !== 255);
                    if (hasContent) {
                        canvasComConteudo++;
                    }
                }
            });
            
            console.log(`🎨 Canvas com conteúdo: ${canvasComConteudo}`);
            
            if (canvasComConteudo >= cartelas.length * 0.8) { // 80% dos QR codes prontos
                break;
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        tentativas++;
    }
    
    const canvasFinais = document.querySelectorAll('.qr-code-mini canvas');
    console.log(`🏁 Iniciando PDF com ${canvasFinais.length} QR Codes prontos`);
    
    mostrarMensagem('📄 Gerando PDF de alta qualidade (método direto)...', 'info');
    
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        let paginaAtual = 0;
        let cartelasPorPagina = 0;
        
        // Dimensões otimizadas para 4 cartelas por página
        const margin = 8;
        const gap = 3;
        const cartelaWidth = (210 - 2 * margin - gap) / 2; // ~95mm
        const cartelaHeight = (297 - 2 * margin - gap) / 2; // ~139mm
        
        cartelas.forEach((cartela, index) => {
            // Nova página a cada 4 cartelas
            if (cartelasPorPagina === 0) {
                if (paginaAtual > 0) {
                    pdf.addPage();
                }
                paginaAtual++;
            }
            
            // Calcular posição da cartela na página (2x2 grid)
            const coluna = cartelasPorPagina % 2;
            const linha = Math.floor(cartelasPorPagina / 2);
            const x = margin + coluna * (cartelaWidth + gap);
            const y = margin + linha * (cartelaHeight + gap);
            
            // Desenhar cartela com qualidade melhorada
            desenharCartelaNoPDF(pdf, cartela, x, y, cartelaWidth, cartelaHeight);
            
            cartelasPorPagina = (cartelasPorPagina + 1) % 4;
            
            // Mostrar progresso
            const progresso = Math.round(((index + 1) / cartelas.length) * 100);
            if (index % 5 === 0 || index === cartelas.length - 1) {
                mostrarMensagem(`📄 Criando PDF profissional... ${progresso}%`, 'info');
            }
        });
        
        // Salvar PDF com nome descritivo
        const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        const nomeArquivo = `Bingo_Cha_de_Panela_Mari_QUALIDADE_${dataAtual}.pdf`;
        
        pdf.save(nomeArquivo);
        mostrarMensagem('✅ PDF de alta qualidade gerado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar PDF direto:', error);
        mostrarMensagem('❌ Erro no PDF direto. Use impressão do navegador.', 'warning');
    }
}

// Função para desenhar cartela diretamente no PDF
function desenharCartelaNoPDF(pdf, cartela, x, y, width, height) {
    // Desenhar borda da cartela com borda arredondada simulada
    pdf.setFillColor(254, 247, 247); // Rosa bem clarinho
    pdf.rect(x, y, width, height, 'F');
    
    pdf.setDrawColor(233, 30, 99);
    pdf.setLineWidth(0.8);
    pdf.rect(x, y, width, height);
    
    // Título da cartela - melhor formatação
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(216, 27, 96); // Rosa escuro
    pdf.text('CHÁS DE PANELA DA MARI', x + width/2, y + 10, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setTextColor(51, 51, 51); // Cinza escuro
    pdf.text('BINGO', x + width/2, y + 20, { align: 'center' });
    
    // Decoração com estrelas
    pdf.setFontSize(12);
    pdf.setTextColor(233, 30, 99);
    pdf.text('★', x + 8, y + 15);
    pdf.text('★', x + width - 8, y + 15);
    
    // Grid 5x5 melhorado
    const gridStartY = y + 25;
    const gridHeight = height - 30;
    const cellWidth = width / 5;
    const cellHeight = gridHeight / 5;
    
    // Pegar conteúdo das células
    const cells = cartela.querySelectorAll('.bingo-cell');
    
    console.log(`📋 Processando cartela com ${cells.length} células`);
    
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        const cellX = x + col * cellWidth;
        const cellY = gridStartY + row * cellHeight;
        
        // Aplicar padrão xadrez correto baseado no CSS original
        let isRed = false;
        
        // Lógica do padrão xadrez do CSS original
        if (row === 0) { // Primeira linha: rosa, vermelho, rosa, vermelho, rosa
            isRed = (col === 1 || col === 3);
        } else if (row === 1) { // Segunda linha: vermelho, rosa, vermelho, rosa, vermelho
            isRed = (col === 0 || col === 2 || col === 4);
        } else if (row === 2) { // Terceira linha: rosa, vermelho, rosa (centro), vermelho, rosa
            isRed = (col === 1 || col === 3);
        } else if (row === 3) { // Quarta linha: vermelho, rosa, vermelho, rosa, vermelho
            isRed = (col === 0 || col === 2 || col === 4);
        } else if (row === 4) { // Quinta linha: rosa, vermelho, rosa, vermelho, rosa
            isRed = (col === 1 || col === 3);
        }
        
        // Aplicar cores
        if (isRed) {
            pdf.setFillColor(233, 30, 99); // Vermelho/Pink
            pdf.rect(cellX, cellY, cellWidth, cellHeight, 'F');
            pdf.setTextColor(255, 255, 255); // Texto branco
            pdf.setFont('helvetica', 'bold');
        } else {
            pdf.setFillColor(252, 228, 236); // Rosa claro
            pdf.rect(cellX, cellY, cellWidth, cellHeight, 'F');
            pdf.setTextColor(51, 51, 51); // Texto escuro
            pdf.setFont('helvetica', 'normal');
        }
        
        // Borda da célula
        pdf.setDrawColor(233, 30, 99);
        pdf.setLineWidth(0.3);
        pdf.rect(cellX, cellY, cellWidth, cellHeight);
        
        // Conteúdo da célula
        let texto = cell.textContent.trim();
        
        if (index === 12) { // Centro - QR Code
            console.log(`🎯 Processando célula central (QR) - índice ${index}`);
            
            pdf.setFillColor(255, 255, 255); // Fundo branco para QR
            pdf.rect(cellX + 2, cellY + 2, cellWidth - 4, cellHeight - 4, 'F');
            
            // Tentar obter o QR Code real da cartela
            const qrElement = cell.querySelector('.qr-code-mini');
            let qrCanvas = null;
            
            if (qrElement) {
                qrCanvas = qrElement.querySelector('canvas');
                console.log(`📱 QR Element encontrado:`, qrElement.id, 'Canvas:', !!qrCanvas);
            }
            
            console.log(`🔍 Cartela QR - Elemento:`, !!qrElement, 'Canvas:', !!qrCanvas);
            
            if (qrCanvas && qrCanvas.width > 0 && qrCanvas.height > 0) {
                try {
                    // Verificar se o canvas tem conteúdo
                    const ctx = qrCanvas.getContext('2d');
                    const imageData = ctx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
                    const hasContent = imageData.data.some(pixel => pixel !== 0 && pixel !== 255);
                    
                    console.log(`🎨 Canvas tem conteúdo real:`, hasContent);
                    
                    if (hasContent) {
                        // Converter canvas do QR Code para imagem
                        const qrImageData = qrCanvas.toDataURL('image/png');
                        
                        if (qrImageData && qrImageData.length > 100) {
                            // Calcular tamanho do QR no PDF
                            const qrSize = Math.min(cellWidth - 6, cellHeight - 6);
                            const qrX = cellX + (cellWidth - qrSize) / 2;
                            const qrY = cellY + (cellHeight - qrSize) / 2;
                            
                            // Adicionar QR Code como imagem no PDF
                            pdf.addImage(qrImageData, 'PNG', qrX, qrY, qrSize, qrSize);
                            console.log(`✅ QR Code adicionado ao PDF para posição ${index}`);
                        } else {
                            throw new Error('QR DataURL vazio ou muito pequeno');
                        }
                    } else {
                        throw new Error('Canvas sem conteúdo visual');
                    }
                    
                } catch (error) {
                    console.log('⚠️ Erro ao adicionar QR Code no PDF:', error);
                    // Fallback para texto
                    pdf.setFontSize(6);
                    pdf.setTextColor(233, 30, 99);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text('QR CODE', cellX + cellWidth/2, cellY + cellHeight/2 + 1, { 
                        align: 'center'
                    });
                }
            } else {
                console.log('⚠️ Canvas QR não encontrado ou inválido');
                // Fallback quando não há canvas QR Code válido
                pdf.setFontSize(6);
                pdf.setTextColor(233, 30, 99);
                pdf.setFont('helvetica', 'bold');
                pdf.text('QR CODE', cellX + cellWidth/2, cellY + cellHeight/2 + 1, { 
                    align: 'center'
                });
            }
        } else if (texto && texto.length > 0) {
            // Configurar fonte para texto normal
            pdf.setFontSize(8);
            
            // Ajustar quebra de texto melhor
            const maxWidth = cellWidth - 4;
            let linhas = [];
            
            // Quebrar texto em palavras
            const palavras = texto.split(' ');
            let linhaAtual = '';
            
            palavras.forEach(palavra => {
                const testeLinha = linhaAtual ? linhaAtual + ' ' + palavra : palavra;
                const larguraTeste = pdf.getTextWidth(testeLinha);
                
                if (larguraTeste <= maxWidth) {
                    linhaAtual = testeLinha;
                } else {
                    if (linhaAtual) {
                        linhas.push(linhaAtual);
                        linhaAtual = palavra;
                    } else {
                        // Palavra muito longa - forçar quebra
                        linhas.push(palavra);
                    }
                }
            });
            
            if (linhaAtual) {
                linhas.push(linhaAtual);
            }
            
            // Limitar a 3 linhas
            if (linhas.length > 3) {
                linhas = linhas.slice(0, 2);
                linhas.push(linhas[1].substring(0, Math.min(linhas[1].length, 8)) + '...');
            }
            
            // Centralizar verticalmente
            const alturaTexto = linhas.length * 3;
            const startY = cellY + cellHeight/2 - alturaTexto/2 + 2;
            
            linhas.forEach((linha, lineIndex) => {
                pdf.text(linha, cellX + cellWidth/2, startY + (lineIndex * 3), { 
                    align: 'center'
                });
            });
        }
    });
    
    // Número da cartela no canto superior direito
    const numeroElement = cartela.querySelector('.cartela-numero');
    if (numeroElement) {
        const numero = numeroElement.textContent.trim();
        pdf.setFillColor(233, 30, 99);
        pdf.roundedRect(x + width - 20, y + 2, 15, 8, 2, 2, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text(numero, x + width - 12.5, y + 8, { align: 'center' });
    }
}

// Função placeholder para SVG (caso precise depois)
function criarSVGDaCartela(cartela) {
    // Implementação futura se necessário
    return true;
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
    const botaoGerarPDF = document.getElementById('gerarPDF');
    const botaoGerarPDFDireto = document.getElementById('gerarPDFDireto');
    const botaoImprimir = document.getElementById('imprimirCartelas');
    const botaoTeste = document.getElementById('testarCaptura');
    
    if (cartelas.length > 0) {
        if (botaoGerarPDF) botaoGerarPDF.disabled = false;
        if (botaoGerarPDFDireto) botaoGerarPDFDireto.disabled = false;
        if (botaoImprimir) botaoImprimir.disabled = false;
        if (botaoTeste) botaoTeste.disabled = false;
    } else {
        if (botaoGerarPDF) botaoGerarPDF.disabled = true;
        if (botaoGerarPDFDireto) botaoGerarPDFDireto.disabled = true;
        if (botaoImprimir) botaoImprimir.disabled = true;
        if (botaoTeste) botaoTeste.disabled = true;
    }
}

// Função para testar QR Code
function testarQRCode() {
    console.log('🧪 Testando biblioteca QRCode...');
    console.log('QRCode disponível:', typeof QRCode);
    
    if (typeof QRCode === 'undefined') {
        console.error('❌ Biblioteca QRCode não carregou!');
        mostrarMensagem('⚠️ Erro: QRCode não carregou. Recarregue a página!', 'warning');
        return;
    }
    
    console.log('✅ QRCode library carregada com sucesso');
    
    // Criar um elemento de teste
    const testeDiv = document.createElement('div');
    testeDiv.id = 'qr-teste';
    testeDiv.style.position = 'fixed';
    testeDiv.style.top = '100px';
    testeDiv.style.right = '20px';
    testeDiv.style.width = '60px';
    testeDiv.style.height = '60px';
    testeDiv.style.background = 'white';
    testeDiv.style.border = '2px solid #e91e63';
    testeDiv.style.zIndex = '9999';
    document.body.appendChild(testeDiv);
    
    try {
        QRCode.toCanvas(testeDiv, 'TESTE-QR-CODE', {
            width: 50,
            height: 50,
            margin: 1,
            color: {
                dark: '#000000',  // COR PRETA
                light: '#ffffff'
            }
        }, function (error, canvas) {
            if (error) {
                console.error('❌ Erro no teste QR:', error);
                testeDiv.remove();
                mostrarMensagem('❌ Erro: QR Code não funciona!', 'warning');
            } else {
                console.log('✅ Teste QR Code bem-sucedido!');
                // Remover teste após 3 segundos
                setTimeout(() => {
                    testeDiv.remove();
                }, 3000);
                mostrarMensagem('✅ QR Code funcionando! Pode gerar cartelas.', 'success');
            }
        });
    } catch (error) {
        console.error('❌ Erro crítico no QR Code:', error);
        testeDiv.remove();
        mostrarMensagem('❌ Erro crítico no QR Code!', 'warning');
    }
}

// Função para testar QR Codes especificamente em mobile
function testarQRCodesMobile() {
    if (!isMobile()) {
        mostrarMensagem('Esta função é específica para dispositivos móveis.', 'warning');
        return;
    }
    
    console.log('📱 Testando QR Codes em dispositivo móvel...');
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('📱 Is iOS:', isIOS());
    console.log('📱 Tela:', window.innerWidth + 'x' + window.innerHeight);
    
    // Testar bibliotecas disponíveis
    console.log('📦 QRCode disponível:', typeof QRCode !== 'undefined');
    console.log('📦 QRious disponível:', typeof QRious !== 'undefined');
    
    // Gerar um QR Code de teste
    const testeElement = document.createElement('div');
    testeElement.id = 'qr-teste-mobile';
    testeElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border: 2px solid #e91e63;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        max-width: 90%;
        text-align: center;
    `;
    
    const botaoFechar = document.createElement('button');
    botaoFechar.textContent = '✕';
    botaoFechar.style.cssText = `
        position: absolute;
        top: 5px;
        right: 10px;
        background: #e91e63;
        color: white;
        border: none;
        padding: 5px 8px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
    `;
    
    botaoFechar.onclick = () => document.body.removeChild(testeElement);
    
    const qrContainer = document.createElement('div');
    qrContainer.id = 'qr-container-teste-mobile';
    qrContainer.style.cssText = `
        width: 100px;
        height: 100px;
        margin: 10px auto;
        border: 2px solid #e91e63;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
    `;
    
    testeElement.innerHTML = `
        <h3 style="margin: 0 20px 10px 0; color: #e91e63;">Teste QR Mobile</h3>
        <p style="margin: 5px 0; font-size: 14px;">Dispositivo: <strong>${isMobile() ? 'Mobile ✅' : 'Desktop'}</strong></p>
        <p style="margin: 5px 0; font-size: 14px;">iOS: <strong>${isIOS() ? 'Sim 📱' : 'Não 🤖'}</strong></p>
        <div id="qr-container-teste-mobile" style="width: 100px; height: 100px; margin: 15px auto; border: 2px solid #e91e63; display: flex; align-items: center; justify-content: center; background: white;"></div>
        <p style="font-size: 12px; color: #666;">Se você vê um QR Code acima, está funcionando!</p>
    `;
    
    testeElement.appendChild(botaoFechar);
    document.body.appendChild(testeElement);
    
    // Tentar gerar QR Code de teste
    const container = testeElement.querySelector('#qr-container-teste-mobile');
    if (container) {
        // Criar um QR Code diretamente no container
        const qrDiv = document.createElement('div');
        qrDiv.id = 'qr-mini-teste-mobile';
        qrDiv.className = 'qr-code-mini';
        qrDiv.style.cssText = 'width: 90px; height: 90px; display: flex; align-items: center; justify-content: center;';
        
        container.appendChild(qrDiv);
        
        // Gerar QR Code
        setTimeout(() => {
            gerarQRCodeMini('teste-mobile', 'TESTE-MOBILE-QR-' + Date.now());
        }, 100);
    }
}

// Nova função para debug dos QR Codes nas cartelas
function debugQRCodes() {
    console.log('🔍 DEBUGGING QR CODES...');
    
    const cartelas = document.querySelectorAll('.cartela');
    const qrElements = document.querySelectorAll('.qr-code-mini');
    const canvasElements = document.querySelectorAll('.qr-code-mini canvas');
    
    console.log(`📊 Estatísticas:
    - Cartelas: ${cartelas.length}
    - QR Elements: ${qrElements.length} 
    - Canvas Elements: ${canvasElements.length}`);
    
    console.log(`🧪 Bibliotecas disponíveis:
    - QRCode: ${typeof QRCode}
    - QRious: ${typeof QRious}
    - window.QRCode: ${typeof window.QRCode}`);
    
    // Verificar cada QR individualmente
    qrElements.forEach((qr, index) => {
        const canvas = qr.querySelector('canvas');
        const hasDataAttr = qr.hasAttribute('data-qr-gerado');
        
        console.log(`🔍 QR ${index + 1}:`, {
            element: !!qr,
            canvas: !!canvas,
            dataAttr: hasDataAttr,
            canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'N/A',
            innerHTML: qr.innerHTML.substring(0, 50) + (qr.innerHTML.length > 50 ? '...' : '')
        });
        
        if (canvas && canvas.width > 0) {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const hasContent = imageData.data.some(pixel => pixel !== 0 && pixel !== 255);
            console.log(`  📈 Canvas ${index + 1} tem conteúdo:`, hasContent);
            
            if (hasContent) {
                const dataURL = canvas.toDataURL();
                console.log(`  📸 DataURL length:`, dataURL.length);
            }
        }
    });
    
    // Se não há QR Codes, tentar gerar um manualmente para teste
    if (canvasElements.length === 0) {
        console.log('❌ Nenhum QR Code encontrado! Tentando teste manual...');
        
        // Encontrar primeiro elemento QR
        const primeiroQR = qrElements[0];
        if (primeiroQR) {
            console.log('🧪 Testando geração manual no primeiro QR...');
            const numeroCartela = primeiroQR.getAttribute('data-cartela') || '1';
            gerarQRCodeMini(numeroCartela, `TESTE-${numeroCartela}`);
        }
    }
    
    mostrarMensagem(`🔍 Debug completo! Veja o console. QR: ${canvasElements.length}/${cartelas.length}`, 'info');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, configurando event listeners...');
    
    // Verificar se as bibliotecas estão carregadas
    console.log('Bibliotecas disponíveis:', {
        QRCode: typeof QRCode,
        jsPDF: typeof window.jspdf,
        html2canvas: typeof html2canvas
    });
    
    const botaoGerar = document.getElementById('gerarCartelas');
    const botaoGerarPDF = document.getElementById('gerarPDF');
    const botaoGerarPDFDireto = document.getElementById('gerarPDFDireto');
    const botaoImprimir = document.getElementById('imprimirCartelas');
    const botaoNovas = document.getElementById('novasCartelas');
    const botaoTeste = document.getElementById('testarCaptura');
    const botaoDebugQR = document.getElementById('debugQR');
    const botaoTesteMobile = document.getElementById('testarMobile');
    
    console.log('Botões encontrados:', {
        gerar: !!botaoGerar,
        gerarPDF: !!botaoGerarPDF,
        gerarPDFDireto: !!botaoGerarPDFDireto,
        imprimir: !!botaoImprimir,
        novas: !!botaoNovas,
        teste: !!botaoTeste,
        debugQR: !!botaoDebugQR,
        testeMobile: !!botaoTesteMobile
    });
    
    // Inicialmente desabilitar botões que dependem das cartelas
    if (botaoGerarPDF) botaoGerarPDF.disabled = true;
    if (botaoGerarPDFDireto) botaoGerarPDFDireto.disabled = true;
    if (botaoImprimir) botaoImprimir.disabled = true;
    if (botaoTeste) botaoTeste.disabled = true;
    
    if (botaoGerar) {
        console.log('✅ Botão gerarCartelas encontrado, adicionando listener...');
        botaoGerar.addEventListener('click', function() {
            console.log('🎯 Botão Gerar Cartelas clicado!');
            try {
                gerarTodasCartelas();
            } catch (error) {
                console.error('❌ Erro ao gerar cartelas:', error);
            }
        });
    } else {
        console.error('❌ Botão gerarCartelas NÃO encontrado!');
    }
    
    if (botaoGerarPDF) {
        botaoGerarPDF.addEventListener('click', function() {
            console.log('Botão Gerar PDF clicado!');
            gerarPDFProfissional();
        });
    }
    
    if (botaoGerarPDFDireto) {
        botaoGerarPDFDireto.addEventListener('click', function() {
            console.log('Botão Gerar PDF Direto clicado!');
            gerarPDFDireto();
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
    
    if (botaoTeste) {
        botaoTeste.addEventListener('click', function() {
            console.log('Botão Testar Captura clicado!');
            testarCaptura();
        });
    }
    
    if (botaoDebugQR) {
        botaoDebugQR.addEventListener('click', function() {
            console.log('Botão Debug QR clicado!');
            debugQRCodes();
        });
    }
    
    // Botão de teste mobile
    if (botaoTesteMobile) {
        botaoTesteMobile.addEventListener('click', function() {
            console.log('Botão Teste Mobile clicado!');
            testarQRCodesMobile();
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
        if (isMobile()) {
            mostrarMensagem('📱 Versão Mobile detectada! QR Codes são apenas visuais.', 'info');
        } else {
            mostrarMensagem('🎉 Bem-vinda ao Gerador de Bingo da Mari!', 'info');
        }
        
        // Testar QR Code após um tempo
        setTimeout(() => {
            testarQRCode();
        }, 1000);
    }, 500);
});

// Verificar periodicamente se as cartelas foram geradas
setInterval(verificarCartelas, 1000);
