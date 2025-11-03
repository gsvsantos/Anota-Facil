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

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  private readonly apiUrl: string = environment.apiUrl + '/notas';
  private readonly http: HttpClient = inject(HttpClient);

  public cadastrar(notaModel: CadastrarNotaModel): Observable<CadastrarNotaApiResponse> {
    return this.http.post<CadastrarNotaApiResponse>(this.apiUrl, notaModel);
  }

  public editar(id: string, notaModel: EditarNotaModel): Observable<EditarNotaApiResponse> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.put<EditarNotaApiResponse>(url, notaModel);
  }

  public excluir(id: string): Observable<null> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<null>(url);
  }

  public selecionarPorId(id: string): Observable<DetalhesNotaApiResponse> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.get<DetalhesNotaApiResponse>(url);
  }

  public selecionarTodas(): Observable<ListagemNotasModel[]> {
    return this.http.get<ListagemNotasApiResponse>(this.apiUrl).pipe(map((res) => res.registros));
  }
}
