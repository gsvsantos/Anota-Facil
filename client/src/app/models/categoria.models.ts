export interface CadastrarCategoriaApiResponse {
  id: string;
}

export interface CadastrarCategoriaModel {
  titulo: string;
}

export interface EditarCategoriaApiResponse {
  titulo: string;
}

export interface EditarCategoriaModel {
  titulo: string;
}

export interface DetalhesCategoriaApiResponse {
  id: string;
  titulo: string;
}

export interface ListagemCategoriasApiResponse {
  registros: ListagemCategoriasModel[];
}

export interface ListagemCategoriasModel {
  id: string;
  titulo: string;
}
