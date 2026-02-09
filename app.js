const tabs=document.querySelectorAll(".tab-btn")
const sections=document.querySelectorAll(".tab")
tabs.forEach(b=>b.addEventListener("click",()=>{sections.forEach(s=>s.classList.add("hidden"));document.getElementById(b.dataset.tab).classList.remove("hidden");tabs.forEach(t=>t.classList.remove("active"));b.classList.add("active")}))
const loginOverlay=document.getElementById("login-overlay")
const btnLoginPatient=document.getElementById("btn-login-patient")
const btnLoginDoctor=document.getElementById("btn-login-doctor")
function enterRole(role){
  if(loginOverlay)loginOverlay.classList.add("hidden")
  sections.forEach(s=>s.classList.add("hidden"))
  const target=role==="doctor"?"doctor":"patient"
  const el=document.getElementById(target)
  if(el)el.classList.remove("hidden")
  tabs.forEach(t=>{t.classList.remove("active"); if(t.dataset.tab===target)t.classList.add("active")})
  localStorage.setItem("role",role)
  const e=new Event("resize");window.dispatchEvent(e)
}
if(btnLoginPatient){btnLoginPatient.addEventListener("click",()=>enterRole("patient"))}
if(btnLoginDoctor){btnLoginDoctor.addEventListener("click",()=>enterRole("doctor"))}
function gotoSection(id){
  enterRole("patient")
  setTimeout(()=>{
    const el=document.getElementById(id)
    if(el)el.scrollIntoView({behavior:"smooth",block:"start"})
  },50)
}
const goTrends=document.getElementById("go-trends")
const goRisk=document.getElementById("go-risk")
const goExplain=document.getElementById("go-explain")
const goInterv=document.getElementById("go-interventions")
if(goTrends)goTrends.addEventListener("click",()=>gotoSection("patient-trends"))
if(goRisk)goRisk.addEventListener("click",()=>gotoSection("patient-risk"))
if(goExplain)goExplain.addEventListener("click",()=>gotoSection("patient-explain"))
if(goInterv)goInterv.addEventListener("click",()=>gotoSection("patient-interventions"))
const btnTheme=document.getElementById("btn-theme")
function setTheme(d){const html=document.documentElement;d?html.classList.add("dark"):html.classList.remove("dark");localStorage.setItem("darkMode",d?"1":"0");drawTrends()}
if(btnTheme){btnTheme.addEventListener("click",()=>{const isDark=document.documentElement.classList.contains("dark");setTheme(!isDark)})}
;(function(){const pref=localStorage.getItem("darkMode");if(pref==="1")setTheme(true)})()
function seedRandom(seed){let t=seed;return function(){t=(t*9301+49297)%233280;return t/233280}}
const rng=seedRandom(42)
function pick(arr){return arr[Math.floor(rng()*arr.length)]}
function genPatients(n){
  const first=["Maria","Asha","Ravi","Kiran","Neha","Arun","Fatima","John","Meera","Sanjay","Priya","Vivek","Leena","Aman","Geeta"]
  const last=["Iyer","Patel","Khan","Singh","Verma","Das","Roy","Fernandes","Chopra","Nair","Sharma","Gupta"]
  const cond=["Hypertension","Diabetes","Asthma","Thyroid"]
  const meds={"Hypertension":"BP Medicine","Diabetes":"Diabetes Medicine","Asthma":"Asthma Inhaler","Thyroid":"Thyroid Medicine"}
  const arr=[]
  for(let i=0;i<n;i++){
    const c=pick(cond)
    const age=Math.floor(rng()*60)+25
    arr.push({id:i+1,name:`${pick(first)} ${pick(last)}`,age,condition:c,medication:meds[c],signals:[]})
  }
  return arr
}
let patients=genPatients(10000)
const riskIndicator=document.getElementById("risk-indicator")
const timeImpact=document.getElementById("time-impact")
const explainLang=document.getElementById("explain-lang")
const explainInput=document.getElementById("explain-med")
const explainOutput=document.getElementById("explain-output")
const actionLog=document.getElementById("action-log")
const riskStatus=document.getElementById("risk-status")
const riskUpdated=document.getElementById("risk-updated")
const explainConfidence=document.getElementById("explain-confidence")
const explainUpdated=document.getElementById("explain-updated")
const explainTip=document.getElementById("explain-tip")
function stamp(){return new Date().toLocaleString()}
const trendsCanvas=document.getElementById("trends-chart")
const trendsTip=document.getElementById("trends-tooltip")
function genWeeklyVitals(){
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
  const baseSys=120,baseDia=78,baseGlu=95,basePeak=95
  return days.map((d,i)=>({
    day:d,
    sys:Math.round(baseSys+rng()*12-6-i*0.8),
    dia:Math.round(baseDia+rng()*8-4-i*0.3),
    glu:Math.round(baseGlu+rng()*18-9+i*0.6),
    peak:Math.round(basePeak+rng()*10-5-i*0.4)
  }))
}
let weeklyVitals=genWeeklyVitals()
function cssVar(name){return getComputedStyle(document.documentElement).getPropertyValue(name).trim()}
function drawTrends(){
  if(!trendsCanvas)return
  const dpr=window.devicePixelRatio||1
  const W=trendsCanvas.clientWidth
  const H=220
  trendsCanvas.width=W*dpr
  trendsCanvas.height=H*dpr
  const ctx=trendsCanvas.getContext("2d")
  ctx.scale(dpr,dpr)
  ctx.clearRect(0,0,W,H)
  const padding={l:40,r:20,t:20,b:28}
  const x0=padding.l,y0=padding.t,x1=W-padding.r,y1=H-padding.b
  const days=weeklyVitals.map(v=>v.day)
  const values=[...weeklyVitals.map(v=>v.sys),...weeklyVitals.map(v=>v.dia),...weeklyVitals.map(v=>v.glu)]
  const min=Math.min(...values,50)
  const max=Math.max(...values,160)
  for(let i=0;i<=4;i++){
    const y=y0+(y1-y0)*(i/4)
    ctx.strokeStyle=cssVar("--border")||"#E5E7EB"
    ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke()
  }
  const step=(x1-x0)/(days.length-1)
  function yScale(v){return y1-(v-min)/(max-min)*(y1-y0)}
  function xAt(i){return x0+step*i}
  function drawSeries(color,arr){
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath()
    arr.forEach((v,i)=>{const x=xAt(i),y=yScale(v);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)})
    ctx.stroke()
    const grad=ctx.createLinearGradient(0,y0,0,y1)
    grad.addColorStop(0,`${color}55`)
    grad.addColorStop(1,`${color}10`)
    ctx.fillStyle=grad
    ctx.beginPath()
    arr.forEach((v,i)=>{const x=xAt(i),y=yScale(v);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)})
    ctx.lineTo(xAt(arr.length-1),y1);ctx.lineTo(xAt(0),y1);ctx.closePath();ctx.fill()
    arr.forEach((v,i)=>{const x=xAt(i),y=yScale(v);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill()})
  }
  const cSys=cssVar("--col-sys")||"#22C55E"
  const cDia=cssVar("--col-dia")||"#EF4444"
  const cGlu=cssVar("--col-glu")||"#F59E0B"
  const cPeak=cssVar("--col-peak")||"#2563EB"
  drawSeries(cSys,weeklyVitals.map(v=>v.sys))
  drawSeries(cDia,weeklyVitals.map(v=>v.dia))
  drawSeries(cGlu,weeklyVitals.map(v=>v.glu))
  drawSeries(cPeak,weeklyVitals.map(v=>v.peak))
  ctx.fillStyle=cssVar("--muted")||"#475569";ctx.font="12px Inter, system-ui";ctx.textAlign="center"
  days.forEach((d,i)=>{ctx.fillText(d,xAt(i),H-10)})
}
function trendsHover(e){
  if(!trendsCanvas||!trendsTip)return
  const rect=trendsCanvas.getBoundingClientRect()
  const x=e.clientX-rect.left
  const W=trendsCanvas.clientWidth
  const x0=40
  const x1=W-20
  const step=(x1-x0)/(weeklyVitals.length-1)
  const idx=Math.max(0,Math.min(weeklyVitals.length-1,Math.round((x-x0)/step)))
  const v=weeklyVitals[idx]
  trendsTip.classList.remove("hidden")
  trendsTip.textContent=`${v.day} • Systolic: ${v.sys} • Diastolic: ${v.dia} • Glucose: ${v.glu} • Peak Flow: ${v.peak}`
}
if(trendsCanvas){
  drawTrends()
  trendsCanvas.addEventListener("mousemove",trendsHover)
  window.addEventListener("resize",drawTrends)
}
function recordAction(s){const t=new Date().toLocaleTimeString();actionLog.textContent=`${t}: ${s}`}
document.getElementById("btn-tele").addEventListener("click",()=>recordAction("Teleconsult slot reserved for next 24h"))
document.getElementById("btn-caregiver").addEventListener("click",()=>recordAction("Caregiver notified with risk and steps"))
document.getElementById("btn-steps").addEventListener("click",()=>recordAction("Suggested hydration, home BP check, breathing exercises"))
let currentMed=null
let currentRisk="LOW"
function signalEvent(type,med,days){
  const evalRes=evaluateRisk(med,days)
  setRisk(evalRes.category)
  timeImpact.textContent=`Estimated time-to-impact: ${evalRes.tti}`
  const text=generateExplanation(med,evalRes.category,evalRes.tti,explainLang.value)
  explainOutput.textContent=text
  currentMed=med
  captureLastStop(days)
  updateInterventions()
  if(explainConfidence){explainConfidence.textContent=`Confidence ${Math.round(evalRes.confidence)}%`}
  if(explainUpdated){explainUpdated.textContent=`Last updated: ${stamp()}`}
  if(explainTip){explainTip.setAttribute("data-tip",`AI explanation uses ${categoryForMed(med)} context and ${evalRes.category} risk state`)}
}
document.getElementById("btn-qr").addEventListener("click",()=>{const med=document.getElementById("qr-med").value||"BP Medicine";signalEvent("qr",med,2)})
document.getElementById("btn-bottle").addEventListener("click",()=>{const med=document.getElementById("bottle-med").value;const days=parseInt(document.getElementById("bottle-days").value||"0",10);signalEvent("bottle",med,days)})
document.getElementById("btn-manual").addEventListener("click",()=>{const med=document.getElementById("manual-med").value;const days=parseInt(document.getElementById("manual-days").value||"0",10);signalEvent("manual",med,days)})
document.getElementById("btn-explain").addEventListener("click",()=>{const med=explainInput.value||"BP Medicine";const res=evaluateRisk(med,2);const text=generateExplanation(med,res.category,res.tti,explainLang.value);explainOutput.textContent=text;currentMed=med})
const btnMic=document.getElementById("btn-mic")
if(btnMic){
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition
  btnMic.addEventListener("click",()=>{
    if(!SpeechRecognition){
      explainOutput.textContent="Voice not supported in this browser. Type medicine name."
      return
    }
    const recog=new SpeechRecognition()
    const lang=explainLang?.value||"en"
    recog.lang=lang==="hi"?"hi-IN":lang==="hinglish"?"en-IN":"en-US"
    recog.interimResults=false
    recog.maxAlternatives=1
    explainOutput.textContent="Listening…"
    recog.start()
    recog.onresult=(e)=>{
      const heard=e.results[0][0].transcript.trim()
      explainInput.value=heard
      const res=evaluateRisk(heard,2)
      const text=generateExplanation(heard,res.category,res.tti,explainLang.value)
      explainOutput.textContent=text
      currentMed=heard
      recordAction(`Voice captured: ${heard}`)
    }
    recog.onerror=(err)=>{
      explainOutput.textContent=`Voice error: ${err.error||"unknown"}`
    }
    recog.onend=()=>{}
  })
}
function setRisk(cat){
  const meter=document.querySelector(".risk-meter")
  const w=meter.clientWidth
  let x=0
  let label="LOW"
  if(cat==="LOW"){x=w*0.15;label="LOW"}
  else if(cat==="MODERATE"){x=w*0.5;label="MODERATE"}
  else{x=w*0.85;label="HIGH"}
  riskIndicator.style.left=`${x}px`
  riskIndicator.textContent=label
  currentRisk=label
  updateInterventions()
  if(riskStatus){
    let t="LOW – Continue monitoring"
    let cls="status-badge"
    if(label==="MODERATE"){t="MODERATE – Plan teleconsult";cls="status-badge warn"}
    if(label==="HIGH"){t="HIGH – Immediate teleconsult";cls="status-badge danger"}
    riskStatus.textContent=t
    riskStatus.className=cls
  }
  if(riskUpdated){riskUpdated.textContent=`Last updated: ${stamp()}`}
}
function bump(cat){if(cat==="LOW")return "MODERATE";if(cat==="MODERATE")return "HIGH";return "HIGH"}
function adjustRisk(res,med){
  const base=categoryForMed(med)
  let cat=res.category
  const sys=parseInt(document.getElementById("bp-sys").value||"0",10)
  const dia=parseInt(document.getElementById("bp-dia").value||"0",10)
  const glu=parseInt(document.getElementById("glu").value||"0",10)
  const peak=parseInt(document.getElementById("peak").value||"0",10)
  const dizzy=document.getElementById("symptom-dizzy").checked
  const headache=document.getElementById("symptom-headache").checked
  const tight=document.getElementById("symptom-tightness").checked
  const wheeze=document.getElementById("symptom-wheeze").checked
  const thirst=document.getElementById("symptom-thirst").checked
  const fatigue=document.getElementById("symptom-fatigue").checked
  if(base==="bp"&&(sys>=150||dia>=95||dizzy||headache))cat=bump(cat)
  if(base==="diabetes"&&(glu>=180||thirst||fatigue))cat=bump(cat)
  if(base==="asthma"&&((peak>0&&peak<80)||tight||wheeze))cat=bump(cat)
  let tti="3–5 days"
  if(cat==="LOW")tti="5–10 days"
  if(cat==="HIGH")tti="1–3 days"
  return {category:cat,tti}
}
document.getElementById("btn-vitals").addEventListener("click",()=>{
  const med=currentMed||explainInput.value||"BP Medicine"
  const base=evaluateRisk(med,2)
  const adj=adjustRisk(base,med)
  setRisk(adj.category)
  timeImpact.textContent=`Estimated time-to-impact: ${adj.tti}`
  const text=generateExplanation(med,adj.category,adj.tti,explainLang.value)
  explainOutput.textContent=text
  currentRisk=adj.category
  updateInterventions()
  if(explainConfidence){explainConfidence.textContent=`Confidence ${Math.round(base.confidence)}%`}
  if(explainUpdated){explainUpdated.textContent=`Last updated: ${stamp()}`}
  if(explainTip){explainTip.setAttribute("data-tip",`AI explanation uses ${categoryForMed(med)} context and ${adj.category} risk state`)}
})
document.getElementById("btn-save-caregiver").addEventListener("click",()=>{
  const v=document.getElementById("caregiver-contact").value||""
  recordAction(`Caregiver contact saved: ${v}`)
})
function tipsFor(base){
  if(base==="bp")return ["Hydration and low-salt meals today","Home BP check twice daily","Avoid sudden standing if dizzy"]
  if(base==="diabetes")return ["Balanced meals, avoid high-sugar snacks","Hydration","Check glucose post-meals"]
  if(base==="asthma")return ["Avoid smoke and dust","Warm up before activity","Practice breathing exercises"]
  if(base==="thyroid")return ["Keep routine consistent","Don't double-dose if missed","Note fatigue or cold sensitivity"]
  return ["Rest and monitor symptoms","Avoid triggers related to your condition","Reach out if you feel worse"]
}
function recsFor(base,cat){
  const items=[]
  if(cat==="HIGH"){items.push("Book teleconsult ASAP","Notify caregiver now","Start intensive home monitoring")}
  else if(cat==="MODERATE"){items.push("Book teleconsult within 24–48h","Enable home monitoring","Share summary with caregiver")}
  else {items.push("Keep routine and monitor","Review medicine routine","Plan check-in message")}
  if(base==="bp")items.push("Limit salt and caffeine today")
  if(base==="diabetes")items.push("Steady meals; track glucose")
  if(base==="asthma")items.push("Keep inhaler accessible; avoid triggers")
  if(base==="thyroid")items.push("Stay on schedule; consult before changes")
  return items
}
function updateInterventions(){
  const base=categoryForMed(currentMed||"")
  const tips=tipsFor(base)
  const recs=recsFor(base,currentRisk)
  const tipsEl=document.getElementById("safety-tips")
  const recList=document.getElementById("recommend-list")
  if(tipsEl)tipsEl.textContent=tips.join(" • ")
  if(recList)recList.innerHTML=recs.map(r=>`<li>${r}</li>`).join("")
}
document.getElementById("btn-tele-2").addEventListener("click",()=>{
  const dt=document.getElementById("tele-dt").value||"(no time selected)"
  recordAction(`Teleconsult booked: ${dt}`)
})
document.getElementById("btn-caregiver-2").addEventListener("click",()=>{
  const p=localStorage.getItem("patientProfile")
  const contact=p?JSON.parse(p).phone||JSON.parse(p).email||"" :""
  recordAction(`Caregiver alerted ${contact?`(${contact})`:''}`)
})
document.getElementById("btn-hm-start").addEventListener("click",()=>{
  const plan=[]
  if(document.getElementById("hm-bp").checked)plan.push("BP x2/day")
  if(document.getElementById("hm-glucose").checked)plan.push("Glucose log post-meals")
  if(document.getElementById("hm-peak").checked)plan.push("Peak flow mornings")
  recordAction(`Home monitoring started: ${plan.join(", ")||"no items selected"}`)
})
document.getElementById("btn-med-check").addEventListener("click",()=>{
  const txt=document.getElementById("med-list").value||""
  recordAction(`Medication review flagged: ${txt?txt:"(empty list)"}`)
})
document.getElementById("btn-download-summary").addEventListener("click",()=>{
  const p=localStorage.getItem("patientProfile")
  const prof=p?JSON.parse(p):{}
  const recs=[...document.querySelectorAll("#recommend-list li")].map(li=>li.textContent)
  const summary=`ArogyaGenix Summary
Name: ${prof.name||""}
Age: ${prof.age||""}  Gender: ${prof.gender||""}  Blood: ${prof.blood||""}
Height: ${prof.height||""} cm  Weight: ${prof.weight||""} kg
Medicine: ${currentMed||""}
Risk: ${currentRisk}
Time-to-impact: ${document.getElementById("time-impact").textContent||""}
Recommended actions:
- ${recs.join("\n- ")}
Safety tips:
- ${tipsFor(categoryForMed(currentMed||"")).join("\n- ")}
`
  const blob=new Blob([summary],{type:"text/plain"})
  const url=URL.createObjectURL(blob)
  const a=document.createElement("a")
  a.href=url
  a.download="arogyagenix_summary.txt"
  a.click()
  URL.revokeObjectURL(url)
  recordAction("Summary downloaded")
})
// Demo gamification
const demoOut=document.getElementById("demo-output")
const demoBar=document.getElementById("demo-progress-bar")
const demoAch=document.getElementById("demo-achievements")
let demoDone=new Set()
function award(id,label){
  if(demoDone.has(id))return
  demoDone.add(id)
  const b=document.createElement("span")
  b.className="achievement-badge"
  b.textContent=label
  demoAch.appendChild(b)
  const pct=Math.round((demoDone.size/6)*100)
  demoBar.style.width=`${pct}%`
}
function step(id,msg,label){demoOut.textContent=msg;award(id,label)}
const d1=document.getElementById("demo-1")
const d2=document.getElementById("demo-2")
const d3=document.getElementById("demo-3")
const d4=document.getElementById("demo-4")
const d5=document.getElementById("demo-5")
const d6=document.getElementById("demo-6")
if(d1)d1.addEventListener("click",()=>step(1,"You scanned disposal QR. Silent signal recorded.","QR Scout"))
if(d2)d2.addEventListener("click",()=>step(2,"We matched similar past patterns to estimate risk.","Pattern Finder"))
if(d3)d3.addEventListener("click",()=>step(3,"Risk timeline predicted with time-to-impact.","Risk Forecaster"))
if(d4)d4.addEventListener("click",()=>step(4,"Plain-language explanation generated for next steps.","Explainer"))
if(d5)d5.addEventListener("click",()=>step(5,"Doctor alerted with context and suggested action.","Care Connector"))
if(d6)d6.addEventListener("click",()=>step(6,"Proactive actions avoided an ER visit.","Prevention Hero"))

