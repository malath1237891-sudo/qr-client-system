
const sampleData = {
  patientId: 'P1001',
  basic: { fullName:'Sara Abdullah', nationalId:'9988776655', mrn:'MRN-558201', dob:'1993-05-14', gender:'Female', phone:'+966500000000', address:'Riyadh' },
  visits: {
    '11/1/2025': { date:'11/1/2025', department:'Emergency', doctor:'Dr. Ahmed Ali', diagnosis:'Headache', notes:'Arrived with moderate symptoms.' },
    '3/12/2024': { date:'3/12/2024', department:'Internal Medicine', doctor:'Dr. Laila Hassan', diagnosis:'Hypertension', notes:'BP controlled.' }
  },
  labs: {
    'CBC': { testDate:'11/1/2025', status:'Completed', result:'Normal', tech:'Sarah M.' },
    'Blood Sugar': { testDate:'3/12/2024', status:'Completed', result:'High', tech:'Alaa K.' }
  },
  radiology: {
    'CT Scan': { date:'11/1/2025', report:'No acute findings.', tech:'Mohammed J.', file:'CT_11-1-2025.pdf' },
    'X-Ray': { date:'2/2/2024', report:'Fracture healed.', tech:'Fahad S.', file:'XR_2-2-2024.pdf' }
  }
};

const sections = document.getElementById('sections');
const panel = document.getElementById('rightpanel');
const pidBox = document.getElementById('patientIdBox');

const urlParams = new URLSearchParams(window.location.search);
const pid = urlParams.get('pid') || sampleData.patientId;
pidBox.textContent = 'Patient: ' + pid;

function clearActive(){
  sections.querySelectorAll('li').forEach(li=>li.classList.remove('active'));
}
sections.addEventListener('click', (e)=>{
  const li = e.target.closest('li');
  if(!li) return;
  const s = li.dataset.s;
  clearActive();
  li.classList.add('active');
  renderSection(s);
});

renderSection('basic');

function renderSection(s){
  panel.innerHTML='';
  if(s==='basic') panel.appendChild(renderBasic());
  if(s==='medical') panel.appendChild(renderMedical());
  if(s==='visits') panel.appendChild(renderVisits());
  if(s==='labs') panel.appendChild(renderLabs());
  if(s==='radio') panel.appendChild(renderRadiology());
  if(s==='meds') panel.appendChild(renderMeds());
  if(s==='appts') panel.appendChild(renderAppts());
  if(s==='files') panel.appendChild(renderFiles());
  if(s==='notes') panel.appendChild(renderNotes());
  if(s==='actions') panel.appendChild(renderActions());
}

function el(html){ const d=document.createElement('div'); d.innerHTML=html; return d.firstElementChild; }

function renderBasic(){
  const wrap = document.createElement('div');
  wrap.appendChild(el('<h3>Patient Information</h3>'));
  const keys = [
    ['Full Name','fullName'],['National ID','nationalId'],['MRN','mrn'],
    ['Date of Birth','dob'],['Gender','gender'],['Phone','phone'],['Address','address']
  ];
  keys.forEach(k=>{
    const row = document.createElement('div'); row.className='form-row';
    const f = document.createElement('div'); f.className='field';
    const label = document.createElement('label'); label.textContent=k[0];
    const input = document.createElement('input'); input.type='text'; input.value = sampleData.basic[k[1]] || '';
    f.appendChild(label); f.appendChild(input); row.appendChild(f); wrap.appendChild(row);
  });
  const actions = document.createElement('div'); actions.className='actions'; actions.innerHTML = '<button class="btn" onclick="alert(\\'Saved (demo)\\')">Save</button>';
  wrap.appendChild(actions);
  return wrap;
}

function renderMedical(){
  const wrap = document.createElement('div');
  wrap.appendChild(el('<h3>Medical Information</h3>'));
  const arr = ['Height (cm)','Weight (kg)','Blood Type','Chronic Diseases','Allergies','Previous Surgeries'];
  arr.forEach(a=>{
    const row=document.createElement('div'); row.className='form-row'; const f=document.createElement('div'); f.className='field';
    const label=document.createElement('label'); label.textContent=a; const input=document.createElement('input'); input.type='text'; f.appendChild(label); f.appendChild(input); row.appendChild(f); wrap.appendChild(row);
  });
  wrap.appendChild(el('<div class="actions"><button class="btn" onclick="alert(\\'Saved (demo)\\')">Save</button></div>'));
  return wrap;
}

