import { servicosApi, receitasEspeciais } from "./dados.js";
import { buscarReceitasPorFiltro, buscarReceitaPorId } from "./api.js";
import {
  mostrarMensagem,
  renderizarReceitas,
  renderizarDetalhe,
  mostrarErroDetalhe,
} from "./interface.js";

// Guarda um resumo da última receita aberta para o botão "Especiais".
let receitaSelecionada = null;

// Busca uma categoria no serviço informado e renderiza os resultados recebidos.
async function carregarReceitas(servico, filtro, valor) {
  try {
    const receitas = await buscarReceitasPorFiltro(servico, filtro, valor);
    renderizarReceitas(receitas, servico);
  } catch (erro) {
    console.error("Erro:", erro);
    mostrarMensagem("Não foi possível carregar as receitas.");
  }
}

// A página inicial mostra receitas italianas somente após o clique na header.
document
  .getElementById("btnReceitasItalianas")
  ?.addEventListener("click", () => {
    carregarReceitas("meals", "a", "Italian");
  });

// Páginas de categoria declaram o serviço e o filtro nos atributos do body.
const { servico, filtro, categoria } = document.body.dataset;
if (servico && filtro && categoria) {
  carregarReceitas(servico, filtro, categoria);
}

// Carrega uma receita escolhida aleatoriamente na lista de especiais.
document.getElementById("btnEspeciais")?.addEventListener("click", async () => {
  const especial =
    receitasEspeciais[Math.floor(Math.random() * receitasEspeciais.length)];

  try {
    const receita = await buscarReceitaPorId(especial.servico, especial.id);
    renderizarDetalhe(receita, servicosApi[especial.servico], "smooth");
  } catch (erro) {
    console.error(erro);
    mostrarMensagem("Não foi possível carregar a receita especial.");
  }
});

// A delegação também atende aos botões dos cards criados dinamicamente.
document.addEventListener("click", async (event) => {
  const botao = event.target.closest("button[data-id][data-servico]");
  if (!botao) return;

  const configuracao = servicosApi[botao.dataset.servico];
  if (!configuracao) return;

  try {
    const receita = await buscarReceitaPorId(
      botao.dataset.servico,
      botao.dataset.id,
    );

    receitaSelecionada = `Receita: ${receita[configuracao.nome]}\n\n${receita.strInstructions || "Instruções indisponíveis."}`;

    renderizarDetalhe(receita, configuracao, "instant");
  } catch (erro) {
    console.error(erro);
    mostrarErroDetalhe("Não foi possível carregar os detalhes da receita.");
  }
});
