import { supabase } from "./supabase.js";
import { me, getProfile } from "./auth.js";
const user=await me(); const p=await getProfile(user.id);
if(!p?.nickname){location.href="profile.html?setup=1";throw new Error("Configure o perfil");}
let cancelled=false;
document.querySelector("#cancel").onclick=async()=>{cancelled=true;await supabase.from("waiting_users").update({status:"cancelled"}).eq("user_id",user.id).eq("status","waiting");location.href="index.html"};
async function find(){
  if(cancelled)return;
  const {data,error}=await supabase.rpc("find_random_match");
  if(error){document.querySelector("#status").textContent=error.message;return}
  if(data){location.href=`chat.html?conversation=${data}`;return}
  await new Promise(r=>setTimeout(r,1800)); find();
}
find();
