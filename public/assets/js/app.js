// Constantes
const API_URL = 'http://localhost:3000';
const filmesContainer = document.querySelector('.container-fluid');

// Verifica se o modal de filme existe antes de inicializá-lo e obter os elementos do formulário
let movieModal, movieForm, movieIdInput, modalTitle, tituloInput, generoInput, anoInput, diretorInput, atoresInput, sinopseInput, imagemInput, avaliacaoInput, duracaoInput, classificacaoInput, trailerInput, premiosInput;

const movieModalElement = document.getElementById('movieModal');
if (movieModalElement) {
    movieModal = new bootstrap.Modal(movieModalElement);
    movieForm = document.getElementById('movieForm');
    movieIdInput = document.getElementById('movieId');
    modalTitle = document.getElementById('movieModalLabel');
    tituloInput = document.getElementById('titulo');
    generoInput = document.getElementById('genero');
    anoInput = document.getElementById('ano');
    diretorInput = document.getElementById('diretor');
    atoresInput = document.getElementById('atores');
    sinopseInput = document.getElementById('sinopse');
    imagemInput = document.getElementById('imagem');
    avaliacaoInput = document.getElementById('avaliacao');
    duracaoInput = document.getElementById('duracao');
    classificacaoInput = document.getElementById('classificacao');
    trailerInput = document.getElementById('trailer');
    premiosInput = document.getElementById('premios');
}

// Função para carregar todos os filmes
async function carregarFilmes() {
    console.log('Chamando carregarFilmes...');
    if (!filmesContainer) {
        console.log('filmesContainer não encontrado. Não é a página inicial ou elemento não existe.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/filmes`);
        const filmes = await response.json();
        console.log('Dados de filmes recebidos:', filmes);
        exibirFilmes(filmes);
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        filmesContainer.innerHTML = '<div class="alert alert-danger">Erro ao carregar filmes. Tente novamente mais tarde.</div>';
    }
}

// Função para exibir os filmes na página
function exibirFilmes(filmes) {
    console.log('Chamando exibirFilmes com:', filmes);
    if (!filmesContainer) return;

    const filmesHTML = filmes.map(filme => `
        <div class="col-md-3 col-12 mb-4">
            <div class="card h-100 bg-dark text-white" style="cursor: pointer;">
                <a href="detalhes.html?id=${filme.id}" class="text-decoration-none d-block h-100 movie-link" data-id="${filme.id}">
                    <img src="${filme.imagem}" class="card-img-top" alt="${filme.titulo}">
                    <div class="card-body">
                        <h4 class="card-title">${filme.titulo}</h4>
                        <p class="card-text"><strong>Gênero:</strong> ${filme.genero || 'N/A'}</p>
                        <p class="card-text"><strong>Avaliação:</strong> ${filme.avaliacao || 'N/A'}/10</p>
                    </div>
                </a>
                <div class="card-footer bg-transparent border-top-0 text-center">
                    <button class="btn btn-sm btn-warning edit-button" data-id="${filme.id}" data-bs-toggle="modal" data-bs-target="#movieModal">Editar</button>
                    <button class="btn btn-sm btn-danger delete-button" data-id="${filme.id}">Excluir</button>
                </div>
            </div>
        </div>
    `).join('');

    filmesContainer.innerHTML = `
        <div class="container mt-5">
            <div class="row d-flex justify-content-center">
                ${filmesHTML}
            </div>
        </div>
    `;

    // Remove o event listener anterior para evitar duplicação se a função for chamada novamente
    // Isso é importante se a lista de filmes puder ser recarregada sem recarregar a página
    if (filmesContainer._movieLinkListener) {
        filmesContainer.removeEventListener('click', filmesContainer._movieLinkListener);
    }

    // Adiciona um único event listener ao contêiner principal usando delegação de eventos
    const movieLinkListener = (event) => {
        const link = event.target.closest('.movie-link');
        if (link) {
            event.preventDefault(); // Impede a navegação padrão do link
            const filmeId = link.dataset.id;
            // const targetUrl = `detalhes.html?id=${filmeId}`;
            console.log('Armazenando ID no localStorage e navegando para detalhes:', filmeId);
            localStorage.setItem('filmeIdParaDetalhes', filmeId); // Armazena o ID no localStorage
            window.location.href = 'detalhes.html'; // Redireciona para a página de detalhes (sem ID na URL)
        }
    };

    filmesContainer.addEventListener('click', movieLinkListener);
    filmesContainer._movieLinkListener = movieLinkListener; // Armazena a referência para remover depois

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', async () => {
            const filmeId = button.dataset.id;
            await carregarFilmeParaEdicao(filmeId);
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async () => {
            const filmeId = button.dataset.id;
            const cardTitle = button.closest('.card').querySelector('.card-title').innerText;
            if (confirm(`Tem certeza que deseja excluir o filme "${cardTitle}"?`)) {
                await excluirFilme(filmeId);
            }
        });
    });
}

// Função para pesquisar filmes
async function pesquisarFilmes(termo) {
    try {
        const response = await fetch(`${API_URL}/filmes?q=${termo}`);
        const filmes = await response.json();
        exibirFilmes(filmes);
    } catch (error) {
        console.error('Erro ao pesquisar filmes:', error);
        filmesContainer.innerHTML = '<div class="alert alert-danger">Erro ao pesquisar filmes. Tente novamente mais tarde.</div>';
    }
}

