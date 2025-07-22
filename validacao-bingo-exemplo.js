// EXEMPLO DE VALIDAÇÃO COM SISTEMA DE ID ÚNICO
// Sistema otimizado: QR code simples + base de dados local

/**
 * Função para validar bingo usando ID do QR code
 * @param {string} cartelaId - ID escaneado do QR code (ex: "MARI0112345")
 * @param {Array} itensSorteados - Itens já sorteados no bingo
 * @returns {Object} - Resultado da validação
 */
function validarBingoComId(cartelaId, itensSorteados) {
    console.log(`🔍 Validando cartela com ID: ${cartelaId}`);
    
    // CARREGAR BASE DE DADOS (do localStorage ou variável global)
    const database = JSON.parse(localStorage.getItem('cartelasDatabase') || '{}');
    
    // VERIFICAR SE O ID EXISTE
    const dadosCartela = database[cartelaId];
    if (!dadosCartela) {
        return {
            valido: false,
            erro: 'ID de cartela não encontrado ou inválido',
            cartelaId
        };
    }
    
    const { numero, itens, evento } = dadosCartela;
    console.log(`✅ Cartela encontrada: #${numero} do evento "${evento}"`);
    
    // VERIFICAR QUANTOS ITENS FORAM SORTEADOS
    const itensEncontrados = itens.filter(item => 
        itensSorteados.includes(item)
    );
    
    // PARA GANHAR: precisa ter todos os 24 itens (centro é livre)
    const temBingo = itensEncontrados.length >= 24;
    
    const resultado = {
        valido: true,
        cartelaId,
        numeroCartela: numero,
        evento,
        temBingo,
        itensEncontrados: itensEncontrados.length,
        totalItens: itens.length,
        porcentagem: Math.round((itensEncontrados.length / itens.length) * 100),
        itensNaoSorteados: itens.filter(item => !itensSorteados.includes(item)),
        ultimaValidacao: new Date().toISOString()
    };
    
    console.log(`🎯 Resultado da validação:`, resultado);
    return resultado;
}

/**
 * Exemplo prático de uso no sorteio
 */
function exemploValidacaoCompleta() {
    console.log('🎮 EXEMPLO DE VALIDAÇÃO DE BINGO\n');
    
    // 1. SIMULAR ITENS SORTEADOS
    const itensSorteados = [
        "Garfo", "Faca", "Colher", "Panela", "Frigideira",
        "Concha", "Espátula", "Batedor de ovos", "Liquidificador",
        "Tigela", "Pratos", "Xícaras", "Copos", "Avental",
        "Panos de prato", "Escorredor de louças", "Chaleira",
        "Caçarola", "Assadeira", "Forma de bolo", "Batedeira",
        "Torradeira", "Cafeteira", "Micro-ondas" // 24 itens
    ];
    
    console.log(`🎲 ${itensSorteados.length} itens foram sorteados`);
    
    // 2. SIMULAR ESCANEAMENTO DE QR CODE
    const idEscaneado = "MARI015678"; // exemplo de ID
    
    // 3. VALIDAR
    const resultado = validarBingoComId(idEscaneado, itensSorteados);
    
    // 4. MOSTRAR RESULTADO
    if (!resultado.valido) {
        console.log(`❌ ERRO: ${resultado.erro}`);
        return;
    }
    
    if (resultado.temBingo) {
        console.log(`🎉 BINGO CONFIRMADO!`);
        console.log(`🏆 Cartela #${resultado.numeroCartela} GANHOU!`);
        console.log(`📊 ${resultado.itensEncontrados}/${resultado.totalItens} itens (${resultado.porcentagem}%)`);
    } else {
        console.log(`❌ NÃO É BINGO`);
        console.log(`📊 ${resultado.itensEncontrados}/${resultado.totalItens} itens (${resultado.porcentagem}%)`);
        console.log(`🔍 Faltam ${resultado.itensNaoSorteados.length} itens:`);
        console.log(resultado.itensNaoSorteados.join(', '));
    }
}

/**
 * Função para mostrar todas as cartelas cadastradas
 */
function listarCartelas() {
    const database = JSON.parse(localStorage.getItem('cartelasDatabase') || '{}');
    const cartelas = Object.entries(database);
    
    console.log(`📋 CARTELAS CADASTRADAS (${cartelas.length}):`);
    cartelas.forEach(([id, dados]) => {
        console.log(`• ID: ${id} → Cartela #${dados.numero} (${dados.itens.length} itens)`);
    });
}

/**
 * Função auxiliar para processar QR code escaneado
 */
function processarQRCodeEscaneado(textoQR) {
    // Se for um ID simples (sem JSON), usar diretamente
    if (!textoQR.startsWith('{') && textoQR.match(/^MARI\d+$/)) {
        return textoQR;
    }
    
    // Se for JSON (sistema antigo), extrair ID
    try {
        const dados = JSON.parse(textoQR);
        return dados.id || dados.cartelaId || null;
    } catch {
        return null;
    }
}

// FUNÇÕES PARA USAR NO HTML DO SORTEIO
window.validarBingo = validarBingoComId;
window.listarCartelas = listarCartelas;
window.processarQRCode = processarQRCodeEscaneado;

// Para testar:
// exemploValidacaoCompleta();
// listarCartelas();
