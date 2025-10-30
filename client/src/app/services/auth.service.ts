import { RegistroModel, AccessTokenModel } from './../models/auth.models';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/auth';

  public readonly accessTokenSubject$ = new BehaviorSubject<AccessTokenModel | undefined>(
    undefined,
  );

  public readonly accessToken$ = this.accessTokenSubject$.pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public registro(registroModel: RegistroModel): Observable<AccessTokenModel> {
    const url = `${this.apiUrl}/registro`;

    return this.http
      .post<AccessTokenModel>(url, registroModel)
      .pipe(tap((token) => this.accessTokenSubject$.next(token)));
  }
}
