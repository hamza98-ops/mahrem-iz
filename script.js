/* ================================================
   MAHREM-İZ — JavaScript
   (defer ile yüklenir: DOM her zaman hazır)
   ================================================ */

/* ------------------------------------------------
   TOAST BİLDİRİM
   ------------------------------------------------ */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ================================================
   NAVBAR: Scroll + Aktif Link
   ================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id], div[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* ================================================
   MOBİL MENÜ — Erişilebilir (aria-expanded)
   ================================================ */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navLinks');
const menuSpans = navToggle.querySelectorAll('span');

function setMenuOpen(open) {
  navMenu.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Menüyü Kapat' : 'Menüyü Aç');
  // Hamburger → X animasyonu
  if (open) {
    menuSpans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    menuSpans[1].style.opacity   = '0';
    menuSpans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    menuSpans[0].style.transform = '';
    menuSpans[1].style.opacity   = '';
    menuSpans[2].style.transform = '';
  }
}

navToggle.addEventListener('click', () => {
  setMenuOpen(!navMenu.classList.contains('open'));
});

document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});

// ESC tuşuyla menüyü kapat
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) setMenuOpen(false);
});

/* ================================================
   AOS — Özel hafif implementasyon
   (defer sayesinde DOM hazır, harici lib gerek yok)
   ================================================ */
(function initAOS() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('aos-animate');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
})();

/* ================================================
   AKADEMİ SEKMELERİ — ARIA + Klavye Desteği
   (← → ok tuşları, Enter, Space)
   ================================================ */
const tabBtns     = Array.from(document.querySelectorAll('.tab-btn'));
const tabContents = document.querySelectorAll('.tab-content');

function activateTab(btn) {
  tabBtns.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
    b.setAttribute('tabindex', '-1');
  });
  tabContents.forEach(tc => tc.classList.add('hidden'));

  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  btn.setAttribute('tabindex', '0');
  btn.focus();

  const panel = document.getElementById('tab-' + btn.dataset.tab);
  if (panel) panel.classList.remove('hidden');
}

tabBtns.forEach((btn, i) => {
  btn.setAttribute('tabindex', i === 0 ? '0' : '-1');

  btn.addEventListener('click', () => activateTab(btn));

  btn.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      activateTab(tabBtns[(i + 1) % tabBtns.length]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      activateTab(tabBtns[(i - 1 + tabBtns.length) % tabBtns.length]);
    }
  });
});

/* ================================================
   ETİK KARNE — Erişilebilir Radio Yıldız Puanlama
   ================================================ */
const scores = {};

document.querySelectorAll('.karne-stars').forEach(group => {
  const id     = group.dataset.id;
  const radios = group.querySelectorAll('.star-radio');
  const labels = Array.from(group.querySelectorAll('label'));
  scores[id] = 0;

  function paint(val) {
    labels.forEach((l, i) => l.classList.toggle('star-active', i < val));
  }

  // Radio değişince puanı kaydet
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      scores[id] = parseInt(radio.value);
      paint(scores[id]);
      group.closest('.karne-card').classList.add('rated');
      updateKarneScore();
    });
  });

  // Hover efekti label üzerinden
  labels.forEach((label, i) => {
    label.addEventListener('mouseenter', () => {
      labels.forEach((l, j) => l.classList.toggle('star-hover', j <= i));
    });
    label.addEventListener('mouseleave', () => {
      labels.forEach(l => l.classList.remove('star-hover'));
    });
  });
});

/* Ağırlıklar (HTML data-weight ile senkron) ve kırmızı çizgi kriterler */
const KARNE_WEIGHTS = { 1: 30, 2: 15, 3: 20, 4: 10, 5: 10, 6: 10, 7: 5 };
const KARNE_REDLINES = {
  1: 'Kriter 1 — çocuk mahremiyetine 1 yıldız: çocukları içeriğin merkezine koymak ve mahrem anlarını kamuya açmak temel hak ihlalidir.',
  3: 'Kriter 3 — aile dinamiklerini araçsallaştırmaya 1 yıldız: kavga, gerilim ve duygusal anların eğlence içeriği yapılması mahremiyetin en derin ihlalidir.'
};

function computeKarne() {
  // Ağırlıklı yüzde puan: Σ (yıldız/5 × ağırlık)
  let weighted = 0;
  let answered = 0;
  Object.entries(KARNE_WEIGHTS).forEach(([id, w]) => {
    const v = scores[id] || 0;
    if (v > 0) {
      weighted += (v / 5) * w;
      answered++;
    }
  });
  const pct = Math.round(weighted);

  // Kırmızı çizgi: kritik kriterlere 1 yıldız verildiyse otomatik kırmızı
  const tripped = [];
  Object.keys(KARNE_REDLINES).forEach(id => {
    if (scores[id] === 1) tripped.push(id);
  });

  return { pct, answered, tripped };
}

