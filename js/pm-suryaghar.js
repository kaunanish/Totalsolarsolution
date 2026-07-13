// ===================== PM Surya Ghar explainer + lead form =====================

// Supabase project used to store PM Surya Ghar leads. This uses the public
// "anon" key, which is safe to expose in client-side code: the leads table
// has Row Level Security enabled with an INSERT-only policy for anon, so
// this key can add new leads but cannot read, edit, or delete existing ones.
const SUPABASE_URL = 'https://fwjswlyzxzmhoauvdiyl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_B318rr033zAxOQ5KQkX9Dw_DbWm5L8e';

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Phase-cycling animation ---- */
  const anim = document.getElementById('schemeAnim');
  const phaseTag = document.getElementById('schemePhaseTag');
  const titleEl = document.getElementById('schemeTitle');
  const descEl = document.getElementById('schemeDesc');
  const dotsWrap = document.getElementById('schemeDots');
  const prevBtn = document.getElementById('schemePrev');
  const nextBtn = document.getElementById('schemeNext');

  const phases = [
    {
      tag: 'Step 1 of 4',
      title: 'Solar Powers Your Home',
      desc: 'On a sunny day, your rooftop panels generate power that flows straight through the inverter to your appliances — free electricity while the sun is out.'
    },
    {
      tag: 'Step 2 of 4',
      title: 'Extra Power? It Credits Your Bill',
      desc: 'When your panels make more than your home needs, the surplus is exported to the grid. Your net meter tracks it and credits it against your bill — that’s "net metering."'
    },
    {
      tag: 'Step 3 of 4',
      title: 'High Demand? The Grid Tops You Up',
      desc: 'If your home ever needs more power than the panels are producing at that moment, the grid instantly fills the gap alongside your solar — no interruption, no manual switching.'
    },
    {
      tag: 'Step 4 of 4',
      title: 'At Night, the Grid Takes Over',
      desc: 'After sunset your panels stop generating, so the grid powers your home as usual — but thanks to the credits you earned during the day, your net bill stays low.'
    }
  ];

  if (anim && phaseTag && titleEl && descEl && dotsWrap) {
    let current = 0;
    let timer;

    phases.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToPhase(i));
      dotsWrap.appendChild(dot);
    });

    function render() {
      const p = phases[current];
      anim.setAttribute('data-phase', current + 1);
      phaseTag.textContent = p.tag;
      titleEl.textContent = p.title;
      descEl.textContent = p.desc;
      Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === current));
    }
    function goToPhase(i) {
      current = (i + phases.length) % phases.length;
      render();
      resetTimer();
    }
    function nextPhase() { goToPhase(current + 1); }
    function prevPhase() { goToPhase(current - 1); }
    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(nextPhase, 5000);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextPhase);
    if (prevBtn) prevBtn.addEventListener('click', prevPhase);
    render();
    resetTimer();
  }

  /* ---- Lead form -> WhatsApp (+ background email backup) ---- */
  const leadForm = document.getElementById('leadFormEl');
  const leadFormStatus = document.getElementById('leadFormStatus');
  const WHATSAPP_NUMBER = '917855939461'; // TSS business WhatsApp number

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(leadForm);
      const name = (data.get('Name') || '').toString().trim();
      const phone = (data.get('Phone') || '').toString().trim();
      const district = (data.get('District') || '').toString().trim();
      const occupation = (data.get('Occupation') || '').toString().trim();
      const income = (data.get('Monthly Income') || '').toString().trim();
      const ownsHouse = (data.get('Owns House') || '').toString().trim();
      const billInName = (data.get('Electricity Bill In Name') || '').toString().trim();

      const lines = [
        'New PM Surya Ghar Lead - TSS Website',
        '',
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Sub-division: ${district}`,
        `Occupation: ${occupation}`,
        `Monthly Income: ${income}`,
        `Owns House: ${ownsHouse}`,
        `Electricity Bill In Name: ${billInName}`
      ];

      const waText = encodeURIComponent(lines.join('\n'));
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

      // Primary data store: insert the lead straight into Supabase so it can
      // be pulled via API. Fire-and-forget — we don't block the WhatsApp
      // handoff on this, but we do log failures to the console for debugging.
      try {
        fetch(`${SUPABASE_URL}/rest/v1/pm_suryaghar_leads`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name: name,
            phone: phone,
            district: district,
            occupation: occupation,
            monthly_income: income,
            owns_house: ownsHouse === 'Yes',
            electricity_bill_in_name: billInName === 'Yes'
          })
        }).catch(err => console.error('Supabase lead insert failed:', err));
      } catch (err) { console.error('Supabase lead insert failed:', err); }

      // Best-effort background copy to email too (same pattern as the main
      // enquiry form) — an extra backup alongside the Supabase row.
      try {
        fetch(leadForm.action, { method: 'POST', body: data, mode: 'no-cors' });
      } catch (err) { /* ignore - WhatsApp is the primary channel */ }

      window.open(waUrl, '_blank');

      if (leadFormStatus) {
        leadFormStatus.textContent = 'Opening WhatsApp — just hit Send to request your free site visit!';
        leadFormStatus.classList.add('show');
      }
      leadForm.reset();
    });
  }

});
