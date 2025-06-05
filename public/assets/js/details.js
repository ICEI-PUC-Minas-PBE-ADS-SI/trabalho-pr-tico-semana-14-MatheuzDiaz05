// Este arquivo conterá a lógica JavaScript para a página de detalhes do filme.

const API_URL = 'http://localhost:3000';

// Função para carregar detalhes de um filme específico
async function carregarDetalhesFilme(id) {
    console.log('Tentando carregar detalhes para o filme com ID:', id);
    try {
        const response = await fetch(`${API_URL}/filmes/${id}`);
        console.log('Resposta da requisição de detalhes:', response);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const filme = await response.json();
        console.log('Dados do filme recebidos:', filme);
        exibirDetalhesFilme(filme);
    } catch (error) {
        console.error('Erro ao carregar detalhes do filme:', error);
        document.querySelector('.container').innerHTML = '<div class="alert alert-danger">Erro ao carregar detalhes do filme. Tente novamente mais tarde.</div>';
    }
}

// Função para exibir detalhes do filme
function exibirDetalhesFilme(filme) {
    const detalhesContainer = document.querySelector('.container');
    detalhesContainer.innerHTML = `
        <div class="row mt-5">
            <div class="col-md-4">
                <img src="${filme.imagem}" class="img-fluid detalhes-filme-img" alt="${filme.titulo}">
            </div>
            <div class="col-md-8">
                <h1 class="mb-4">${filme.titulo}</h1>
                <p><strong>Diretor:</strong> ${filme.diretor}</p>
                <p><strong>Ano:</strong> ${filme.ano}</p>
                <p><strong>Gênero:</strong> ${filme.genero}</p>
                ${filme.duracao ? `<p><strong>Duração:</strong> ${filme.duracao} minutos</p>` : ''}
                ${filme.classificacao ? `<p><strong>Classificação:</strong> ${filme.classificacao}</p>` : ''}
                <p><strong>Avaliação:</strong> ${filme.avaliacao}/10</p>
                ${filme.atores && filme.atores.length > 0 ? `<p><strong>Elenco:</strong> ${filme.atores.join(', ')}</p>` : ''}
                ${filme.premios && filme.premios.length > 0 ? `<p><strong>Prêmios:</strong> ${filme.premios.join(', ')}</p>` : ''}
                <p><strong>Sinopse:</strong> ${filme.sinopse}</p>

                <div class="mt-3">
                    <button class="btn btn-warning edit-button" data-id="${filme.id}" data-bs-toggle="modal" data-bs-target="#movieModal">Editar</button>
                    <button class="btn btn-danger delete-button" data-id="${filme.id}">Excluir</button>
                </div>
            </div>
        </div>
    `;

    // Adiciona event listeners aos botões de editar e excluir na página de detalhes
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', async () => {
            const filmeId = button.dataset.id;
             // Lógica de edição (provavelmente envolve um modal que não está nesta página)
             console.log(`Botão Editar clicado para o filme com ID: ${filmeId}`);
             alert('Funcionalidade de edição não implementada nesta página.'); // Ou lógica do modal se ele existir aqui
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async () => {
            const filmeId = button.dataset.id;
            const movieTitleElement = document.querySelector('.container h1'); 
            const movieTitle = movieTitleElement ? movieTitleElement.innerText : 'este filme';

            if (confirm(`Tem certeza que deseja excluir ${movieTitle}?`)) {
                 // Lógica de exclusão (se aplicável nesta página)
                 console.log(`Botão Excluir clicado para o filme com ID: ${filmeId}`);
                 alert('Funcionalidade de exclusão não implementada diretamente nesta página. Redirecionando para a home.'); // Ou lógica de exclusão
                // Excluir o filme (chamar a função excluirFilme se ela for movida para cá ou acessível)
                // await excluirFilme(filmeId);
                window.location.href = 'index.html'; // Redireciona para a página inicial após a exclusão (ou tentativa)
            }
        });
    });
}

// Lógica executada quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente carregado - details.js.');
    console.log('window.location.search:', window.location.search);

    const urlParams = new URLSearchParams(window.location.search);
    let filmeId = urlParams.get('id'); // Tenta obter o ID da URL

    console.log('Filme ID obtido da URL:', filmeId);

    // Se o ID não foi encontrado na URL, tenta obter do localStorage
    if (!filmeId) {
        filmeId = localStorage.getItem('filmeIdParaDetalhes');
        console.log('Filme ID obtido do localStorage:', filmeId);
        // Remove o ID do localStorage após obtê-lo para evitar que persista
        if (filmeId) {
            localStorage.removeItem('filmeIdParaDetalhes');
        }
    }

    if (filmeId) {
        carregarDetalhesFilme(filmeId);
    } else {
        // Se nenhum ID for encontrado na URL nem no localStorage
        console.error('ID do filme não especificado na URL ou localStorage.');
        document.querySelector('.container').innerHTML = '<div class="alert alert-danger">ID do filme não especificado.</div>';
    }
}); 