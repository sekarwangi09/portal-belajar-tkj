// ========= Utilitas umum =========
const $ = (id) => document.getElementById(id);
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

// ========= QUIZ =========
const QUIZ_BANK = [
  // jaringan dasar
  {cat:"jaringan", q:"Apa fungsi utama jaringan komputer?", o:["Berbagi data & sumber daya","Mempercepat CPU","Mengganti sistem operasi"], a:0},
  {cat:"jaringan", q:"Perangkat yang menghubungkan banyak host dalam satu LAN adalah…", o:["Router","Switch","Modem"], a:1},
  {cat:"jaringan", q:"Media nirkabel yang umum digunakan untuk LAN adalah…", o:["Bluetooth","Wi-Fi","NFC"], a:1},
  // perangkat jaringan
  {cat:"perangkat", q:"Perangkat yang menghubungkan dua jaringan berbeda & melakukan routing adalah…", o:["Switch","Router","Access Point"], a:1},
  {cat:"perangkat", q:"Perangkat untuk menghubungkan perangkat nirkabel ke jaringan kabel adalah…", o:["Access Point","Repeater","Bridge"], a:0},
  {cat:"perangkat", q:"Firewall berfungsi untuk…", o:["Menyimpan file","Penyaringan trafik","Memberi alamat IP"], a:1},
  // topologi
  {cat:"topologi", q:"Semua host terhubung ke satu perangkat pusat merupakan topologi…", o:["Bus","Ring","Star"], a:2},
  {cat:"topologi", q:"Topologi yang memiliki banyak jalur redundan adalah…", o:["Mesh","Bus","Tree"], a:0},
  // ip
  {cat:"ip", q:"Contoh alamat IPv4 yang valid adalah…", o:["192.168.1.10","999.1.1.1","256.0.0.1"], a:0},
  {cat:"ip", q:"Alamat privat bukan yang mana?", o:["10.0.0.0/8","172.16.0.0/12","8.8.8.0/24"], a:2},
  {cat:"ip", q:"Subnet mask /24 ekuivalen dengan…", o:["255.255.255.0","255.255.0.0","255.255.255.128"], a:0},
  // subnetting
  {cat:"subnetting", q:"/26 menyediakan host usable sebanyak…", o:["62","30","14"], a:0},
  {cat:"subnetting", q:"Network address dari 192.168.10.77/26 adalah…", o:["192.168.10.64","192.168.10.0","192.168.10.128"], a:0},
  {cat:"subnetting", q:"Broadcast address dari 10.1.5.130/25 adalah…", o:["10.1.5.127","10.1.5.255","10.1.5.255 (kelas A)"], a:1},
  // routing
  {cat:"routing", q:"OSPF termasuk jenis protokol…", o:["Distance-vector","Link-state","Path-vector"], a:1},
  {cat:"routing", q:"Routing statik ditambahkan oleh…", o:["Router otomatis","Administrator","Switch"], a:1},
  // vlan
  {cat:"vlan", q:"802.1Q digunakan untuk…", o:["NAT","Trunking VLAN","QoS"], a:1},
  {cat:"vlan", q:"Manfaat VLAN adalah…", o:["Memperluas domain broadcast","Memecah domain broadcast","Mengganti IP"], a:1},
  // osi
  {cat:"osi", q:"Alamat MAC bekerja pada layer…", o:["3 Network","2 Data Link","1 Physical"], a:1},
  {cat:"osi", q:"TCP bekerja pada layer…", o:["4 Transport","3 Network","7 Application"], a:0},
  // tcpip
  {cat:"tcpip", q:"Lapisan Internet (TCP/IP) setara dengan layer…", o:["Network (OSI)","Transport (OSI)","Data Link (OSI)"], a:0},
  {cat:"tcpip", q:"HTTP berada pada lapisan…", o:["Application","Transport","Internet"], a:0},
  // keamanan
  {cat:"keamanan", q:"Tujuan ‘CIA’ adalah…", o:["Confidentiality, Integrity, Availability","Control, Inspect, Audit","Crypto, Integrity, Access"], a:0},
  {cat:"keamanan", q:"HTTPS mengamankan data dengan…", o:["Compression","Encryption","Fragmentation"], a:1},
  // serverclient
  {cat:"serverclient", q:"DHCP server memberikan…", o:["Nama domain","Alamat IP otomatis","DNS cache"], a:1},
  {cat:"serverclient", q:"Browser adalah…", o:["Server","Client","Router"], a:1},
  // hardware
  {cat:"hardware", q:"Komponen yang menyimpan data permanen adalah…", o:["RAM","SSD/HDD","Cache"], a:1},
  {cat:"hardware", q:"GPU terutama digunakan untuk…", o:["Grafik","Jaringan","Penyimpanan"], a:0},
  // software
  {cat:"software", q:"Linux adalah…", o:["Aplikasi","Sistem Operasi","Firmware"], a:1},
  {cat:"software", q:"Utility contoh yang mana?", o:["Antivirus","Browser","CPU"], a:0},
  // htmlcss
  {cat:"htmlcss", q:"Elemen untuk paragraf di HTML adalah…", o:["<div>","<p>","<span>"], a:1},
  {cat:"htmlcss", q:"Properti CSS untuk warna teks adalah…", o:["background","color","font"], a:1},
  // jssql
  {cat:"jssql", q:"JavaScript berjalan di…", o:["Browser & Node.js","Database","Router"], a:0},
  {cat:"jssql", q:"Perintah untuk mengambil semua data di SQL adalah…", o:["GET * FROM","SELECT * FROM","SHOW ALL"], a:1},
];
const QUIZ_CATS = ["campuran","jaringan","perangkat","topologi","ip","subnetting","routing","vlan","osi","tcpip","keamanan","serverclient","hardware","software","htmlcss","jssql"];
let quizSet = [], quizIdx = 0, quizScore = 0;

