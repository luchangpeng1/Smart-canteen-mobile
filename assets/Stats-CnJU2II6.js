import{m as _,S as z,V as Y,o as E,G as T,q as S,t as n,b as c,J as $,L as N,w as d,af as O,ag as D,ah as R,e as f,a as y,c as F,D as x,M as A,r as B,y as b,ai as U,aj as W,ak as C,al as j,am as q,an as G}from"./vendor-MJUihXSy.js";import{_ as J}from"./_plugin-vue_export-helper-DlAUqK2U.js";const P={class:"mobile-stats"},H={class:"page-header"},I={class:"stat-cards"},K={class:"stat-content"},Q={class:"stat-info"},X={class:"stat-title"},Z={class:"stat-value"},ee={class:"chart-header"},te={__name:"Stats",setup(ae){const i=_("week"),h=_(null);let s=null;const v=_(new Date().toISOString().split("T")[0]),k=_([]),L=t=>t>new Date,w=z(()=>{const t=new Date(v.value);if(i.value==="week"){const e=U(t,{weekStartsOn:1}),o=W(t,{weekStartsOn:1});return C({start:e,end:o})}else{const e=j(t),o=q(t);return C({start:e,end:o})}}),m=t=>({revenue:Math.floor(Math.random()*1e4),orders:Math.floor(Math.random()*200),customers:Math.floor(Math.random()*1500),averageOrder:Math.floor(Math.random()*100)}),V=async t=>{t||(t=new Date().toISOString().split("T")[0]),v.value=t,await M(t),g()},M=async t=>{try{const e=m(new Date(t)),o=m(O(new Date(t),1)),u=w.value.reduce((p,a)=>p+m(a).revenue,0),r=w.value.reduce((p,a)=>p+m(O(a,7)).revenue,0),l=((u-r)/r*100).toFixed(1);k.value=[{title:"今日营业额",value:`¥${e.revenue.toFixed(2)}`,trend:((e.revenue-o.revenue)/o.revenue*100).toFixed(1)},{title:"今日订单数",value:e.orders.toString(),trend:((e.orders-o.orders)/o.orders*100).toFixed(1)},{title:i.value==="week"?"本周营业额":"本月营业额",value:`¥${u.toFixed(2)}`,trend:Number(l)},{title:"平均客单价",value:`¥${e.averageOrder.toFixed(2)}`,trend:((e.averageOrder-o.averageOrder)/o.averageOrder*100).toFixed(1)}]}catch(e){console.error("获取统计数据失败:",e)}},g=()=>{if(!h.value)return;const t=w.value,e=t.map(r=>m().revenue),o=t.map(r=>i.value==="week"?D(r,"EEE",{locale:G}):D(r,"d日"));s=R(h.value);const u={tooltip:{trigger:"axis",formatter:r=>{const[l]=r;return`${D(t[l.dataIndex],"yyyy-MM-dd")}<br/>
                营业额: ¥${l.value.toFixed(2)}`}},grid:{top:"15%",left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:o,axisLine:{lineStyle:{color:"#e5e6eb"}},axisTick:{show:!1},axisLabel:{color:"#86909c"}},yAxis:{type:"value",axisLine:{show:!1},axisTick:{show:!1},splitLine:{lineStyle:{color:"#e5e6eb",type:"dashed"}},axisLabel:{color:"#86909c",formatter:r=>`¥${r}`}},series:[{data:e,type:"line",smooth:!0,symbol:"circle",symbolSize:8,itemStyle:{color:"#165DFF"},lineStyle:{width:3,color:"#165DFF"},areaStyle:{color:{type:"linear",x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:"rgba(22,93,255,0.15)"},{offset:1,color:"rgba(22,93,255,0.01)"}]}}}]};s.setOption(u)};return Y(i,()=>{g()}),E(async()=>{await M(v.value),g(),window.addEventListener("resize",()=>s==null?void 0:s.resize())}),T(()=>{s==null||s.dispose(),window.removeEventListener("resize",()=>s==null?void 0:s.resize())}),(t,e)=>{const o=f("el-date-picker"),u=f("el-icon"),r=f("el-card"),l=f("el-radio-button"),p=f("el-radio-group");return y(),S("div",P,[n("div",H,[e[2]||(e[2]=n("h2",null,"营业统计",-1)),c(o,{modelValue:v.value,"onUpdate:modelValue":e[0]||(e[0]=a=>v.value=a),type:"date",size:"small",placeholder:"选择日期",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD","disabled-date":L,onChange:V},null,8,["modelValue"])]),n("div",I,[(y(!0),S($,null,N(k.value,a=>(y(),F(r,{key:a.title,class:"stat-card"},{default:d(()=>[n("div",K,[n("div",Q,[n("div",X,x(a.title),1),n("div",Z,x(a.value),1)]),n("div",{class:A(["stat-trend",{up:a.trend>0,down:a.trend<0}])},[c(u,null,{default:d(()=>[(y(),F(B(a.trend>0?"ArrowUp":"ArrowDown")))]),_:2},1024),b(" "+x(Math.abs(a.trend))+"% ",1)],2)])]),_:2},1024))),128))]),c(r,{class:"chart-card"},{header:d(()=>[n("div",ee,[e[5]||(e[5]=n("span",null,"营业趋势",-1)),c(p,{modelValue:i.value,"onUpdate:modelValue":e[1]||(e[1]=a=>i.value=a),size:"small"},{default:d(()=>[c(l,{value:"week"},{default:d(()=>e[3]||(e[3]=[b("周")])),_:1}),c(l,{value:"month"},{default:d(()=>e[4]||(e[4]=[b("月")])),_:1})]),_:1},8,["modelValue"])])]),default:d(()=>[n("div",{ref_key:"trendChart",ref:h,class:"chart"},null,512)]),_:1})])}}},se=J(te,[["__scopeId","data-v-ba5cf67e"]]);export{se as default};
