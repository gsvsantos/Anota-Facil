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

  public selecionarTodas(): Observable<ListagemCategoriasModel[]> {
    return this.http
      .get<ListagemCategoriasApiResponse>(this.apiUrl)
      .pipe(map((res) => res.registros));
  }
}
