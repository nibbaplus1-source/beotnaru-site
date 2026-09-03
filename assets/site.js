/* ══════════════════════════════════════════════════════════
   벗나루 청춘태권도 — 공통 데이터 및 스크립트

   내용을 고칠 일이 있으면 아래 [1] [2] [3] [4] 네 곳만 보면 됩니다.
   ══════════════════════════════════════════════════════════ */

/* [1] 기본 정보 ─────────────────────────────────────────── */
const SITE = {
  tel:     "02-0000-0000",          // 대표번호
  email:   "",                      // 문의 받을 이메일 (비우면 폼이 안내 문구를 띄웁니다)
  orgName: "벗나루 청춘태권도",
  address: "서울 성동구 ○○로 00",
  hours:   "평일 09:00–18:00"
};

/* [2] 활동 현황 — 기관이 늘면 한 줄 추가하면 모든 페이지에 반영됩니다
      state: "진행 중" | "자체 운영" | "2025.3~2026.2" 처럼 종료 기간 직접 표기 */
const SITES = [
  { name:"공릉복지관",      area:"노원구", start:"2025년 3월", ym:"2025-03", state:"진행 중" },
  { name:"금호복지관",      area:"성동구", start:"2025년 4월", ym:"2025-04", state:"진행 중" },
  { name:"약수복지관",      area:"중구",   start:"2025년 9월", ym:"2025-09", state:"진행 중" },
  { name:"금빛호수 옥수관", area:"성동구", start:"2025년 9월", ym:"2025-09", state:"자체 운영" },
  { name:"옥수복지관",      area:"성동구", start:"2026년 2월", ym:"2026-02", state:"진행 중" }
];

/* [3] 활동 현장 사진 — photos 폴더에 같은 이름으로 넣으세요
      caption 형식: "2026년 6월, 금호복지관" / 기관 동의 전이면 "2026년 6월, 성동구" */
const PHOTOS = [
  { file:"photos/p1.jpg", caption:"〔촬영 시기, 장소〕", big:true },
  { file:"photos/p2.jpg", caption:"〔촬영 시기, 장소〕" },
  { file:"photos/p3.jpg", caption:"〔촬영 시기, 장소〕" },
  { file:"photos/p4.jpg", caption:"〔촬영 시기, 장소〕" },
  { file:"photos/p5.jpg", caption:"〔촬영 시기, 장소〕" },
  { file:"photos/p6.jpg", caption:"〔촬영 시기, 장소〕" }
];

/* [4] 소식 — 위에서부터 최신순. 없으면 빈 배열로 두면 안내 문구가 나옵니다 */
const NEWS = [
  // { date:"2026.02.03", title:"옥수복지관 청춘태권도 수업 시작", body:"성동구 옥수복지관에서 새 수업을 시작했습니다." }
];

/* 서버 CMS에서 저장한 최신 데이터를 불러옵니다. 정적 파일로 열 때는 기존 값이 유지됩니다. */
try {
  const cmsRequest = new XMLHttpRequest();
  cmsRequest.open("GET", "/api/content", false);
  cmsRequest.send(null);
  if (cmsRequest.status === 200) {
    const cms = JSON.parse(cmsRequest.responseText);
    if (cms.site) Object.assign(SITE, cms.site);
    if (Array.isArray(cms.sites) && cms.sites.length) SITES.splice(0, SITES.length, ...cms.sites);
    if (Array.isArray(cms.photos) && cms.photos.length) PHOTOS.splice(0, PHOTOS.length, ...cms.photos);
    if (Array.isArray(cms.news)) NEWS.splice(0, NEWS.length, ...cms.news);
  }
} catch (e) { /* 정적 미리보기에서는 원본 데이터를 사용합니다. */ }

/* ══════════════════════════════════════════════════════════
   아래는 손댈 필요 없습니다
   ══════════════════════════════════════════════════════════ */

const MENU = [
  { href:"index.html",    label:"홈",        key:"home" },
  { href:"about.html",    label:"벗나루 소개", key:"about" },
  { href:"program.html",  label:"청춘태권도",  key:"program" },
  { href:"activity.html", label:"활동 현황",   key:"activity" },
  { href:"news.html",     label:"소식",       key:"news" },
  { href:"contact.html",  label:"문의하기",    key:"contact" }
];

const telHref = "tel:" + SITE.tel.replace(/[^0-9+]/g, "");

function esc(s){
  return String(s).replace(/[&<>"]/g, function(c){
    return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[c];
  });
}

