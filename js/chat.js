import { supabase } from "./supabase.js";
import { me } from "./auth.js";
const user=await me(), conversationId=new URLSearchParams(location.search).get("conversation");
if(!conversationId){location.href="messages.html";throw new Error("Conversa ausente");}
const box=document.querySelector("#messages"), input=document.querySelector("#input"), form=document.querySelector("#composer");
async function loadHeader(){
 const {data}=await supabase.rpc("conversation_partner",{conversation_id:conversationId});
 if(data) {document.querySelector("#partner").textContent=data.nickname;document.querySelector("#partnerStatus").textContent=data.online?"🟢 Online":"⚪ Offline";}
}
async function loadMessages(){
 const {data,error}=await supabase.from("messages").select("id,sender_id,content,created_at").eq("conversation_id",conversationId).order("created_at",{ascending:true});
 if(error){box.innerHTML=`<div class="notice">${error.message}</div>`;return}
 box.innerHTML=(data||[]).map(m=>bubble(m)).join(""); box.scrollTop=box.scrollHeight;
 await supabase.rpc("mark_conversation_read",{p_conversation_id:conversationId});
}
function bubble(m){const mine=m.sender_id===user.id;const t=new Date(m.created_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});return `<div class="bubble ${mine?"mine":""}">${escapeHtml(m.content)}<time>${t}</time></div>`}
form.onsubmit=async e=>{e.preventDefault();const content=input.value.trim();if(!content)return;input.value="";const {error}=await supabase.from("messages").insert({conversation_id:conversationId,sender_id:user.id,content});if(error)alert(error.message)};
document.querySelector("#menuBtn").onclick=()=>document.querySelector("#menu").classList.toggle("hidden");
document.querySelector("#leaveBtn").onclick=async()=>{await supabase.rpc("leave_conversation",{p_conversation_id:conversationId});location.href="messages.html"};
document.querySelector("#blockBtn").onclick=async()=>{if(confirm("Bloquear esta pessoa?")){const {error}=await supabase.rpc("block_conversation_partner",{p_conversation_id:conversationId});if(error)alert(error.message);else location.href="messages.html"}};
document.querySelector("#reportBtn").onclick=async()=>{const reason=prompt("Motivo da denúncia:");if(reason){const {error}=await supabase.rpc("report_conversation_partner",{p_conversation_id:conversationId,p_reason:reason});alert(error?error.message:"Denúncia enviada.");}};
await loadHeader(); await loadMessages();
supabase.channel("chat-"+conversationId).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`conversation_id=eq.${conversationId}`},payload=>{if(payload.new.sender_id!==user.id){box.insertAdjacentHTML("beforeend",bubble(payload.new));box.scrollTop=box.scrollHeight;supabase.rpc("mark_conversation_read",{p_conversation_id:conversationId});}}).subscribe();
function escapeHtml(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

setInterval(async()=>{ await supabase.from("profiles").update({online:true,last_seen:new Date().toISOString()}).eq("id",user.id); },20000);