function updateKarneScore() {
  const { pct, answered, tripped } = computeKarne();

  // Skor görünümü
  document.getElementById('scoreValue').textContent = answered === 0 ? '–' : pct;
  document.getElementById('resultFill').style.width = pct + '%';
  const bar = document.getElementById('resultBar');
  if (bar) bar.setAttribute('aria-valuenow', pct);

  // Trafik ışığı + sözel hüküm (kırmızı çizgi öncelikli)
  const traffic   = document.getElementById('resultTraffic');
  const redlineEl = document.getElementById('resultRedline');
  const redlineReasonEl = document.getElementById('resultRedlineReason');
  let level, text;

  if (answered === 0) {
    traffic.className = 'result-traffic';
    text = 'Kriterleri değerlendirin, sonuç burada görünecek.';
    redlineEl.hidden = true;
  } else if (tripped.length > 0) {
    // Kırmızı çizgi tetiklendi — skor yüksek olsa da kırmızı
    level = 'red';
    traffic.className = 'result-traffic red';
    text = '✗ Kırmızı — Kırmızı çizgi tetiklendi. Diğer kriterler iyi olsa da çocuk veya aile mahremiyetinde temel bir ihlal işaretlendi. Takipten çıkmayı veya en azından bildirimleri kapatıp çocuk içeriklerini desteklememe önerilir.';
    redlineReasonEl.textContent = tripped.map(id => KARNE_REDLINES[id]).join(' ');
    redlineEl.hidden = false;
  } else if (pct >= 80) {
    level = 'green';
    traffic.className = 'result-traffic green';
    text = '✓ Yeşil — Bu hesap mahremiyete büyük ölçüde saygı gösteriyor. Değerlerinizle örtüşüyorsa bilinçli olarak takip edebilirsiniz; çocuk içeriklerini yine de dönemsel gözden geçirin.';
    redlineEl.hidden = true;
  } else if (pct >= 55) {
    level = 'yellow';
    traffic.className = 'result-traffic yellow';
    text = '⚠ Sarı — Orta düzey uyum. Bildirimleri kapatın, çocuk içeriklerini ayrıca değerlendirin; reklam ve sponsorluk işaretlerini yakından izleyin.';
    redlineEl.hidden = true;
  } else if (pct >= 30) {
    level = 'orange';
    traffic.className = 'result-traffic orange';
    text = '⚠ Turuncu — Bu hesap birçok etik kriterde eksik. Takibi sınırlandırın, çocuk içeriklerini beğenip paylaşmayın, benzer içerikleri algoritmaya beslemeyin.';
    redlineEl.hidden = true;
  } else {
    level = 'red';
    traffic.className = 'result-traffic red';
    text = '✗ Kırmızı — Bu hesap mahremiyet ve aile etiği açısından ciddi endişeler barındırıyor. Takipten çıkmanızı, gerekirse platforma bildirmenizi öneririz.';
    redlineEl.hidden = true;
  }

  document.getElementById('resultText').textContent = text;

  // Kopyala butonunu göster
  const copyBtn = document.getElementById('copyKarne');
  if (copyBtn) copyBtn.style.display = answered > 0 ? 'inline-block' : 'none';
}

/* --- Karneyi Sıfırla --- */
document.getElementById('resetKarne').addEventListener('click', () => {
  Object.keys(scores).forEach(k => scores[k] = 0);
  document.querySelectorAll('.star-radio').forEach(r => r.checked = false);
  document.querySelectorAll('.karne-stars label').forEach(l => {
    l.classList.remove('star-active', 'star-hover');
  });
  document.querySelectorAll('.karne-card').forEach(c => c.classList.remove('rated'));
  document.getElementById('scoreValue').textContent = '–';
  document.getElementById('resultFill').style.width  = '0%';
  document.getElementById('resultTraffic').className = 'result-traffic';
  document.getElementById('resultText').textContent  = 'Kriterleri değerlendirin, sonuç burada görünecek.';
  const redlineEl = document.getElementById('resultRedline');
  if (redlineEl) redlineEl.hidden = true;
  const copyBtn = document.getElementById('copyKarne');
  if (copyBtn) copyBtn.style.display = 'none';
  const bar = document.getElementById('resultBar');
  if (bar) bar.setAttribute('aria-valuenow', 0);
});

/* --- Sonucu Kopyala --- */
document.getElementById('copyKarne').addEventListener('click', async () => {
  const { pct, tripped } = computeKarne();
  const flag = tripped.length > 0 ? ' (Kırmızı çizgi tetiklendi)' : '';
  const text = `Mahrem-İz Etik Karne\n${pct}/100${flag}\n${document.getElementById('resultText').textContent}\n\nmahremiz.com.tr`;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Sonuç panoya kopyalandı!');
  } catch {
    showToast('Kopyalama desteklenmiyor, lütfen manuel kopyalayın.');
  }
});

