// Cada serviço usa uma resposta e campos de identificação próprios.
export const servicosApi = {
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

// Receitas escolhidas para aparecerem aleatoriamente em "Especiais".
export const receitasEspeciais = [
  { id: "52772", servico: "meals" },
  { id: "52791", servico: "meals" },
  { id: "11007", servico: "cocktails" },
];
