const express=require('express');
const session=require('express-session');
const multer=require('multer');
const crypto=require('crypto');
const fs=require('fs');
const path=require('path');
const app=express();
const DATA=path.join(__dirname,'data');
const CONTENT=path.join(DATA,'content.json');
const AUTH=path.join(DATA,'auth.json');
fs.mkdirSync(DATA,{recursive:true}); fs.mkdirSync(path.join(__dirname,'photos'),{recursive:true});
const initial={site:{tel:'02-0000-0000',email:'',orgName:'벗나루 청춘태권도',address:'서울 성동구 ○○로 00',hours:'평일 09:00–18:00'},sites:[{name:'공릉복지관',area:'노원구',start:'2025년 3월',ym:'2025-03',state:'진행 중'},{name:'금호복지관',area:'성동구',start:'2025년 4월',ym:'2025-04',state:'진행 중'},{name:'약수복지관',area:'중구',start:'2025년 9월',ym:'2025-09',state:'진행 중'},{name:'금빛호수 옥수관',area:'성동구',start:'2025년 9월',ym:'2025-09',state:'자체 운영'},{name:'옥수복지관',area:'성동구',start:'2026년 2월',ym:'2026-02',state:'진행 중'}],news:[],photos:[1,2,3,4,5,6].map((n)=>({file:`photos/p${n}.jpg`,caption:'〔촬영 시기, 장소〕',...(n===1?{big:true}:{})}))};
if(!fs.existsSync(CONTENT)) fs.writeFileSync(CONTENT,JSON.stringify(initial,null,2));
function hash(p,s=crypto.randomBytes(16).toString('hex')){return {salt:s,hash:crypto.scryptSync(p,s,64).toString('hex')}}
if(!fs.existsSync(AUTH)) fs.writeFileSync(AUTH,JSON.stringify({username:'백승봉',...hash('1234'),mustChange:true},null,2));
app.use(express.json({limit:'2mb'})); app.use(session({secret:process.env.SESSION_SECRET||crypto.randomBytes(32).toString('hex'),resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:'lax',secure:false,maxAge:8*60*60*1000}}));
function auth(req,res,next){if(!req.session.user)return res.status(401).json({error:'로그인이 필요합니다.'});next()}
app.get('/api/content',(q,r)=>r.json(JSON.parse(fs.readFileSync(CONTENT,'utf8'))));
app.post('/api/login',(req,res)=>{const a=JSON.parse(fs.readFileSync(AUTH)); const h=hash(String(req.body.password||''),a.salt).hash; if(req.body.username!==a.username||!crypto.timingSafeEqual(Buffer.from(h),Buffer.from(a.hash)))return res.status(401).json({error:'아이디 또는 비밀번호가 올바르지 않습니다.'}); req.session.user=a.username; res.json({ok:true,mustChange:a.mustChange});});
app.get('/api/session',(req,res)=>{if(!req.session.user)return res.json({loggedIn:false});const a=JSON.parse(fs.readFileSync(AUTH));res.json({loggedIn:true,mustChange:a.mustChange,username:a.username})});
app.post('/api/change-password',auth,(req,res)=>{const p=String(req.body.password||'');if(p.length<6)return res.status(400).json({error:'새 비밀번호는 6자 이상이어야 합니다.'});const a=JSON.parse(fs.readFileSync(AUTH));fs.writeFileSync(AUTH,JSON.stringify({username:a.username,...hash(p),mustChange:false},null,2));res.json({ok:true});});
app.put('/api/content',auth,(req,res)=>{const a=JSON.parse(fs.readFileSync(AUTH));if(a.mustChange)return res.status(403).json({error:'먼저 비밀번호를 변경하세요.'});fs.writeFileSync(CONTENT,JSON.stringify(req.body,null,2));res.json({ok:true});});
const storage=multer.diskStorage({destination:path.join(__dirname,'photos'),filename:(req,file,cb)=>cb(null,Date.now()+'-'+path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g,'_'))});
app.post('/api/upload',auth,multer({storage,limits:{fileSize:10*1024*1024},fileFilter:(q,f,cb)=>cb(null,/^image\//.test(f.mimetype))}).single('photo'),(req,res)=>{if(!req.file)return res.status(400).json({error:'이미지 파일을 선택하세요.'});res.json({file:'photos/'+req.file.filename});});
app.post('/api/logout',(req,res)=>req.session.destroy(()=>res.json({ok:true})));
app.use(express.static(__dirname,{index:'index.html',dotfiles:'deny'}));
app.listen(process.env.PORT||3000,()=>console.log('http://localhost:'+(process.env.PORT||3000)));
