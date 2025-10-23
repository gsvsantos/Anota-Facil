export interface ListagemCategoriasApiResponse {
  registros: ListagemCategoriasModel[];
}

export interface ListagemCategoriasModel {
  id: string;
  titulo: string;
}

export interface CadastrarCategoriaApiResponse {
  id: string;
}

export interface CadastrarCategoriaModel {
  titulo: string;
}
