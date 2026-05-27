// JobVerse — hash de senha PBKDF2 via Web Crypto (sem dep externa)
//
// Por que client-side? Não temos backend custom no MVP — só o Supabase com a
// anon key. Pra evitar guardar senha em plaintext, derivamos um hash PBKDF2
// no browser antes de chamar o INSERT/SELECT. Não é tão forte quanto bcrypt
// server-side, mas é OK pra hackathon (e o salt é aleatório por usuário, então
// rainbow tables não funcionam).
//
// TODO produção: migrar pra Supabase Auth e deixar o servidor cuidar disso.

const ITERATIONS = 100_000;
const HASH_BITS = 256;
const HASH_ALGO = 'SHA-256';

function bytesParaHex(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0');
  }
  return out;
}

/** Gera um salt aleatório de 128 bits em hex. */
export async function gerarSalt(): Promise<string> {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return bytesParaHex(arr);
}

/** Deriva hash PBKDF2-SHA256 (100k iters) → hex de 256 bits. */
export async function hashSenha(senha: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(senha),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: ITERATIONS,
      hash: HASH_ALGO
    },
    key,
    HASH_BITS
  );
  return bytesParaHex(new Uint8Array(bits));
}

/** Comparação de hash; usa o mesmo salt da geração original. */
export async function verificarSenha(
  senha: string,
  hashSalvo: string,
  salt: string
): Promise<boolean> {
  const hash = await hashSenha(senha, salt);
  return hash === hashSalvo;
}
