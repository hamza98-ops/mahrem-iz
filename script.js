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

function updateKarneScore() {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const max   = 35;
  const pct   = Math.round((total / max) * 100);

  document.getElementById('scoreValue').textContent = total;
  document.getElementById('resultFill').style.width = pct + '%';
  const bar = document.getElementById('resultBar');
  if (bar) bar.setAttribute('aria-valuenow', total);

  // Trafik ışığı
  const traffic = document.getElementById('resultTraffic');
  if (total === 0) {
    traffic.className = 'result-traffic';
  } else if (pct >= 80) {
    traffic.className = 'result-traffic green';
  } else if (pct >= 55) {
    traffic.className = 'result-traffic yellow';
  } else {
    traffic.className = 'result-traffic red';
  }

  // Metin + aksiyon önerisi
  let text = '';
  if (total === 0) {
    text = 'Kriterleri değerlendirin, sonuç burada görünecek.';
  } else if (pct >= 80) {
    text = '✓ Yeşil — Bu hesap mahremiyete büyük ölçüde saygı gösteriyor. Değerlerinizle örtüşüyorsa bilinçli olarak takip edebilirsiniz.';
  } else if (pct >= 55) {
    text = '⚠ Sarı — Orta düzey uyum. Takip ederken eleştirel bakış açısını koruyun; reklamları ve çocuk içeriklerini yakından izleyin.';
  } else if (pct >= 30) {
    text = '⚠ Turuncu — Bu hesap birçok etik kriterde eksik kalıyor. Takip etmeyi sınırlandırmayı ya da bildirimleri kapatmayı düşünün.';
  } else {
    text = '✗ Kırmızı — Bu hesap mahremiyet ve aile etiği açısından ciddi endişeler barındırıyor. Takipten çıkmanızı öneririz.';
  }
  document.getElementById('resultText').textContent = text;

  // Kopyala butonunu göster
  const copyBtn = document.getElementById('copyKarne');
  if (copyBtn) copyBtn.style.display = total > 0 ? 'inline-block' : 'none';
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
  const copyBtn = document.getElementById('copyKarne');
  if (copyBtn) copyBtn.style.display = 'none';
  const bar = document.getElementById('resultBar');
  if (bar) bar.setAttribute('aria-valuenow', 0);
});

/* --- Sonucu Kopyala --- */
document.getElementById('copyKarne').addEventListener('click', async () => {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const text  = `Mahrem-İz Etik Karne\n${total}/35 puan\n${document.getElementById('resultText').textContent}\n\nmahremiz.com.tr`;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Sonuç panoya kopyalandı!');
  } catch {
    showToast('Kopyalama desteklenmiyor, lütfen manuel kopyalayın.');
  }
});

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
   İLETİŞİM FORMU — Honeypot + KVKK + Geri bildirim
   ================================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    // Honeypot kontrolü
    const honeypot = contactForm.querySelector('.honeypot');
    if (honeypot && honeypot.value) return; // Bot tespiti, sessizce durdur

    // KVKK kontrolü
    const kvkk = document.getElementById('kvkk');
    if (kvkk && !kvkk.checked) {
      showToast('Lütfen KVKK onayını verin.');
      kvkk.focus();
      return;
    }

    const btn          = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent    = 'Gönderildi ✓';
    btn.style.background = 'var(--green)';
    btn.disabled       = true;

    setTimeout(() => {
      btn.textContent      = originalText;
      btn.style.background = '';
      btn.disabled         = false;
      contactForm.reset();
      showToast('Mesajınız iletildi, teşekkürler!');
    }, 3000);
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
