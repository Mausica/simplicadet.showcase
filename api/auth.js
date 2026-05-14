

import { Auth } from '@auth/core';
import Google from '@auth/core/providers/google';
import { sql, json } from './db.js';



async function upsertUserFromProfile(profile) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS users (
      id text primary key,
      email text unique,
      name text,
      image text,
      created_at timestamptz default now(),
      updated_at timestamptz
    )`;
    await sql`CREATE TABLE IF NOT EXISTS user_roles (
      id bigserial primary key,
      user_id text,
      role text,
      an int,
      pluton int,
      unique(user_id, role, an, pluton)
    )`;
  } catch {}

  const id = profile.sub || profile.id || profile.email;
  if (!id) return;
  const now = new Date().toISOString();
  try {
    const existing = await sql`SELECT id FROM users WHERE id=${id}`;
    if (existing.length) {
      await sql`UPDATE users SET email=${profile.email||null}, name=${profile.name||null}, image=${profile.picture||profile.image||null}, updated_at=${now} WHERE id=${id}`;
    } else {
      await sql`INSERT INTO users (id,email,name,image,updated_at) VALUES (${id},${profile.email||null},${profile.name||null},${profile.picture||profile.image||null},${now})`;
    }
  } catch {}
}

export default async function handler(req, res) {
  const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || '';

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `${proto}://${host}`;
  const originalUrl = new URL(req.url, origin);
  const url = originalUrl;
  const method = req.method || 'GET';
  const bodyNeeded = !(method === 'GET' || method === 'HEAD');
  const body = bodyNeeded ? await new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => resolve(data));
  }) : undefined;
  const init = { method, headers: req.headers };
  const webRequest = new Request(url.toString(), bodyNeeded ? { ...init, body } : init);
  const response = await Auth(webRequest, {
    providers: [
      Google({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET })
    ],
    session: { strategy: 'jwt' },
    basePath: '/api/auth',
    callbacks: {
      async jwt({ token, account, profile }) {
        if (account && profile) {
          token.uid = profile.sub || profile.id || token.sub;
          token.email = profile.email || token.email;
          token.name = profile.name || token.name;
          token.picture = profile.picture || token.picture;
          if (allowedDomain && token.email && token.email.endsWith(`@${allowedDomain}`)) {
            token.domainOk = true;
          }
          try { await upsertUserFromProfile(profile); } catch {}
        }
        return token;
      },
      async session({ session, token }) {
        session.user = session.user || {};
        session.user.id = token.uid || token.sub || null;
        session.user.email = token.email || null;
        session.user.name = token.name || null;
        session.user.image = token.picture || null;
        session.domainOk = !!token.domainOk;
        return session;
      },
      async signIn({ profile }) {
        if (!process.env.ALLOW_ANY_EMAIL && process.env.ALLOWED_EMAIL_DOMAIN) {
          const ok = profile?.email?.endsWith(`@${process.env.ALLOWED_EMAIL_DOMAIN}`);
          return !!ok;
        }
        return true;
      }
    },
    logger: {
      error: (...args) => console.error('[AUTH ERROR]', ...args),
      warn: (...args) => console.warn('[AUTH WARN]', ...args),
      debug: (...args) => console.debug('[AUTH DEBUG]', ...args),
    },
    trustHost: true,
    secret: process.env.AUTH_SECRET,
  });

  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(await response.text());
}

export async function getSessionFromRequest(req) {

  try {
    const cookies = Object.fromEntries(((req.headers.cookie||'').split(';').map(s=>s.trim().split('=').map(decodeURIComponent)).filter(p=>p[0])));
    const token = cookies['app_session'];
    if (!token) return null;
    const [dataB64, sigB64] = token.split('.');
    if (!dataB64 || !sigB64) return null;
    const dataJson = Buffer.from(dataB64.replace(/-/g,'+').replace(/_/g,'/'), 'base64').toString('utf8');

    const { createHmac } = await import('node:crypto');
    const secret = process.env.AUTH_SECRET || 'dev-secret';
    const expected = createHmac('sha256', secret).update(dataB64).digest('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    if (expected !== sigB64) return null;
    const payload = JSON.parse(dataJson);
    if (!payload || !payload.user) return null;

    const now = Math.floor(Date.now()/1000);
    if (payload.exp && now > payload.exp) return null;
    return payload;
  } catch {

  }

  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = `${proto}://${host}${req.url}`;
    const resp = await fetch(url, { headers: { cookie: req.headers.cookie || '' } });
    if (resp.ok) {
      const json = await resp.json();
      if (json && json.user) return json;
    }
  } catch {}
  return null;
}