/* 헤더 */
function renderHeader(active){
  const nav = MENU.filter(function(m){ return m.key !== "home"; });
  const gnb = nav.map(function(m){
    return '<a href="' + m.href + '"' + (m.key === active ? ' class="on"' : '') + '>' + m.label + '</a>';
  }).join("");
  const mob = MENU.map(function(m){
    return '<a href="' + m.href + '">' + m.label + '</a>';
  }).join("");

  document.getElementById("siteHeader").innerHTML =
    '<header class="site">' +
      '<div class="wrap bar">' +
        '<a href="index.html" class="logo">' +
          '<svg class="sym" viewBox="0 0 40 40" aria-hidden="true">' +
            '<path d="M8 27c4-9 9-14 12-17 3 3 8 8 12 17-4-3-8-4.5-12-4.5S12 24 8 27z" fill="#0c2e63"/>' +
            '<circle cx="20" cy="6.5" r="4" fill="#168a4b"/>' +
          '</svg>' +
          '<span><small>건강한 움직임, 행복한 노년</small><b>벗나루 청춘태권도</b></span>' +
        '</a>' +
        '<nav class="gnb">' + gnb + '</nav>' +
        '<a class="pill" href="contact.html">협력 문의</a>' +
        '<button class="burger" id="burger" aria-label="메뉴 열기" aria-expanded="false">' +
          '<span></span><span></span><span></span></button>' +
      '</div>' +
      '<div class="wrap mnb" id="mnb">' + mob + '</div>' +
    '</header>';

  const b = document.getElementById("burger");
  const m = document.getElementById("mnb");
  b.addEventListener("click", function(){
    const open = m.classList.toggle("open");
    b.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

/* 푸터 */
function renderFooter(){
  const links = MENU.map(function(m){ return '<a href="' + m.href + '">' + m.label + '</a>'; }).join("");
  document.getElementById("siteFooter").innerHTML =
    '<footer class="site"><div class="wrap">' +
      '<div class="cols">' +
        '<div><b>벗나루 청춘태권도</b><br>건강한 움직임이 행복한 노년을 만듭니다.</div>' +
        '<div style="text-align:right">' + esc(SITE.tel) +
          (SITE.email ? "<br>" + esc(SITE.email) : "") +
          "<br>" + esc(SITE.address) + '</div>' +
      '</div>' +
      '<div class="fnav">' + links + '</div>' +
      '<p class="small" style="color:#8e9aa7;margin:16px 0 0">' +
        '청춘태권도는 의료적 치료를 목적으로 하지 않으며, 어르신의 건강한 생활을 지원하는 신체·인지활동 프로그램입니다.</p>' +
    '</div></footer>';
}

/* 활동 현황 표 */
function renderSites(elId, limit){
  const el = document.getElementById(elId);
  if(!el) return;
  const list = limit ? SITES.slice(0, limit) : SITES;
  el.innerHTML = list.map(function(s){
    const cls = s.state === "자체 운영" ? "badge own" : "badge";
    return '<tr><td>' + esc(s.name) + '</td><td>' + esc(s.area) + '</td><td>' + esc(s.start) +
           '</td><td><span class="' + cls + '">' + esc(s.state) + '</span></td></tr>';
  }).join("");
}

/* 연혁 */
function renderHistory(elId){
  const el = document.getElementById(elId);
  if(!el) return;
  const list = SITES.slice().sort(function(a,b){ return a.ym < b.ym ? -1 : 1; });
  el.innerHTML = list.map(function(s){
    return '<li><b>' + esc(s.start) + '</b><span>' + esc(s.name) + ' (' + esc(s.area) + ') 수업 시작</span></li>';
  }).join("");
}

/* 사진 */
function renderPhotos(elId, opt){
  const el = document.getElementById(elId);
  if(!el) return;
  opt = opt || {};
  let list = PHOTOS.slice(0, opt.limit || PHOTOS.length);
  el.innerHTML = list.map(function(p){
    const big = (!opt.even && p.big) ? ' class="big"' : '';
    return '<figure' + big + '>' +
      '<div class="ph" data-slot="' + esc(p.file) + '"><img src="' + esc(p.file) + '" alt=""></div>' +
      '<figcaption>' + esc(p.caption) + '</figcaption></figure>';
  }).join("");
  markPhotos();
}

/* 소식 */
function renderNews(elId, limit){
  const el = document.getElementById(elId);
  if(!el) return;
  if(!NEWS.length){
    el.outerHTML = '<div class="empty">등록된 소식이 아직 없습니다.</div>';
    return;
  }
  const list = limit ? NEWS.slice(0, limit) : NEWS;
  el.innerHTML = list.map(function(n){
    return '<li><div class="d">' + esc(n.date) + '</div>' +
      '<div><h3>' + esc(n.title) + '</h3><p>' + esc(n.body || "") + '</p></div></li>';
  }).join("");
}

/* 사진 자리 표시 처리 */
function markPhotos(){
  document.querySelectorAll(".ph img, .hero-img img").forEach(function(img){
    const box = img.parentElement;
    if(img.complete && img.naturalWidth > 0) box.classList.add("filled");
    img.addEventListener("load",  function(){ box.classList.add("filled"); });
    img.addEventListener("error", function(){ img.remove(); });
  });
}

/* 연락처 표시 */
function renderContactInfo(){
  const big = document.getElementById("telBig");
  if(big){ big.textContent = SITE.tel; big.href = telHref; }
  const mail = document.getElementById("mailLine");
  if(mail) mail.textContent = (SITE.email ? "이메일 " + SITE.email + " · " : "") + SITE.hours;
  const org = document.getElementById("orgLine");
  if(org) org.textContent = SITE.orgName + " · " + SITE.address;
}

/* 문의 폼 */
function sendMail(e){
  e.preventDefault();
  const v = function(id){ const el = document.getElementById(id); return el ? el.value : ""; };
  const note = document.getElementById("formNote");
  if(!SITE.email){
    note.textContent = "받는 이메일 주소가 아직 설정되지 않았습니다. assets/site.js의 SITE.email을 채워주세요.";
    return;
  }
  const subject = encodeURIComponent("[벗나루 협력 문의] " + v("type") + " - " + v("org"));
  const body = encodeURIComponent(
    "기관명: " + v("org") + "\n담당자: " + v("name") +
    "\n연락처: " + v("phone") + "\n이메일: " + v("email") +
    "\n문의 유형: " + v("type") + "\n\n" + v("message")
  );
  window.location.href = "mailto:" + SITE.email + "?subject=" + subject + "&body=" + body;
  note.textContent = "메일 프로그램을 열었습니다. 보내기까지 눌러주세요.";
}

/* 페이지 공통 초기화 */
function initPage(active){
  renderHeader(active);
  renderFooter();
  renderContactInfo();
  markPhotos();
}