function quizBuild(){
  const cat = $("quizCategory").value;
  const count = parseInt($("quizCount").value,10);
  let pool = (cat === "campuran") ? [...QUIZ_BANK] : QUIZ_BANK.filter(q=>q.cat===cat);
  if(pool.length < count){
    // jika bank kategori sedikit, campur dari lain agar tetap cukup
    pool = pool.concat(shuffle([...QUIZ_BANK]).slice(0, count));
  }
  shuffle(pool);
  quizSet = pool.slice(0, count);
  quizIdx = 0;
  quizScore = 0;
  quizRender();
}
function quizRender(){
  $("quizProg").textContent = `Soal ${Math.min(quizIdx+1, quizSet.length)}/${quizSet.length}`;
  $("quizScore").textContent = `Skor: ${quizScore}`;
  const qbox = $("quizQuestion");
  const obox = $("quizOptions");
  obox.innerHTML = "";
  if(quizIdx >= quizSet.length){
    qbox.textContent = `Selesai! Skor akhir ${quizScore}/${quizSet.length}. Klik "Mulai / Acak Ulang" untuk set baru.`;
    return;
  }
  const item = quizSet[quizIdx];
  qbox.textContent = item.q;
  item.o.forEach((opt, i)=>{
    const b = document.createElement("button");
    b.className = "opt-btn";
    b.textContent = opt;
    b.onclick = ()=>{
      if(i === item.a){
        b.classList.add("correct");
        quizScore++;
      }else{
        b.classList.add("wrong");
        // tandai yang benar
        [...obox.children].forEach((btn,idx)=>{ if(idx===item.a) btn.classList.add("correct"); });
      }
      $("quizScore").textContent = `Skor: ${quizScore}`;
      setTimeout(()=>{ quizIdx++; quizRender(); }, 650);
    };
    obox.appendChild(b);
  });
}
$("quizStart").addEventListener("click", quizBuild);
$("quizReset").addEventListener("click", quizBuild);
$("quizCategory").addEventListener("change", quizBuild);
$("quizCount").addEventListener("change", quizBuild);