/* ================================================
   ETİK KARNE — PAYLAŞIM KARTI (Canvas API)
   Sıfır bağımlılık: native Canvas + Web Share + downloadLink
   ================================================ */
(function initShareCard() {
  const btn      = document.getElementById('shareCardBtn');
  const modal    = document.getElementById('shareModal');
  const canvas   = document.getElementById('shareCanvas');
  const closeBtn = document.getElementById('shareModalClose');
  const dlBtn    = document.getElementById('shareDownload');
  const shareBtn = document.getElementById('shareNative');
  const tabs     = document.querySelectorAll('.share-tab');
  if (!btn || !canvas) return;

  let currentFormat = 'story'; // 'story' | 'square'

  // Karne sonucu olduğunda paylaşım butonunu göster
  document.addEventListener('change', () => {
    const { answered } = computeKarne();
    btn.style.display = answered > 0 ? 'inline-block' : 'none';
  });

  function paletteFor(pct, redlineTripped) {
    if (redlineTripped) return { color: '#e74c3c', label: 'KIRMIZI · ÇİZGİ AŞILDI', verdict: 'Mahremiyet ihlali', bg1: '#0f1f3d', bg2: '#4a1a1a' };
    if (pct >= 80) return { color: '#27ae60', label: 'YEŞIL', verdict: 'Mahremiyete saygılı', bg1: '#0f1f3d', bg2: '#1a4a3a' };
    if (pct >= 55) return { color: '#f39c12', label: 'SARI',  verdict: 'Eleştirel takip',     bg1: '#0f1f3d', bg2: '#4a3d1a' };
    if (pct >= 30) return { color: '#e67e22', label: 'TURUNCU', verdict: 'Sınırla',           bg1: '#0f1f3d', bg2: '#4a2d1a' };
    return                 { color: '#e74c3c', label: 'KIRMIZI', verdict: 'Takipten çık',     bg1: '#0f1f3d', bg2: '#4a1a1a' };
  }

  function drawCard(format) {
    const { pct, tripped } = computeKarne();
    const pal = paletteFor(pct, tripped.length > 0);

    // Doğal boyut: story 1080×1920, square 1080×1080. Canvas iki boyut için yeniden ayarlanır.
    const W = 1080;
    const H = format === 'story' ? 1920 : 1080;
    canvas.width  = W;
    canvas.height = H;
    // CSS preview için orantılı yükseklik (genişlik 540 sabit)
    canvas.style.width  = '540px';
    canvas.style.height = (540 * H / W) + 'px';

    const ctx = canvas.getContext('2d');

    // ---- ARKA PLAN: Diagonal gradient ----
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0,   pal.bg1);
    grad.addColorStop(0.6, '#07132a');
    grad.addColorStop(1,   pal.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // ---- DEKORATİF DAİRELER (radial accents) ----
    ctx.save();
    const r1 = ctx.createRadialGradient(W*0.85, H*0.15, 0, W*0.85, H*0.15, W*0.6);
    r1.addColorStop(0, 'rgba(201,168,76,0.18)');
    r1.addColorStop(1, 'rgba(201,168,76,0)');
    ctx.fillStyle = r1;
    ctx.fillRect(0,0,W,H);
    const r2 = ctx.createRadialGradient(W*0.15, H*0.85, 0, W*0.15, H*0.85, W*0.7);
    r2.addColorStop(0, 'rgba(46,134,171,0.16)');
    r2.addColorStop(1, 'rgba(46,134,171,0)');
    ctx.fillStyle = r2;
    ctx.fillRect(0,0,W,H);
    ctx.restore();

    // ---- ALTIN ÇERÇEVE ----
    ctx.strokeStyle = 'rgba(201,168,76,0.55)';
    ctx.lineWidth = 4;
    const m = 50;
    ctx.strokeRect(m, m, W - 2*m, H - 2*m);
    ctx.strokeStyle = 'rgba(201,168,76,0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(m + 14, m + 14, W - 2*m - 28, H - 2*m - 28);

    // ---- LOGO / MARKA (üst) ----
    const topY = H * 0.13;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '700 64px "Playfair Display", Georgia, serif';
    ctx.fillText('Mahrem', W/2 - 70, topY);
    ctx.fillStyle = '#e8c76a';
    ctx.fillText('-İz', W/2 + 80, topY);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '400 22px Inter, sans-serif';
    ctx.fillText('ETİK KARNE  ·  ETİK DENETLEME', W/2, topY + 38);

    // ---- TRAFİK IŞIĞI (büyük renkli daire) ----
    const lightY = format === 'story' ? H * 0.32 : H * 0.30;
    const lightR = format === 'story' ? 130 : 110;
    // glow halka
    const glow = ctx.createRadialGradient(W/2, lightY, 0, W/2, lightY, lightR * 2.2);
    glow.addColorStop(0, pal.color + 'AA');
    glow.addColorStop(1, pal.color + '00');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(W/2, lightY, lightR * 2.2, 0, Math.PI*2);
    ctx.fill();
    // ışık
    ctx.fillStyle = pal.color;
    ctx.beginPath();
    ctx.arc(W/2, lightY, lightR, 0, Math.PI*2);
    ctx.fill();
    // iç gloss
    const gloss = ctx.createRadialGradient(W/2 - lightR*0.3, lightY - lightR*0.3, 0, W/2, lightY, lightR);
    gloss.addColorStop(0, 'rgba(255,255,255,0.5)');
    gloss.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gloss;
    ctx.beginPath();
    ctx.arc(W/2, lightY, lightR, 0, Math.PI*2);
    ctx.fill();

    // ---- SKOR (büyük rakam: yüzde) ----
    const scoreY = format === 'story' ? H * 0.52 : H * 0.55;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 240px "Playfair Display", Georgia, serif';
    ctx.fillText(String(pct), W/2, scoreY);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '400 38px Inter, sans-serif';
    ctx.fillText('/ 100  PUAN', W/2, scoreY + 46);

    // Kırmızı çizgi rozeti (varsa)
    if (tripped.length > 0) {
      const rW = 380, rH = 44, rX = (W - rW) / 2, rY = scoreY - 200;
      ctx.fillStyle = 'rgba(231,76,60,0.25)';
      roundRect(ctx, rX, rY, rW, rH, 22); ctx.fill();
      ctx.strokeStyle = 'rgba(231,76,60,0.8)';
      ctx.lineWidth = 2;
      roundRect(ctx, rX, rY, rW, rH, 22); ctx.stroke();
      ctx.fillStyle = '#ff8a80';
      ctx.font = '700 22px Inter, sans-serif';
      ctx.fillText('⚠ KIRMIZI ÇİZGİ TETİKLENDİ', W/2, rY + 29);
    }

    // ---- VERDICT BAR ----
    const barY = format === 'story' ? H * 0.66 : H * 0.72;
    const barW = W * 0.7;
    const barH = 14;
    const barX = (W - barW) / 2;
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    roundRect(ctx, barX, barY, barW, barH, 7); ctx.fill();
    ctx.fillStyle = pal.color;
    roundRect(ctx, barX, barY, barW * (pct/100), barH, 7); ctx.fill();
    ctx.fillStyle = pal.color;
    ctx.font = '700 30px Inter, sans-serif';
    ctx.fillText(`${pct}%   ·   ${pal.label}`, W/2, barY + 60);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '500 32px Inter, sans-serif';
    ctx.fillText(pal.verdict.toUpperCase(), W/2, barY + 100);

    // ---- ALT ŞERİT: çağrı + URL ----
    const ctaY = H * 0.86;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = 'italic 600 36px "Playfair Display", Georgia, serif';
    wrapText(ctx, '"Dikkatiniz bir oy gibidir; nereye verirseniz, orayı büyütürsünüz."', W/2, ctaY, W * 0.85, 44);

    ctx.fillStyle = '#e8c76a';
    ctx.font = '700 30px Inter, sans-serif';
    ctx.fillText('mahremiz.com.tr  ·  Sosyalfest 2026', W/2, H - m - 38);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];
    for (const w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line.trim());
        line = w + ' ';
      } else {
        line = test;
      }
    }
    lines.push(line.trim());
    const startY = y - (lines.length - 1) * lineHeight / 2;
    lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
  }

  // Buton: modal aç + ilk render
  btn.addEventListener('click', () => {
    drawCard(currentFormat);
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  });
  closeBtn.addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    currentFormat = t.dataset.format;
    drawCard(currentFormat);
  }));

  dlBtn.addEventListener('click', () => {
    const { pct } = computeKarne();
    const a = document.createElement('a');
    a.href     = canvas.toDataURL('image/png');
    a.download = `mahrem-iz-etik-karne-${pct}-100.png`;
    a.click();
    showToast('Kart indiriliyor.');
  });

  shareBtn.addEventListener('click', async () => {
    const { pct, tripped } = computeKarne();
    const flagged = tripped.length > 0 ? ' (Kırmızı çizgi tetiklendi)' : '';
    canvas.toBlob(async blob => {
      if (!blob) { showToast('Kart üretilemedi.'); return; }
      const file = new File([blob], `mahrem-iz-karne-${pct}.png`, { type: 'image/png' });
      const data = {
        title: 'Mahrem-İz Etik Karne',
        text:  `Bu hesabı Mahrem-İz Etik Karne ile ${pct}/100 puan${flagged} olarak değerlendirdim. Sen de değerlendir:`,
        url:   'https://mahremiz.com.tr/#karne',
        files: [file],
      };
      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share(data);
        } else if (navigator.share) {
          await navigator.share({ title: data.title, text: data.text, url: data.url });
        } else {
          dlBtn.click(); // Fallback: indir
          showToast('Web Share desteklenmiyor — kart indirildi.');
        }
      } catch (err) {
        if (err.name !== 'AbortError') showToast('Paylaşım başarısız.');
      }
    }, 'image/png');
  });
})();

