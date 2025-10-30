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
import { obterOpcoesHeaderAutorizacao } from '../utils/obter-header-autorizacao';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly apiUrl: string = environment.apiUrl + '/categorias';
  private readonly authService = inject(AuthService);
  private readonly http: HttpClient = inject(HttpClient);

  public cadastrar(
    categoriaModel: CadastrarCategoriaModel,
  ): Observable<CadastrarCategoriaApiResponse> {
    return this.http.post<CadastrarCategoriaApiResponse>(
      this.apiUrl,
      categoriaModel,
      obterOpcoesHeaderAutorizacao(this.authService.accessTokenSubject$.getValue()),
    );
  }

  public editar(
    id: string,
    categoriaModel: EditarCategoriaModel,
  ): Observable<EditarCategoriaApiResponse> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.put<EditarCategoriaApiResponse>(
      url,
      categoriaModel,
      obterOpcoesHeaderAutorizacao(this.authService.accessTokenSubject$.getValue()),
    );
  }

  public excluir(id: string): Observable<null> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<null>(
      url,
      obterOpcoesHeaderAutorizacao(this.authService.accessTokenSubject$.getValue()),
    );
  }

  public selecionarPorId(id: string): Observable<DetalhesCategoriaApiResponse> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.get<DetalhesCategoriaApiResponse>(
      url,
      obterOpcoesHeaderAutorizacao(this.authService.accessTokenSubject$.getValue()),
    );
  }

  public selecionarTodas(): Observable<ListagemCategoriasModel[]> {
    return this.http
      .get<ListagemCategoriasApiResponse>(
        this.apiUrl,
        obterOpcoesHeaderAutorizacao(this.authService.accessTokenSubject$.getValue()),
      )
      .pipe(map((res) => res.registros));
  }
}
