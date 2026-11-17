// Shared interactions for the product pages: header, reveal, 3D tilt, lightbox, demo form.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // header shadow
  var header = document.querySelector('header');
  var onScroll = function () { header.classList.toggle('solid', scrollY > 10); };
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // reveal on scroll + straighten perspective screenshots
  var targets = document.querySelectorAll('.card, .frow, .gallery figure, .trio figure, .code, .stat, .plan, .steps li, details, .sec-head, .contact, .persp, .phone-wrap');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    targets.forEach(function (el, i) {
      if (!el.classList.contains('persp') && !el.classList.contains('phone-wrap')) { el.classList.add('rv'); el.style.transitionDelay = (i % 3) * 80 + 'ms'; }
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  // hero stage: settles on load, then follows the mouse in 3D
  var stage = document.querySelector('.stage');
  if (stage) {
    setTimeout(function () { stage.classList.add('in'); }, 200);
    if (finePointer && !reduce) {
      var inner = stage.querySelector('.stage-inner');
      var hero = document.querySelector('.hero');
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform = 'rotateX(' + (6 - y * 8).toFixed(2) + 'deg) rotateY(' + (x * 12).toFixed(2) + 'deg)';
      });
      hero.addEventListener('mouseleave', function () { inner.style.transform = ''; });
    }
  }

  // 3D tilt for cards
  if (finePointer && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.dataset.tilt) || 8;
      var base = el.classList.contains('pop') ? ' translateY(-14px)' : '';
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = 'transform .08s, box-shadow .3s';
        el.style.transform = 'perspective(900px) rotateX(' + (-y * max).toFixed(2) + 'deg) rotateY(' + (x * max).toFixed(2) + 'deg)' + base;
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1), box-shadow .3s';
        el.style.transform = base ? base.trim() : '';
      });
    });
  }

  // lightbox
  var lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', 'Image preview');
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  document.querySelectorAll('.zoom img').forEach(function (img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () { lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add('open'); });
  });
  lb.addEventListener('click', function () { lb.classList.remove('open'); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });

  // demo form -> WhatsApp
  var form = document.getElementById('demo');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var parts = [];
      d.forEach(function (v) { if (String(v).trim()) parts.push(String(v).trim()); });
      var text = form.dataset.product + ' demo request: ' + parts.join(', ');
      form.querySelector('.status').textContent = 'Opening WhatsApp… press Send there to reach us.';
      location.href = 'https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(text);
    });
  }
})();