/* ================================================
   SÖZLEŞME: PRINT BUTONU
   ================================================ */
document.getElementById('btnPrint').addEventListener('click', () => window.print());

/* ================================================
   MANİFESTO: PAYLAŞ + YAZDIR
   ================================================ */
document.getElementById('btnShare').addEventListener('click', async () => {
  const shareData = {
    title: 'Mahrem-İz Manifestosu',
    text:  'Mutluluğu Sergileme, Huzuru Yaşa. Dijital mahremiyet ve aile etiği üzerine bir farkındalık hareketi.',
    url:   window.location.href,
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Bağlantı panoya kopyalandı!');
    }
  } catch (err) {
    // Kullanıcı iptal ettiyse sessizce geç
    if (err.name !== 'AbortError') showToast('Paylaşım başarısız oldu.');
  }
});

document.getElementById('btnPrint2').addEventListener('click', () => window.print());

/* ================================================
   İLETİŞİM FORMU — Honeypot + FormSubmit AJAX
   KVKK aydınlatma yeterli; açık rıza kutusu kaldırıldı.
   ================================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    // Honeypot kontrolü
    const honeypot = contactForm.querySelector('.honeypot');
    if (honeypot && honeypot.value) return; // Bot tespiti, sessizce durdur

    const btn          = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent    = 'Gönderiliyor…';
    btn.disabled       = true;

    const endpoint = contactForm.dataset.endpoint;
    const payload  = {
      name:    document.getElementById('name').value.trim(),
      email:   document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim(),
      _subject: 'Mahrem-İz · Yeni İletişim Mesajı',
      _template: 'table',
    };

    try {
      // Endpoint yoksa (örn. local geliştirme) sahte başarı simülasyonu
      if (!endpoint) {
        await new Promise(r => setTimeout(r, 800));
      } else {
        const res = await fetch(endpoint, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body:    JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
      }

      btn.textContent      = 'Gönderildi ✓';
      btn.style.background = 'var(--green)';
      contactForm.reset();
      showToast('Mesajınız iletildi, teşekkürler!');
    } catch (err) {
      btn.textContent      = 'Hata — Tekrar Dene';
      btn.style.background = 'var(--red)';
      showToast('Gönderilemedi: ' + err.message);
    } finally {
      setTimeout(() => {
        btn.textContent      = originalText;
        btn.style.background = '';
        btn.disabled         = false;
      }, 3000);
    }
  });
}

/* ================================================
   SMOOTH SCROLL — Anchor Linkleri
   ================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ================================================
   STAT SAYAÇ ANİMASYONU
   ================================================ */
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  (function step(now) {
    const p       = Math.min((now - start) / duration, 1);
    const eased   = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = el.dataset.original;
  })(start);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const orig = entry.target.textContent.trim();
      entry.target.dataset.original = orig;
      const num = parseFloat(orig.replace(/[^0-9]/g, ''));
      if (!isNaN(num) && num > 0) animateCounter(entry.target, num);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

