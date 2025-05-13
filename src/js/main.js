document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');
    const loginContainer = document.getElementById('login-container');
    const cadastroVagaContainer = document.getElementById('cadastro-vaga-container');
    const mensagemLogin = document.getElementById('mensagemLogin');
    const formVaga = document.getElementById('formVaga');
    const listaVagas = document.getElementById('listaVagas');
    const imagemInput = document.getElementById('imagemUrl');
    const imagemArquivoInput = document.getElementById('imagemArquivo');
    const excluirModal = document.getElementById('excluir-modal');
    const formExcluir = document.getElementById('formExcluir');
    const cancelarExcluirBotao = excluirModal.querySelector('.cancelar-excluir');
    const confirmarExcluirBotao = excluirModal.querySelector('.confirmar-excluir');
    const usuarioExcluirInput = document.getElementById('usuarioExcluir'); // Corrigido ID
    const senhaExcluirInput = document.getElementById('senhaExcluir');     // Corrigido ID
    let vagas = [];
    let usuarioLogado = false;

    // Credenciais de exemplo (NÃO USE ISSO EM PRODUÇÃO!)
    const USUARIO_ADMIN = 'Jamile Abreu';
    const SENHA_ADMIN = 'Carreira10';

    // Carregar estado de login
    const loggedIn = localStorage.getItem('usuarioLogado');
    if (loggedIn === 'true') {
        usuarioLogado = true;
        exibirCadastroVaga();
    } else {
        exibirLogin();
    }

    // Carregar vagas salvas
    const vagasSalvas = localStorage.getItem('vagas');
    if (vagasSalvas) {
        vagas = JSON.parse(vagasSalvas);
        renderizarVagas();
    }

    formLogin.addEventListener('submit', function(event) {
        event.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        if (usuario === USUARIO_ADMIN && senha === SENHA_ADMIN) {
            usuarioLogado = true;
            localStorage.setItem('usuarioLogado', 'true');
            exibirCadastroVaga();
            mensagemLogin.textContent = '';
            formLogin.reset();
        } else {
            mensagemLogin.textContent = 'Usuário ou senha incorretos.';
            usuarioLogado = false;
            cadastroVagaContainer.style.display = 'none';
        }
    });

    formVaga.addEventListener('submit', function(event) {
        event.preventDefault();
        if (usuarioLogado) { // Só permite cadastrar se estiver logado
            const titulo = document.getElementById('titulo').value;
            const descricao = document.getElementById('descricao').value;
            const linkDescricao = document.getElementById('linkDescricao').value;
            let imagemUrl = imagemInput.value;
            const imagemArquivo = imagemArquivoInput.files[0];

            if (imagemArquivo) {
                imagemUrl = URL.createObjectURL(imagemArquivo);
            }

            const novaVaga = {
                id: Date.now(),
                titulo: titulo,
                descricao: descricao,
                linkDescricao: linkDescricao,
                imagem: imagemUrl
            };

            vagas.push(novaVaga);
            salvarVagas();
            renderizarVagas();
            formVaga.reset();
        } else {
            alert('Você precisa estar logado como administrador para adicionar vagas.');
        }
    });

    function renderizarVagas() {
        listaVagas.innerHTML = '';

        vagas.forEach(vaga => {
            const divVaga = document.createElement('div');
            divVaga.classList.add('vaga');

            const infoContainer = document.createElement('div');
            infoContainer.classList.add('vaga-info');

            if (vaga.imagem) {
                const imagemVaga = document.createElement('img');
                imagemVaga.src = vaga.imagem;
                imagemVaga.alt = `Foto da vaga de ${vaga.titulo}`;
                infoContainer.appendChild(imagemVaga);
            }

            const tituloVaga = document.createElement('h3');
            tituloVaga.textContent = vaga.titulo;
            infoContainer.appendChild(tituloVaga);

            const descricaoVaga = document.createElement('p');
            descricaoVaga.textContent = vaga.descricao.substring(0, 100) + '...';
            infoContainer.appendChild(descricaoVaga);

            if (vaga.linkDescricao) {
                const linkDetalhes = document.createElement('a');
                linkDetalhes.href = vaga.linkDescricao;
                linkDetalhes.textContent = 'Ver Detalhes';
                linkDetalhes.target = '_blank';
                infoContainer.appendChild(linkDetalhes);
            }

            divVaga.appendChild(infoContainer);

            const actionsContainer = document.createElement('div');
            actionsContainer.classList.add('vaga-actions');
            const botaoExcluir = document.createElement('button');
            botaoExcluir.textContent = 'Excluir';
            botaoExcluir.addEventListener('click', function() {
                if (usuarioLogado) { // Verifica o login antes de exibir o modal
                    vagaParaExcluirId = vaga.id;
                    exibirModalExcluir();
                } else {
                    alert('Você precisa estar logado como administrador para excluir vagas.');
                }
            });
            actionsContainer.appendChild(botaoExcluir);
            divVaga.appendChild(actionsContainer);

            listaVagas.appendChild(divVaga);
        });
    }

    function salvarVagas() {
        localStorage.setItem('vagas', JSON.stringify(vagas));
    }

    function excluirVaga(idVaga) {
        if (usuarioLogado) { // Verifica o login antes de excluir
            vagas = vagas.filter(vaga => vaga.id !== idVaga);
            salvarVagas();
            renderizarVagas();
            ocultarModalExcluir();
            vagaParaExcluirId = null;
        } else {
             alert('Você precisa estar logado como administrador para excluir vagas.');
        }
    }

    function exibirLogin() {
        loginContainer.style.display = 'block';
        cadastroVagaContainer.style.display = 'none';
    }

    function exibirCadastroVaga() {
        loginContainer.style.display = 'none';
        cadastroVagaContainer.style.display = 'block';
    }

    function exibirModalExcluir() {
        excluirModal.style.display = 'block';
    }

    function ocultarModalExcluir() {
        excluirModal.style.display = 'none';
    }

    cancelarExcluirBotao.addEventListener('click', ocultarModalExcluir);

    formExcluir.addEventListener('submit', function(event) {
        event.preventDefault();
        const usuario = usuarioExcluirInput.value;
        const senha = senhaExcluirInput.value;

        if (usuario === USUARIO_ADMIN && senha === SENHA_ADMIN && vagaParaExcluirId !== null) {
            excluirVaga(vagaParaExcluirId);
            usuarioExcluirInput.value = '';
            senhaExcluirInput.value = '';
        } else {
            alert('Credenciais incorretas para excluir a vaga.');
        }
    });

    // Fechar o modal se o usuário clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target == excluirModal) {
            ocultarModalExcluir();
        }
    });
});
