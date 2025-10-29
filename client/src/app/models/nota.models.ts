export interface CadastrarNotaApiResponse {
  id: string;
}

export interface CadastrarNotaModel {
  titulo: string;
  conteudo: string;
  categoriaId: string;
}

export interface EditarNotaApiResponse {
  titulo: string;
  conteudo: string;
  categoriaId: string;
}

export interface EditarNotaModel {
  titulo: string;
  conteudo: string;
  categoriaId: string;
}

export interface DetalhesNotaApiResponse {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: CategoriaNotaModel;
}

export interface CategoriaNotaModel {
  id: string;
  titulo: string;
}

export interface ListagemNotasApiResponse {
  registros: ListagemNotasModel[];
}

export interface ListagemNotasModel {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
}
