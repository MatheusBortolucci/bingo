
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
    
    // Gerar dados para QR Code
    const dadosQR = gerarDadosQRCode(numeroCartela, itensCartela);
    
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
        <div class="qr-container">
            <div class="qr-code" id="qr-${numeroCartela}"></div>
            <div class="qr-label">📱 QR para validação</div>
        </div>
    `;
    
    // Gerar QR Code após adicionar ao DOM
    setTimeout(() => {
        gerarQRCode(numeroCartela, dadosQR);
    }, 100);
    
    console.log(`Cartela ${numeroCartela} criada com sucesso`);
    return cartela;
}

// Função para gerar dados do QR Code
function gerarDadosQRCode(numeroCartela, itensCartela) {
    // Criar hash para verificar integridade
    const hash = gerarHashCartela(numeroCartela, itensCartela);
    
    const dados = {
        numero: numeroCartela,
        itens: itensCartela,
        hash: hash,
        evento: "Chá de Panela da Mari",
        timestamp: new Date().toISOString()
    };
    
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

// Função para gerar QR Code visual
async function gerarQRCode(numeroCartela, dadosQR) {
    const elemento = document.getElementById(`qr-${numeroCartela}`);
    if (elemento && typeof QRCode !== 'undefined') {
        try {
            // Criar um canvas pequeno para o QR Code
            const canvas = document.createElement('canvas');
            await QRCode.toCanvas(canvas, dadosQR, {
                width: 80,
                margin: 1,
                color: {
                    dark: '#e91e63',  // Rosa escuro
                    light: '#ffffff'  // Fundo branco
                }
            });
            
            // Adicionar o canvas ao elemento
            elemento.appendChild(canvas);
            console.log(`QR Code gerado para cartela ${numeroCartela}`);
        } catch (error) {
            console.error(`Erro ao gerar QR Code para cartela ${numeroCartela}:`, error);
            // Fallback: mostrar apenas o texto
            elemento.innerHTML = '<div style="font-size: 0.6rem; color: #e91e63;">QR Code</div>';
        }
    } else {
        console.warn('Biblioteca QRCode não disponível ou elemento não encontrado');
        if (elemento) {
            elemento.innerHTML = '<div style="font-size: 0.6rem; color: #e91e63;">QR Code</div>';
        }
    }
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
function gerarPDFDireto() {
    const cartelas = document.querySelectorAll('.cartela');
    if (cartelas.length === 0) {
        mostrarMensagem('⚠️ Gere as cartelas primeiro!', 'warning');
        return;
    }
    
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
        
        if (index === 12) { // Centro - coração
            pdf.setFontSize(16);
            pdf.setTextColor(233, 30, 99);
            pdf.setFont('helvetica', 'bold');
            // Usar símbolo de coração disponível
            pdf.text('♥', cellX + cellWidth/2, cellY + cellHeight/2 + 3, { 
                align: 'center'
            });
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

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, configurando event listeners...');
    
    const botaoGerar = document.getElementById('gerarCartelas');
    const botaoGerarPDF = document.getElementById('gerarPDF');
    const botaoGerarPDFDireto = document.getElementById('gerarPDFDireto');
    const botaoImprimir = document.getElementById('imprimirCartelas');
    const botaoNovas = document.getElementById('novasCartelas');
    const botaoTeste = document.getElementById('testarCaptura');
    
    console.log('Botões encontrados:', {
        gerar: !!botaoGerar,
        gerarPDF: !!botaoGerarPDF,
        gerarPDFDireto: !!botaoGerarPDFDireto,
        imprimir: !!botaoImprimir,
        novas: !!botaoNovas,
        teste: !!botaoTeste
    });
    
    // Inicialmente desabilitar botões que dependem das cartelas
    if (botaoGerarPDF) botaoGerarPDF.disabled = true;
    if (botaoGerarPDFDireto) botaoGerarPDFDireto.disabled = true;
    if (botaoImprimir) botaoImprimir.disabled = true;
    if (botaoTeste) botaoTeste.disabled = true;
    
    if (botaoGerar) {
        botaoGerar.addEventListener('click', function() {
            console.log('Botão Gerar Cartelas clicado!');
            gerarTodasCartelas();
        });
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
