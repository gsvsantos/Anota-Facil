import { RegistroModel, AccessTokenModel, LoginModel } from './../models/auth.models';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  defer,
  distinctUntilChanged,
  merge,
  Observable,
  of,
  shareReplay,
  skip,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { obterOpcoesHeaderAutorizacao } from '../utils/obter-header-autorizacao';

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + 'auth';
  private readonly accessTokenKey: string = 'notekeeper:access-token';

  public readonly accessTokenSubject$ = new BehaviorSubject<AccessTokenModel | undefined>(
    undefined,
  );

  public readonly accessTokenArmazenado$ = defer(() => {
    const accessToken = this.obterAccessToken();

    if (!accessToken) return of(undefined);

    const valido = new Date(accessToken.expiracao) > new Date();

    if (!valido) return of(undefined);

    return of(accessToken);
  });

  public readonly accessToken$: Observable<AccessTokenModel | undefined> = merge(
    this.accessTokenArmazenado$,
    this.accessTokenSubject$.pipe(skip(1)),
  ).pipe(
    distinctUntilChanged((first, second) => first === second),
    tap((accessToken) => {
      if (accessToken) this.salvarAccessToken(accessToken);
      else this.limparAccessToken();

      this.accessTokenSubject$.next(accessToken);
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public registro(registroModel: RegistroModel): Observable<AccessTokenModel> {
    const url = `${this.apiUrl}/registro`;

    return this.http
      .post<AccessTokenModel>(url, registroModel)
      .pipe(tap((token) => this.accessTokenSubject$.next(token)));
  }

  public login(loginModel: LoginModel): Observable<AccessTokenModel> {
    const url = `${this.apiUrl}/login`;

    return this.http
      .post<AccessTokenModel>(url, loginModel)
      .pipe(tap((token) => this.accessTokenSubject$.next(token)));
  }

  public sair(): Observable<null> {
    const urlCompleto = `${this.apiUrl}/sair`;

    return this.http
      .post<null>(
        urlCompleto,
        {},
        obterOpcoesHeaderAutorizacao(this.accessTokenSubject$.getValue()),
      )
      .pipe(tap(() => this.accessTokenSubject$.next(undefined)));
  }

  private salvarAccessToken(token: AccessTokenModel): void {
    const jsonString = JSON.stringify(token);

    localStorage.setItem(this.accessTokenKey, jsonString);
  }

  private limparAccessToken(): void {
    localStorage.removeItem(this.accessTokenKey);
  }

  private obterAccessToken(): AccessTokenModel | undefined {
    const jsonString = localStorage.getItem(this.accessTokenKey);

    if (!jsonString) return undefined;

    return JSON.parse(jsonString) as AccessTokenModel;
  }
}
