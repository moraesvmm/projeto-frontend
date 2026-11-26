import { servicosApi } from "./dados.js";

// Exibe uma mensagem de estado na área de resultados, quando ela existe.
export function mostrarMensagem(mensagem) {
  const container = document.getElementById("resultadoBusca");

  if (container) {
    container.innerHTML = `<p class="status-message">${mensagem}</p>`;
  }
}

// Cria os cards usando os nomes de campo específicos do serviço consultado.
export function renderizarReceitas(receitas, servico) {
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
      `,
    )
    .join("");
}

// Monta os <li> de ingredientes (a API usa strIngredient1..20 e strMeasure1..20).
function montarIngredientes(receita) {
  return Array.from({ length: 20 }, (_, indice) => {
    const numero = indice + 1;
    const ingrediente = receita[`strIngredient${numero}`]?.trim();
    const medida = receita[`strMeasure${numero}`]?.trim();

    return ingrediente
      ? `<li>${medida ? `${medida} ` : ""}${ingrediente}</li>`
      : "";
  })
    .filter(Boolean)
    .join("");
}

// Renderiza os detalhes de uma receita na área #detalheReceita.
export function renderizarDetalhe(receita, configuracao, rolagem = "smooth") {
  const detalhe = document.getElementById("detalheReceita");
  if (!detalhe) return;

  const ingredientes = montarIngredientes(receita);

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

  detalhe.scrollIntoView({ behavior: rolagem, block: "start" });
}

// Mostra uma mensagem de erro na área de detalhes.
export function mostrarErroDetalhe(mensagem) {
  const detalhe = document.getElementById("detalheReceita");

  if (detalhe) {
    detalhe.innerHTML = `<p>${mensagem}</p>`;
  }
}
