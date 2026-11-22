// SCHOOL_RAN lightweight game-data server (Node.js built-ins only)
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'game-data.json');
const PORT = Number(process.env.PORT || 3000);
const TYPES = ['monsters','equipment','items','skills'];
const seed = {
  schemaVersion: 1, project: 'SCHOOL_RAN',
  monsters: [
    {id:'campus_slime',name:'校園史萊姆',category:'校園初級',level:1,hp:70,attack:8,defense:1,exp:35,goldMin:3,goldMax:12,aggroRange:12,attackRange:1.9,respawn:8,description:'在校園草地出沒的初級怪物。',drops:[{itemId:'potion_hp_small',chance:50,min:1,max:1},{itemId:'campus_wood_sword',chance:5,min:1,max:1}]},
    {id:'red_slime',name:'赤紅史萊姆',category:'校園初級',level:2,hp:105,attack:13,defense:4,exp:55,goldMin:8,goldMax:20,aggroRange:14,attackRange:1.9,respawn:8,description:'較強的變異史萊姆。',drops:[{itemId:'potion_hp_small',chance:55,min:1,max:2},{itemId:'campus_guard',chance:8,min:1,max:1}]},
    {id:'wild_wolf',name:'荒野狼',category:'校園周邊',level:3,hp:145,attack:18,defense:7,exp:85,goldMin:12,goldMax:30,aggroRange:16,attackRange:1.9,respawn:12,description:'具有主動追擊能力的野獸。',drops:[{itemId:'wolf_fang',chance:35,min:1,max:2}]},
    {id:'rock_golem',name:'岩石魔像',category:'校園周邊',level:4,hp:260,attack:27,defense:15,exp:140,goldMin:20,goldMax:45,aggroRange:13,attackRange:2.4,respawn:18,description:'防禦力很高的大型怪物。',drops:[{itemId:'golem_core',chance:25,min:1,max:1},{itemId:'rare_blade',chance:3,min:1,max:1}]}
  ],
  equipment: [
    {id:'campus_wood_sword',name:'學園練習木劍',category:'新手武器',slot:'武器',rarity:'普通',level:1,attack:5,defense:0,hp:0,price:80,sellPrice:20,description:'新生練習用木劍。'},
    {id:'campus_guard',name:'新生護額',category:'新手防具',slot:'頭盔',rarity:'普通',level:1,attack:0,defense:2,hp:12,price:100,sellPrice:25,description:'簡單的頭部防具。'},
    {id:'rare_blade',name:'精製騎士長劍',category:'稀有武器',slot:'武器',rarity:'稀有',level:5,attack:12,defense:2,hp:0,price:900,sellPrice:180,description:'經過精製的長劍。'},
    {id:'campus_uniform',name:'校園制服外套',category:'新手防具',slot:'上衣',rarity:'普通',level:1,attack:0,defense:5,hp:25,price:180,sellPrice:45,description:'校園制服的外套部件。'}
  ],
  items: [
    {id:'potion_hp_small',name:'小型生命藥水',category:'恢復道具',type:'potion',effect:'hp',amount:120,rarity:'普通',price:80,sellPrice:25,stack:99,description:'恢復 120 HP。'},
    {id:'potion_mp_small',name:'小型魔力藥水',category:'恢復道具',type:'potion',effect:'mp',amount:100,rarity:'普通',price:80,sellPrice:25,stack:99,description:'恢復 100 MP。'},
    {id:'wolf_fang',name:'狼牙',category:'素材',type:'material',effect:'',amount:0,rarity:'普通',price:0,sellPrice:18,stack:99,description:'可用於製作或任務的素材。'},
    {id:'golem_core',name:'魔像核心',category:'素材',type:'material',effect:'',amount:0,rarity:'稀有',price:0,sellPrice:75,stack:20,description:'蘊含能量的核心。'}
  ],
  skills: [
    {id:'power_slash',name:'強力斬',category:'戰士',job:'warrior',level:1,mp:15,cooldown:4,range:3.8,power:2.4,type:'active',description:'近距離強力斬擊。'},
    {id:'piercing_shot',name:'穿心箭',category:'弓箭手',job:'archer',level:1,mp:18,cooldown:3.5,range:14,power:2,type:'active',description:'遠距離精準射擊。'},
    {id:'cyclone_punch',name:'旋風拳',category:'格鬥家',job:'fighter',level:1,mp:16,cooldown:3.5,range:3.8,power:2.2,type:'active',description:'快速近身連擊。'},
    {id:'fireball',name:'火球術',category:'氣功師',job:'mage',level:1,mp:20,cooldown:4,range:14,power:2.5,type:'active',description:'遠距離火焰魔法。'}
  ]
};
function validationError(db) {
  if (!db || !TYPES.every(k => Array.isArray(db[k]))) return '缺少必要資料分類（monsters／equipment／items／skills）。';
  for (const k of TYPES) {
    const ids = new Set();
    for (let i=0;i<db[k].length;i++) {
      const x=db[k][i], label=k+' 第 '+(i+1)+' 筆';
      if (!x || typeof x.id !== 'string' || !x.id.trim()) return label+'缺少有效 ID。';
      if (typeof x.name !== 'string' || !x.name.trim()) return label+'（'+x.id+'）缺少名稱。';
      if (ids.has(x.id)) return label+'出現重複 ID：'+x.id+'。';
      ids.add(x.id);
    }
  }
  const itemIds = new Set([...db.items,...db.equipment].map(x=>x.id));
  for (const m of db.monsters) {
    if (!Array.isArray(m.drops)) return '怪物「'+m.name+'」的掉落物資料不是清單。';
    for (let i=0;i<m.drops.length;i++) {
      const d=m.drops[i];
      if (!d || !itemIds.has(d.itemId)) return '怪物「'+m.name+'」的第 '+(i+1)+' 項掉落物找不到對應道具／裝備（ID：'+(d&&d.itemId||'空白')+'）。';
      const chance=Number(d.chance);
      if (!Number.isFinite(chance) || chance<0 || chance>100) return '怪物「'+m.name+'」的掉落物「'+d.itemId+'」機率無效：'+d.chance+'（必須為 0–100）。';
    }
  }
  return null;
}
function valid(db) { return validationError(db)===null; }
function readDB() {
  if (!fs.existsSync(DATA_FILE)) { fs.mkdirSync(DATA_DIR,{recursive:true}); fs.writeFileSync(DATA_FILE,JSON.stringify(seed,null,2)); }
  return JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
}
function send(res,status,obj){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','Cache-Control':'no-store'});res.end(JSON.stringify(obj));}
function body(req){return new Promise((resolve,reject)=>{let s='';req.on('data',c=>{s+=c;if(s.length>30e6)reject(new Error('資料超過 30MB'));});req.on('end',()=>{try{resolve(JSON.parse(s||'{}'));}catch(e){reject(e);}});});}
function rollDrops(monster,db){const catalog=new Map([...db.items,...db.equipment].map(x=>[x.id,x]));return monster.drops.filter(d=>Math.random()*100<Number(d.chance)).map(d=>{const item=catalog.get(d.itemId);const min=Math.max(1,Number(d.min)||1),max=Math.max(min,Number(d.max)||min);return {itemId:item.id,name:item.name,kind:db.equipment.some(x=>x.id===item.id)?'equipment':'item',quantity:Math.floor(Math.random()*(max-min+1))+min};});}
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'});return res.end();}
  try {
    if(url.pathname==='/api/health'&&req.method==='GET') return send(res,200,{ok:true,project:'SCHOOL_RAN'});
    if(url.pathname==='/api/projectr-drop-guide'&&req.method==='GET'){
      const upstream=await fetch('https://projectr.games/assets/drop-guide-v1.json?v=20261004-2',{headers:{'Accept':'application/json'},signal:AbortSignal.timeout(15000)});
      if(!upstream.ok) return send(res,502,{error:'ProjectR source returned HTTP '+upstream.status});
      const guide=await upstream.json();
      if(!Array.isArray(guide.maps)||!guide.mobs||!guide.items) return send(res,502,{error:'ProjectR source format invalid'});
      res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','Cache-Control':'public, max-age=300'});
      return res.end(JSON.stringify(guide));
    }
    if(url.pathname==='/api/monster-style/status'&&req.method==='GET') return send(res,200,{configured:!!process.env.OPENAI_API_KEY,model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-2'});
    if(url.pathname==='/api/monster-style/convert'&&req.method==='POST'){
      if(!process.env.OPENAI_API_KEY) return send(res,503,{error:'尚未設定 OPENAI_API_KEY。請在伺服器環境變數加入 API 金鑰；不要把金鑰貼在網頁或聊天中。'});
      const input=await body(req);
      const validImage=x=>x&&typeof x.data==='string'&&/^image\/(png|jpeg|webp)$/.test(x.mimeType)&&x.data.length<12e6;
      if(!validImage(input.image)) return send(res,400,{error:'請提供 PNG、JPG 或 WEBP 怪物圖片（單張限制約 8 MB）。'});
      if(input.reference&&!validImage(input.reference)) return send(res,400,{error:'人物參考圖格式不支援或檔案太大。'});
      const prompt=String(input.prompt||'').slice(0,4000);
      const form=new FormData();
      form.append('model',process.env.OPENAI_IMAGE_MODEL||'gpt-image-2');
      form.append('prompt',prompt+'\\n\\nUse the first image as the source monster to transform. If a second image is provided, use it only as the visual style reference. Preserve the monster identity and silhouette. Output one complete isolated character on a transparent background.');
      form.append('size','1024x1024');
      form.append('quality',process.env.OPENAI_IMAGE_QUALITY||'medium');
      form.append('background','transparent');
      form.append('output_format','png');
      const toBlob=x=>new Blob([Buffer.from(x.data,'base64')],{type:x.mimeType});
      form.append('image[]',toBlob(input.image),input.image.name||'monster.png');
      if(input.reference) form.append('image[]',toBlob(input.reference),input.reference.name||'character-reference.png');
      const upstream=await fetch('https://api.openai.com/v1/images/edits',{method:'POST',headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY},body:form,signal:AbortSignal.timeout(180000)});
      const result=await upstream.json();
      if(!upstream.ok) return send(res,upstream.status,{error:result.error&&result.error.message||'AI 圖像重繪失敗'});
      const generated=result.data&&result.data[0]&&result.data[0].b64_json;
      if(!generated) return send(res,502,{error:'AI 沒有回傳可用圖片。'});
      return send(res,200,{ok:true,mimeType:'image/png',data:generated,model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-2'});
    }
    if(url.pathname==='/api/monster-assets'&&req.method==='POST'){\n      const input=await body(req);const id=String(input.id||'').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,64);const types={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'};const ext=types[input.mimeType];if(!id||!ext||typeof input.data!=='string'||input.data.length>12e6)return send(res,400,{error:'圖片資料無效；只支援 8MB 內的 PNG／JPG／WEBP。'});const bytes=Buffer.from(input.data,'base64');const valid=ext==='png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):ext==='jpg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP';if(!valid)return send(res,400,{error:'圖片檔案內容與格式不符。'});const dir=path.join(ROOT,'public','assets','monsters');fs.mkdirSync(dir,{recursive:true});const filename=id+'.'+ext;fs.writeFileSync(path.join(dir,filename),bytes);return send(res,200,{ok:true,path:'/assets/monsters/'+filename,bytes:bytes.length});\n    }\n    if(url.pathname==='/api/game-data'&&req.method==='GET') return send(res,200,readDB());
    if(url.pathname==='/api/game-data'&&req.method==='PUT'){
      const next=await body(req); const problem=validationError(next); if(problem) return send(res,400,{error:'資料格式錯誤：'+problem});
      fs.mkdirSync(DATA_DIR,{recursive:true});const tmp=DATA_FILE+'.tmp';fs.writeFileSync(tmp,JSON.stringify({...next,schemaVersion:1,project:'SCHOOL_RAN',updatedAt:new Date().toISOString()},null,2));fs.renameSync(tmp,DATA_FILE);
      return send(res,200,{ok:true,savedAt:new Date().toISOString()});
    }
    const defeat=url.pathname.match(/^\/api\/game\/monsters\/([^/]+)\/defeat$/);
    if(defeat&&req.method==='POST'){
      const db=readDB(),monster=db.monsters.find(x=>x.id===decodeURIComponent(defeat[1]));if(!monster)return send(res,404,{error:'找不到怪物'});
      return send(res,200,{monsterId:monster.id,exp:Number(monster.exp)||0,gold:Math.floor(Math.random()*(Math.max(0,Number(monster.goldMax)||0)-Math.max(0,Number(monster.goldMin)||0)+1))+Math.max(0,Number(monster.goldMin)||0),drops:rollDrops(monster,db)});
    }
    if(url.pathname.startsWith('/api/')) return send(res,404,{error:'API not found'});
    let pathname=decodeURIComponent(url.pathname);if(pathname==='/')pathname='/game.html';
    let file=path.resolve(ROOT,'.'+pathname);if(!file.startsWith(ROOT+path.sep))return send(res,403,{error:'Forbidden'});if(!fs.existsSync(file)){const publicRoot=path.join(ROOT,'public');const publicFile=path.resolve(publicRoot,'.'+pathname);if(publicFile.startsWith(publicRoot+path.sep))file=publicFile;}
    if(!fs.existsSync(file)||!fs.statSync(file).isFile())return send(res,404,{error:'Not found'});
    const ext=path.extname(file).toLowerCase(),mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'}[ext]||'application/octet-stream';
    res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
  } catch(e){send(res,500,{error:e.message||'Server error'});}
});
server.listen(PORT,()=>console.log('SCHOOL_RAN server running at http://localhost:'+PORT));
