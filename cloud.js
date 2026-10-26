/* Sunyani Connect online layer. Requires Supabase project + schema.sql setup. */
'use strict';
(function () {
  const cfg = window.SUNYANI_CONFIG || {};
  const ready = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const client = ready ? window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey) : null;
  const s = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const message = (id, txt, error=false) => {const el=document.getElementById(id);if(el){el.hidden=false;el.textContent=txt;el.classList.toggle('error',error)}};
  window.SunyaniCloud = {client,ready,escape:s};
  const onlineHint = document.querySelector('[data-online-status]');
  if (onlineHint) onlineHint.textContent = ready ? 'Online submissions are sent for administrator review. They appear publicly only after approval.' : 'Online registration is not configured yet. Contact Wiseborn using the WhatsApp buttons below to request a listing.';
  async function session(){if(!client)return null;const {data}=await client.auth.getUser();return data.user||null}
  async function renderAccount(){
    const el=document.querySelector('[data-account]');if(!el)return;
    if(!ready){el.innerHTML='<p>Administrator setup required: follow <strong>SETUP-V7.md</strong> to connect Supabase. No accounts or online listings are active yet.</p>';return}
    const user=await session();
    el.innerHTML=user?`<p>Signed in as <strong>${s(user.email)}</strong></p><button class="btn btn-dark" id="signOut">Sign out</button>`:`<label>Email address<input id="authEmail" type="email" autocomplete="email" required></label><label>Password<input id="authPassword" type="password" autocomplete="current-password" minlength="8" required></label><div class="account-buttons"><button type="button" class="btn btn-dark" id="signIn">Sign in</button><button type="button" class="btn btn-outline" id="signUp">Create account</button></div><p class="help-note">Confirm your email if requested. Never send passwords by WhatsApp.</p>`;
    if(user){document.getElementById('signOut').onclick=async()=>{await client.auth.signOut();location.reload()};return}
    for(const [id,action] of [['signIn','signInWithPassword'],['signUp','signUp']])document.getElementById(id).onclick=async()=>{
      const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value;
      if(!email||password.length<8){message('accountStatus','Enter a valid email and a password of at least 8 characters.',true);return}
      const {error}=await client.auth[action]({email,password});
      if(error)message('accountStatus',error.message,true);else if(action==='signUp')message('accountStatus','Account created. Check your email for a confirmation link, then sign in.');else location.reload();
    };
  }
  async function cloudListings(){if(!client)return[];const {data,error}=await client.from('businesses').select('id,name,category,area,description,phone,location,website,whatsapp,latitude,longitude,image_url').eq('status','approved').order('created_at',{ascending:false}).limit(1000);if(error){console.warn('Approved listings unavailable:',error.message);return[]}return (data||[]).map(b=>({...b,verified:false,cloud:true,source:'',local:false}));}
  window.SunyaniCloud.loadApproved=cloudListings;
  async function bindNewListing(){
    const form=document.getElementById('onlineListing');if(!form)return;
    const cats=document.getElementById('newCategory');if(cats&&typeof CATEGORIES!=='undefined')for(const c of CATEGORIES)cats.add(new Option(c.label,c.id));
    if(!ready){form.querySelectorAll('input,textarea,select,button').forEach(x=>x.disabled=true);return}
    form.addEventListener('submit', async e=>{
      e.preventDefault();const user=await session();if(!user){message('onlineSubmitStatus','Please sign in first using the account section above.',true);return}
      const fd=Object.fromEntries(new FormData(form));const payload={};
      for(const key of ['name','category','area','description','phone','location','website','whatsapp'])payload[key]=(fd[key]||'').trim();
      if(payload.name.length<2||payload.description.length<12||!payload.area||!payload.category){message('onlineSubmitStatus','Complete the required business details.',true);return}
      payload.owner_id=user.id;payload.status='pending';
      const {error}=await client.from('businesses').insert(payload);
      if(error)message('onlineSubmitStatus','Not submitted: '+error.message,true);else{message('onlineSubmitStatus','Submitted for review. It will appear publicly only after approval.');form.reset()}
    });
  }
  async function renderAdmin(){
    const root=document.getElementById('adminPanel');if(!root)return;
    if(!ready){root.innerHTML='<p>Connect Supabase using <strong>SETUP-V7.md</strong> before accessing the dashboard.</p>';return}
    const user=await session();if(!user){root.innerHTML='<p>Sign in on the <a href="account.html">Account page</a> first.</p>';return}
    const {data:role,error:roleErr}=await client.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();
    if(roleErr||!role){root.innerHTML='<p>Access denied. Only approved Sunyani Connect administrators can review listings.</p>';return}
    root.innerHTML='<div class="admin-top"><h2>Pending applications</h2><button class="btn btn-outline" id="adminRefresh">Refresh</button></div><div id="adminEntries" aria-live="polite">Loading…</div>';
    const entries=document.getElementById('adminEntries');
    async function refresh(){const {data,error}=await client.from('businesses').select('*').eq('status','pending').order('created_at',{ascending:true}).limit(100);if(error){entries.textContent=error.message;return}entries.innerHTML=data?.length?data.map(x=>`<article class="review-card"><h3>${s(x.name)}</h3><p>${s(x.category)} · ${s(x.area)}</p><p>${s(x.description)}</p><p>Contact: ${s(x.phone||'Not provided')}</p><div class="account-buttons"><button type="button" class="btn btn-dark" data-decision="approved" data-id="${s(x.id)}">Approve</button><button type="button" class="btn btn-outline" data-decision="rejected" data-id="${s(x.id)}">Reject</button></div></article>`).join(''):'<p>No pending listings.</p>'}
    document.getElementById('adminRefresh').onclick=refresh;
    entries.addEventListener('click',async e=>{const b=e.target.closest('[data-decision]');if(!b)return;if(!confirm(`Mark this listing ${b.dataset.decision}?`))return;b.disabled=true;const {error}=await client.from('businesses').update({status:b.dataset.decision}).eq('id',b.dataset.id);if(error){alert('Could not update: '+error.message);b.disabled=false}else refresh()});
    refresh();
  }
  document.addEventListener('DOMContentLoaded',()=>{renderAccount();bindNewListing();renderAdmin()});
})();