// ========= TEBAK KATA (20 soal) =========
const WORD_BANK = shuffle([
  {q:"Perangkat keras utama pemroses?", a:"CPU"},
  {q:"Penyimpanan sementara komputer?", a:"RAM"},
  {q:"Alamat unik perangkat di jaringan?", a:"IP"},
  {q:"Perangkat untuk mencetak dokumen?", a:"Printer"},
  {q:"Perangkat masukan teks?", a:"Keyboard"},
  {q:"Protokol untuk menjelajah web?", a:"HTTP"},
  {q:"Jaringan lokal skala kecil?", a:"LAN"},
  {q:"Perangkat untuk mengarahkan paket antar jaringan?", a:"Router"},
  {q:"Perangkat untuk menghubungkan perangkat dalam LAN?", a:"Switch"},
  {q:"Pemecahan jaringan menjadi beberapa VLAN disebut?", a:"Trunking"},
  {q:"Model 7 lapisan jaringan?", a:"OSI"},
  {q:"Pasangan TCP/IP untuk pengalamatan?", a:"IP"},
  {q:"Protokol pengiriman email?", a:"SMTP"},
  {q:"Protokol transfer berkas?", a:"FTP"},
  {q:"Kumpulan aturan komunikasi data?", a:"Protokol"},
  {q:"Alamat privat contoh kelas C?", a:"192.168.0.0"},
  {q:"Istilah membagi network menjadi subnet kecil?", a:"Subnetting"},
  {q:"Server pemberi alamat IP otomatis?", a:"DHCP"},
  {q:"Keamanan: C dalam CIA artinya?", a:"Confidentiality"},
  {q:"Database query untuk ambil semua data?", a:"SELECT"},
]);
let wIdx = 0, wCorrect = 0, wTotal = 0;
function wordStart(){
  wIdx = 0; wCorrect = 0; wTotal = 0;
  $("wordFeedback").textContent = "";
  $("wordScore").textContent = `Benar: 0`;
  $("wordProg").textContent = `Soal 1/20`;
  $("wordInput").value = "";
  $("wordInput").focus();
  $("wordQuestion").textContent = WORD_BANK[wIdx].q;
}
function wordNext(){
  wIdx = (wIdx + 1) % WORD_BANK.length;
  $("wordQuestion").textContent = WORD_BANK[wIdx].q;
  $("wordProg").textContent = `Soal ${wIdx+1}/20`;
  $("wordInput").value = "";
  $("wordInput").focus();
}
function wordCheck(){
  const ans = $("wordInput").value.trim().toLowerCase();
  if(!ans) return;
  const correct = WORD_BANK[wIdx].a.toLowerCase();
  wTotal++;
  if(ans === correct){
    wCorrect++;
    $("wordFeedback").innerHTML = `<span class="ok">✅ Benar!</span>`;
  }else{
    $("wordFeedback").innerHTML = `<span class="no">❌ Salah.</span> Jawaban: <b>${WORD_BANK[wIdx].a}</b>`;
  }
  $("wordScore").textContent = `Benar: ${wCorrect}`;
  setTimeout(()=>{ $("wordFeedback").textContent = ""; wordNext(); }, 850);
}
$("wordSubmit").addEventListener("click", wordCheck);
$("wordInput").addEventListener("keydown", (e)=>{ if(e.key==="Enter") wordCheck(); });
$("wordReset").addEventListener("click", wordStart);
$("wordStart").addEventListener("click", wordStart);

// ========= MEMORY CARD =========
const MEM_PAIRS = [
  {k:"CPU", e:"💻"}, {k:"RAM", e:"📗"}, {k:"Router", e:"📡"}, {k:"Switch", e:"🔀"},
  {k:"Server", e:"🗄️"}, {k:"Firewall", e:"🔥"}, {k:"Cloud", e:"☁️"}, {k:"Database", e:"🗃️"},
  {k:"Keyboard", e:"⌨️"}, {k:"Mouse", e:"🖱️"}
]; // 10 pasang => 20 kartu
let memDeck = [], memFirst=null, memSecond=null, memLock=false, memMoves=0, memMatched=0;
let memPreviewTimer=null, memGameTimer=null, memTimeLeft=0, memInPlay=false, memInPreview=false;

