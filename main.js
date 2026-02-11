/* Url # sil */
document.documentElement.classList.add("js");
document.querySelectorAll('a[data-scroll]').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('data-scroll');
        const target = document.getElementById(targetId);

        if (!target) return;

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // URL'deki #hash'i temizle
        history.replaceState(null, '', window.location.pathname);
    });
});

/* Logo tıklayınca sayfa yenile */
const logo = document.getElementById("logoReload");
if (logo) {
    logo.addEventListener("click", function (e) {
        e.preventDefault();

        if ("scrollRestoration" in history) history.scrollRestoration = "manual";
        window.scrollTo(0, 0);
        window.location.reload();
    });
}

/* SCROLL REVEAL (HIZLI) */
const revealEls = document.querySelectorAll(".reveal");

/* herkese gecikme yok */
revealEls.forEach((el) => {
    el.style.setProperty("--d", "0ms"); // ✅ tırnak şart
});

/* sadece skill kartlarına sırayla gelme ver */
document.querySelectorAll(".skill-item.reveal").forEach((el, i) => {
    el.style.setProperty("--d", `${i * 25}ms`);
});

const io = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
);

revealEls.forEach((el) => io.observe(el));

/* =========================
   FORMSPREE: teşekkür sayfasına gitmesin
   (sayfa yenilenmeden gönderim)
========================= */
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending...";
    }
    if (statusEl) statusEl.textContent = "";

    try {
      const formData = new FormData(form);

      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" } // ✅ bu önemli
      });

      const data = await res.json().catch(() => null);

      // ✅ asıl başarı kontrolü
      if (res.ok && data && data.ok) {
        form.reset();
        if (statusEl) statusEl.textContent = "Mesajın gönderildi. Teşekkürler!";
        if (statusEl) setTimeout(() => statusEl.textContent = "", 5000);
      } else {
        console.log("Formspree hata:", data);
        if (statusEl) statusEl.textContent = "Gönderilemedi. Tekrar deneyiniz.";
      }
    } catch (err) {
      console.log("Fetch hata:", err);
      if (statusEl) statusEl.textContent = "Bağlantı hatası. Tekrar deneyiniz.";
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Send Message";
      }
    }
  });
}
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  /* linke basınca menü kapansın */
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* dışarı tıklayınca kapansın */
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ekran büyüyünce menüyü resetle */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}