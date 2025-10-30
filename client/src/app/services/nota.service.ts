import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  CadastrarNotaApiResponse,
  CadastrarNotaModel,
  DetalhesNotaApiResponse,
  EditarNotaApiResponse,
  EditarNotaModel,
  ListagemNotasApiResponse,
  ListagemNotasModel,
} from '../models/nota.models';
import { obterOpcoesHeaderAutorizacao } from '../utils/obter-header-autorizacao';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  private readonly apiUrl: string = environment.apiUrl + '/notas';
  private readonly authService = inject(AuthService);
  private readonly http: HttpClient = inject(HttpClient);

  public cadastrar(notaModel: CadastrarNotaModel): Observable<CadastrarNotaApiResponse> {
    return this.http.post<CadastrarNotaApiResponse>(
      this.apiUrl,
      notaModel,
      obterOpcoesHeaderAutorizacao(this.authService.accessTokenSubject$.getValue()),
    );
  }

  public editar(id: string, notaModel: EditarNotaModel): Observable<EditarNotaApiResponse> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.put<EditarNotaApiResponse>(
      url,
      notaModel,
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

  public selecionarPorId(id: string): Observable<DetalhesNotaApiResponse> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.get<DetalhesNotaApiResponse>(
      url,
      obterOpcoesHeaderAutorizacao(this.authService.accessTokenSubject$.getValue()),
    );
  }

  public selecionarTodas(): Observable<ListagemNotasModel[]> {
    return this.http
      .get<ListagemNotasApiResponse>(
        this.apiUrl,
        obterOpcoesHeaderAutorizacao(this.authService.accessTokenSubject$.getValue()),
      )
      .pipe(map((res) => res.registros));
  }
}
