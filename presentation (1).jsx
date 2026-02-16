import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Line, CartesianGrid, ComposedChart } from "recharts";

const T24=52569,T25=125253,TOT=177822,N24=14,N25=18,OV=9,GR=138,CAP=7000,AVG=Math.round(T25/N25);
const fmt=n=>Math.round(n).toLocaleString("en");
const MAR=["","يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

const allP=[{d:"16 يونيو",a:12188},{d:"29 سبتمبر",a:11713},{d:"21 أكتوبر",a:11528},{d:"31 ديسمبر",a:10750},{d:"7 أبريل",a:8604},{d:"8 يوليو",a:7763},{d:"19 مايو",a:7616},{d:"6 نوفمبر",a:7552},{d:"18 أغسطس",a:7281},{d:"15 ديسمبر",a:6754},{d:"3 سبتمبر",a:5685},{d:"25 نوفمبر",a:5240},{d:"16 يوليو",a:4875},{d:"5 يناير",a:4566},{d:"5 أغسطس",a:4184},{d:"12 فبراير",a:3265},{d:"29 يناير",a:3038},{d:"3 مارس",a:2652}];

const cats=[{n:"سياسة التواصل الداخلي",v:40785,c:"#7C3AED"},{n:"البوفيه والضيافة",v:38529,c:"#8B5CF6"},{n:"القرطاسية",v:16137,c:"#A78BFA"},{n:"الصيانة والإصلاحات",v:14691,c:"#6D28D9"},{n:"الرسوم الحكومية",v:13909,c:"#D4A054"},{n:"الوقود والبنزين",v:13645,c:"#E8C77B"},{n:"النظافة",v:9126,c:"#059669"},{n:"غرفة التجارة",v:8587,c:"#4ECDC4"}];

const monthly=[
  {m:"يناير",y24:5524,y25:7603},{m:"فبراير",y24:4183,y25:3265},{m:"مارس",y24:3574,y25:2652},
  {m:"أبريل",y24:3853,y25:8604},{m:"مايو",y24:8278,y25:7616},{m:"يونيو",y24:0,y25:12188},
  {m:"يوليو",y24:7284,y25:12639},{m:"أغسطس",y24:0,y25:11465},{m:"سبتمبر",y24:8107,y25:17398},
  {m:"أكتوبر",y24:2015,y25:11528},{m:"نوفمبر",y24:5962,y25:12792},{m:"ديسمبر",y24:2335,y25:17504},
].map(d=>({...d,cap:CAP}));

const q2=[
  {cat:"رأس المال البشري",cl:"#8B5CF6",goals:[
    {t:"إطلاق منظومة العقود الثلاثية",d:"توقيع عقود البوفيه + النظافة + الصيانة خلال 45 يوم",kpi:"3 عقود موقعة بنهاية مايو"},
    {t:"برنامج «صوت الموظف للمشتريات»",d:"استبيان رقمي شهري يقيس رضا الموظفين عن الجودة",kpi:"نسبة رضا أساسية خلال يونيو"},
  ]},
  {cat:"الثقافة المؤسسية",cl:"#2563EB",goals:[
    {t:"إطلاق دليل التصنيفات الذكي",d:"11 فئة موحدة + قاعدة «إذا شككت اسأل»",kpi:"100% التزام من أول دفعة"},
    {t:"أتمتة دورة الشراء",d:"نموذج طلب شراء إلكتروني → اعتماد → أمر شراء",kpi:"إطلاق النموذج بنهاية أبريل"},
  ]},
  {cat:"العلامة التجارية",cl:"#0D9488",goals:[
    {t:"قاعدة بيانات الموردين المعتمدين",d:"نموذج تسجيل احترافي + معايير تقييم أولية",kpi:"15 مورد مسجل بنهاية يونيو"},
    {t:"هوية المراسلات الموحدة",d:"قوالب موحدة لمراسلات المشتريات",kpi:"اعتماد 5 قوالب رسمية"},
  ]},
];
const q3=[
  {cat:"رأس المال البشري",cl:"#8B5CF6",goals:[
    {t:"تقرير أثر العقود على بيئة العمل",d:"مقارنة رضا الموظفين قبل/بعد العقود",kpi:"تحسن 20%+ في رضا الموظفين"},
    {t:"ورشة ثقافة الترشيد الذكي",d:"تدريب على التوازن بين الجودة والتكلفة",kpi:"تدريب 100% من رؤساء الأقسام"},
  ]},
  {cat:"الثقافة المؤسسية",cl:"#2563EB",goals:[
    {t:"لوحة الشفافية الشهرية",d:"داشبورد يُنشر لجميع الأقسام",kpi:"3 تقارير شهرية منشورة"},
    {t:"تدقيق الالتزام بالتصنيفات",d:"مراجعة 100% من دفعات Q2",kpi:"نسبة الالتزام > 95%"},
  ]},
  {cat:"العلامة التجارية",cl:"#0D9488",goals:[
    {t:"تقييم الموردين — الجولة الأولى",d:"تقييم وفق 5 معايير",kpi:"تقييم 100% من الموردين"},
    {t:"توسيع شبكة الموردين",d:"إضافة 10 موردين جدد + حضور معرض",kpi:"25 مورد بنهاية سبتمبر"},
  ]},
];
const q4=[
  {cat:"رأس المال البشري",cl:"#8B5CF6",goals:[
    {t:"جائزة «أفضل مورد للعام»",d:"تكريم أفضل مورد بناءً على تقييمات Q3",kpi:"حفل تكريم + شهادة رسمية"},
    {t:"ميزانية 2027 مبنية على البيانات",d:"تخطيط مبني على 9 أشهر بيانات فعلية",kpi:"ميزانية 2027 معتمدة بنهاية نوفمبر"},
  ]},
  {cat:"الثقافة المؤسسية",cl:"#2563EB",goals:[
    {t:"تقرير الحوكمة السنوي",d:"التوفير المحقق + نسبة الالتزام + التوصيات",kpi:"تقرير معتمد للإدارة التنفيذية"},
    {t:"سياسة المشتريات v2.0",d:"تحديث السياسة + آلية المراجعة الدورية",kpi:"اعتماد النسخة المحدثة"},
  ]},
  {cat:"العلامة التجارية",cl:"#0D9488",goals:[
    {t:"نشر سياسة المشتريات للموردين",d:"صفحة على موقع الشركة + تسجيل إلكتروني",kpi:"صفحة منشورة + 5 تسجيلات"},
    {t:"شراكات استراتيجية طويلة الأمد",d:"تحويل أفضل 3 موردين لشراكات تفضيلية",kpi:"3 اتفاقيات إطارية"},
  ]},
];

const Tip=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return <div style={{background:"#1a1035",border:"1px solid #3D2D6B",borderRadius:12,padding:"10px 14px",direction:"rtl"}}>
    <div style={{color:"#E8C77B",fontSize:13,fontWeight:700,marginBottom:4}}>{label}</div>
    {payload.map((p,i)=><div key={i} style={{color:p.color||"#A99BC8",fontSize:12}}>{p.name}: {fmt(p.value)} ر.س</div>)}
  </div>;
};