// Função para carregar dados de um filme para edição
async function carregarFilmeParaEdicao(id) {
    // Verifica se os elementos do modal existem antes de tentar preencher/abrir
    if (!movieForm || !movieIdInput || !modalTitle || !movieModal) {
        console.error('Elementos do modal não encontrados. Não é a página inicial ou o modal não existe.');
        return; // Não tenta carregar para edição se os elementos do modal não existem
    }

    try {
        const response = await fetch(`${API_URL}/filmes/${id}`);
        const filme = await response.json();

        movieIdInput.value = filme.id;
        tituloInput.value = filme.titulo;
        generoInput.value = filme.genero;
        anoInput.value = filme.ano;
        diretorInput.value = filme.diretor;
        atoresInput.value = filme.atores ? filme.atores.join(', ') : '';
        sinopseInput.value = filme.sinopse;
        imagemInput.value = filme.imagem;
        avaliacaoInput.value = filme.avaliacao;
        duracaoInput.value = duracaoInput.value || ''; // Corrigido: duracaoInput.value = filme.duracao || ''
        classificacaoInput.value = classificacaoInput.value || ''; // Corrigido: classificacaoInput.value = filme.classificacao || ''
        trailerInput.value = trailerInput.value || ''; // Corrigido: trailerInput.value = filme.trailer || ''
        premiosInput.value = premiosInput.value ? premiosInput.value.split(',').map(premio => premio.trim()) : ''; // Corrigido: premiosInput.value = filme.premios ? filme.premios.join(', ') : ''

        modalTitle.innerText = 'Editar Filme';

        movieModal.show();

    } catch (error) {
        console.error('Erro ao carregar filme para edição:', error);
        alert('Erro ao carregar filme para edição.');
    }
}

// Função para criar um novo filme
async function criarFilme(filmeData) {
    try {
        const response = await fetch(`${API_URL}/filmes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filmeData)
        });
        if (!response.ok) {
            throw new Error('Erro ao criar filme');
        }
        const novoFilme = await response.json();
        console.log('Filme criado com sucesso:', novoFilme);
        carregarFilmes();
    } catch (error) {
        console.error('Erro ao criar filme:', error);
        alert('Erro ao criar filme. Verifique o console para mais detalhes.');
    }
}

// Função para atualizar um filme existente
async function atualizarFilme(id, filmeData) {
    try {
        const response = await fetch(`${API_URL}/filmes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filmeData)
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar filme');
        }
        const filmeAtualizado = await response.json();
        console.log('Filme atualizado com sucesso:', filmeAtualizado);
        // Após atualizar, podemos recarregar a lista na página inicial
        carregarFilmes();

    } catch (error) {
        console.error('Erro ao atualizar filme:', error);
        alert('Erro ao atualizar filme. Verifique o console para mais detalhes.');
    }
}

// Função para excluir um filme
async function excluirFilme(id) {
    try {
        const response = await fetch(`${API_URL}/filmes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Erro ao excluir filme');
        }
        console.log('Filme excluído com sucesso:', id);
        carregarFilmes();
    } catch (error) {
        console.error('Erro ao excluir filme:', error);
        alert('Erro ao excluir filme. Verifique o console para mais detalhes.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente carregado.');

    const currentPage = window.location.pathname.split('/').pop();
    console.log('Página atual:', currentPage);

    // Lógica para a página inicial
    if (currentPage === 'index.html' || currentPage === '') {
        console.log('Executando lógica para página inicial (index.html).');
        carregarFilmes();

        // Configura o botão de pesquisa (só na página inicial)
        const searchButton = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');

        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                const termo = searchInput.value.trim();
                if (termo) {
                    pesquisarFilmes(termo);
                }
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const termo = searchInput.value.trim();
                    if (termo) {
                        pesquisarFilmes(termo);
                    }
                }
            });
        }

        // Event listener para o botão "Adicionar Novo Filme" (só na página inicial)
        const addMovieBtn = document.getElementById('addMovieBtn');
        if (addMovieBtn && movieForm && movieIdInput && modalTitle) { 
             addMovieBtn.addEventListener('click', () => {
                movieForm.reset();
                movieIdInput.value = '';
                modalTitle.innerText = 'Adicionar Novo Filme';
            });

            // Event listener para o submit do formulário do modal (só na página inicial)
            movieForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const filmeData = {
                    titulo: tituloInput.value,
                    genero: generoInput.value,
                    ano: parseInt(anoInput.value),
                    diretor: diretorInput.value,
                    atores: atoresInput.value.split(',').map(ator => ator.trim()),
                    sinopse: sinopseInput.value,
                    imagem: imagemInput.value,
                    avaliacao: parseFloat(avaliacaoInput.value),
                    duracao: duracaoInput.value ? parseInt(duracaoInput.value) : undefined,
                    classificacao: classificacaoInput.value || undefined,
                    trailer: trailerInput.value || undefined,
                    premios: premiosInput.value ? premiosInput.value.split(',').map(premio => premio.trim()) : undefined
                };

                const filmeId = movieIdInput.value;

                if (filmeId) {
                    await atualizarFilme(filmeId, filmeData);
                } else {
                    await criarFilme(filmeData);
                }

                if (movieModal) movieModal.hide();
            });
        }
    }
    // Lógica para a página de detalhes - AGORA ESTÁ EM details.js
    // else if (currentPage === 'detalhes.html') { ... }
}); 