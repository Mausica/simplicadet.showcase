
import { neon } from '@neondatabase/serverless';

if(!process.env.POSTGRES_URL){
  console.warn('POSTGRES_URL env var missing – API routes will fail.');
}

export const sql = process.env.POSTGRES_URL ? neon(process.env.POSTGRES_URL) : (()=>{ throw new Error('DB not configured'); })();

export function json(res, code, data){
  res.writeHead(code, { 'Content-Type':'application/json' });
  res.end(JSON.stringify(data));
}

export function readBody(req){
  return new Promise((resolve)=>{
    let data='';
    req.on('data',c=> data+=c.toString());
    req.on('end',()=>{ try{ resolve(JSON.parse(data||'{}')); } catch{ resolve({}); } });
  });
}

export async function ensureSchema(){
  try {
    await sql`CREATE TABLE IF NOT EXISTS students (id text primary key, nume text, prenume text, clasa text, pluton int, zi_libera boolean, localitate text, judet text, an_studiu int, grad text)`;
    await sql`CREATE TABLE IF NOT EXISTS leave_requests (id bigserial primary key, student_id text, start_date text, end_date text, start_time text, end_time text, reason text, status text, created_at text, updated_at text, approved_by text)`;
    await sql`CREATE TABLE IF NOT EXISTS permissions (id bigserial primary key, student_id text, type text, start_date text, end_date text, start_time text, end_time text, reason text, status text, created_at text, updated_at text, approved_by text)`;
  } catch(e){
    console.error('ensureSchema failed', e);
  }
}