function renderVisits(){
  const wrap=document.createElement('div'); wrap.appendChild(el('<h3>Visits</h3>'));
  const sel = document.createElement('select'); sel.id='visitSelect'; sel.innerHTML='<option value=\"\">-- Select Visit Date --</option>';
  Object.keys(sampleData.visits).forEach(k=>{ sel.innerHTML += `<option value="${k}">${k}</option>`; });
  const row = document.createElement('div'); row.className='form-row'; const f=document.createElement('div'); f.className='field'; const label=document.createElement('label'); label.textContent='Visit Date'; f.appendChild(label); f.appendChild(sel); row.appendChild(f); wrap.appendChild(row);

  const fields = ['Department','Doctor Name','Diagnosis','Notes'];
  fields.forEach(name=>{
    const r=document.createElement('div'); r.className='form-row'; const ff=document.createElement('div'); ff.className='field'; const l=document.createElement('label'); l.textContent=name; const inp=document.createElement('input'); inp.type='text'; inp.id='vis_'+name.replace(/\s+/g,''); ff.appendChild(l); ff.appendChild(inp); r.appendChild(ff); wrap.appendChild(r);
  });

  sel.addEventListener('change', ()=>{
    const v = sampleData.visits[sel.value];
    if(v){
      document.getElementById('vis_Department').value = v.department;
      document.getElementById('vis_DoctorName').value = v.doctor;
      document.getElementById('vis_Diagnosis').value = v.diagnosis;
      document.getElementById('vis_Notes').value = v.notes;
    } else {
      ['Department','DoctorName','Diagnosis','Notes'].forEach(x=>{ document.getElementById('vis_'+x).value=''; });
    }
  });
  wrap.appendChild(el('<div class="actions"><button class="btn" onclick="alert(\\'Saved (demo)\\')">Save Visit</button></div>'));
  return wrap;
}

function renderLabs(){
  const wrap=document.createElement('div'); wrap.appendChild(el('<h3>Laboratory Tests</h3>'));
  const sel=document.createElement('select'); sel.id='labSelect'; sel.innerHTML='<option value=\"\">-- Select Test --</option>';
  Object.keys(sampleData.labs).forEach(k=> sel.innerHTML += `<option value="${k}">${k}</option>`);
  const row=document.createElement('div'); row.className='form-row'; const f=document.createElement('div'); f.className='field'; const label=document.createElement('label'); label.textContent='Test Name'; f.appendChild(label); f.appendChild(sel); row.appendChild(f); wrap.appendChild(row);

  const fields = [{id:'lab_TestDate',label:'Test Date'},{id:'lab_Status',label:'Status'},{id:'lab_Result',label:'Result'},{id:'lab_Tech',label:'Lab Technician'}];
  fields.forEach(fld=>{
    const r=document.createElement('div'); r.className='form-row'; const ff=document.createElement('div'); ff.className='field'; const l=document.createElement('label'); l.textContent=fld.label; const inp=document.createElement('input'); inp.type='text'; inp.id=fld.id; ff.appendChild(l); ff.appendChild(inp); r.appendChild(ff); wrap.appendChild(r);
  });

  sel.addEventListener('change', ()=>{
    const v = sampleData.labs[sel.value];
    if(v){
      document.getElementById('lab_TestDate').value=v.testDate;
      document.getElementById('lab_Status').value=v.status;
      document.getElementById('lab_Result').value=v.result;
      document.getElementById('lab_Tech').value=v.tech;
    } else { ['lab_TestDate','lab_Status','lab_Result','lab_Tech'].forEach(id=>document.getElementById(id).value=''); }
  });
  wrap.appendChild(el('<div class="actions"><button class="btn" onclick="alert(\\'Saved (demo)\\')">Save</button></div>'));
  return wrap;
}

