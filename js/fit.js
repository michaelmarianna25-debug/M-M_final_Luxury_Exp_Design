/* Package finder (EL/EN). Revenue = rooms x occupied nights x ADR; compares with ADR +12%. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const form = $('#fitform'); if (!form) return;
  const UP = 1.12;                 // assumed ADR uplift (+12%)
  const T_GROWTH = 3500, T_PREMIUM = 5000, T_PARTNER = 6000;   // € difference thresholds (edit here)
  const TXT = {
    el: { l1: 'Τρέχων ετήσιος τζίρος δωματίων', l2: 'Με ADR +12%', l3: 'Διαφορά', l4: 'Το πακέτο που σας ταιριάζει',
      err: 'Συμπληρώστε θετικούς αριθμούς σε όλα τα πεδία (occupancy έως 366).',
      msg: 'Με αύξηση ADR 12%, ο ετήσιος τζίρος δωματίων σας θα μπορούσε να αυξηθεί ενδεικτικά κατά {d}. Χρησιμοποιήστε τη φόρμα επικοινωνίας για να συζητήσουμε τις λεπτομέρειες.',
      fine: 'Ενδεικτικός υπολογισμός: δωμάτια × διανυκτερεύσεις × ADR. Η τελική πρόταση διαμορφώνεται μετά από συζήτηση.', cta: 'Επικοινωνία' },
    en: { l1: 'Current annual room revenue', l2: 'With ADR +12%', l3: 'Difference', l4: 'The package that suits you best',
      err: 'Please enter positive numbers in all fields (occupancy up to 366).',
      msg: 'With a 12% ADR increase, your annual room revenue could grow by an indicative {d}. Please use the contact form so we can discuss the details.',
      fine: 'Indicative calculation: rooms × occupied nights × ADR. The final proposal is shaped after a conversation.', cta: 'Contact us' }
  };
  const L = () => (window.I18N && window.I18N.lang === 'en') ? 'en' : 'el';
  const eur = n => new Intl.NumberFormat(L() === 'en' ? 'en-GB' : 'el-GR', { maximumFractionDigits: 0 }).format(Math.round(n)) + '€';
  const pick = d => d >= T_PARTNER ? 'Annual Partnership' : d >= T_PREMIUM ? 'Premium' : d >= T_GROWTH ? 'Growth & Insights' : 'Standard';
  const label = p => p === 'Annual Partnership' ? '(Semi) Annual Partnership' : p;
  let last = null;
  const set = (id, v) => { $(id).textContent = v; };

  function render() {
    const t = TXT[L()];
    set('#r-l1', t.l1); set('#r-l2', t.l2); set('#r-l3', t.l3); set('#r-l4', t.l4); set('#r-fine', t.fine); set('#fit-cta', t.cta);
    if (!last) return;
    set('#r-base', eur(last.base)); set('#r-up', eur(last.up)); set('#r-diff', eur(last.diff));
    set('#r-pack', label(last.pack)); set('#r-msg', t.msg.replace('{d}', eur(last.diff)));
    if ($('#fit-err').textContent) set('#fit-err', t.err);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const rooms = parseFloat($('#f-rooms').value), occ = parseFloat($('#f-occ').value), adr = parseFloat($('#f-adr').value);
    const err = $('#fit-err'), res = $('#fit-result');
    if (!(rooms > 0) || !(occ > 0) || occ > 366 || !(adr > 0)) { err.textContent = TXT[L()].err; res.hidden = true; last = null; return; }
    err.textContent = '';
    const base = rooms * occ * adr, up = base * UP, diff = up - base;
    last = { base, up, diff, pack: pick(diff) };
    res.hidden = false; render();
  });

  /* pre-select the recommended package in the contact form */
  $('#fit-cta').addEventListener('click', () => {
    const sel = document.querySelector('#cform select[name="package"]');
    if (sel && last) sel.value = last.pack;
  });
  window.addEventListener('langchange', render);
  render();
})();
