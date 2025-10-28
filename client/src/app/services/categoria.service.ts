import {
  DetalhesCategoriaApiResponse,
  EditarCategoriaApiResponse,
  EditarCategoriaModel,
} from './../models/categoria.models';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  CadastrarCategoriaApiResponse,
  CadastrarCategoriaModel,
  ListagemCategoriasApiResponse,
  ListagemCategoriasModel,
} from '../models/categoria.models';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly apiUrl: string = environment.apiUrl + '/categorias';
  private readonly http: HttpClient = inject(HttpClient);

  public cadastrar(
    categoriaModel: CadastrarCategoriaModel,
  ): Observable<CadastrarCategoriaApiResponse> {
    return this.http.post<CadastrarCategoriaApiResponse>(this.apiUrl, categoriaModel);
  }

  public editar(
    id: string,
    categoriaModel: EditarCategoriaModel,
  ): Observable<EditarCategoriaApiResponse> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.put<EditarCategoriaApiResponse>(url, categoriaModel);
  }

  public excluir(id: string): Observable<null> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<null>(url);
  }

  public selecionarPorId(id: string): Observable<DetalhesCategoriaApiResponse> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.get<DetalhesCategoriaApiResponse>(url);
  }

  public selecionarTodas(): Observable<ListagemCategoriasModel[]> {
    return this.http
      .get<ListagemCategoriasApiResponse>(this.apiUrl)
      .pipe(map((res) => res.registros));
  }
}