// Demo data explorer
const btnDemoData=document.getElementById("btn-demo-data")
const demoTable=document.getElementById("demo-table")
function renderDemoData(){
  const rows=patients.slice(0,50).map(p=>{
    const r=evaluateRisk(p.medication,Math.floor(rng()*7)+1)
    return `<tr class="${rowClass(r.category)}"><td>${p.name}</td><td>${p.age}</td><td>${p.condition}</td><td>${r.category}</td><td>${r.tti}</td></tr>`
  })
  demoTable.innerHTML=rows.join("")
}
if(btnDemoData)btnDemoData.addEventListener("click",renderDemoData)

// Family mode
const famName=document.getElementById("fam-name")
const famAge=document.getElementById("fam-age")
const famRel=document.getElementById("fam-relation")
const famCond=document.getElementById("fam-condition")
const famAdd=document.getElementById("btn-fam-add")
const famList=document.getElementById("fam-list")
function loadFamily(){
  const arr=JSON.parse(localStorage.getItem("familyMembers")||"[]")
  famList.innerHTML=arr.map((m,i)=>`<div class="family-card"><div><strong>${m.name}</strong> • ${m.relation}</div><div class="meta">${m.age} • ${m.condition}</div><div class="explain-row"><button data-i="${i}" class="btn-secondary btn-fam-remove">Remove</button></div></div>`).join("")
  famList.querySelectorAll(".btn-fam-remove").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const i=parseInt(btn.getAttribute("data-i"),10)
      const cur=JSON.parse(localStorage.getItem("familyMembers")||"[]")
      cur.splice(i,1)
      localStorage.setItem("familyMembers",JSON.stringify(cur))
      loadFamily()
    })
  })
}
if(famAdd){
  famAdd.addEventListener("click",()=>{
    const m={name:famName.value||"Unnamed",age:parseInt(famAge.value||"0",10),relation:famRel.value||"",condition:famCond.value||""}
    const arr=JSON.parse(localStorage.getItem("familyMembers")||"[]")
    arr.push(m)
    localStorage.setItem("familyMembers",JSON.stringify(arr))
    famName.value="";famAge.value="";famRel.value="";famCond.value=""
    loadFamily()
    recordAction(`Family member added: ${m.name}`)
  })
  loadFamily()
}

