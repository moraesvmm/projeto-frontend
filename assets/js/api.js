import { servicosApi } from "./dados.js";

// Retorna a configuração do serviço ou lança erro se ele não existir.
export function obterConfiguracao(servico) {
  const configuracao = servicosApi[servico];

  if (!configuracao) {
    throw new Error("Serviço de receitas não reconhecido.");
  }

  return configuracao;
}

// Faz o fetch e devolve o JSON, lançando erro se a resposta não for ok.
async function buscarJson(url, mensagemErro) {
  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(mensagemErro);
  }

  return resposta.json();
}

// Busca a lista de receitas de uma categoria/área (filter.php).
export async function buscarReceitasPorFiltro(servico, filtro, valor) {
  const configuracao = obterConfiguracao(servico);
  const url = `${configuracao.baseUrl}/filter.php?${filtro}=${encodeURIComponent(valor)}`;

  const dados = await buscarJson(url, "Erro ao buscar receitas");
  return dados[configuracao.colecao] || [];
}

// Busca os detalhes completos de uma receita pelo id (lookup.php).
export async function buscarReceitaPorId(servico, id) {
  const configuracao = obterConfiguracao(servico);
  const url = `${configuracao.baseUrl}/lookup.php?i=${encodeURIComponent(id)}`;

  const dados = await buscarJson(url, "Erro ao buscar detalhes");
  const receita = dados[configuracao.colecao]?.[0];

  if (!receita) {
    throw new Error("Receita não encontrada");
  }

  return receita;
}
