import { supabase } from "./supabase.js";
import { me } from "./auth.js";
const user=await me(), inbox=document.querySelector("#inbox");
async function load(){
 const {data,error}=await supabase.rpc("my_conversations");
 if(error){inbox.innerHTML=`<div class="card">${error.message}</div>`;return}
 inbox.innerHTML=(data||[]).length?(data||[]).map(c=>`<a class="inbox-item" href="chat.html?conversation=${c.conversation_id}"><div class="avatar">${(c.nickname||"?")[0].toUpperCase()}</div><div class="last"><strong>${escapeHtml(c.nickname)}</strong><div>${escapeHtml(c.last_message||"Nenhuma mensagem ainda")}</div><small>${c.updated_at?new Date(c.updated_at).toLocaleString():""}</small></div>${c.unread_count?`<span class="unread">${c.unread_count}</span>`:""}</a>`).join(""):`<div class="card">💬 Ainda não existem conversas.<br><br><a class="button secondary" href="online.html">Encontrar alguém</a></div>`;
}
await load();
supabase.channel("inbox-"+user.id).on("postgres_changes",{event:"*",schema:"public",table:"messages"},load).subscribe();
function escapeHtml(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
