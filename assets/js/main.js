// URL da API de receitas italianas
const url = "https://www.themealdb.com/api/json/v1/1/filter.php?a=Italian";

// Função assíncrona que aguarda a resposta da API, alertando caso dê erro
async function carregarReceitasItalianas() {
  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar receitas");
    }

    const dados = await resposta.json();
    const receitas = dados.meals || [];

    renderizarReceitas(receitas);
  } catch (erro) {
    console.error("Erro:", erro);
    const container = document.getElementById("resultadoBusca");
    if (container) {
      container.innerHTML = "<p>Não foi possível carregar as receitas.</p>";
    }
  }
}

// Renderiza a receita no HTML
function renderizarReceitas(receitas) {
  const container = document.getElementById("resultadoBusca");

  if (!container) {
    console.error("Elemento #resultadoBusca não encontrado no HTML.");
    return;
  }

  container.innerHTML = receitas
    .map(
      (receita) => `
        <div class="card">
          <img src="${receita.strMealThumb}" alt="${receita.strMeal}" width="200">
          <h2>${receita.strMeal}</h2>
          <button data-id="${receita.idMeal}">Ver receita</button>
        </div>
      `
    )
    .join("");
}

let receitaSelecionada = null;

const btnEspeciais = document.getElementById("btnEspeciais");

btnEspeciais.addEventListener("click", () => {
  if (receitaSelecionada) {
    alert(receitaSelecionada);
  } else {
    alert("Nenhuma receita especial selecionada.");
  }
});

document.addEventListener("click", async (event) => {
  const botao = event.target.closest("button[data-id]");

  if (!botao) return;

  const id = botao.dataset.id;
  const urlDetalhes = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  try {
    const resposta = await fetch(urlDetalhes);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar detalhes");
    }

    const dados = await resposta.json();
    const receita = dados.meals[0];

    receitaSelecionada = `Receita: ${receita.strMeal}\n\n${receita.strInstructions.slice(0, 300)}...`;

    console.log(receita);

    const detalhe = document.getElementById("detalheReceita");

    if (!detalhe) {
      console.error("Elemento #detalheReceita não encontrado no HTML.");
      return;
    }

    detalhe.innerHTML = `
      <div class="modal-receita">
        <img src="${receita.strMealThumb}" alt="${receita.strMeal}">
        <h2>${receita.strMeal}</h2>
        <p>${receita.strInstructions}</p>
      </div>
    `;
  } catch (erro) {
    console.error(erro);
    const detalhe = document.getElementById("detalheReceita");
    if (detalhe) {
      detalhe.innerHTML = "<p>Não foi possível carregar os detalhes da receita.</p>";
    }
  }
});

carregarReceitasItalianas();