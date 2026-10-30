// Cada serviço usa uma resposta e campos de identificação próprios.
const servicosApi = {
  meals: {
    baseUrl: "https://www.themealdb.com/api/json/v1/1",
    colecao: "meals",
    id: "idMeal",
    nome: "strMeal",
    imagem: "strMealThumb",
  },
  cocktails: {
    baseUrl: "https://www.thecocktaildb.com/api/json/v1/1",
    colecao: "drinks",
    id: "idDrink",
    nome: "strDrink",
    imagem: "strDrinkThumb",
  },
};

// Busca uma categoria no serviço informado e renderiza os resultados recebidos.
async function carregarReceitas(servico, filtro, valor) {
  const configuracao = servicosApi[servico];

  if (!configuracao) {
    mostrarMensagem("Serviço de receitas não reconhecido.");
    return;
  }

  const url = `${configuracao.baseUrl}/filter.php?${filtro}=${encodeURIComponent(valor)}`;

  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar receitas");
    }

    const dados = await resposta.json();
    const receitas = dados[configuracao.colecao] || [];

    renderizarReceitas(receitas, servico);
  } catch (erro) {
    console.error("Erro:", erro);
    mostrarMensagem("Não foi possível carregar as receitas.");
  }
}

// Exibe uma mensagem de estado na área de resultados, quando ela existe.
function mostrarMensagem(mensagem) {
  const container = document.getElementById("resultadoBusca");

  if (container) {
    container.innerHTML = `<p class="status-message">${mensagem}</p>`;
  }
}

/**
 * Cria cards usando os nomes de campo específicos do serviço consultado.
 * @param {Array<Object>} receitas Itens retornados pelo endpoint de filtro.
 * @param {string} servico Serviço que forneceu os dados.
 */
function renderizarReceitas(receitas, servico) {
  const container = document.getElementById("resultadoBusca");
  const configuracao = servicosApi[servico];

  if (!container || !configuracao) return;

  if (receitas.length === 0) {
    mostrarMensagem("Nenhuma receita encontrada nesta categoria.");
    return;
  }

  container.innerHTML = receitas
    .map(
      (receita) => `
        <article class="recipe-card">
          <img class="recipe-card__image" src="${receita[configuracao.imagem]}" alt="${receita[configuracao.nome]}" loading="lazy">
          <div class="recipe-card__body">
            <h2 class="recipe-card__title">${receita[configuracao.nome]}</h2>
            <button class="recipe-card__action" data-id="${receita[configuracao.id]}" data-servico="${servico}">Ver receita</button>
          </div>
        </article>
      `
    )
    .join("");
}

// Guarda um resumo da última receita aberta para o botão "Especiais".
let receitaSelecionada = null;

// A página inicial mostra receitas italianas somente após o clique na header.
const btnReceitasItalianas = document.getElementById("btnReceitasItalianas");
btnReceitasItalianas?.addEventListener("click", () => {
  carregarReceitas("meals", "a", "Italian");
});

// Páginas de categoria declaram o serviço e o filtro nos atributos do body.
const { servico, filtro, categoria } = document.body.dataset;
if (servico && filtro && categoria) {
  carregarReceitas(servico, filtro, categoria);
}

// Exibe o resumo da última receita aberta ou informa que nenhuma foi selecionada.
const btnEspeciais = document.getElementById("btnEspeciais");
btnEspeciais?.addEventListener("click", () => {
  alert(receitaSelecionada || "Nenhuma receita especial selecionada.");
});

// A delegação também atende aos botões dos cards criados dinamicamente.
document.addEventListener("click", async (event) => {
  const botao = event.target.closest("button[data-id][data-servico]");
  if (!botao) return;

  const configuracao = servicosApi[botao.dataset.servico];
  if (!configuracao) return;

  const url = `${configuracao.baseUrl}/lookup.php?i=${encodeURIComponent(botao.dataset.id)}`;

  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar detalhes");
    }

    const dados = await resposta.json();
    const receita = dados[configuracao.colecao]?.[0];

    if (!receita) {
      throw new Error("Receita não encontrada");
    }

    receitaSelecionada = `Receita: ${receita[configuracao.nome]}\n\n${receita.strInstructions || "Instruções indisponíveis."}`;

    const ingredientes = Array.from({ length: 20 }, (_, indice) => {
      const numero = indice + 1;
      const ingrediente = receita[`strIngredient${numero}`]?.trim();
      const medida = receita[`strMeasure${numero}`]?.trim();

      return ingrediente ? `<li>${medida ? `${medida} ` : ""}${ingrediente}</li>` : "";
    })
      .filter(Boolean)
      .join("");

    const detalhe = document.getElementById("detalheReceita");
    if (!detalhe) return;

    detalhe.innerHTML = `
      <div class="recipe-detail">
        <img src="${receita[configuracao.imagem]}" alt="${receita[configuracao.nome]}">
        <div class="recipe-detail__content">
          <h2>${receita[configuracao.nome]}</h2>
          ${ingredientes ? `<h3>Ingredientes</h3><ul>${ingredientes}</ul>` : ""}
          <p>${receita.strInstructions || "Instruções indisponíveis."}</p>
        </div>
      </div>
    `;
    detalhe.scrollIntoView({ behavior: "instant", block: "start" });
  } catch (erro) {
    console.error(erro);
    const detalhe = document.getElementById("detalheReceita");

    if (detalhe) {
      detalhe.innerHTML = "<p>Não foi possível carregar os detalhes da receita.</p>";
    }
  }
});
