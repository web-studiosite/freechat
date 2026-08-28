import { supabase } from "./supabase.js";
import { me, getProfile } from "./auth.js";
const user = await me(); if (!user) throw new Error("Sem sessão");
const nickname = document.querySelector("#nickname"), available = document.querySelector("#available"), result = document.querySelector("#result");
const p = await getProfile(user.id);
if (p) { nickname.value = p.nickname || ""; available.checked = !!p.available; }
document.querySelector("#save").onclick = async () => {
  const name = nickname.value.trim();
  if (name.length < 2) return result.textContent = "Escolha um apelido com pelo menos 2 caracteres.";
  const { error } = await supabase.from("profiles").upsert({id:user.id,nickname:name,available:available.checked,online:true,last_seen:new Date().toISOString()});
  result.textContent = error ? error.message : "Perfil salvo.";
  if (!error && new URLSearchParams(location.search).get("setup")) setTimeout(()=>location.href="index.html",500);
};
window.addEventListener("beforeunload",()=>supabase.from("profiles").update({online:false,last_seen:new Date().toISOString()}).eq("id",user.id));

setInterval(async()=>{ await supabase.from("profiles").update({online:true,last_seen:new Date().toISOString()}).eq("id",user.id); },20000);