/* ================================================
   MADDE CHECKBOX: İlerleme Göstergesi
   ================================================ */
const maddeCheckboxes = document.querySelectorAll('.madde-checkbox');
maddeCheckboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    const checked = document.querySelectorAll('.madde-checkbox:checked').length;
    if (checked === maddeCheckboxes.length) {
      setTimeout(() => {
        const btn = document.querySelector('#btnPrint');
        if (btn) btn.textContent = '✓ Tüm Maddeler Onaylandı — Yazdır & İmzala';
      }, 200);
    }
  });
});

/* ================================================
   FIKHÎ DENETİM — SİNEMATİK ANLATI
   Sentinel-tabanlı IntersectionObserver
   Mobilde (≤768px) sticky kapalı; observer no-op
   ================================================ */
(function initCinema() {
  const stage     = document.getElementById('cinema');
  if (!stage) return;
  const frames    = stage.querySelectorAll('.cinema-frame');
  const sentinels = stage.querySelectorAll('.cinema-sentinel');
  const stageEl   = stage.querySelector('.cinema-stage');
  const progress  = document.getElementById('cinemaProgressFill');
  const chapter   = document.getElementById('cinemaChapter');
  const caption   = document.getElementById('cinemaCaption');
  if (!frames.length || !sentinels.length || !caption) return;

  const total = sentinels.length;

  // Her sahnenin anlatım metni (caption verisi)
  const scenes = {
    1:  { tag: 'Sahne 01 · Açılış',           title: 'Dijital Vitrin ve Velâyetin Sınırları',
          text: 'Klasik İslâm hukuku, "influencer ebeveynlik" fenomenini emanet, velâyet ve maslahat kavramları ışığında nasıl denetler? Dört aşamalı bir denetimin haritası.' },
    2:  { tag: 'Sahne 02 · Ekosistem',        title: 'Sponsorlu Çocuk İçeriğinin Üçgeni',
          text: 'Kaynak (çocuk) → Katalizör (algoritma) → Alıcı (ebeveyn hesabı). Bu modelde ebeveyn, çocuğun dijital varlığını bir banka kapısı olarak yönetir.' },
    3:  { tag: 'Sahne 03 · Temel Kaide',      title: 'Mülkiyet Yanılgısı vs Emanet Kalkanı',
          text: '"Ebeveyn, çocuk üzerindeki velâyetini mülk hakkı olarak değil, yalnızca çocuğun maslahatı gereği kullanılan ilâhî bir emanet olarak kullanabilir."' },
    4:  { tag: 'Sahne 04 · Birinci Denetim',  title: 'Eylem Kimin Standartlarına Hizmet Ediyor?',
          text: 'Piyasanın "etkileşim/sponsor beklentisi" ile İbn Abdüsselâm\'ın "en aslah olan" ölçütü çatışır: Veliler raiyye üzerindeki tasarruflarında en aslah olanı yapmak zorundadır.' },
    5:  { tag: 'Sahne 05 · Hz. Ömer Formülü', title: 'Yetim Velisi: Üç Halin Hükmü',
          text: 'Zorunluluk → ihtiyaç kadar al. Telafi → bittikten sonra iade et. İstiğnâ → müstağniyken hiç dokunma. Ebeveyn, ham sahibi değil, menfaat gözeten bir emanetçidir.' },
    6:  { tag: 'Sahne 06 · İcâre Algoritması',title: 'Çocuğu Çalıştırmak Ne Zaman Caiz?',
          text: 'Eylem çocuğa bir mâl getiriyor mu? Te\'dib ve eğitim katkısı var mı? Ahlâk öğreniyor mu, sadece pozlama mı? Cevap zinciri caiz/geçersiz arasındaki çizgiyi belirler.' },
    7:  { tag: 'Sahne 07 · Kabz vs Tasarruf', title: 'Ücret Çocuğun Malıdır',
          text: 'Ebeveyn ücreti tahsil edebilir (kabz). Ama kendi lüksüne, tatiline veya yaşam standardını yükseltmek için harcayamaz (tasarruf). Aksi halde ecr-i misli zedelenir.' },
    8:  { tag: 'Sahne 08 · Setr Kaidesi',     title: 'Asla Paylaşılamayacaklar Çizgisi',
          text: 'Banyo ve tuvalet rutinleri, duygusal çöküntü ve ağlama, hastalık anları, üstsüzlük… "Organik aile içeriği" maskesiyle bile sunulsa, fıkhî maslahat dairesine giremez.' },
    9:  { tag: 'Sahne 09 · Rıza Yanılsaması', title: '"Çocuk Kendisi İstiyor!" Argümanı',
          text: 'Kâsânî\'ye göre küçüğün rızası fıkhen bağlayıcı bir irade değildir. Sevgi için kameraya verilen "rıza" görüntüsü, haksız kazanç döngüsünü aklamaz.' },
    10: { tag: 'Sahne 10 · Kabîh Hükmü',      title: 'Ebû Hanîfe: Yetişkinin Zedelenen Haysiyeti',
          text: '"Eğer o tefakkuh edip kadılıkla görevlendirilirse, babasının yaptığı icâre sebebiyle onu insanlara hizmet eder hâlde bırakacak mıyım? Bu kabîhtir."' },
    11: { tag: 'Sahne 11 · İleriye Dönük',    title: 'Ne Zaman Caiz Olabilir? Beş Şart',
          text: 'Fona aktarım, mahremiyet kalkanı, te\'dib ve pedagoji, gelecek iradesi taahhüdü, ahlâkî niyet — beşi birden sağlandığında çerçeve meşrulaşır.' },
  };

  function setActive(scene) {
    frames.forEach(f => f.classList.toggle('active', +f.dataset.scene === scene));
    if (chapter) {
      chapter.textContent = `${String(scene).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
    if (progress) {
      const pct = ((scene - 1) / (total - 1)) * 100;
      progress.style.width = pct + '%';
    }
    if (caption && scenes[scene]) {
      caption.classList.add('fading');
      setTimeout(() => {
        const tagEl   = caption.querySelector('.cinema-caption-tag');
        const titleEl = caption.querySelector('.cinema-caption-title');
        const textEl  = caption.querySelector('.cinema-caption-text');
        if (tagEl)   tagEl.textContent   = scenes[scene].tag;
        if (titleEl) titleEl.textContent = scenes[scene].title;
        if (textEl)  textEl.textContent  = scenes[scene].text;
        caption.classList.remove('fading');
      }, 180);
    }
    if (stageEl) stageEl.dataset.sceneActive = 'true';
  }

  // İlk sahne ile başlat
  setActive(1);

  // Mobilde (sticky devre dışı), observer'ı atla
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return;

  // Sentinellerin viewport'a ortasından geçişine göre aktif sahneyi belirle
  const observer = new IntersectionObserver(
    entries => {
      // En çok kesişen ve görünür olan sentineli seç
      let best = null;
      let bestRatio = 0;
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > bestRatio) {
          best = e.target;
          bestRatio = e.intersectionRatio;
        }
      });
      if (best) {
        const scene = +best.dataset.scene;
        if (scene && scenes[scene]) setActive(scene);
      }
    },
    {
      // Sentinel viewport'un orta %20'siyle kesiştiğinde tetiklensin
      rootMargin: '-40% 0px -40% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }
  );
  sentinels.forEach(s => observer.observe(s));
})();

/* ================================================
   YOUTUBE FACADE — privacy-first lazy embed
   Ziyaretçi tıklamadan YouTube'a hiçbir istek gitmez.
   Tıklandığında youtube-nocookie.com (gelişmiş gizlilik) yüklenir.
   ================================================ */
document.querySelectorAll('.yt-facade').forEach(facade => {
  const trigger = facade.querySelector('.yt-facade-trigger');
  if (!trigger) return;
  trigger.addEventListener('click', () => {
    const id    = facade.dataset.yt;
    const title = facade.dataset.title || 'YouTube video';
    if (!id) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    facade.classList.add('yt-loaded');
    facade.appendChild(iframe);
    // Erişilebilirlik: yeni iframe'e odak ver
    setTimeout(() => iframe.focus(), 100);
  }, { once: true });
});

/* ================================================
   YAŞA GÖRE REHBER — Accordion
   ================================================ */
document.querySelectorAll('.yas-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const isOpen  = btn.classList.contains('open');

    // Tümünü kapat
    document.querySelectorAll('.yas-btn').forEach(b => {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
      if (b.nextElementSibling) b.nextElementSibling.classList.remove('open');
    });

    // Kapalıysa aç
    if (!isOpen) {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      content.classList.add('open');
    }
  });
});

/* ================================================
   7 GÜNLÜK TAKİP LİSTESİ TEMİZLİĞİ — Faz 2 üçüncü araç
   localStorage ile durum saklanır (mahremiyet: çerez yok, sunucu yok)
   ================================================ */
(function initTemizlik() {
  const grid = document.getElementById('temizlikGrid');
  if (!grid) return;

  const STORAGE_KEY = 'mahrem-iz.temizlik-7gun.v1';
  const fillEl   = document.getElementById('temizlikProgressFill');
  const countEl  = document.getElementById('temizlikProgressCount');
  const barEl    = document.getElementById('temizlikProgressBar');
  const finaleEl = document.getElementById('temizlikFinale');
  const resetBtn = document.getElementById('temizlikReset');

  // Saved state yükle
  let state;
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { state = {}; }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* quota / private mode */ }
  }

  function refresh() {
    let done = 0;
    grid.querySelectorAll('.temizlik-card').forEach(card => {
      const day = card.dataset.day;
      const cb  = card.querySelector('.temizlik-check');
      const isDone = !!state[day];
      cb.checked = isDone;
      card.classList.toggle('done', isDone);
      if (isDone) done++;
    });
    const pct = Math.round((done / 7) * 100);
    fillEl.style.width = pct + '%';
    countEl.textContent = done;
    barEl.setAttribute('aria-valuenow', done);
    finaleEl.hidden = done < 7;
  }

  // Checkbox olayları
  grid.querySelectorAll('.temizlik-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const day = cb.closest('.temizlik-card').dataset.day;
      state[day] = cb.checked;
      persist();
      refresh();
    });
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    state = {};
    persist();
    refresh();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('7 gün sıfırlandı.');
  });

  refresh();
})();

/* ================================================
   PAYLAŞMADAN ÖNCE 10 SANİYE TESTİ — Faz 2 amiral aracı
   7 soru · 4 sonuç (yeşil/sarı/turuncu/kırmızı) · kırmızı çizgi mantığı
   Skor: her "Evet" = 1 puan. Soru 3 veya 7 "Evet" → otomatik kırmızı.
   ================================================ */
(function initPaylasimTesti() {
  const list = document.getElementById('paylasimList');
  if (!list) return;

  const result        = document.getElementById('paylasimResult');
  const traffic       = document.getElementById('paylasimTraffic');
  const verdictEl     = document.getElementById('paylasimVerdict');
  const actionEl      = document.getElementById('paylasimAction');
  const redlineEl     = document.getElementById('paylasimRedline');
  const redlineReason = document.getElementById('paylasimRedlineReason');
  const resetBtn      = document.getElementById('paylasimReset');

  const answers = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null };

  const verdicts = {
    green:  { label: 'YEŞİL · Paylaşabilirsiniz',
              text:  'Bu paylaşım <strong>düşük risk</strong> taşıyor. Yine de konum ve günlük rutin bilgisi içermediğinden emin olun; yüksek görünürlük gerektiren paylaşımları ailecek değerlendirin.' },
    yellow: { label: 'SARI · Düzenleyerek paylaşın',
              text:  'Bu paylaşımı <strong>düzenleyerek</strong> paylaşmayı düşünün: yüzü emoji veya bulanıklaştırarak kapatın, konum bilgisini çıkarın, ya da yalnızca özel ve sınırlı çevreye paylaşın.' },
    orange: { label: 'TURUNCU · Şimdilik ertelenmeli',
              text:  'Bu paylaşımı <strong>en az 24 saat erteleyin</strong>, sonra bağlamı yeniden değerlendirin. Çocuğunuzun yaşı uygunsa rızasını sorun; yararı zarara baskın geliyor mu birlikte düşünün.' },
    red:    { label: 'KIRMIZI · Paylaşılmamalı',
              text:  'Bu içerik <strong>yüksek risk</strong> taşıyor. Çocuğun mahremiyeti ve geleceği için kamuya açık paylaşmayın. Yalnızca güvendiğiniz aile sohbetinde (kapalı, sınırlı grup) paylaşmayı düşünebilirsiniz.' }
  };

  const redlineMessages = {
    3: 'Soru 3 — çocuğun mahrem hâli (ağlama, hastalık, korku, ceza, banyo, tuvalet) kamuya açık paylaşılmamalı.',
    7: 'Soru 7 — kendiniz rahatsızlık duyuyorsanız, içerik zaten hassas demektir.'
  };

  function compute() {
    const allAnswered = Object.values(answers).every(a => a !== null);
    if (!allAnswered) return null;

    const yesCount = Object.values(answers).filter(a => a === 'yes').length;
    const tripped = [];
    if (answers[3] === 'yes') tripped.push(3);
    if (answers[7] === 'yes') tripped.push(7);

    let level;
    if (tripped.length > 0 || yesCount >= 6) level = 'red';
    else if (yesCount >= 4) level = 'orange';
    else if (yesCount >= 2) level = 'yellow';
    else level = 'green';

    return { level, tripped };
  }

  function render() {
    const r = compute();
    if (!r) { result.hidden = true; return; }

    const v = verdicts[r.level];
    result.hidden = false;
    traffic.className = 'paylasim-traffic ' + r.level;
    verdictEl.textContent = v.label;
    actionEl.innerHTML = v.text;

    if (r.tripped.length > 0) {
      redlineReason.textContent = r.tripped.map(q => redlineMessages[q]).join(' ');
      redlineEl.hidden = false;
    } else {
      redlineEl.hidden = true;
    }

    // Sonuç ilk göründüğünde sayfayı paneline kaydır
    if (!result.dataset.shown) {
      result.dataset.shown = '1';
      setTimeout(() => result.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
    }
  }

  list.querySelectorAll('.yn-input').forEach(input => {
    input.addEventListener('change', e => {
      const q = e.target.name.replace('paylasim-', '');
      answers[q] = e.target.value;

      const li = e.target.closest('.paylasim-q');
      li.classList.add('answered');
      li.classList.toggle('answered-yes', e.target.value === 'yes');
      li.classList.toggle('answered-no',  e.target.value === 'no');

      render();
    });
  });

  resetBtn.addEventListener('click', () => {
    Object.keys(answers).forEach(k => answers[k] = null);
    list.querySelectorAll('.yn-input').forEach(i => i.checked = false);
    list.querySelectorAll('.paylasim-q').forEach(li => {
      li.classList.remove('answered', 'answered-yes', 'answered-no');
    });
    result.hidden = true;
    delete result.dataset.shown;
    list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