const KPI=({label,value,sub,color})=>(
  <div style={{position:"relative",background:"#fff",borderRadius:16,padding:"20px 22px",boxShadow:"0 2px 16px rgba(83,70,124,0.08)",overflow:"hidden",minWidth:0}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:color}}/>
    <div style={{color:"#7B6BA5",fontSize:11,fontWeight:500,marginBottom:4}}>{label}</div>
    <div style={{color,fontSize:26,fontWeight:800,fontFamily:"'Playfair Display',Georgia,serif"}}>{value}</div>
    {sub&&<div style={{color:"#9CA3AF",fontSize:10,marginTop:2}}>{sub}</div>}
  </div>
);

const QSlide=({qData,qNum,qTitle,qSub})=>(
  <div style={{padding:"0 40px"}}>
    <div style={{display:"grid",gap:16}}>
      {qData.map((cat,ci)=>(
        <div key={ci}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:14,height:14,borderRadius:4,background:cat.cl}}/>
            <span style={{color:cat.cl,fontWeight:700,fontSize:14,fontFamily:"'Playfair Display',Georgia,serif"}}>{cat.cat}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {cat.goals.map((g,gi)=>(
              <div key={gi} style={{background:"#fff",borderRadius:14,padding:"16px 18px",boxShadow:"0 2px 12px rgba(83,70,124,0.06)",borderRight:`4px solid ${cat.cl}`}}>
                <div style={{color:"#1F1535",fontSize:13,fontWeight:700,marginBottom:4}}>{g.t}</div>
                <div style={{color:"#7B6BA5",fontSize:11,lineHeight:1.5,marginBottom:8}}>{g.d}</div>
                <div style={{background:`${cat.cl}12`,borderRadius:8,padding:"6px 10px"}}>
                  <span style={{color:cat.cl,fontSize:11,fontWeight:700}}>KPI: </span>
                  <span style={{color:cat.cl,fontSize:11}}>{g.kpi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SLIDES=[
  {id:1,title:"الغلاف",num:""},
  {id:2,title:"داشبورد الإنفاق",num:"01"},
  {id:3,title:"التوزيع والدفعات",num:"02"},
  {id:4,title:"المنهجية",num:"03"},
  {id:5,title:"الأهداف الاستراتيجية",num:"04"},
  {id:6,title:"الربع الثاني",num:"Q2"},
  {id:7,title:"الربع الثالث",num:"Q3"},
  {id:8,title:"الربع الرابع",num:"Q4"},
  {id:9,title:"الخلاصة",num:""},
];

export default function App(){
  const [slide,setSlide]=useState(0);
  const [anim,setAnim]=useState(true);
  const ref=useRef();

  useEffect(()=>{setAnim(false);const t=setTimeout(()=>setAnim(true),50);return()=>clearTimeout(t);},[slide]);

  const go=(n)=>{if(n>=0&&n<SLIDES.length)setSlide(n);};

  const sty={
    wrap:{width:"100%",maxWidth:960,margin:"0 auto",fontFamily:"'Playfair Display','Noto Kufi Arabic',Georgia,serif",direction:"rtl",position:"relative",background:"#FAFAFA",minHeight:"100vh"},
    nav:{position:"sticky",top:0,zIndex:50,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid #E5E0F0",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"},
    slideWrap:{padding:"24px 0",opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(12px)",transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)"},
    header:{textAlign:"center",padding:"0 40px 20px"},
    h1:{fontSize:28,fontWeight:800,color:"#1F1535",margin:0,lineHeight:1.4},
    sub:{fontSize:13,color:"#7B6BA5",marginTop:4},
    card:{background:"#fff",borderRadius:18,padding:24,boxShadow:"0 2px 20px rgba(83,70,124,0.06)",margin:"0 40px 16px"},
  };

  const renderSlide=()=>{
    switch(slide){
      case 0: return (
        <div style={{textAlign:"center",padding:"60px 40px 40px"}}>
          <div style={{display:"inline-block",background:"linear-gradient(135deg,#53467C,#8B5CF6)",borderRadius:24,padding:"48px 60px",color:"#fff",maxWidth:700,width:"100%",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:"linear-gradient(90deg,#D4A054,#E8C77B)"}}/>
            <div style={{fontSize:16,opacity:0.7,marginBottom:8,fontFamily:"Calibri,sans-serif"}}>شركة قيمة المالية · Value Capital</div>
            <div style={{fontSize:36,fontWeight:800,lineHeight:1.3,marginBottom:8}}>خطة ترشيد وتنظيم</div>
            <div style={{fontSize:36,fontWeight:800,lineHeight:1.3,marginBottom:4}}>المشتريات والصندوق النثري</div>
            <div style={{fontSize:64,fontWeight:900,color:"#E8C77B",margin:"16px 0"}}>2026</div>
            <div style={{fontSize:14,opacity:0.8,fontFamily:"Calibri,sans-serif",fontStyle:"italic"}}>من التكلفة إلى الاستثمار — ROEI Approach</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:24}}>
            {[{v:fmt(TOT),l:"إجمالي الإنفاق (ر.س)"},{v:`+${GR}%`,l:"نمو الإنفاق"},{v:`${OV}/${N25}`,l:"تجاوزات 2025"},{v:"25K+",l:"التوفير المستهدف"}].map((k,i)=>
              <div key={i} style={{background:"#fff",borderRadius:14,padding:"16px 12px",boxShadow:"0 2px 12px rgba(83,70,124,0.06)"}}>
                <div style={{fontSize:24,fontWeight:800,color:"#53467C"}}>{k.v}</div>
                <div style={{fontSize:11,color:"#7B6BA5",marginTop:2,fontFamily:"Calibri,sans-serif"}}>{k.l}</div>
              </div>
            )}
          </div>
        </div>
      );

      case 1: return (
        <div>
          <div style={{...sty.header}}><h1 style={sty.h1}>داشبورد الإنفاق</h1><div style={sty.sub}>تحليل {N24+N25} دفعة فعلية · 2024-2025</div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,padding:"0 40px 16px"}}>
            <KPI label="إجمالي 2024" value={fmt(T24)} sub={`${N24} دفعة`} color="#7B6BA5"/>
            <KPI label="إجمالي 2025" value={fmt(T25)} sub={`${N25} دفعة`} color="#8B5CF6"/>
            <KPI label="التجاوزات" value={`${OV} دفعات`} sub={`من ${N25} (${Math.round(OV/N25*100)}%)`} color="#DC2626"/>
            <KPI label="المتوسط/دفعة" value={`${fmt(AVG)}`} sub={`السقف: ${fmt(CAP)} ر.س`} color="#EA580C"/>
          </div>
          <div style={sty.card}>
            <div style={{color:"#1F1535",fontSize:14,fontWeight:700,marginBottom:12}}>الإنفاق الشهري مقابل السقف</div>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="#E5E0F0"/><XAxis dataKey="m" tick={{fill:"#7B6BA5",fontSize:10}}/><YAxis tick={{fill:"#7B6BA5",fontSize:10}}/><Tooltip content={<Tip/>}/>
              <Bar dataKey="y24" name="2024" fill="#C4B5FD" radius={[4,4,0,0]}/><Bar dataKey="y25" name="2025" fill="#8B5CF6" radius={[4,4,0,0]}/>
              <Line dataKey="cap" name="السقف" stroke="#DC2626" strokeWidth={2} strokeDasharray="6 3" dot={false}/></ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      );

      case 2: return (
        <div>
          <div style={{...sty.header}}><h1 style={sty.h1}>أين يذهب المال؟</h1><div style={sty.sub}>توزيع الإنفاق + جميع دفعات 2025</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,padding:"0 40px"}}>
            <div style={{background:"#fff",borderRadius:18,padding:20,boxShadow:"0 2px 20px rgba(83,70,124,0.06)"}}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart><Pie data={cats} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="v">
                  {cats.map((c,i)=><Cell key={i} fill={c.c}/>)}</Pie>
                <Tooltip formatter={v=>`${fmt(v)} ر.س`} contentStyle={{background:"#1a1035",border:"1px solid #3D2D6B",borderRadius:10,direction:"rtl"}} itemStyle={{color:"#A99BC8"}}/></PieChart>
              </ResponsiveContainer>
              <div style={{marginTop:8}}>
                {cats.slice(0,6).map(c=>{const pct=Math.round(c.v/TOT*100);return(
                  <div key={c.n} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:c.c,flexShrink:0}}/>
                    <span style={{flex:1,fontSize:11,color:"#1F1535"}}>{c.n}</span>
                    <span style={{fontSize:11,fontWeight:700,color:c.c}}>{fmt(c.v)}</span>
                    <span style={{fontSize:10,color:"#9CA3AF",width:30,textAlign:"center"}}>{pct}%</span>
                  </div>
                );})}
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:18,padding:20,boxShadow:"0 2px 20px rgba(83,70,124,0.06)",maxHeight:460,overflowY:"auto"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#1F1535",marginBottom:10}}>جميع دفعات 2025 ({N25} دفعة)</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:"2px solid #EDE9FE"}}>
                  <th style={{padding:"6px 8px",textAlign:"right",color:"#7B6BA5",fontWeight:600}}>التاريخ</th>
                  <th style={{padding:"6px 8px",textAlign:"center",color:"#7B6BA5",fontWeight:600}}>المبلغ</th>
                  <th style={{padding:"6px 8px",textAlign:"center",color:"#7B6BA5",fontWeight:600}}>الحالة</th>
                </tr></thead>
                <tbody>{allP.map((p,i)=>{const ov=p.a>CAP;return(
                  <tr key={i} style={{background:ov?"#FEE2E2":i%2===0?"#FAFAFA":"#fff",borderBottom:"1px solid #F3F0FA"}}>
                    <td style={{padding:"5px 8px",color:"#1F1535"}}>{p.d}</td>
                    <td style={{padding:"5px 8px",textAlign:"center",fontWeight:ov?700:400,color:ov?"#DC2626":"#1F1535"}}>{fmt(p.a)}</td>
                    <td style={{padding:"5px 8px",textAlign:"center"}}><span style={{display:"inline-block",padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600,background:ov?"#FEE2E2":"#D1FAE5",color:ov?"#DC2626":"#059669"}}>{ov?`+${fmt(p.a-CAP)}`:"ضمن السقف"}</span></td>
                  </tr>
                );})}</tbody>
              </table>
            </div>
          </div>
        </div>
      );

      case 3: return (
        <div style={{padding:"0 40px"}}>
          <div style={{...sty.header,padding:"0 0 20px"}}><h1 style={sty.h1}>المنهجية — ليست تكلفة، بل استثمار</h1><div style={sty.sub}>ROEI — Return on Employee Investment</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:20}}>
            {[{t:"الوضع الحالي",cl:"#DC2626",bg:"#FEE2E2",items:["إنفاق 125K بدون سقف","50% تجاوزات","تصنيفات غير متسقة","شراء تجزئة مكلف"],em:"⚠️"},
              {t:"المنهجية المقترحة",cl:"#D4A054",bg:"#FEF3C7",items:["عقود إطارية (34K)","دليل تصنيفات موحد","نماذج إلكترونية","داشبورد شهري"],em:"💡"},
              {t:"الوضع المستهدف",cl:"#059669",bg:"#D1FAE5",items:["103K ميزانية مضبوطة","صفر تجاوزات","شفافية كاملة","توفير 25K+ سنوياً"],em:"⭐"},
            ].map((b,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:18,padding:"24px 20px",boxShadow:"0 2px 16px rgba(83,70,124,0.06)",borderTop:`4px solid ${b.cl}`,textAlign:"center"}}>
                <div style={{fontSize:36,marginBottom:8}}>{b.em}</div>
                <div style={{fontSize:15,fontWeight:800,color:b.cl,marginBottom:12}}>{b.t}</div>
                {b.items.map((it,j)=><div key={j} style={{background:b.bg,borderRadius:8,padding:"6px 12px",marginBottom:6,fontSize:12,color:"#1F1535"}}>◆ {it}</div>)}
              </div>
            ))}
          </div>
          <div style={{background:"linear-gradient(135deg,#53467C,#3D2D6B)",borderRadius:18,padding:"20px 28px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {[{l:"صندوق نثري",v:"69,200",d:"المصاريف اليومية"},{l:"عقد البوفيه",v:"~15,000",d:"توريد شامل"},{l:"عقد النظافة",v:"~12,000",d:"عقد رسمي"},{l:"عقد الصيانة",v:"~7,000",d:"صيانة دورية"}].map((b,i)=>
              <div key={i} style={{textAlign:"center"}}>
                <div style={{color:"#C4B5FD",fontSize:11,fontWeight:600}}>{b.l}</div>
                <div style={{color:"#fff",fontSize:22,fontWeight:800,margin:"4px 0"}}>{b.v}</div>
                <div style={{color:"#7B6BA5",fontSize:10}}>{b.d}</div>
              </div>
            )}
          </div>
        </div>
      );

      case 4: return (
        <div style={{padding:"0 40px"}}>
          <div style={{...sty.header,padding:"0 0 20px"}}><h1 style={sty.h1}>ربط المشتريات بالأهداف الاستراتيجية</h1></div>
          {[{n:"01",t:"تنمية رأس المال البشري",d:"بيئة عمل محفزة عبر عقود احترافية",link:"عقود البوفيه + النظافة + الصيانة = بيئة تعزز الإنتاجية والولاء",cl:"#8B5CF6",bg:"#EDE9FE"},
            {n:"02",t:"تعزيز الثقافة المؤسسية",d:"حوكمة المشتريات ترسخ الشفافية والمساءلة",link:"تصنيفات موحدة + نماذج إلكترونية + تقارير دورية = مؤسسية ناضجة",cl:"#2563EB",bg:"#DBEAFE"},
            {n:"03",t:"تعزيز الوعي بالعلامة التجارية",d:"التعامل الاحترافي يعكس صورة قيمة المالية",link:"عقود رسمية + تقييم موردين + قاعدة بيانات = سمعة مهنية",cl:"#0D9488",bg:"#CCFBF1"},
          ].map((g,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:18,padding:"20px 24px",marginBottom:14,boxShadow:"0 2px 16px rgba(83,70,124,0.06)",borderRight:`5px solid ${g.cl}`}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                <span style={{fontSize:28,fontWeight:900,color:g.cl,opacity:0.3}}>{g.n}</span>
                <div><div style={{fontSize:16,fontWeight:800,color:"#1F1535"}}>{g.t}</div><div style={{fontSize:12,color:"#7B6BA5"}}>{g.d}</div></div>
              </div>
              <div style={{background:g.bg,borderRadius:10,padding:"8px 14px",fontSize:12,color:g.cl,fontWeight:600}}>← {g.link}</div>
            </div>
          ))}
        </div>
      );

      case 5: return (
        <div>
          <div style={{...sty.header}}><h1 style={sty.h1}>الربع الثاني — أبريل → يونيو 2026</h1><div style={sty.sub}>مرحلة التأسيس والإطلاق</div></div>
          <QSlide qData={q2}/>
        </div>
      );
      case 6: return (
        <div>
          <div style={{...sty.header}}><h1 style={sty.h1}>الربع الثالث — يوليو → سبتمبر 2026</h1><div style={sty.sub}>مرحلة القياس والتحسين</div></div>
          <QSlide qData={q3}/>
        </div>
      );
      case 7: return (
        <div>
          <div style={{...sty.header}}><h1 style={sty.h1}>الربع الرابع — أكتوبر → ديسمبر 2026</h1><div style={sty.sub}>مرحلة التميز والاستدامة</div></div>
          <QSlide qData={q4}/>
        </div>
      );

      case 8: return (
        <div style={{textAlign:"center",padding:"40px"}}>
          <div style={{background:"linear-gradient(135deg,#53467C,#3D2D6B)",borderRadius:24,padding:"48px 40px",color:"#fff",maxWidth:750,margin:"0 auto"}}>
            <div style={{fontSize:32,fontWeight:800,marginBottom:4}}>الخلاصة</div>
            <div style={{width:60,height:3,background:"#D4A054",margin:"12px auto 28px",borderRadius:2}}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
              {[{v:"103K",l:"ميزانية مضبوطة",c:"#8B5CF6"},{v:"25K+",l:"توفير سنوي",c:"#059669"},{v:"0",l:"تجاوزات مستهدفة",c:"#D4A054"},{v:"18",l:"هدف مبتكر",c:"#fff"}].map((s,i)=>
                <div key={i}><div style={{fontSize:36,fontWeight:900,color:s.c}}>{s.v}</div><div style={{fontSize:11,color:"#C4B5FD",marginTop:4}}>{s.l}</div></div>
              )}
            </div>
            <div style={{background:"rgba(255,255,255,0.08)",borderRadius:16,padding:"20px 24px",textAlign:"right"}}>
              <div style={{color:"#D4A054",fontSize:15,fontWeight:700,marginBottom:12,textAlign:"center"}}>رؤيتنا: تحويل المشتريات من مركز تكلفة إلى شريك استراتيجي</div>
              {["Q2: تأسيس المنظومة — عقود + تصنيفات + أتمتة + قاعدة موردين","Q3: قياس الأثر — داشبورد شفافية + تقييم موردين + تدريب","Q4: استدامة التميز — حوكمة + شراكات + ميزانية 2027 ذكية"].map((t,i)=>
                <div key={i} style={{fontSize:13,color:"#C4B5FD",marginBottom:8,lineHeight:1.6}}>◆ {t}</div>
              )}
            </div>
          </div>
          <div style={{marginTop:20,color:"#7B6BA5",fontSize:12}}>شركة قيمة المالية · إدارة رأس المال البشري والشؤون الإدارية</div>
        </div>
      );
    }
  };

  return (
    <div style={sty.wrap}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800;900&family=Noto+Kufi+Arabic:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={sty.nav}>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>go(slide-1)} disabled={slide===0} style={{width:34,height:34,borderRadius:10,border:"1px solid #E5E0F0",background:slide===0?"#F8F6FC":"#fff",color:slide===0?"#ccc":"#53467C",cursor:slide===0?"default":"pointer",fontSize:16,fontWeight:700}}>→</button>
          <button onClick={()=>go(slide+1)} disabled={slide===SLIDES.length-1} style={{width:34,height:34,borderRadius:10,border:"1px solid #E5E0F0",background:slide===SLIDES.length-1?"#F8F6FC":"#fff",color:slide===SLIDES.length-1?"#ccc":"#53467C",cursor:slide===SLIDES.length-1?"default":"pointer",fontSize:16,fontWeight:700}}>←</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",justifyContent:"center",flex:1,padding:"0 12px"}}>
          {SLIDES.map((s,i)=>(
            <button key={i} onClick={()=>go(i)} style={{padding:"4px 10px",borderRadius:8,border:"none",fontSize:10,fontWeight:slide===i?700:500,fontFamily:"'Noto Kufi Arabic',sans-serif",
              background:slide===i?"#8B5CF6":"transparent",color:slide===i?"#fff":"#7B6BA5",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap"}}>
              {s.num?`${s.num} `:" "}{s.title}
            </button>
          ))}
        </div>
        <div style={{color:"#7B6BA5",fontSize:11,fontWeight:600,minWidth:40,textAlign:"left"}}>{slide+1}/{SLIDES.length}</div>
      </div>
      <div style={sty.slideWrap} ref={ref}>{renderSlide()}</div>
    </div>
  );
}
