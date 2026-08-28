import { supabase } from "./supabase.js";

export async function ensureSession(){
  let { data:{session} } = await supabase.auth.getSession();
  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) { alert("Não foi possível entrar: " + error.message); return null; }
    session = data.session;
  }
  return session;
}
export async function getProfile(userId){
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data;
}
export async function me(){
  const s = await ensureSession();
  return s?.user || null;
}
