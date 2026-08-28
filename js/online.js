import { supabase } from "./supabase.js";
import { me } from "./auth.js";
const user = await me(); const people = document.querySelector("#people"), search = document.querySelector("#search"), notice=document.querySelector("#notice");
async function load(){
  const {data,error}=await supabase.from("profiles").select("id,nickname,avatar,online,last_seen,available").eq("online",true).eq("available",true).neq("id",user.id).gte("last_seen",new Date(Date.now()-65000).toISOString()).order("last_seen",{ascending:false}).limit(100);
  if(error){notice.textContent=error.message;return}
  const q=search.value.trim().toLowerCase(); const list=(data||[]).filter(x=>(x.nickname||"").toLowerCase().includes(q));
  people.innerHTML=list.length?list.map(p=>`<article class="person"><div class="avatar">${(p.nickname||"?")[0].toUpperCase()}</div><div class="person-info"><strong>${escapeHtml(p.nickname)}</strong><small>🟢 Disponível</small></div><button class="chat-button" data-id="${p.id}">Conversar</button></article>`).join(""):`<div class="card">Ninguém disponível no momento.</div>`;
  people.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>start(b.dataset.id));
}
async function start(partner){
  const {data,error}=await supabase.rpc("start_direct_conversation",{other_user:partner});
  if(error){alert(error.message);return} location.href=`chat.html?conversation=${data}`;
}
function escapeHtml(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
search.oninput=load; await load();
supabase.channel("online-list").on("postgres_changes",{event:"*",schema:"public",table:"profiles"},load).subscribe();
setInterval(async()=>{await supabase.from("profiles").update({online:true,last_seen:new Date().toISOString()}).eq("id",user.id);},20000);
window.addEventListener("beforeunload",()=>supabase.from("profiles").update({online:false,last_seen:new Date().toISOString()}).eq("id",user.id));
