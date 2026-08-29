```javascript
/* =====================================================
   VARIÁVEIS
===================================================== */

let carrinho = [];
let favoritos = [];
let produtoSelecionado = null;


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    atualizarContadores();
    atualizarCarrinho();
    configurarEventos();
});


/* =====================================================
   LOCAL STORAGE
===================================================== */

function carregarDados() {

    try {

        const carrinhoSalvo =
            localStorage.getItem("carrinho");

        const favoritosSalvos =
            localStorage.getItem("favoritos");

        carrinho =
            carrinhoSalvo
                ? JSON.parse(carrinhoSalvo)
                : [];

        favoritos =
            favoritosSalvos
                ? JSON.parse(favoritosSalvos)
                : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar dados:",
            erro
        );

        carrinho = [];
        favoritos = [];

    }

}


function salvarDados() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

}


/* =====================================================
   MENU MOBILE
===================================================== */

function toggleMenu() {

    const menu =
        document.getElementById("menu");

    if (!menu) return;

    menu.classList.toggle("ativo");

}


/* =====================================================
   FILTRO DE CATEGORIA
===================================================== */

function filtrarCategoria(categoria) {

    const produtos =
        document.querySelectorAll(".produto");

    produtos.forEach(produto => {

        const categoriaProduto =
            produto.dataset.categoria;

        const mostrar =
            categoria === "todos" ||
            categoriaProduto === categoria;

        produto.classList.toggle(
            "oculto",
            !mostrar
        );

    });

    const colecao =
        document.getElementById("colecao");

    if (colecao) {

        colecao.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =====================================================
   FAVORITOS
===================================================== */

function favoritar(botao, nome) {

    if (!botao || !nome) return;

    const index =
        favoritos.indexOf(nome);


    if (index === -1) {

        favoritos.push(nome);

        botao.classList.add("ativo");

        botao.textContent = "♥";

    } else {

        favoritos.splice(index, 1);

        botao.classList.remove("ativo");

        botao.textContent = "♡";

    }


    salvarDados();

    atualizarContadores();

}


function atualizarFavoritosVisual() {

    const botoes =
        document.querySelectorAll(".favorito");

    botoes.forEach(botao => {

        const nome =
            botao.dataset.nome;

        if (!nome) return;

        const estaFavorito =
            favoritos.includes(nome);

        botao.classList.toggle(
            "ativo",
            estaFavorito
        );

        botao.textContent =
            estaFavorito ? "♥" : "♡";

    });

}


/* =====================================================
   CONTADORES
===================================================== */

function atualizarContadores() {

    const favoritosCount =
        document.getElementById(
            "favoritosCount"
        );

    const carrinhoCount =
        document.getElementById(
            "carrinhoCount"
        );


    if (favoritosCount) {

        favoritosCount.textContent =
            favoritos.length;

    }


    if (carrinhoCount) {

        carrinhoCount.textContent =
            carrinho.reduce(
                (total, produto) =>
                    total + (produto.quantidade || 1),
                0
            );

    }


    atualizarFavoritosVisual();

}


/* =====================================================
   MODAL DO PRODUTO
===================================================== */

function verProduto(
    nome,
    material,
    preco,
    imagem,
    categoria = "Joia"
) {

    if (!nome || !imagem) return;


    produtoSelecionado = {

        nome: nome,

        material: material || "",

        preco: Number(preco) || 0,

        imagem: imagem,

        categoria: categoria

    };


    const modal =
        document.getElementById(
            "produtoModal"
        );

    const modalImg =
        document.getElementById(
            "modalImg"
        );

    const modalNome =
        document.getElementById(
            "modalNome"
        );

    const modalMaterial =
        document.getElementById(
            "modalMaterial"
        );

    const modalPreco =
        document.getElementById(
            "modalPreco"
        );

    const modalCategoria =
        document.getElementById(
            "modalCategoria"
        );


    if (!modal) return;


    if (modalImg) {

        modalImg.src = imagem;
        modalImg.alt = nome;

    }


    if (modalNome) {

        modalNome.textContent = nome;

    }


    if (modalMaterial) {

        modalMaterial.textContent =
            material || "Material não informado";

    }


    if (modalPreco) {

        modalPreco.textContent =
            formatarPreco(
                Number(preco) || 0
            );

    }


    if (modalCategoria) {

        modalCategoria.textContent =
            categoria;

    }


    modal.classList.add("ativo");

    document.body.classList.add(
        "modal-aberto"
    );

}


function fecharModal() {

    const modal =
        document.getElementById(
            "produtoModal"
        );

    if (!modal) return;

    modal.classList.remove("ativo");

    document.body.classList.remove(
        "modal-aberto"
    );

    produtoSelecionado = null;

}


/* =====================================================
   CARRINHO
===================================================== */

function adicionarCarrinho() {

    if (!produtoSelecionado) {

        console.warn(
            "Nenhum produto selecionado."
        );

        return;

    }


    const produtoExistente =
        carrinho.find(
            produto =>
                produto.nome ===
                produtoSelecionado.nome
        );


    if (produtoExistente) {

        produtoExistente.quantidade =
            (produtoExistente.quantidade || 1) + 1;

    } else {

        carrinho.push({

            ...produtoSelecionado,

            quantidade: 1

        });

    }


    salvarDados();

    atualizarCarrinho();

    fecharModal();

    abrirCarrinho();

}


/* =====================================================
   ATUALIZAR CARRINHO
===================================================== */

function atualizarCarrinho() {

    const container =
        document.getElementById(
            "carrinhoItens"
        );

    const totalElemento =
        document.getElementById(
            "total"
        );


    if (!container) return;


    atualizarContadores();


    if (carrinho.length === 0) {

        container.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

        if (totalElemento) {

            totalElemento.textContent =
                formatarPreco(0);

        }

        return;

    }


    container.innerHTML = "";


    let valorTotal = 0;


    carrinho.forEach((produto, index) => {

        const quantidade =
            produto.quantidade || 1;

        const subtotal =
            produto.preco * quantidade;

        valorTotal += subtotal;


        const item =
            document.createElement("div");

        item.className =
            "carrinho-item";


        item.innerHTML = `

            <div>

                <h4>
                    ${produto.nome}
                </h4>

                <p>
                    ${produto.material}
                </p>

                <p>
                    ${formatarPreco(produto.preco)}
                </p>

                <div class="quantidade">

                    <button
                        type="button"
                        onclick="alterarQuantidade(${index}, -1)">
                        −
                    </button>

                    <span>
                        ${quantidade}
                    </span>

                    <button
                        type="button"
                        onclick="alterarQuantidade(${index}, 1)">
                        +
                    </button>

                </div>

            </div>

            <button
                type="button"
                class="remover"
                onclick="removerCarrinho(${index})">

                ×

            </button>

        `;


        container.appendChild(item);

    });


    if (totalElemento) {

        totalElemento.textContent =
            formatarPreco(valorTotal);

    }


    salvarDados();

}


/* =====================================================
   ALTERAR QUANTIDADE
===================================================== */

function alterarQuantidade(
    index,
    quantidade
) {

    if (!carrinho[index]) return;


    carrinho[index].quantidade =
        (carrinho[index].quantidade || 1)
        + quantidade;


    if (
        carrinho[index].quantidade <= 0
    ) {

        carrinho.splice(index, 1);

    }


    salvarDados();

    atualizarCarrinho();

}


/* =====================================================
   REMOVER PRODUTO
===================================================== */

function removerCarrinho(index) {

    if (!carrinho[index]) return;

    carrinho.splice(index, 1);

    salvarDados();

    atualizarCarrinho();

}


/* =====================================================
   ABRIR CARRINHO
===================================================== */

function abrirCarrinho() {

    const carrinhoElemento =
        document.getElementById(
            "carrinho"
        );

    const overlay =
        document.getElementById(
            "overlay"
        );


    if (carrinhoElemento) {

        carrinhoElemento.classList.add(
            "ativo"
        );

    }


    if (overlay) {

        overlay.classList.add(
            "ativo"
        );

    }

}


/* =====================================================
   FECHAR CARRINHO
===================================================== */

function fecharCarrinho() {

    const carrinhoElemento =
        document.getElementById(
            "carrinho"
        );

    const overlay =
        document.getElementById(
            "overlay"
        );


    if (carrinhoElemento) {

        carrinhoElemento.classList.remove(
            "ativo"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "ativo"
        );

    }

}


/* =====================================================
   FAVORITOS
===================================================== */

function abrirFavoritos() {

    if (favoritos.length === 0) {

        alert(
            "Você ainda não adicionou nenhuma joia aos favoritos."
        );

        return;

    }


    alert(
        "Joias favoritas:\n\n" +
        favoritos.join("\n")
    );

}


/* =====================================================
   BUSCA
===================================================== */

function abrirBusca() {

    const busca =
        prompt(
            "Digite o nome da joia que deseja encontrar:"
        );


    if (!busca) return;


    const termo =
        removerAcentos(
            busca.trim().toLowerCase()
        );


    const produtos =
        document.querySelectorAll(
            ".produto"
        );


    let encontrados = 0;


    produtos.forEach(produto => {

        const nomeElemento =
            produto.querySelector("h3");

        if (!nomeElemento) return;


        const nome =
            removerAcentos(
                nomeElemento.textContent
                    .trim()
                    .toLowerCase()
            );


        const encontrou =
            nome.includes(termo);


        produto.classList.toggle(
            "oculto",
            !encontrou
        );


        if (encontrou) {

            encontrados++;

        }

    });


    const colecao =
        document.getElementById(
            "colecao"
        );


    if (colecao) {

        colecao.scrollIntoView({
            behavior: "smooth"
        });

    }


    if (encontrados === 0) {

        alert(
            "Nenhuma joia encontrada."
        );

    }

}


/* =====================================================
   REMOVER ACENTOS
===================================================== */

function removerAcentos(texto) {

    return texto
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

}


/* =====================================================
   ORDENAÇÃO
===================================================== */

function ordenarProdutos() {

    const container =
        document.getElementById(
            "produtos"
        );

    const select =
        document.getElementById(
            "ordenacao"
        );


    if (!container || !select) return;


    const produtos =
        [
            ...container.querySelectorAll(
                ".produto"
            )
        ];


    const ordem =
        select.value;


    if (ordem === "menor") {

        produtos.sort(
            (a, b) =>
                Number(
                    a.dataset.preco
                ) -
                Number(
                    b.dataset.preco
                )
        );

    }


    if (ordem === "maior") {

        produtos.sort(
            (a, b) =>
                Number(
                    b.dataset.preco
                ) -
                Number(
                    a.dataset.preco
                )
        );

    }


    produtos.forEach(produto => {

        container.appendChild(
            produto
        );

    });

}


/* =====================================================
   NEWSLETTER
===================================================== */

function inscrever(event) {

    event.preventDefault();


    const campo =
        document.getElementById(
            "email"
        );


    if (!campo) return;


    const email =
        campo.value.trim();


    if (!email) return;


    alert(
        `Obrigada! ${email} foi cadastrado com sucesso.`
    );


    campo.value = "";

}


/* =====================================================
   FORMATAÇÃO DE PREÇO
===================================================== */

function formatarPreco(valor) {

    const numero =
        Number(valor);


    if (Number.isNaN(numero)) {

        return "R$ 0,00";

    }


    return numero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =====================================================
   FECHAR TUDO
===================================================== */

function fecharTudo() {

    fecharCarrinho();

    fecharModal();

}


/* =====================================================
   EVENTOS
===================================================== */

function configurarEventos() {

    const modal =
        document.getElementById(
            "produtoModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    fecharModal();

                }

            }
        );

    }


    const overlay =
        document.getElementById(
            "overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            fecharCarrinho
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                fecharTudo();

            }

        }
    );

}
```