// Explainability Timeline
const timeline=document.getElementById("timeline")
const btnGenTimeline=document.getElementById("btn-gen-timeline")
let lastStopDays=0
function buildTimeline(med,days){
  const base=categoryForMed(med)
  const items=[
    {t:"Day 0",s:"Stop "+med+" • routine disrupted"},
    {t:"Day 1–2",s: base==="bp"?"BP variability rises":"Routine adherence drops"},
    {t:"Day 3",s:"Risk increases • MODERATE"},
    {t:"Day 5",s: base==="asthma"?"Wheeze/tightness risk":"Symptoms escalate"},
    {t:"Action",s:"Teleconsult + caregiver alert"}
  ]
  timeline.innerHTML=items.map((it,i)=>{
    const node=`<div class="timeline-node"><div class="t">${it.t}</div><div class="s">${it.s}</div></div>`
    const arrow=i<items.length-1?`<span class="timeline-arrow">→</span>`:""
    return node+arrow
  }).join("")
}
if(btnGenTimeline)btnGenTimeline.addEventListener("click",()=>{
  const med=currentMed||explainInput.value||"BP Medicine"
  buildTimeline(med,lastStopDays||2)
})
// capture days from signals
function captureLastStop(days){ lastStopDays=days }
document.getElementById("btn-emergency").addEventListener("click",()=>{
  document.getElementById("quick-output").textContent="Emergency: Dial 112 • Keep inhaler and BP cuff accessible • Share caregiver contact"
})
document.getElementById("btn-reminder").addEventListener("click",()=>{
  document.getElementById("quick-output").textContent="Reminder set: Home BP at 8:00 AM • Hydration check at 2:00 PM"
})
document.getElementById("btn-near-care").addEventListener("click",()=>{
  document.getElementById("quick-output").textContent="Nearest care: Community Clinic (2.1 km) • Teleconsult available"
})
function categoryForMed(med){
  const m=(med||"").toLowerCase().replace(/[^a-z0-9]/g,"")
  if(m.includes("bp")||m.includes("bloodpressure")||m.includes("amlodipine")||m.includes("lisinopril")||m.includes("losartan")) return "bp"
  if(m.includes("diab")||m.includes("metformin")||m.includes("insulin")||m.includes("glimepiride")||m.includes("gly")) return "diabetes"
  if(m.includes("asthma")||m.includes("inhaler")||m.includes("salbutamol")||m.includes("albuterol")) return "asthma"
  if(m.includes("thyroid")||m.includes("levothyroxine")||m.includes("eltroxin")||m.includes("thyro")) return "thyroid"
  if(m.includes("paracetamol")||m.includes("acetaminophen")||m.includes("praceta")||m.includes("acef")) return "paracetamol"
  if(m.includes("dolo650")||m.includes("crocin")||m.includes("calpol")||m.includes("combiflam")||m.includes("brufen")||m.includes("ibuprofen")||m.includes("voveran")||m.includes("diclofenac")||m.includes("naprosyn")||m.includes("naproxen")||m.includes("myospaz")) return "analgesic"
  if(m.includes("vicksaction500")||m.includes("sinarest")||m.includes("coldact")||m.includes("okacetcold")||m.includes("chericof")||m.includes("benadryl")||m.includes("alex")||m.includes("ascoril")||m.includes("honitus")||m.includes("koflet")) return "cold"
  if(m.includes("cetirizine")||m.includes("levocetirizine")||m.includes("allegra")||m.includes("fexofenadine")||m.includes("avil")||m.includes("loratadine")) return "antihist"
  if(m.includes("digene")||m.includes("gelusil")||m.includes("eno")||m.includes("pantoprazole")||m.includes("omeprazole")||m.includes("rantac")||m.includes("ranitidine")||m.includes("gaviscon")||m.includes("polycrol")) return "antacid"
  if(m.includes("ors")||m.includes("electral")||m.includes("sporlac")||m.includes("enterogermina")||m.includes("norfloxtz")||m.includes("norflox")) return "diarrhea"
  if(m.includes("becosules")||m.includes("zincovit")||m.includes("limcee")||m.includes("shelcal")||m.includes("neurobion")||m.includes("supradyn")) return "vitamin"
  if(m.includes("dettol")||m.includes("savlon")||m.includes("betnovate")||m.includes("burnol")||m.includes("boroline")) return "topical"
  if(m.includes("otrivin")) return "nasal"
  return "other"
}
function norm(n){return (n||"").toLowerCase().replace(/[^a-z0-9]/g,"")}
const MED_MAP={
  paracetamol:{tags:["paracetamol","acetaminophen","dolo650","crocin","calpol"]},
  combiflam:{tags:["combiflam"]},
  ibuprofen:{tags:["ibuprofen","brufen"]},
  diclofenac:{tags:["diclofenac","voveran"]},
  naproxen:{tags:["naprosyn","naproxen"]},
  myospaz:{tags:["myospaz"]},
  vicksaction500:{tags:["vicksaction500"]},
  sinarest:{tags:["sinarest"]},
  coldact:{tags:["coldact"]},
  okacetcold:{tags:["okacetcold"]},
  chericof:{tags:["chericof"]},
  benadryl:{tags:["benadryl"]},
  alex:{tags:["alex"]},
  ascoril:{tags:["ascoril"]},
  honitus:{tags:["honitus"]},
  koflet:{tags:["koflet"]},
  cetirizine:{tags:["cetirizine"]},
  levocetirizine:{tags:["levocetirizine"]},
  allegra:{tags:["allegra","fexofenadine"]},
  avil:{tags:["avil"]},
  loratadine:{tags:["loratadine"]},
  digene:{tags:["digene"]},
  gelusil:{tags:["gelusil"]},
  eno:{tags:["eno"]},
  pantoprazole:{tags:["pantoprazole"]},
  omeprazole:{tags:["omeprazole"]},
  rantac:{tags:["rantac","ranitidine"]},
  gaviscon:{tags:["gaviscon"]},
  polycrol:{tags:["polycrol"]},
  ors:{tags:["ors"]},
  electral:{tags:["electral"]},
  sporlac:{tags:["sporlac"]},
  enterogermina:{tags:["enterogermina"]},
  norfloxtz:{tags:["norfloxtz","norflox"]},
  becosules:{tags:["becosules"]},
  zincovit:{tags:["zincovit"]},
  limcee:{tags:["limcee"]},
  shelcal:{tags:["shelcal"]},
  neurobion:{tags:["neurobion","neurobionforte"]},
  supradyn:{tags:["supradyn"]},
  dettol:{tags:["dettol"]},
  savlon:{tags:["savlon"]},
  betnovate:{tags:["betnovate"]},
  burnol:{tags:["burnol"]},
  boroline:{tags:["boroline"]},
  otrivin:{tags:["otrivin"]}
}
const MED_TEXT={
  paracetamol:{
    en:"Paracetamol reduces fever and pain. Stopping may let symptoms persist or return. If fever or pain continues beyond 0–2 days, consult a clinician.",
    hi:"पैरासिटामोल बुखार और दर्द घटाती है। बंद करने पर लक्षण बने रह सकते हैं या वापस आ सकते हैं। यदि 0–2 दिनों से आगे जारी हों, तो डॉक्टर से सलाह लें।",
    hinglish:"Paracetamol bukhar aur dard kam karti hai. Band karne par symptoms reh ya wapas aa sakte hain. Agar 0–2 din se zyada chale, doctor se salaah lein."
  },
  combiflam:{
    en:"Combiflam combines paracetamol and ibuprofen for pain/fever. Stopping may bring back pain. Avoid if stomach upset; consult if symptoms persist.",
    hi:"कॉम्बीफ्लैम दर्द/बुखार के लिए पैरासिटामोल और आइबुप्रोफेन का संयोजन है। बंद करने पर दर्द लौट सकता है। पेट में तकलीफ हो तो सावधानी; लक्षण रहें तो डॉक्टर से मिलें।",
    hinglish:"Combiflam mein paracetamol + ibuprofen hota hai. Band karne par dard wapas aa sakta hai. Pet ki dikkat ho to savdhaan; symptoms rahen to doctor se milen."
  },
  ibuprofen:{
    en:"Ibuprofen helps pain and inflammation. Stopping may return pain. Use with food; avoid long-term self-use. Consult if pain persists.",
    hi:"आइबुप्रोफेन दर्द और सूजन में मदद करता है। बंद करने पर दर्द लौट सकता है। भोजन के साथ लें; लंबे समय तक स्वयं न लें। दर्द रहे तो डॉक्टर से मिलें।",
    hinglish:"Ibuprofen dard aur soojan mein madad karta hai. Band karne par dard wapas aa sakta hai. Khane ke saath lein; lambi avadhi tak self-use na karein."
  },
  diclofenac:{
    en:"Diclofenac relieves pain/inflammation. Stopping may return pain. Avoid if stomach or kidney issues. Consult for persistent symptoms.",
    hi:"डाइक्लोफेनाक दर्द/सूजन कम करता है। बंद करने पर दर्द लौट सकता है। पेट/किडनी समस्या हो तो सावधानी। लक्षण रहें तो डॉक्टर से मिलें।",
    hinglish:"Diclofenac dard/soojan kam karta hai. Band karne par dard wapas aa sakta hai. Pet/kidney issues ho to savdhaan."
  },
  naproxen:{
    en:"Naproxen helps longer-lasting pain relief. Stopping may bring symptoms back. Take with food and consult if pain continues.",
    hi:"नैप्रोक्सन लंबे समय का दर्द कम करता है। बंद करने पर लक्षण वापस आ सकते हैं। भोजन के साथ लें और दर्द रहे तो डॉक्टर से मिलें।",
    hinglish:"Naproxen lambi muddat ka dard kam karta hai. Band karne par symptoms wapas aa sakte hain."
  },
  myospaz:{
    en:"Myospaz is for muscle spasm relief. Stopping may let spasm/pain persist. Can cause drowsiness; avoid driving. Consult if symptoms continue.",
    hi:"मायोस्पैज़ मांसपेशी ऐंठन के लिए है। बंद करने पर दर्द बना रह सकता है। नींद ला सकता है; वाहन न चलाएं। लक्षण रहें तो डॉक्टर से मिलें।",
    hinglish:"Myospaz muscle spasm ke liye hai. Band karne par dard reh sakta hai. Neend aa sakti hai; gaadi na chalayein."
  },
  vicksaction500:{
    en:"Cold/flu relief with multiple ingredients. Stopping may let cold symptoms persist. If you have high BP, avoid decongestants. Consult if symptoms last >3–5 days.",
    hi:"कोल्ड/फ्लू राहत के लिए बहु-घटक दवा। बंद करने पर सर्दी के लक्षण बने रह सकते हैं। उच्च BP हो तो डीकंजेस्टेंट से बचें। 3–5 दिनों से अधिक रहें तो डॉक्टर से मिलें।",
    hinglish:"Cold/flu relief multi-ingredient. Band karne par sardi ke lakshan reh sakte hain. High BP ho to decongestant se bachein."
  },
  sinarest:{en:"Cold/flu relief; may cause drowsiness. Stopping may let symptoms persist. Avoid driving. Consult if symptoms last >3–5 days.",hi:"कोल्ड/फ्लू राहत; नींद ला सकती है। बंद करने पर लक्षण रह सकते हैं। 3–5 दिनों से अधिक रहें तो डॉक्टर से मिलें।",hinglish:"Cold/flu relief; neend aa sakti hai. Band karne par symptoms reh sakte hain."},
  coldact:{en:"Cold relief with antihistamine/decongestant. Stopping may let symptoms persist. Use caution in high BP. Consult if >3–5 days.",hi:"एंटीहिस्टामिन/डीकंजेस्टेंट आधारित। बंद करने पर लक्षण रह सकते हैं। उच्च BP में सावधानी। 3–5 दिनों से अधिक रहें तो डॉक्टर से मिलें।",hinglish:"Cold relief; high BP mein savdhaan."},
  okacetcold:{en:"Cetirizine + decongestant for cold. Stopping may let blocked nose persist. May cause drowsiness.",hi:"सिटिरीज़िन + डीकंजेस्टेंट। बंद करने पर जकड़न रह सकती है। नींद ला सकती है।",hinglish:"Cetirizine + decongestant; neend aa sakti hai."},
  chericof:{en:"Cough relief syrup. Stopping may bring cough back. If cough persists >3–5 days, consult.",hi:"खांसी की दवा। बंद करने पर खांसी लौट सकती है। 3–5 दिनों से अधिक रहे तो डॉक्टर से मिलें।",hinglish:"Khansi relief; symptoms rahe to doctor se milen."},
  benadryl:{en:"Cough/sedating antihistamine. Stopping may bring symptoms back. May cause drowsiness.",hi:"खांसी/निंद्रा लाने वाला एंटीहिस्टामिन। बंद करने पर लक्षण लौट सकते हैं। नींद आ सकती है।",hinglish:"Sedating antihistamine; neend aa sakti hai."},
  alex:{en:"Cough syrup. Stopping may let cough persist. If cough lasts >3–5 days, consult.",hi:"खांसी की दवा। 3–5 दिनों से अधिक रहे तो डॉक्टर से मिलें।",hinglish:"Khansi rahe to doctor se milen."},
  ascoril:{en:"Expectorant for chest congestion. Stopping may keep mucus. Hydrate and consult if >3–5 days.",hi:"छाती में बलगम निकालने में मदद। बंद करने पर बलगम बना रह सकता है। हाइड्रेशन रखें।",hinglish:"Expectorant; pani piyen; symptoms rahe to consult."},
  honitus:{en:"Herbal cough relief. Stopping may bring cough back. Consult if persistent.",hi:"हर्बल खांसी राहत। बंद करने पर खांसी लौट सकती है।",hinglish:"Herbal cough relief."},
  koflet:{en:"Ayurvedic cough relief. Stopping may bring cough back.",hi:"आयुर्वेदिक खांसी राहत।",hinglish:"Ayurvedic cough relief."},
  cetirizine:{en:"Antihistamine for allergy. Stopping may let sneezing/itch persist. May cause drowsiness.",hi:"एलर्जी के लिए एंटीहिस्टामिन। बंद करने पर छींक/खुजली रह सकती है। नींद आ सकती है।",hinglish:"Allergy relief; neend aa sakti hai."},
  levocetirizine:{en:"Similar to cetirizine with possible drowsiness.",hi:"सिटिरीज़िन जैसा; नींद हो सकती है।",hinglish:"Cetirizine jaisa."},
  allegra:{en:"Fexofenadine non-sedating antihistamine. Stopping may let allergy symptoms persist.",hi:"फेक्सोफेनाडिन गैर-निंद्राजनक एंटीहिस्टामिन। बंद करने पर एलर्जी रह सकती है।",hinglish:"Fexofenadine non-sedating."},
  avil:{en:"Pheniramine antihistamine; can cause drowsiness. Stopping may return symptoms.",hi:"फेनिरामिन एंटीहिस्टामिन; नींद ला सकता है।",hinglish:"Pheniramine; neend aa sakti hai."},
  loratadine:{en:"Non-sedating antihistamine. Stopping may let allergy persist.",hi:"गैर-निंद्राजनक एंटीहिस्टामिन।",hinglish:"Non-sedating antihistamine."},
  digene:{en:"Antacid for acidity. Stopping may let heartburn return. If frequent, consult.",hi:"एंटासिड; बंद करने पर जलन लौट सकती है। बार-बार हो तो डॉक्टर से मिलें।",hinglish:"Antacid; heartburn wapas aa sakta hai."},
  gelusil:{en:"Antacid; similar guidance as Digene.",hi:"एंटासिड; डीजीन जैसा मार्गदर्शन।",hinglish:"Antacid guidance."},
  eno:{en:"Quick antacid powder. Stopping may let acidity persist.",hi:"त्वरित एंटासिड पाउडर। बंद करने पर एसिडिटी रह सकती है।",hinglish:"Quick antacid."},
  pantoprazole:{en:"PPI for acid control. Stopping may let reflux return. Long-term use needs medical supervision.",hi:"पीपीआई; बंद करने पर रिफ्लक्स लौट सकता है। लंबे समय के लिए डॉक्टर की सलाह आवश्यक।",hinglish:"PPI; long-term doctor supervision."},
  omeprazole:{en:"PPI similar to pantoprazole.",hi:"पीपीआई; पैंटोप्राज़ोल जैसा।",hinglish:"PPI similar."},
  rantac:{en:"Acid reducer. Use caution; consult for long-term use.",hi:"एसिड कम करने वाली दवा। सावधानी रखें; लंबे उपयोग में डॉक्टर से सलाह।",hinglish:"Acid reducer; consult for long term."},
  gaviscon:{en:"Antacid/alginate for reflux. Stopping may let discomfort persist.",hi:"एंटासिड/एल्जिनेट; बंद करने पर असहजता रह सकती है।",hinglish:"Antacid/alginate."},
  polycrol:{en:"Antacid; helps neutralize stomach acid.",hi:"एंटासिड; पेट का एसिड कम करता है।",hinglish:"Antacid."},
  ors:{en:"Oral rehydration for diarrhea. Stopping may let dehydration persist. Continue small sips frequently.",hi:"डायरिया में ओआरएस। बंद करने पर डिहाइड्रेशन रह सकता है।",hinglish:"ORS for diarrhea; hydration important."},
  electral:{en:"ORS similar to ORS.",hi:"ओआरएस जैसा।",hinglish:"ORS similar."},
  sporlac:{en:"Probiotic for gut support. Stopping may slow recovery.",hi:"आंत के लिए प्रॉबायोटिक।",hinglish:"Probiotic."},
  enterogermina:{en:"Probiotic; supports gut flora.",hi:"प्रॉबायोटिक; आंत को समर्थन।",hinglish:"Probiotic."},
  norfloxtz:{en:"Antibiotic for diarrhea; doctor advice recommended. Do not self-start or stop mid-course.",hi:"डायरिया के लिए एंटीबायोटिक; डॉक्टर की सलाह आवश्यक। स्वयं शुरू/बीच में बंद न करें।",hinglish:"Antibiotic; doctor advice required."},
  becosules:{en:"B-complex vitamins. Stopping usually safe; symptoms may persist if deficiency.",hi:"बी-कॉम्प्लेक्स विटामिन। बंद करना सामान्यतः सुरक्षित।",hinglish:"B-complex vitamins."},
  zincovit:{en:"Multivitamin with minerals. Stopping usually safe.",hi:"मल्टीविटामिन; सामान्यतः सुरक्षित।",hinglish:"Multivitamin."},
  limcee:{en:"Vitamin C tablet. Stopping usually safe.",hi:"विटामिन C टैबलेट।",hinglish:"Vitamin C."},
  shelcal:{en:"Calcium supplement. Stopping may allow deficiency symptoms. Consult for dosing.",hi:"कैल्शियम सप्लीमेंट।",hinglish:"Calcium supplement."},
  neurobion:{en:"B1/B6/B12 supplement. Stopping may let nerve symptoms persist.",hi:"बी1/बी6/बी12 सप्लीमेंट।",hinglish:"Neuro vitamins."},
  supradyn:{en:"Multivitamin for fatigue support. Stopping usually safe.",hi:"मल्टीविटामिन।",hinglish:"Multivitamin."},
  dettol:{en:"Topical antiseptic. For minor cuts. Stopping may slow cleaning; avoid ingestion.",hi:"टॉपिकल एंटिसेप्टिक; छोटे घावों हेतु।",hinglish:"Topical antiseptic."},
  savlon:{en:"Topical antiseptic similar to Dettol.",hi:"टॉपिकल एंटिसेप्टिक।",hinglish:"Topical antiseptic."},
  betnovate:{en:"Topical steroid. Use sparingly and short-term. Stopping may let rash return.",hi:"टॉपिकल स्टेरॉयड; कम और सीमित समय के लिए।",hinglish:"Topical steroid; short-term only."},
  burnol:{en:"Minor burn relief. Cool water first. Stopping may slow symptom relief.",hi:"हल्के जलन में राहत। पहले ठंडा पानी।",hinglish:"Minor burn relief."},
  boroline:{en:"Antiseptic cream for minor skin issues.",hi:"एंटिसेप्टिक क्रीम।",hinglish:"Antiseptic cream."},
  otrivin:{en:"Nasal decongestant. Limit use to 3–5 days to avoid rebound. Stopping may bring back congestion.",hi:"नेज़ल डीकंजेस्टेंट; 3–5 दिनों तक सीमित रखें।",hinglish:"Nasal decongestant; 3–5 din tak hi."}
}
function lookupMed(med){
  const nm=norm(med)
  for(const k in MED_MAP){if(MED_MAP[k].tags.some(t=>nm.includes(t)))return k}
  return null
}
function evaluateRisk(med,days){
  const base=categoryForMed(med)
  let lag=days
  let drift=rng()*0.6+0.2
  let score=0
  let category="LOW"
  let tti="3–5 days"
  if(base==="bp"){score=lag*0.25+drift*40}
  else if(base==="diabetes"){score=lag*0.3+drift*35}
  else if(base==="asthma"){score=lag*0.4+drift*30}
  else if(base==="thyroid"){score=lag*0.2+drift*25}
  else {score=lag*0.15+drift*15}
  if(base==="paracetamol"||base==="analgesic"||base==="cold"||base==="antihist"||base==="antacid"||base==="diarrhea"||base==="vitamin"||base==="topical"||base==="nasal"){
    category="LOW";tti="0–2 days"
  } else {
    if(score>35&&score<=65){category="MODERATE"}
    else if(score>65){category="HIGH"}
    if(category==="LOW")tti="5–10 days"
    if(category==="HIGH")tti="1–3 days"
  }
  const confidence=base==="paracetamol" ? 75 : (70+drift*20-(lag>7?10:0))
  return {category,tti,confidence}
}
function generateExplanation(med,cat,tti,lang){
  const key=lookupMed(med)
  if(key&&MED_TEXT[key]){return MED_TEXT[key][lang]}
  const base=categoryForMed(med)
  const map={
    bp:{
      en:`When this medicine is stopped, blood pressure can quietly rise. People with similar patterns often feel dizziness or headaches within ${tti}.`,
      hi:`इस दवा को बंद करने पर रक्तचाप धीरे-धीरे बढ़ सकता है। ऐसे पैटर्न वाले लोगों को अक्सर ${tti} के भीतर चकराहट या सिरदर्द होता है।`,
      hinglish:`Yeh dawa band karne par blood pressure dheere-dheere badh sakta hai. Aise patterns mein log ${tti} ke andar chakkar ya headache mehsoos karte hain.`
    },
    diabetes:{
      en:`Stopping this medicine can let sugar levels drift up. People with similar patterns often feel fatigue or more thirst within ${tti}.`,
      hi:`यह दवा बंद करने पर शुगर स्तर ऊपर जा सकता है। ऐसे पैटर्न में लोग अक्सर ${tti} में थकान या ज्यादा प्यास महसूस करते हैं।`,
      hinglish:`Yeh dawa band karne se sugar level upar ja sakta hai. Aise patterns mein log ${tti} mein thakaan ya zyada pyaas mehsoos karte hain.`
    },
    asthma:{
      en:`Without regular inhaler use, airway balance can slip. People with similar patterns often feel chest tightness or wheeze within ${tti}.`,
      hi:`इनहेलर नियमित न लेने पर सांस की नली का संतुलन बिगड़ सकता है। ऐसे पैटर्न में लोग ${tti} के भीतर सीने में जकड़न या घरघराहट महसूस करते हैं।`,
      hinglish:`Inhaler regular na lene par airway ka balance bigad sakta hai. Aise patterns mein log ${tti} ke andar chest tightness ya wheeze mehsoos karte hain.`
    },
    thyroid:{
      en:`Stopping thyroid medicine can slow body balance. People with similar patterns often feel tiredness or cold sensitivity within ${tti}.`,
      hi:`थायरॉइड की दवा बंद करने पर शरीर का संतुलन धीमा पड़ सकता है। ऐसे पैटर्न में लोग ${tti} में थकान या ठंड ज्यादा लगना महसूस करते हैं।`,
      hinglish:`Thyroid ki dawa band karne par body balance slow ho sakta hai. Aise patterns mein log ${tti} mein thakaan ya thand zyada lagna mehsoos karte hain.`
    },
    paracetamol:{
      en:`Paracetamol helps reduce fever and pain. If you stop it, symptoms may persist or return. If fever or pain continues beyond ${tti}, speak with a doctor before changing doses.`,
      hi:`पैरासिटामोल बुखार और दर्द कम करने में मदद करती है। इसे बंद करने पर लक्षण बने रह सकते हैं या वापस आ सकते हैं। यदि बुखार या दर्द ${tti} से आगे जारी रहे, तो खुराक बदलने से पहले डॉक्टर से बात करें।`,
      hinglish:`Paracetamol bukhar aur dard kam karti hai. Band karne par symptoms reh sakte hain ya wapas aa sakte hain. Agar bukhar/dard ${tti} se zyada chale, dose badalne se pehle doctor se baat karein.`
    },
    other:{
      en:`We currently provide general guidance for this medicine. If stopped, symptoms related to its purpose may return. If you feel worse within ${tti}, consult a clinician for personalized advice.`,
      hi:`इस दवा के लिए हम सामान्य मार्गदर्शन देते हैं। दवा बंद करने पर उससे जुड़े लक्षण फिर आ सकते हैं। यदि आप ${tti} के भीतर अधिक असहज महसूस करें, तो व्यक्तिगत सलाह के लिए डॉक्टर से मिलें।`,
      hinglish:`Is dawa ke liye hum general guidance dete hain. Dawa band karne par uske related symptoms wapas aa sakte hain. Agar aap ${tti} ke andar zyada bura mehsoos karein, to doctor se salaah lein.`
    }
  }
  return map[base][lang]
}
const doctorTable=document.getElementById("doctor-table")
const filterText=document.getElementById("filter-text")
document.getElementById("btn-load").addEventListener("click",()=>renderDoctor())
filterText.addEventListener("input",()=>renderDoctor())
function renderDoctor(){
  let rows=patients.slice(0,500).map(p=>{
    const r=evaluateRisk(p.medication,Math.floor(rng()*7)+1)
    return {...p,category:r.category,tti:r.tti,confidence:r.confidence,explain:generateExplanation(p.medication,r.category,r.tti,"en"),suggest:suggestIntervention(r.category)}
  })
  const q=(filterText.value||"").toLowerCase()
  if(q)rows=rows.filter(r=>r.condition.toLowerCase().includes(q))
  rows.sort((a,b)=>rank(b.category)-rank(a.category))
  doctorTable.innerHTML=rows.map(r=>`<tr class="${rowClass(r.category)}"><td>${r.name}</td><td>${r.age}</td><td>${r.condition}</td><td>${r.category}</td><td>${r.tti}</td><td>${r.explain}</td><td>${r.suggest}</td></tr>`).join("")
}
function rowClass(c){if(c==="HIGH")return "risk-high";if(c==="MODERATE")return "risk-moderate";return "risk-low"}
function rank(c){if(c==="HIGH")return 3;if(c==="MODERATE")return 2;return 1}
function suggestIntervention(cat){if(cat==="HIGH")return "Immediate teleconsult, caregiver ping, medication reconciliation";if(cat==="MODERATE")return "Teleconsult within 48h, home monitoring";return "Check-in message, reinforce routine"}
// old demo handlers replaced by gamified tutorial
const radarOut=document.getElementById("radar-output")
document.getElementById("btn-radar").addEventListener("click",()=>{
  const sample=patients.slice(0,1000).map(p=>{
    const r=evaluateRisk(p.medication,Math.floor(rng()*7)+1)
    return {...p,cat:r.category,tti:r.tti}
  })
  const agg={Hypertension:{LOW:0,MODERATE:0,HIGH:0,total:0},Diabetes:{LOW:0,MODERATE:0,HIGH:0,total:0},Asthma:{LOW:0,MODERATE:0,HIGH:0,total:0},Thyroid:{LOW:0,MODERATE:0,HIGH:0,total:0}}
  let totLow=0,totMod=0,totHigh=0,ageSum=0
  sample.forEach(s=>{
    agg[s.condition][s.cat]++
    agg[s.condition].total++
    ageSum+=s.age
    if(s.cat==="LOW")totLow++
    else if(s.cat==="MODERATE")totMod++
    else totHigh++
  })
  const avgAge=Math.round(ageSum/sample.length)
  function pct(a,b){return b?Math.round((a/b)*100):0}
  function row(label,o){
    const total=o.total
    return `<tr><td>${label}</td><td>${total}</td><td>${o.LOW} (${pct(o.LOW,total)}%)</td><td>${o.MODERATE} (${pct(o.MODERATE,total)}%)</td><td>${o.HIGH} (${pct(o.HIGH,total)}%)</td><td>${pct(total,sample.length)}%</td></tr>`
  }
  radarOut.innerHTML=`
    <div class="small-note">Population: 1000 • Average age: ${avgAge}</div>
    <table class="table">
      <thead><tr><th>Condition</th><th>Total</th><th>LOW</th><th>MODERATE</th><th>HIGH</th><th>% of Pop</th></tr></thead>
      <tbody>
        ${row("Hypertension",agg.Hypertension)}
        ${row("Diabetes",agg.Diabetes)}
        ${row("Asthma",agg.Asthma)}
        ${row("Thyroid",agg.Thyroid)}
      </tbody>
    </table>
    <div class="small-note">Overall risk distribution • LOW ${totLow} (${pct(totLow,sample.length)}%) • MODERATE ${totMod} (${pct(totMod,sample.length)}%) • HIGH ${totHigh} (${pct(totHigh,sample.length)}%)</div>
  `
})
const avatarBtn=document.getElementById("btn-profile")
const avatarText=document.getElementById("avatar-initials")
const avatarPhoto=document.getElementById("avatar-photo")
const modal=document.getElementById("profile-modal")
const nameI=document.getElementById("profile-name")
const ageI=document.getElementById("profile-age")
const genderI=document.getElementById("profile-gender")
const bloodI=document.getElementById("profile-blood")
const heightI=document.getElementById("profile-height")
const weightI=document.getElementById("profile-weight")
const phoneI=document.getElementById("profile-phone")
const emailI=document.getElementById("profile-email")
const bmiEl=document.getElementById("profile-bmi")
const bmiStatus=document.getElementById("profile-bmi-status")
const photoFile=document.getElementById("profile-photo-file")
const btnClearPhoto=document.getElementById("btn-clear-photo")
const profileAvatarPreview=document.getElementById("profile-avatar-preview")
const btnChangePhoto=document.getElementById("btn-change-photo")
function showModal(){modal.classList.remove("hidden")}
function hideModal(){modal.classList.add("hidden")}
avatarBtn.addEventListener("click",()=>{loadProfile();showModal()})
document.getElementById("btn-close-profile").addEventListener("click",hideModal)
document.getElementById("btn-save-profile").addEventListener("click",()=>{
  const p={name:nameI.value||"",age:parseInt(ageI.value||"0",10)||0,gender:genderI.value||"",blood:bloodI.value||"",height:parseFloat(heightI.value||"0")||0,weight:parseFloat(weightI.value||"0")||0,phone:phoneI.value||"",email:emailI.value||""}
  localStorage.setItem("patientProfile",JSON.stringify(p))
  localStorage.setItem("patientLoggedIn","1")
  updateAvatar(p)
  updateBmi(p)
  hideModal()
})
document.getElementById("btn-logout-profile").addEventListener("click",()=>{
  localStorage.removeItem("patientLoggedIn")
  localStorage.removeItem("patientProfile")
  avatarText.textContent="👤"
  hideModal()
})
function updateAvatar(p){
  const n=(p.name||"").trim()
  const photo=localStorage.getItem("patientPhoto")
  if(photo){
    if(avatarPhoto){avatarPhoto.src=photo;avatarPhoto.classList.remove("hidden");avatarText.classList.add("hidden")}
    if(profileAvatarPreview){profileAvatarPreview.src=photo}
    return
  }
  avatarPhoto.classList.add("hidden")
  avatarText.classList.remove("hidden")
  if(!n){avatarText.textContent="👤";return}
  const parts=n.split(/\s+/)
  const initials=(parts[0]?.[0]||"")+(parts[1]?.[0]||"")
  avatarText.textContent=initials.toUpperCase()
}
function updateBmi(p){
  const h=p.height>0?p.height:parseFloat(heightI.value||"0")
  const w=p.weight>0?p.weight:parseFloat(weightI.value||"0")
  if(h>0&&w>0){
    const m=h/100
    const bmi=(w/(m*m))
    bmiEl.textContent=`${bmi.toFixed(1)}`
    let status="",cls="badge"
    if(bmi<18.5){status="Underweight";cls="badge bmi-warn"}
    else if(bmi<25){status="Normal";cls="badge bmi-ok"}
    else if(bmi<30){status="Overweight";cls="badge bmi-warn"}
    else {status="Obese";cls="badge bmi-danger"}
    if(bmiStatus){bmiStatus.textContent=status;bmiStatus.className=cls}
  }else{
    bmiEl.textContent="—"
    if(bmiStatus){bmiStatus.textContent="";bmiStatus.className="badge"}
  }
}
function loadProfile(){
  const s=localStorage.getItem("patientProfile")
  if(s){
    const p=JSON.parse(s)
    nameI.value=p.name||""
    ageI.value=p.age||""
    genderI.value=p.gender||""
    bloodI.value=p.blood||""
    heightI.value=p.height||""
    weightI.value=p.weight||""
    phoneI.value=p.phone||""
    emailI.value=p.email||""
    updateBmi(p)
  }else{
    nameI.value="";ageI.value="";genderI.value="";bloodI.value="";heightI.value="";weightI.value="";phoneI.value="";emailI.value="";bmiEl.textContent="—"
  }
}
;(function init(){
  const s=localStorage.getItem("patientProfile")
  if(s){updateAvatar(JSON.parse(s))}
  if(heightI){heightI.addEventListener("input",()=>updateBmi({height:parseFloat(heightI.value||"0"),weight:parseFloat(weightI.value||"0")}))}
  if(weightI){weightI.addEventListener("input",()=>updateBmi({height:parseFloat(heightI.value||"0"),weight:parseFloat(weightI.value||"0")}))}
  if(photoFile){photoFile.addEventListener("change",e=>{
    const f=e.target.files&&e.target.files[0]
    if(!f)return
    const r=new FileReader()
    r.onload=()=>{
      localStorage.setItem("patientPhoto",r.result)
      updateAvatar(JSON.parse(localStorage.getItem("patientProfile")||"{}"))
      if(profileAvatarPreview){profileAvatarPreview.src=r.result}
    }
    r.readAsDataURL(f)
  })}
  if(btnClearPhoto){btnClearPhoto.addEventListener("click",()=>{
    localStorage.removeItem("patientPhoto")
    updateAvatar(JSON.parse(localStorage.getItem("patientProfile")||"{}"))
    if(profileAvatarPreview){profileAvatarPreview.src=""}
  })}
  if(btnChangePhoto){btnChangePhoto.addEventListener("click",()=>{if(photoFile)photoFile.click()})}
})()
