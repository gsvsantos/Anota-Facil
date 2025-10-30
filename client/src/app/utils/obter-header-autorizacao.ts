import { AccessTokenModel } from '../models/auth.models';

export function obterOpcoesHeaderAutorizacao(accessToken?: AccessTokenModel): object {
  if (!accessToken) throw new Error('O token de acesso não foi fornecido');

  return {
    headers: {
      Authorization: 'Bearer ' + accessToken.chave,
    },
  };
}
