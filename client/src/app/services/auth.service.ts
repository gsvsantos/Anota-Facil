import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay } from 'rxjs';
import { AccessTokenModel } from '../models/auth.models';

@Injectable()
export class AuthService {
  public readonly accessTokenSubject$ = new BehaviorSubject<AccessTokenModel | undefined>(
    undefined,
  );

  public readonly accessToken$ = this.accessTokenSubject$.pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