function memBuildDeck(){
  const doubled = [];
  MEM_PAIRS.forEach(p=>{
    doubled.push({id:cryptoRandom(), k:p.k, e:p.e});
    doubled.push({id:cryptoRandom(), k:p.k, e:p.e});
  });
  return shuffle(doubled);
}
function cryptoRandom(){
  // fallback random id
  return (Math.random().toString(36).slice(2)+Date.now().toString(36)).slice(0,12);
}
function memRenderBoard(){
  const board = $("memBoard");
  board.innerHTML = "";
  memDeck.forEach(card=>{
    const el = document.createElement("div");
    el.className = "card";
    el.dataset.key = card.k;
    el.dataset.id = card.id;
    el.innerHTML = `
      <div class="card-inner">
        <div class="face front">?</div>
        <div class="face back">
          <div class="emoji">${card.e}</div>
          <div class="label">${card.k}</div>
        </div>
      </div>
    `;
    el.addEventListener("click", ()=>memFlip(el));
    board.appendChild(el);
  });
}
function memFlip(el){
  if(memLock || !memInPlay || memInPreview) return;
  if(el.classList.contains("matched") || el.classList.contains("flipped")) return;
  el.classList.add("flipped");
  if(!memFirst){ memFirst = el; return; }
  if(el === memFirst) return;

  memSecond = el;
  memLock = true;
  memMoves++;
  $("memMoves").textContent = `Langkah: ${memMoves}`;

  // cek cocok
  if(memFirst.dataset.key === memSecond.dataset.key){
    setTimeout(()=>{
      memFirst.classList.add("matched");
      memSecond.classList.add("matched");
      memFirst = memSecond = null;
      memLock = false;
      memMatched++;
      $("memStat").textContent = `Skor: ${memMatched} pasangan`;
      if(memMatched === MEM_PAIRS.length){
        memFinish(true);
      }
    }, 200);
  }else{
    setTimeout(()=>{
      memFirst.classList.remove("flipped");
      memSecond.classList.remove("flipped");
      memFirst = memSecond = null;
      memLock = false;
    }, 700);
  }
}
function memStart(){
  // reset state + deck baru
  memReset(true);
  memDeck = memBuildDeck();
  memRenderBoard();

  // preview semua kartu 10 detik
  const cards = [...document.querySelectorAll("#memBoard .card")];
  cards.forEach(c=>c.classList.add("flipped"));
  memInPreview = true;
  let pv = 10;
  $("memPreview").textContent = `Preview: ${pv} dtk`;
  clearInterval(memPreviewTimer);
  memPreviewTimer = setInterval(()=>{
    pv--;
    $("memPreview").textContent = `Preview: ${pv} dtk`;
    if(pv<=0){
      clearInterval(memPreviewTimer);
      memInPreview = false;
      $("memPreview").textContent = `Preview selesai`;
      cards.forEach(c=>{ if(!c.classList.contains("matched")) c.classList.remove("flipped"); });
      // mulai waktu main
      const dur = parseInt($("memDuration").value,10);
      memTimeLeft = dur;
      memInPlay = true;
      $("memTimer").textContent = `⏱ Waktu: ${formatSecs(memTimeLeft)}`;
      clearInterval(memGameTimer);
      memGameTimer = setInterval(()=>{
        memTimeLeft--;
        $("memTimer").textContent = `⏱ Waktu: ${formatSecs(memTimeLeft)}`;
        if(memTimeLeft<=0){
          memFinish(false);
        }
      }, 1000);
    }
  }, 1000);
}
function memFinish(win){
  memInPlay = false;
  clearInterval(memGameTimer);
  $("memTimer").textContent = `⏱ Waktu: ${formatSecs(memTimeLeft)} (selesai)`;
  const msg = win
    ? `🎉 Selesai! Kamu menemukan semua pasangan dengan ${memMoves} langkah.`
    : `⌛ Waktu habis. Skor kamu: ${memMatched}/${MEM_PAIRS.length} pasangan.`;
  alert(msg);
}
function memReset(skipAlert=false){
  if(!skipAlert) {
    // reshuffle & render ulang
  }
  clearInterval(memPreviewTimer);
  clearInterval(memGameTimer);
  memFirst = memSecond = null;
  memLock = false;
  memMoves = 0;
  memMatched = 0;
  memTimeLeft = 0;
  memInPlay = false;
  memInPreview = false;
  $("memPreview").textContent = "Preview: —";
  $("memTimer").textContent = "⏱ Waktu: —";
  $("memStat").textContent = "Skor: 0 pasangan";
  $("memMoves").textContent = "Langkah: 0";
  // regenerate new shuffled deck & render so tatanan berubah walau reset biasa
  memDeck = memBuildDeck();
  memRenderBoard();
}
function formatSecs(s){
  const m = Math.floor(s/60).toString().padStart(2,"0");
  const sc = (s%60).toString().padStart(2,"0");
  return `${m}:${sc}`;
}
$("memStart").addEventListener("click", memStart);
$("memReset").addEventListener("click", ()=>memReset());

// ====== INIT DEFAULT ======
document.addEventListener("DOMContentLoaded", ()=>{
  // Quiz: langsung siapkan set awal (campuran, 5)
  quizBuild();
  // Word: tampilkan instruksi
  $("wordQuestion").textContent = "Klik “Mulai” untuk memulai sesi Tebak Kata (20 soal acak).";
  // Memory: render papan awal (di-reset) agar bisa langsung di-klik setelah Mulai
  memReset(true);
});
