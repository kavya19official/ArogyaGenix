const tabs=document.querySelectorAll(".tab-btn")
const sections=document.querySelectorAll(".tab")
tabs.forEach(b=>b.addEventListener("click",()=>{sections.forEach(s=>s.classList.add("hidden"));document.getElementById(b.dataset.tab).classList.remove("hidden")}))
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
const trustLabel=document.getElementById("trust-label")
const actionLog=document.getElementById("action-log")
function recordAction(s){const t=new Date().toLocaleTimeString();actionLog.textContent=`${t}: ${s}`}
document.getElementById("btn-tele").addEventListener("click",()=>recordAction("Teleconsult slot reserved for next 24h"))
document.getElementById("btn-caregiver").addEventListener("click",()=>recordAction("Caregiver notified with risk and steps"))
document.getElementById("btn-steps").addEventListener("click",()=>recordAction("Suggested hydration, home BP check, breathing exercises"))
function signalEvent(type,med,days){
  const evalRes=evaluateRisk(med,days)
  setRisk(evalRes.category)
  timeImpact.textContent=`Estimated time-to-impact: ${evalRes.tti}`
  const text=generateExplanation(med,evalRes.category,evalRes.tti,explainLang.value)
  explainOutput.textContent=text
  setConfidence(evalRes.confidence)
}
document.getElementById("btn-qr").addEventListener("click",()=>{const med=document.getElementById("qr-med").value||"BP Medicine";signalEvent("qr",med,2)})
document.getElementById("btn-bottle").addEventListener("click",()=>{const med=document.getElementById("bottle-med").value;const days=parseInt(document.getElementById("bottle-days").value||"0",10);signalEvent("bottle",med,days)})
document.getElementById("btn-manual").addEventListener("click",()=>{const med=document.getElementById("manual-med").value;const days=parseInt(document.getElementById("manual-days").value||"0",10);signalEvent("manual",med,days)})
document.getElementById("btn-explain").addEventListener("click",()=>{const med=explainInput.value||"BP Medicine";const res=evaluateRisk(med,2);const text=generateExplanation(med,res.category,res.tti,explainLang.value);explainOutput.textContent=text;setConfidence(res.confidence)})
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
}
function setConfidence(p){trustLabel.textContent=`Confidence: ${Math.round(p)}%`}
function categoryForMed(med){
  const m=(med||"").toLowerCase().replace(/[^a-z0-9]/g,"")
  if(m.includes("bp")||m.includes("bloodpressure")||m.includes("amlodipine")||m.includes("lisinopril")||m.includes("losartan")) return "bp"
  if(m.includes("diab")||m.includes("metformin")||m.includes("insulin")||m.includes("glimepiride")||m.includes("gly")) return "diabetes"
  if(m.includes("asthma")||m.includes("inhaler")||m.includes("salbutamol")||m.includes("albuterol")) return "asthma"
  if(m.includes("thyroid")||m.includes("levothyroxine")||m.includes("eltroxin")||m.includes("thyro")) return "thyroid"
  if(m.includes("paracetamol")||m.includes("acetaminophen")||m.includes("praceta")||m.includes("acef")) return "paracetamol"
  return "other"
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
  else if(base==="paracetamol"){score=lag*0.1+drift*10}
  else {score=lag*0.15+drift*15}
  if(base==="paracetamol"){category="LOW";tti="0–2 days"}
  else {
    if(score>35&&score<=65){category="MODERATE"}
    else if(score>65){category="HIGH"}
    if(category==="LOW")tti="5–10 days"
    if(category==="HIGH")tti="1–3 days"
  }
  const confidence=base==="paracetamol" ? 75 : (70+drift*20-(lag>7?10:0))
  return {category,tti,confidence}
}
function generateExplanation(med,cat,tti,lang){
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
const demoOut=document.getElementById("demo-output")
document.getElementById("demo-1").addEventListener("click",()=>{demoOut.textContent="Maria scanned her unused BP pills. System recognized a disposal event."})
document.getElementById("demo-2").addEventListener("click",()=>{demoOut.textContent="Matched similar patients with rising BP after stoppage. Early pattern detected."})
document.getElementById("demo-3").addEventListener("click",()=>{demoOut.textContent="Risk timeline predicts MODERATE risk, impact in 3–5 days."})
document.getElementById("demo-4").addEventListener("click",()=>{demoOut.textContent=generateExplanation("BP Medicine","MODERATE","3–5 days","en")})
document.getElementById("demo-5").addEventListener("click",()=>{demoOut.textContent="Doctor alerted. Teleconsult scheduled. Caregiver notified."})
document.getElementById("demo-6").addEventListener("click",()=>{demoOut.textContent="ER visit avoided. Cost saved. Maria felt supported and safe."})
const radarOut=document.getElementById("radar-output")
document.getElementById("btn-radar").addEventListener("click",()=>{
  const sample=patients.slice(0,1000).map(p=>{const r=evaluateRisk(p.medication,Math.floor(rng()*7));return {cond:p.condition,cat:r.category}})
  const agg={Hypertension:{LOW:0,MODERATE:0,HIGH:0},Diabetes:{LOW:0,MODERATE:0,HIGH:0},Asthma:{LOW:0,MODERATE:0,HIGH:0},Thyroid:{LOW:0,MODERATE:0,HIGH:0}}
  sample.forEach(s=>agg[s.cond][s.cat]++)
  radarOut.textContent=`Hypertension: L ${agg.Hypertension.LOW}, M ${agg.Hypertension.MODERATE}, H ${agg.Hypertension.HIGH} | Diabetes: L ${agg.Diabetes.LOW}, M ${agg.Diabetes.MODERATE}, H ${agg.Diabetes.HIGH} | Asthma: L ${agg.Asthma.LOW}, M ${agg.Asthma.MODERATE}, H ${agg.Asthma.HIGH} | Thyroid: L ${agg.Thyroid.LOW}, M ${agg.Thyroid.MODERATE}, H ${agg.Thyroid.HIGH}`
})