function renderRadiology(){
  const wrap=document.createElement('div'); wrap.appendChild(el('<h3>Radiology</h3>'));
  const sel=document.createElement('select'); sel.id='radSelect'; sel.innerHTML='<option value=\"\">-- Select Imaging --</option>';
  Object.keys(sampleData.radiology).forEach(k=> sel.innerHTML += `<option value="${k}">${k}</option>`);
  const row=document.createElement('div'); row.className='form-row'; const f=document.createElement('div'); f.className='field'; const label=document.createElement('label'); label.textContent='Imaging Type'; f.appendChild(label); f.appendChild(sel); row.appendChild(f); wrap.appendChild(row);

  const fields=[{id:'rad_Date',label:'Date'},{id:'rad_Report',label:'Report'},{id:'rad_Tech',label:'Technician'},{id:'rad_File',label:'Attachment'}];
  fields.forEach(fld=>{ const r=document.createElement('div'); r.className='form-row'; const ff=document.createElement('div'); ff.className='field'; const l=document.createElement('label'); l.textContent=fld.label; const inp=document.createElement('input'); inp.type='text'; inp.id=fld.id; ff.appendChild(l); ff.appendChild(inp); r.appendChild(ff); wrap.appendChild(r); });

  sel.addEventListener('change', ()=>{
    const v = sampleData.radiology[sel.value];
    if(v){ document.getElementById('rad_Date').value=v.date; document.getElementById('rad_Report').value=v.report; document.getElementById('rad_Tech').value=v.tech; document.getElementById('rad_File').value=v.file; }
    else { ['rad_Date','rad_Report','rad_Tech','rad_File'].forEach(id=>document.getElementById(id).value=''); }
  });
  wrap.appendChild(el('<div class="actions"><button class="btn" onclick="alert(\\'Saved (demo)\\')">Save</button></div>'));
  return wrap;
}

function renderMeds(){ const wrap=document.createElement('div'); wrap.appendChild(el('<h3>Medications</h3>')); ['Medication Name','Dosage','Duration','Doctor'].forEach(n=>{ const r=document.createElement('div'); r.className='form-row'; const f=document.createElement('div'); f.className='field'; const l=document.createElement('label'); l.textContent=n; const inp=document.createElement('input'); inp.type='text'; f.appendChild(l); f.appendChild(inp); r.appendChild(f); wrap.appendChild(r); }); wrap.appendChild(el('<div class="actions"><button class="btn" onclick="alert(\\'Saved\\')">Save</button></div>')); return wrap; }
function renderAppts(){ const wrap=document.createElement('div'); wrap.appendChild(el('<h3>Appointments</h3>')); ['Appointment Date','Department','Doctor','Status'].forEach(n=>{ const r=document.createElement('div'); r.className='form-row'; const f=document.createElement('div'); f.className='field'; const l=document.createElement('label'); l.textContent=n; const inp=document.createElement('input'); inp.type='text'; f.appendChild(l); f.appendChild(inp); r.appendChild(f); wrap.appendChild(r); }); wrap.appendChild(el('<div class="actions"><button class="btn" onclick="alert(\\'Saved\\')">Save</button></div>')); return wrap; }
function renderFiles(){ const wrap=document.createElement('div'); wrap.appendChild(el('<h3>Attachments</h3>')); const r=document.createElement('div'); r.className='form-row'; const f=document.createElement('div'); f.className='field'; const l=document.createElement('label'); l.textContent='Upload Files'; const inp=document.createElement('input'); inp.type='file'; inp.multiple=true; f.appendChild(l); f.appendChild(inp); r.appendChild(f); wrap.appendChild(r); return wrap; }
function renderNotes(){ const wrap=document.createElement('div'); wrap.appendChild(el('<h3>Notes</h3>')); const r=document.createElement('div'); r.className='form-row'; const f=document.createElement('div'); f.className='field'; const l=document.createElement('label'); l.textContent='Doctor / Nurse Notes'; const ta=document.createElement('textarea'); f.appendChild(l); f.appendChild(ta); r.appendChild(f); wrap.appendChild(r); wrap.appendChild(el('<div class="actions"><button class="btn" onclick="alert(\\'Saved\\')">Save Note</button></div>')); return wrap; }
function renderActions(){ const wrap=document.createElement('div'); wrap.appendChild(el('<h3>Record Actions</h3>')); wrap.appendChild(el('<div class="small-note">Actions available: Edit Patient, Add Visit, Delete Visit, Print.</div>')); wrap.appendChild(el('<div class="actions"><button class="btn">Edit Patient</button><button class="btn" style="margin-left:8px">Add Visit</button></div>')); return wrap; }
