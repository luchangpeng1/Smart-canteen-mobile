import{m as f,S as G,U as j,V as le,o as xe,q as r,t as l,b as a,w as n,D as d,y as m,u as h,c as M,d as y,J as U,L as R,E as v,W as O,n as Ve,e as g,a as i,X as na,Y as me,Z as oa,_ as ia,$ as Le,a0 as Fe,a1 as da,a2 as ua,a3 as We,a4 as Qe,a5 as De,M as pe,a6 as Je,a7 as Xe,v as Ze,a8 as Ge,a9 as Ke,aa as ra,ab as ca,ac as ma,F as pa}from"./vendor-DLSupzTO.js";import{_ as va}from"./_plugin-vue_export-helper-DlAUqK2U.js";const fa="/Smart-canteen-mobile/assets/%E5%8F%AE%E5%92%9A-C5IQiY7P.mp3",_a={class:"mobile-orders"},ga={class:"window-control"},ya={class:"window-info"},ha={class:"header-top"},wa={class:"canteen-name"},ka={class:"floor-info"},ba={class:"header-bottom"},Ca={class:"status-controls"},Ta=["src"],xa={key:1,class:"upload-placeholder"},Va={class:"time-periods-container"},Da={class:"time-pickers"},Ma={class:"dialog-footer"},Sa={class:"tabs-wrapper"},$a={class:"history-entry"},Ya={key:0,class:"search-filter-area"},za={class:"search-bar"},Na={class:"filter-toolbar"},Aa={class:"toolbar-left"},ja={key:3,class:"price-range"},Ua={key:1,class:"auto-accept-controls"},Oa={class:"auto-accept-switch"},Ba={class:"auto-accept-actions"},Ia={class:"settings-content"},Ra={class:"smart-adjust-wrapper"},Ha={key:0,class:"hint-text"},Pa={class:"drawer-footer"},Ea={key:2,class:"batch-toolbar"},qa={class:"selected-count"},La={class:"batch-actions"},Fa={key:3,class:"stats-cards"},Wa={class:"stat-card"},Qa={class:"stat-value"},Ja={class:"stat-card"},Xa={class:"stat-value"},Za={class:"stat-card"},Ga={class:"stat-value"},Ka={key:4,class:"order-list"},es={class:"date-header"},ts={class:"date-text"},as={class:"order-count"},ss={class:"order-card-header"},ls={class:"order-basic-info"},ns={class:"order-info"},os={class:"order-info-left"},is={class:"order-no"},ds={key:0,class:"order-meta"},us={class:"order-time"},rs={class:"customer-info"},cs={class:"order-no"},ms={class:"order-items"},ps={class:"items-header"},vs={class:"order-items-grid"},fs={key:0,class:"item-image"},_s=["src","alt"],gs={class:"item-content"},ys={class:"item-info"},hs={class:"item-name"},ws={key:0,class:"item-specs"},ks={class:"item-price-info"},bs={class:"item-quantity"},Cs={class:"item-price"},Ts={class:"order-footer"},xs={class:"order-total"},Vs={class:"total-info"},Ds={class:"total-price"},Ms={key:0,class:"order-remark"},Ss={class:"order-actions"},$s={class:"order-card-header"},Ys={class:"order-basic-info"},zs={class:"order-info"},Ns={class:"order-info-left"},As={class:"order-no"},js={key:1,class:"order-no"},Us={key:0,class:"order-meta"},Os={class:"order-time"},Bs={class:"customer-info"},Is={class:"student-id"},Rs={class:"order-items"},Hs={class:"items-header"},Ps={class:"order-items-grid"},Es={key:0,class:"item-image"},qs=["src","alt"],Ls={class:"item-content"},Fs={class:"item-info"},Ws={class:"item-name"},Qs={key:0,class:"item-specs"},Js={class:"item-price-info"},Xs={class:"item-quantity"},Zs={class:"item-price"},Gs={class:"order-footer"},Ks={class:"order-total"},el={class:"total-info"},tl={class:"total-price"},al={key:0,class:"order-remark"},sl={class:"order-actions"},ll={key:5,class:"pagination-container"},nl={key:6,class:"load-more"},ol={key:0},il={key:1},dl={class:"refund-filter"},ul={class:"refund-list"},rl={class:"refund-header"},cl={class:"refund-info"},ml={class:"order-info-row"},pl={class:"order-no"},vl={class:"refund-time"},fl={class:"refund-content"},_l={class:"refund-user-info"},gl={class:"user-details"},yl={class:"user-name"},hl={class:"user-id"},wl={class:"refund-amount-tag"},kl={class:"amount"},bl={class:"refund-details"},Cl={class:"refund-reason-box"},Tl={class:"reason-header"},xl={class:"reason-tag"},Vl={key:0,class:"description"},Dl={key:0,class:"refund-images"},Ml={class:"images-header"},Sl={class:"image-count"},$l={class:"image-list"},Yl={class:"image-error"},zl={key:0,class:"refund-actions"},Nl={class:"pagination-container"},Al={__name:"Orders",setup(jl){const Me=pa(),w=f("pending"),k=f([]),b=f([]),L=f(!1),ne=f(!1),et=f(1),W=f(10),oe=f(0),F=f("");f(!1),f({diningType:"",dateRange:[]});const ie=f({orderCount:0,revenue:0,avgTime:0}),T=f(""),Y=f(""),S=f({min:null,max:null}),z=f([]),H=f(1),de=f(0),ue=f(!1),Se=f("sound"),K=f(!1),N=f({timeRange:[new Date(2e3,1,1,8,0),new Date(2e3,1,1,20,0)],maxOrders:5,rejectConditions:[],maxOrderAmount:100}),ve=f(!1),$e=f(!1),Ye=f(!1),tt=[{text:"最近一周",value:()=>{const t=new Date,e=new Date;return e.setTime(e.getTime()-3600*1e3*24*7),[e,t]}},{text:"最近一月",value:()=>{const t=new Date,e=new Date;return e.setTime(e.getTime()-3600*1e3*24*30),[e,t]}},{text:"本月",value:()=>{const t=new Date;return[new Date(t.getFullYear(),t.getMonth(),1),t]}}],at=G(()=>!T.value||!Y.value&&T.value!=="total"&&T.value!=="date"?k.value:k.value.filter(t=>{switch(T.value){case"date":if(!z.value||!z.value.length)return!0;const e=j(t.createTime).format("YYYY-MM-DD"),o=z.value[0],p=z.value[1];return e>=o&&e<=p;case"orderNo":return t.orderNo.toLowerCase().includes(Y.value.toLowerCase());case"studentName":return t.studentName.includes(Y.value);case"diningType":return t.diningType===Y.value;case"total":const _=S.value.min??0,B=S.value.max??1/0;return t.total>=_&&t.total<=B;default:return!0}})),ze=t=>t.reduce((e,o)=>e+o.quantity,0),st=()=>{ie.value={orderCount:47,revenue:1268,avgTime:15}},lt=t=>["待处理","进行中"].includes(t.status),fe=Array(20).fill(null).map((t,e)=>{const p=["待处理","进行中","已完成"][Math.floor(e/7)],_=p==="待处理"?Math.floor(Math.random()*30):p==="进行中"?Math.floor(Math.random()*120)+30:Math.floor(Math.random()*24*60)+150,B=[{name:"红烧肉",price:15},{name:"宫保鸡丁",price:16},{name:"鱼香肉丝",price:14},{name:"麻婆豆腐",price:12},{name:"青椒肉丝",price:13},{name:"回锅肉",price:15},{name:"水煮肉片",price:18},{name:"糖醋里脊",price:16}],c=["常规份量","加量","微辣","特辣"],$=Math.floor(Math.random()*2)+1,I=B.sort(()=>Math.random()-.5).slice(0,$).map((x,D)=>({id:e*10+D*2+1,name:x.name,quantity:Math.floor(Math.random()*2)+1,price:x.price,specs:c[Math.floor(Math.random()*c.length)]}));I.push({id:e*10+$*2,name:"米饭",quantity:Math.floor(Math.random()*2)+1,price:2,specs:Math.random()>.5?"常规份量":"大份"});const X=I.reduce((x,D)=>x+D.price*D.quantity,0),Z=["不要辣","少放盐","打包带走","加饭","多放点青菜",""];return{id:String(e+1),orderNo:`DD${j().format("YYYYMMDD")}${String(e+1).padStart(3,"0")}`,status:p,createTime:j().subtract(_,"minute").valueOf(),studentName:["张三","李四","王五","赵六","钱七","孙八","周九","吴十"][Math.floor(Math.random()*8)],studentId:`2024${String(Math.floor(Math.random()*1e3)+1).padStart(4,"0")}`,diningType:Math.random()>.5?"堂食":"外带",items:I,total:X,isNew:p==="待处理"&&Math.random()>.7,remark:Z[Math.floor(Math.random()*Z.length)],expanded:!1}});fe.sort((t,e)=>e.createTime-t.createTime);const P=async(t=!1)=>{if(!L.value)try{L.value=!0,t&&(et.value=1,k.value=[],ne.value=!1);const e={pending:"待处理",processing:"进行中",completed:"已完成"};let o=fe.filter(c=>c.status===e[w.value]);if(F.value){const c=F.value.toLowerCase();o=o.filter($=>$.orderNo.toLowerCase().includes(c)||$.studentName.toLowerCase().includes(c))}T.value&&(o=o.filter(c=>{switch(T.value){case"date":if(!z.value||!z.value.length)return!0;const $=j(c.createTime).format("YYYY-MM-DD"),I=z.value[0],X=z.value[1];return $>=I&&$<=X;case"orderNo":return c.orderNo.toLowerCase().includes(Y.value.toLowerCase());case"studentName":return c.studentName.includes(Y.value);case"diningType":return c.diningType===Y.value;case"total":const Z=S.value.min??0,x=S.value.max??1/0;return c.total>=Z&&c.total<=x;default:return!0}}));const p=(H.value-1)*W.value,_=p+W.value,B=o.slice(p,_);k.value=B,de.value=o.length,ne.value=_>=o.length}catch(e){console.error(e),v.error("获取订单列表失败")}finally{L.value=!1}},nt=t=>{W.value=t,P(!0)},ot=t=>{H.value=t,P(!0)};le(w,()=>{H.value=1,W.value=10,P(!0)});const Q=t=>j(t).format("HH:mm:ss"),Ne=t=>({待处理:"warning",进行:"primary",已完成:"success",已取消:"info"})[t]||"info",it=async t=>{try{await O.confirm("确定接受此订单吗？"),t.status="进行中",v.success("已接单")}catch{}},dt=async t=>{try{const{value:e}=await O.prompt("请输入拒绝原因",{confirmButtonText:"确定",cancelButtonText:"取消"});e&&(t.status="已取消",v.success("已拒绝订单"))}catch{}},ut=async t=>{try{await O.confirm("确定完成此订单吗？"),t.status="已完成",v.success("订单已完成")}catch{}},rt=async()=>{try{await O.confirm(`确定接受选中的 ${b.value.length} 个订单吗？`),k.value.forEach(t=>{b.value.includes(t.id)&&(t.status="进行中")}),b.value=[],v.success("批量接单成功")}catch{}},ct=async()=>{try{await O.confirm(`确定完成选中的 ${b.value.length} 个订单吗？`),k.value.forEach(t=>{b.value.includes(t.id)&&(t.status="已完成")}),b.value=[],v.success("批量完成订单成功")}catch{}},mt=()=>{setInterval(()=>{if(Math.random()>.3&&w.value==="pending"){const t={id:`new-${Date.now()}`,orderNo:`DD${j().format("YYYYMMDD")}${String(Math.floor(Math.random()*1e3)).padStart(3,"0")}`,status:"待处理",createTime:Date.now(),items:[{id:1,name:"红烧肉",quantity:1,price:15},{id:2,name:"米饭",quantity:1,price:2}],total:17,isNew:!0};k.value.unshift(t),oe.value++,new Audio(fa).play()}},5e5)};xe(()=>{P(!0),mt(),st()}),le(w,()=>{w.value==="pending"&&(oe.value=0)});const pt=t=>{b.value=t},vt=()=>{T.value="",Y.value="",z.value=[],S.value={min:null,max:null},H.value=1,P(!0)},ft=()=>{"vibrate"in navigator&&navigator.vibrate(50)},_t=async(t,e)=>{try{await updateOrderStatus(t.id,e),new Audio(statusChangeSound).play(),ft(),v.success("订单状态已更新")}catch{v.error("更新失败")}},Ae=t=>{t.expanded||k.value.forEach(e=>{e.id!==t.id&&(e.expanded=!1)}),t.expanded=!t.expanded},gt=async t=>{if(!b.value.length){v.warning("请先选择订单");return}switch(t){case"print":await yt();break;case"export":await ht();break;case"delete":await wt();break}},yt=async()=>{try{const e=k.value.filter(p=>b.value.includes(p.id)).map(p=>`
      订单号：${p.orderNo}
      下单时间：${Q(p.createTime)}
      客户信息：${p.studentName} (${p.studentId})
      菜品明细：
      ${p.items.map(_=>`${_.name} x${_.quantity} ¥${_.price}`).join(`
`)}
      总计：¥${p.total}
      ----------------------------------------
    `).join(`
`),o=window.open("","_blank");o.document.write(`
      <pre style="font-family: monospace; padding: 20px;">
        ${e}
      </pre>
    `),o.print(),o.close(),v.success("批量打印成功")}catch{v.error("批量打印失败")}},ht=async()=>{try{const t=k.value.filter(_=>b.value.includes(_.id)),e=[["订单号","下单时间","客户姓名","学号","订单状态","用餐方式","总金额"].join(","),...t.map(_=>[_.orderNo,Q(_.createTime),_.studentName,_.studentId,_.status,_.diningType,_.total].join(","))].join(`
`),o=new Blob([e],{type:"text/csv;charset=utf-8;"}),p=document.createElement("a");p.href=URL.createObjectURL(o),p.download=`订单导出_${j().format("YYYYMMDD_HHmmss")}.csv`,p.click(),v.success("导出成功")}catch{v.error("导出失败")}},wt=async()=>{try{await O.confirm(`确定要删除选中的 ${b.value.length} 个订单吗？`,"警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}),k.value=k.value.filter(t=>!b.value.includes(t.id)),b.value=[],v.success("批量删除成功")}catch(t){t!=="cancel"&&v.error("批量删除失败")}},kt=G(()=>{if(w.value!=="completed")return[];const t=k.value.reduce((e,o)=>{const p=j(o.createTime).format("YYYY-MM-DD");return e[p]||(e[p]=[]),e[p].push(o),e},{});return Object.entries(t).map(([e,o])=>({date:bt(e),orders:o.sort((p,_)=>_.createTime-p.createTime)})).sort((e,o)=>{const p=j(e.date,"YYYY年MM月DD日");return j(o.date,"YYYY年MM月DD日").diff(p)})}),bt=t=>{const e=j(t),o=j().startOf("day"),p=o.subtract(1,"day");return e.isSame(o,"day")?"今天":e.isSame(p,"day")?"昨天":e.format("YYYY年MM月DD日")},Ct=()=>{Y.value="",z.value=[],S.value={min:null,max:null},F.value="",P(!0)},ee=()=>{if(T.value==="total"&&S.value.max&&S.value.min>S.value.max){v.warning("最小金额不能大于最大金额");return}H.value=1,P(!0)},je=t=>({红烧肉:"https://img.zcool.cn/community/01a9445d54c65da801211d53235317.jpg",宫保鸡丁:"https://img.zcool.cn/community/01f8c65d54c65da801211d532386f7.jpg",鱼香肉丝:"https://img.zcool.cn/community/0120465d54c65da801211d532343b4.jpg",麻婆豆腐:"https://img.zcool.cn/community/01c3c25d54c65da801211d5323cf41.jpg",青椒肉丝:"https://img.zcool.cn/community/01d9d95d54c65da801211d532358f4.jpg",回锅肉:"https://img.zcool.cn/community/01d2fd5d54c65da801211d53236875.jpg",水煮肉片:"https://img.zcool.cn/community/01b5fd5d54c65da801211d53234c67.jpg",糖醋里脊:"https://img.zcool.cn/community/01f9d65d54c65da801211d53237dc3.jpg"})[t]||"https://img.zcool.cn/community/01311f5d54c65da801211d53231984.jpg",Ue=async t=>{try{const e=window.open("","_blank");e.document.write(`
      <pre style="font-family: monospace; padding: 20px;">
        订单号：${t.orderNo}
        下单时间：${Q(t.createTime)}
        客户信息：${t.studentName} (${t.studentId})
        
        菜品明细：
        ${t.items.map(o=>`${o.name} x${o.quantity} ¥${o.price}`).join(`
`)}
        
        总计：¥${t.total}
      </pre>
    `),e.print(),e.close(),v.success("打印成功")}catch(e){console.error(e),v.error("打印失败")}},Tt=t=>{t?O.confirm("开启自动接单后，系统将按照设置的条件自动处理新订单。是否继续？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{xt()}).catch(()=>{ue.value=!1}):Vt()},xt=()=>{v.success("自动接单已开启")},Vt=()=>{v.info("自动接单已关闭")};G(()=>k.value.sort((t,e)=>t.priority!==e.priority?e.priority-t.priority:t.createTime-e.createTime)),G(()=>({avgProcessTime:calculateAvgProcessTime(k.value),peakHours:analyzePeakHours(k.value),popularDishes:analyzePopularDishes(k.value)})),le(b,t=>{const e=t.length,o=k.value.length;ve.value=e===o&&o>0,$e.value=e>0&&e<o});const Dt=async t=>{Ye.value=!0;try{if(t)if(at.value.length>=100)if(await O.confirm(`当前筛选条件下共有 ${de.value} 条数据，是否全部选择？`,"提示",{confirmButtonText:"全选",cancelButtonText:"仅选择当前页",type:"warning"})){const o=await Mt();b.value=o.map(p=>p.id),v.success(`已选择全部 ${de.value} 条数据`)}else b.value=k.value.map(o=>o.id),v.success(`已选择当前页 ${k.value.length} 条数据`);else b.value=k.value.map(e=>e.id);else b.value=[]}catch(e){e!=="cancel"&&v.error("操作失败")}finally{Ye.value=!1}},Mt=async()=>{L.value=!0;try{return fe.filter(e=>w.value==="pending"?e.status==="待处理":w.value==="processing"?e.status==="进行中":w.value==="completed"?e.status==="已完成":!0)}catch{return v.error("获取数据失败"),[]}finally{L.value=!1}},St=()=>{T.value="",Y.value="",z.value=[],S.value={min:null,max:null},F.value="",H.value=1,P(!0),v.success("筛选条件已重置")},$t=G(()=>!!(T.value||Y.value||z.value&&z.value.length||S.value.min!==null||S.value.max!==null||F.value)),Yt=async()=>{try{await new Promise(t=>setTimeout(t,500)),v.success("设置已保存"),K.value=!1}catch{v.error("保存设置失败")}},A=f({name:"大荤窗口",status:"open",canteen:{id:1,name:"中央食堂"},floor:1,operatingHours:"10:30-13:30, 16:30-19:00",type:"大荤窗口"}),_e=f(A.value.status==="open"),E=f(!1),C=f({canteenId:"",floor:"",name:"",image:"",address:"",operatingPeriods:[{startTime:new Date(2e3,0,1,10,30),endTime:new Date(2e3,0,1,13,30)}]}),ge=[{id:"1",name:"中央食堂",floors:3},{id:"2",name:"沁园餐厅",floors:2},{id:"3",name:"馨园餐厅",floors:1},{id:"4",name:"仲园餐厅",floors:3},{id:"5",name:"雅园餐厅",floors:1},{id:"6",name:"F区服务点",floors:1},{id:"7",name:"A区服务点",floors:1}],zt=G(()=>{const t=ge.find(e=>e.id===C.value.canteenId);return t?Array.from({length:t.floors},(e,o)=>o+1):[]});le(()=>C.value.canteenId,t=>{const e=ge.find(o=>o.id===t);e&&C.value.floor>e.floors&&(C.value.floor=1)});const Nt=async t=>{try{await O.confirm(`确定要${t?"开始营业":"打烊"}吗？`,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:t?"success":"warning"}),A.value.status=t?"open":"closed",v.success(`已${t?"开始营业":"打烊"}`)}catch{_e.value=!t}},At=async t=>{if(t==="editWindow"){E.value=!0;const e=A.value.operatingHours.split(",").map(o=>{const[p,_]=o.trim().split("-"),[B,c]=p.split(":").map(Number),[$,I]=_.split(":").map(Number);return{startTime:new Date(2e3,0,1,B,c),endTime:new Date(2e3,0,1,$,I)}});C.value={canteenId:A.value.canteen.id,floor:A.value.floor,name:A.value.name,image:A.value.image,address:A.value.address,operatingPeriods:e}}else if(t==="logout")try{await O.confirm("确定要退出登录吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}),localStorage.removeItem("token"),localStorage.removeItem("user"),Me.push("/login"),v.success("已退出登录")}catch{}},jt=()=>{E.value=!0,Ve(()=>{const t=document.querySelector(".window-edit-form .el-select");t&&t.click()})},Ut=()=>{E.value=!0,Ve(()=>{const t=document.querySelector('.window-edit-form input[placeholder="请输入窗口名称"]');t&&t.focus()})},Ot=()=>{E.value=!0,Ve(()=>{const t=document.querySelector(".time-periods-container");t&&t.scrollIntoView({behavior:"smooth"})})},Bt=()=>{C.value.operatingPeriods.push({startTime:new Date(2e3,0,1,10,0),endTime:new Date(2e3,0,1,22,0)})},It=t=>{C.value.operatingPeriods.splice(t,1)},ye=f(""),Rt=t=>{ye.value=t.url,C.value.image=t.url},Ht=()=>{const t=C.value.operatingPeriods;for(const e of t){if(!e.startTime||!e.endTime)return v.warning("请填写完整的营业时间"),!1;if(e.endTime<=e.startTime)return v.warning("结束时间必须晚于开始时间"),!1}for(let e=0;e<t.length;e++)for(let o=e+1;o<t.length;o++)if(t[e].startTime<=t[o].endTime&&t[e].endTime>=t[o].startTime||t[o].startTime<=t[e].endTime&&t[o].endTime>=t[e].startTime)return v.warning("营业时间段不能重叠"),!1;return!0},Pt=async()=>{if(Ht())try{const t=C.value.operatingPeriods.map(o=>{const p=`${o.startTime.getHours().toString().padStart(2,"0")}:${o.startTime.getMinutes().toString().padStart(2,"0")}`,_=`${o.endTime.getHours().toString().padStart(2,"0")}:${o.endTime.getMinutes().toString().padStart(2,"0")}`;return`${p}-${_}`}).join(", "),e={...C.value,operatingHours:t};v.success("窗口信息更新成功"),E.value=!1,await Oe()}catch{v.error("更新窗口信息失败")}},Oe=async()=>{};xe(()=>{Oe()});const he=f(0),Be=f([]),J=f(""),Et=t=>({pending:"warning",approved:"success",rejected:"danger",completed:"info"})[t]||"info",qt=()=>{te.value=1,q()},Lt=()=>{J.value="",te.value=1,q()},Ft=t=>({pending:"待处理",approved:"已同意",rejected:"已拒绝",completed:"已完成"})[t]||t,Wt=async t=>{try{await O.confirm(`确定同意退款 ¥${t.amount} 给用户 ${t.userName} 吗？`,"确认退款",{confirmButtonText:"确定退款",cancelButtonText:"取消",type:"warning"}),t.status="approved",v.success("已同意退款"),await q()}catch(e){e!=="cancel"&&v.error("处理退款失败")}},Qt=async t=>{try{const{value:e}=await O.prompt("请输入拒绝原因","拒绝退款",{confirmButtonText:"确定",cancelButtonText:"取消",inputPlaceholder:"请输入拒绝退款的原因",inputValidator:o=>o?!0:"请输入拒绝原因"});e&&(t.status="rejected",t.rejectReason=e,v.success("已拒绝退款"),await q())}catch(e){e!=="cancel"&&v.error("处理退款失败")}},q=async()=>{try{let t=[{id:1,orderNo:"DD20240220001",status:"pending",applyTime:Date.now()-36e5,userName:"张三",userId:"2024001",userAvatar:"",amount:25.5,reason:"菜品口感不佳",description:"饭菜太咸了，而且不够新鲜",images:["https://example.com/image1.jpg","https://example.com/image2.jpg"]},{id:2,orderNo:"DD20240220002",status:"approved",applyTime:Date.now()-72e5,userName:"李四",userId:"2024002",userAvatar:"",amount:18,reason:"等待时间过长",description:"等了一个小时还没有出餐"}];J.value&&(t=t.filter(e=>j(e.applyTime).format("YYYY-MM-DD")===J.value)),Be.value=t,Ie.value=t.length,he.value=t.filter(e=>e.status==="pending").length}catch(t){console.error(t),v.error("获取退款列表失败")}};le(w,t=>{t==="refund"&&q()}),xe(()=>{q()});const te=f(1),we=f(10),Ie=f(0),Jt=t=>{we.value=t,q()},Xt=t=>{te.value=t,q()};return(t,e)=>{const o=g("el-icon"),p=g("el-divider"),_=g("el-tag"),B=g("el-switch"),c=g("el-button"),$=g("el-dropdown-item"),I=g("el-dropdown-menu"),X=g("el-dropdown"),Z=g("el-upload"),x=g("el-form-item"),D=g("el-option"),ae=g("el-select"),ke=g("el-input"),be=g("el-time-picker"),Re=g("el-form"),Zt=g("el-dialog"),He=g("el-badge"),re=g("el-tab-pane"),Gt=g("el-tabs"),Pe=g("el-date-picker"),ce=g("el-input-number"),se=g("el-checkbox"),Ee=g("el-checkbox-group"),Kt=g("el-time-select"),ea=g("el-scrollbar"),ta=g("el-drawer"),Ce=g("el-col"),aa=g("el-row"),Te=g("el-card"),qe=g("el-pagination"),sa=g("el-avatar"),la=g("el-image");return i(),r("div",_a,[l("div",ga,[l("div",ya,[l("div",ha,[l("div",{class:"location-info clickable",onClick:jt},[a(o,null,{default:n(()=>[a(h(na))]),_:1}),l("span",wa,d(A.value.canteen.name),1),a(p,{direction:"vertical"}),l("span",ka,d(A.value.floor)+"层",1),a(o,{class:"edit-icon"},{default:n(()=>[a(h(me))]),_:1})]),l("div",{class:"operation-time clickable",onClick:Ot},[a(o,null,{default:n(()=>[a(h(oa))]),_:1}),l("span",null,d(A.value.operatingHours),1),a(o,{class:"edit-icon"},{default:n(()=>[a(h(me))]),_:1})])]),l("div",ba,[l("span",{class:"window-name clickable",onClick:Ut},[m(d(A.value.name)+" ",1),a(o,{class:"edit-icon"},{default:n(()=>[a(h(me))]),_:1})]),l("div",Ca,[a(_,{size:"small",type:A.value.status==="open"?"success":"danger"},{default:n(()=>[m(d(A.value.status==="open"?"营业中":"已打烊"),1)]),_:1},8,["type"]),a(B,{modelValue:_e.value,"onUpdate:modelValue":e[0]||(e[0]=s=>_e.value=s),"active-text":"营业","inactive-text":"打烊",onChange:Nt,class:"status-switch",style:{"--el-switch-on-color":"#07c160","--el-switch-off-color":"rgba(0,0,0,0.25)"}},null,8,["modelValue"]),a(X,{onCommand:At,trigger:"click"},{dropdown:n(()=>[a(I,null,{default:n(()=>[a($,{command:"editWindow"},{default:n(()=>[a(o,null,{default:n(()=>[a(h(me))]),_:1}),e[33]||(e[33]=m("编辑窗口 "))]),_:1}),a($,{command:"logout"},{default:n(()=>[a(o,null,{default:n(()=>[a(h(ia))]),_:1}),e[34]||(e[34]=m("退出登录 "))]),_:1})]),_:1})]),default:n(()=>[a(c,{size:"small",type:"primary",plain:""},{default:n(()=>[a(o,null,{default:n(()=>[a(h(Le))]),_:1})]),_:1})]),_:1})])])])]),a(Zt,{modelValue:E.value,"onUpdate:modelValue":e[5]||(e[5]=s=>E.value=s),title:"编辑窗口信息",width:"90%",class:"window-edit-dialog","close-on-click-modal":!1},{footer:n(()=>[l("div",Ma,[a(c,{onClick:e[4]||(e[4]=s=>E.value=!1)},{default:n(()=>e[38]||(e[38]=[m("取消")])),_:1}),a(c,{type:"primary",onClick:Pt},{default:n(()=>e[39]||(e[39]=[m("确定")])),_:1})])]),default:n(()=>[a(Re,{model:C.value,"label-width":"4.5em",class:"window-edit-form"},{default:n(()=>[a(x,{label:"图片"},{default:n(()=>[a(Z,{class:"window-image-uploader",action:"/api/upload","show-file-list":!1,"on-success":Rt},{default:n(()=>[ye.value?(i(),r("img",{key:0,src:ye.value,class:"window-image"},null,8,Ta)):(i(),r("div",xa,[a(o,{class:"window-uploader-icon"},{default:n(()=>[a(h(Fe))]),_:1}),e[35]||(e[35]=l("span",null,"点击上传图片",-1))]))]),_:1})]),_:1}),a(x,{label:"餐厅"},{default:n(()=>[a(ae,{modelValue:C.value.canteenId,"onUpdate:modelValue":e[1]||(e[1]=s=>C.value.canteenId=s),placeholder:"请选择餐厅",class:"full-width-input"},{default:n(()=>[(i(),r(U,null,R(ge,s=>a(D,{key:s.id,label:s.name,value:s.id},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),a(x,{label:"楼层"},{default:n(()=>[a(ae,{modelValue:C.value.floor,"onUpdate:modelValue":e[2]||(e[2]=s=>C.value.floor=s),placeholder:"请选择楼层",class:"full-width-input",disabled:!C.value.canteenId},{default:n(()=>[(i(!0),r(U,null,R(zt.value,s=>(i(),M(D,{key:s,label:`${s}层`,value:s},null,8,["label","value"]))),128))]),_:1},8,["modelValue","disabled"])]),_:1}),a(x,{label:"名称"},{default:n(()=>[a(ke,{modelValue:C.value.name,"onUpdate:modelValue":e[3]||(e[3]=s=>C.value.name=s),class:"full-width-input",placeholder:"请输入窗口名称"},null,8,["modelValue"])]),_:1}),a(x,{label:"时间"},{default:n(()=>[l("div",Va,[(i(!0),r(U,null,R(C.value.operatingPeriods,(s,u)=>(i(),r("div",{key:u,class:"time-period"},[l("div",Da,[a(be,{modelValue:s.startTime,"onUpdate:modelValue":V=>s.startTime=V,format:"HH:mm",placeholder:"开始时间",clearable:!1,class:"time-picker"},null,8,["modelValue","onUpdate:modelValue"]),e[36]||(e[36]=l("span",{class:"time-separator"},"至",-1)),a(be,{modelValue:s.endTime,"onUpdate:modelValue":V=>s.endTime=V,format:"HH:mm",placeholder:"结束时间",clearable:!1,class:"time-picker"},null,8,["modelValue","onUpdate:modelValue"])]),C.value.operatingPeriods.length>1?(i(),M(c,{key:0,type:"danger",circle:"",size:"small",class:"delete-time-btn",onClick:V=>It(u)},{default:n(()=>[a(o,null,{default:n(()=>[a(h(da))]),_:1})]),_:2},1032,["onClick"])):y("",!0)]))),128)),C.value.operatingPeriods.length<3?(i(),M(c,{key:0,type:"primary",link:"",size:"small",class:"add-time-btn",onClick:Bt},{default:n(()=>[a(o,null,{default:n(()=>[a(h(Fe))]),_:1}),e[37]||(e[37]=m("添加时间段 "))]),_:1})):y("",!0)])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),l("div",Sa,[a(Gt,{modelValue:w.value,"onUpdate:modelValue":e[6]||(e[6]=s=>w.value=s),onTabChange:_t,class:"order-tabs"},{default:n(()=>[a(re,{name:"pending"},{label:n(()=>[a(He,{value:oe.value,hidden:!oe.value},{default:n(()=>e[40]||(e[40]=[m(" 待处理 ")])),_:1},8,["value","hidden"])]),_:1}),a(re,{label:"进行中",name:"processing"}),a(re,{label:"已完成",name:"completed"}),a(re,{name:"refund"},{label:n(()=>[a(He,{value:he.value,hidden:!he.value,type:"danger"},{default:n(()=>e[41]||(e[41]=[m(" 退款申请 ")])),_:1},8,["value","hidden"])]),_:1})]),_:1},8,["modelValue"]),l("div",$a,[a(c,{type:"primary",link:"",onClick:e[7]||(e[7]=s=>h(Me).push("/m/admin/order-history"))},{default:n(()=>[a(o,null,{default:n(()=>[a(h(ua))]),_:1}),e[42]||(e[42]=m(" 历史订单 "))]),_:1})])]),w.value!=="refund"?(i(),r("div",Ya,[l("div",za,[a(ke,{modelValue:F.value,"onUpdate:modelValue":e[8]||(e[8]=s=>F.value=s),placeholder:"搜索订单号/学生姓名",clearable:""},{prefix:n(()=>[a(o,null,{default:n(()=>[a(h(We))]),_:1})]),_:1},8,["modelValue"]),a(c,{type:"primary",onClick:vt},{default:n(()=>[a(o,null,{default:n(()=>[a(h(We))]),_:1}),e[43]||(e[43]=m(" 搜索 "))]),_:1})]),l("div",Na,[l("div",Aa,[a(ae,{modelValue:T.value,"onUpdate:modelValue":e[9]||(e[9]=s=>T.value=s),placeholder:"筛选条件",size:"small",style:{width:"120px"},onChange:Ct,clearable:""},{default:n(()=>[a(D,{label:"订单号",value:"orderNo"}),a(D,{label:"学生姓名",value:"studentName"}),a(D,{label:"用餐方式",value:"diningType"}),a(D,{label:"订单金额",value:"total"}),a(D,{label:"下单日期",value:"date"})]),_:1},8,["modelValue"]),T.value==="date"?(i(),M(Pe,{key:0,modelValue:z.value,"onUpdate:modelValue":e[10]||(e[10]=s=>z.value=s),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",size:"small",onChange:ee,style:{width:"260px"},"value-format":"YYYY-MM-DD",shortcuts:tt},null,8,["modelValue"])):T.value==="orderNo"||T.value==="studentName"?(i(),M(ke,{key:1,modelValue:Y.value,"onUpdate:modelValue":e[11]||(e[11]=s=>Y.value=s),placeholder:`请输入${T.value==="orderNo"?"订单号":"学生姓名"}`,size:"small",clearable:"",onInput:ee,style:{width:"200px"}},null,8,["modelValue","placeholder"])):T.value==="diningType"?(i(),M(ae,{key:2,modelValue:Y.value,"onUpdate:modelValue":e[12]||(e[12]=s=>Y.value=s),placeholder:"选择用餐方式",size:"small",clearable:"",onChange:ee,style:{width:"200px"}},{default:n(()=>[a(D,{label:"堂食",value:"堂食"}),a(D,{label:"外带",value:"外带"})]),_:1},8,["modelValue"])):T.value==="total"?(i(),r("div",ja,[a(ce,{modelValue:S.value.min,"onUpdate:modelValue":e[13]||(e[13]=s=>S.value.min=s),min:0,size:"small",placeholder:"最小金额",onChange:ee},null,8,["modelValue"]),e[44]||(e[44]=l("span",null,"-",-1)),a(ce,{modelValue:S.value.max,"onUpdate:modelValue":e[14]||(e[14]=s=>S.value.max=s),min:0,size:"small",placeholder:"最大金额",onChange:ee},null,8,["modelValue"])])):y("",!0),a(c,{type:"default",size:"small",onClick:St,disabled:!$t.value},{default:n(()=>[a(o,null,{default:n(()=>[a(h(Qe))]),_:1}),e[45]||(e[45]=m(" 重置 "))]),_:1},8,["disabled"])])])])):y("",!0),w.value!=="refund"?(i(),r("div",Ua,[l("div",Oa,[a(B,{modelValue:ue.value,"onUpdate:modelValue":e[15]||(e[15]=s=>ue.value=s),"active-text":"自动接单",onChange:Tt},null,8,["modelValue"]),ue.value?(i(),M(ae,{key:0,modelValue:Se.value,"onUpdate:modelValue":e[16]||(e[16]=s=>Se.value=s),placeholder:"提醒方式",size:"small",style:{width:"120px","margin-left":"10px"}},{default:n(()=>[a(D,{label:"声音提醒",value:"sound"}),a(D,{label:"桌面通知",value:"desktop"}),a(D,{label:"全部提醒",value:"all"})]),_:1},8,["modelValue"])):y("",!0)]),l("div",Ba,[a(se,{modelValue:ve.value,"onUpdate:modelValue":e[17]||(e[17]=s=>ve.value=s),indeterminate:$e.value,onChange:Dt,class:"select-all-checkbox",value:!0},{default:n(()=>e[46]||(e[46]=[m(" 全选 ")])),_:1},8,["modelValue","indeterminate"]),a(c,{type:"primary",link:"",onClick:e[18]||(e[18]=s=>K.value=!0)},{default:n(()=>[a(o,null,{default:n(()=>[a(h(Le))]),_:1}),e[47]||(e[47]=m(" 设置 "))]),_:1})])])):y("",!0),a(ta,{modelValue:K.value,"onUpdate:modelValue":e[26]||(e[26]=s=>K.value=s),title:"自动接单设置",direction:"rtl",size:"90%","with-header":!0,class:"settings-drawer","modal-class":"settings-drawer-modal","append-to-body":!0},{header:n(()=>e[48]||(e[48]=[l("h4",{class:"drawer-title"},"自动接单设置",-1)])),footer:n(()=>[l("div",Pa,[a(c,{onClick:e[25]||(e[25]=s=>K.value=!1)},{default:n(()=>e[52]||(e[52]=[m("取消")])),_:1}),a(c,{type:"primary",onClick:Yt},{default:n(()=>e[53]||(e[53]=[m("保存")])),_:1})])]),default:n(()=>[l("div",Ia,[a(ea,null,{default:n(()=>[a(Re,{"label-position":"top"},{default:n(()=>[a(x,{label:"接单时间范围"},{default:n(()=>[a(be,{modelValue:N.value.timeRange,"onUpdate:modelValue":e[19]||(e[19]=s=>N.value.timeRange=s),"is-range":"","range-separator":"至","start-placeholder":"开始时间","end-placeholder":"结束时间",format:"HH:mm",class:"full-width-input"},null,8,["modelValue"])]),_:1}),a(x,{label:"最大同时处理订单数"},{default:n(()=>[a(ce,{modelValue:N.value.maxOrders,"onUpdate:modelValue":e[20]||(e[20]=s=>N.value.maxOrders=s),min:1,max:20,class:"full-width-input"},null,8,["modelValue"])]),_:1}),a(x,{label:"自动拒单条件"},{default:n(()=>[a(Ee,{modelValue:N.value.rejectConditions,"onUpdate:modelValue":e[21]||(e[21]=s=>N.value.rejectConditions=s),class:"reject-conditions"},{default:n(()=>[a(se,{value:"largeOrder",class:"condition-item"},{default:n(()=>e[49]||(e[49]=[m("订单金额超过限制")])),_:1}),a(se,{value:"specialRequirement",class:"condition-item"},{default:n(()=>e[50]||(e[50]=[m("含有特殊要求")])),_:1}),a(se,{value:"busyHours",class:"condition-item"},{default:n(()=>e[51]||(e[51]=[m("高峰时段")])),_:1})]),_:1},8,["modelValue"])]),_:1}),N.value.rejectConditions.includes("largeOrder")?(i(),M(x,{key:0,label:"订单金额限制"},{default:n(()=>[a(ce,{modelValue:N.value.maxOrderAmount,"onUpdate:modelValue":e[22]||(e[22]=s=>N.value.maxOrderAmount=s),min:0,step:10,class:"full-width-input"},null,8,["modelValue"])]),_:1})):y("",!0),N.value.rejectConditions.includes("busyHours")?(i(),M(x,{key:1,label:"高峰时段设置"},{default:n(()=>[a(Kt,{modelValue:N.value.busyHours,"onUpdate:modelValue":e[23]||(e[23]=s=>N.value.busyHours=s),"picker-options":{start:"08:00",step:"00:30",end:"20:00"},multiple:"",placeholder:"选择高峰时段",class:"full-width-input"},null,8,["modelValue"])]),_:1})):y("",!0),a(x,{label:"智能调节"},{default:n(()=>[l("div",Ra,[a(B,{modelValue:N.value.smartAdjust,"onUpdate:modelValue":e[24]||(e[24]=s=>N.value.smartAdjust=s),"active-text":"开启","inactive-text":"关闭"},null,8,["modelValue"]),N.value.smartAdjust?(i(),r("div",Ha," 系统将根据历史数据自动调节接单参数 ")):y("",!0)])]),_:1})]),_:1})]),_:1})])]),_:1},8,["modelValue"]),b.value.length>0&&w.value!=="refund"?(i(),r("div",Ea,[l("span",qa,"已选择 "+d(b.value.length)+" 个订单",1),l("div",La,[a(X,{onCommand:gt},{dropdown:n(()=>[a(I,null,{default:n(()=>[a($,{command:"print"},{default:n(()=>e[55]||(e[55]=[m("批量打印")])),_:1}),a($,{command:"export"},{default:n(()=>e[56]||(e[56]=[m("导出订单")])),_:1}),a($,{command:"delete",divided:"",style:{color:"#F56C6C"}},{default:n(()=>e[57]||(e[57]=[m(" 批量删除 ")])),_:1})]),_:1})]),default:n(()=>[a(c,{type:"primary",size:"small"},{default:n(()=>[e[54]||(e[54]=m(" 批量处理 ")),a(o,{class:"el-icon--right"},{default:n(()=>[a(h(De))]),_:1})]),_:1})]),_:1}),w.value==="pending"?(i(),M(c,{key:0,type:"primary",size:"small",onClick:rt},{default:n(()=>e[58]||(e[58]=[m(" 批量接单 ")])),_:1})):y("",!0),w.value==="processing"?(i(),M(c,{key:1,type:"success",size:"small",onClick:ct},{default:n(()=>e[59]||(e[59]=[m(" 批量完成 ")])),_:1})):y("",!0)])])):y("",!0),w.value!=="refund"?(i(),r("div",Fa,[a(aa,{gutter:10},{default:n(()=>[a(Ce,{span:8},{default:n(()=>[l("div",Wa,[l("div",Qa,d(ie.value.orderCount),1),e[60]||(e[60]=l("div",{class:"stat-label"},"今日订单",-1))])]),_:1}),a(Ce,{span:8},{default:n(()=>[l("div",Ja,[l("div",Xa,"¥"+d(ie.value.revenue),1),e[61]||(e[61]=l("div",{class:"stat-label"},"营业额",-1))])]),_:1}),a(Ce,{span:8},{default:n(()=>[l("div",Za,[l("div",Ga,d(ie.value.avgTime)+"分钟",1),e[62]||(e[62]=l("div",{class:"stat-label"},"平均处理",-1))])]),_:1})]),_:1})])):y("",!0),w.value!=="refund"?(i(),r("div",Ka,[a(Ee,{modelValue:b.value,"onUpdate:modelValue":e[27]||(e[27]=s=>b.value=s),onChange:pt},{default:n(()=>[w.value==="completed"?(i(!0),r(U,{key:0},R(kt.value,s=>(i(),r("div",{key:s.date,class:"order-group"},[l("div",es,[l("span",ts,d(s.date),1),l("span",as,d(s.orders.length)+"个订单",1)]),(i(!0),r(U,null,R(s.orders,u=>(i(),M(Te,{key:u.id,class:"order-card"},{default:n(()=>[l("div",ss,[l("div",ls,[l("div",ns,[l("div",os,[l("span",is,"订单号："+d(u.orderNo),1)]),a(_,{type:Ne(u.status)},{default:n(()=>[m(d(u.status),1)]),_:2},1032,["type"])]),u.expanded?(i(),r("div",ds,[l("span",us,d(Q(u.createTime)),1),a(_,{size:"small",type:u.diningType==="堂食"?"success":"warning",class:"dining-type"},{default:n(()=>[m(d(u.diningType),1)]),_:2},1032,["type"])])):y("",!0)]),a(c,{text:"",class:"expand-btn",onClick:V=>Ae(u)},{default:n(()=>[m(d(u.expanded?"收起":"展开")+" ",1),a(o,{class:pe(["expand-icon",{"is-expanded":u.expanded}])},{default:n(()=>[a(h(De))]),_:2},1032,["class"])]),_:2},1032,["onClick"])]),Je(l("div",null,[l("div",rs,[a(o,null,{default:n(()=>[a(h(Ze))]),_:1}),l("span",null,d(u.studentName),1),l("span",cs,"订单号："+d(u.orderNo),1)]),l("div",ms,[l("div",ps,[e[63]||(e[63]=l("span",null,"菜品明细",-1)),l("span",null,"共"+d(ze(u.items))+"份",1)]),l("div",vs,[(i(!0),r(U,null,R(u.items,V=>(i(),r("div",{key:V.id,class:"order-item"},[V.name!=="米饭"?(i(),r("div",fs,[l("img",{src:je(V.name),alt:V.name},null,8,_s)])):y("",!0),l("div",gs,[l("div",ys,[l("span",hs,d(V.name),1)]),V.specs?(i(),r("div",ws,d(V.specs),1)):y("",!0),l("div",ks,[l("span",bs,"x"+d(V.quantity),1),l("span",Cs,"¥"+d(V.price),1)])])]))),128))])]),l("div",Ts,[l("div",xs,[l("div",Vs,[e[64]||(e[64]=l("span",{class:"total-label"},"总计：",-1)),l("span",Ds,"¥"+d(u.total),1)]),u.remark?(i(),r("div",Ms,[a(o,null,{default:n(()=>[a(h(Ge))]),_:1}),l("span",null,d(u.remark),1)])):y("",!0)]),l("div",Ss,[a(c,{type:"primary",size:"small",onClick:V=>Ue(u),class:"print-btn"},{default:n(()=>[a(o,null,{default:n(()=>[a(h(Ke))]),_:1}),e[65]||(e[65]=m(" 打印 "))]),_:2},1032,["onClick"])])])],512),[[Xe,u.expanded]])]),_:2},1024))),128))]))),128)):(i(!0),r(U,{key:1},R(k.value,s=>(i(),M(Te,{key:s.id,class:pe(["order-card",{"new-order":s.isNew}])},{default:n(()=>[l("div",$s,[l("div",Ys,[l("div",zs,[l("div",Ns,[lt(s)?(i(),M(se,{key:0,value:s.id},{default:n(()=>[l("span",As,"订单号："+d(s.orderNo),1)]),_:2},1032,["value"])):(i(),r("span",js,"订单号："+d(s.orderNo),1))]),a(_,{type:Ne(s.status)},{default:n(()=>[m(d(s.status),1)]),_:2},1032,["type"])]),s.expanded?(i(),r("div",Us,[l("span",Os,d(Q(s.createTime)),1),a(_,{size:"small",type:s.diningType==="堂食"?"success":"warning",class:"dining-type"},{default:n(()=>[m(d(s.diningType),1)]),_:2},1032,["type"])])):y("",!0)]),a(c,{text:"",class:"expand-btn",onClick:u=>Ae(s)},{default:n(()=>[m(d(s.expanded?"收起":"展开")+" ",1),a(o,{class:pe(["expand-icon",{"is-expanded":s.expanded}])},{default:n(()=>[a(h(De))]),_:2},1032,["class"])]),_:2},1032,["onClick"])]),Je(l("div",null,[l("div",Bs,[a(o,null,{default:n(()=>[a(h(Ze))]),_:1}),l("span",null,d(s.studentName),1),l("span",Is,"("+d(s.studentId)+")",1)]),l("div",Rs,[l("div",Hs,[e[66]||(e[66]=l("span",null,"菜品明细",-1)),l("span",null,"共"+d(ze(s.items))+"份",1)]),l("div",Ps,[(i(!0),r(U,null,R(s.items,u=>(i(),r("div",{key:u.id,class:"order-item"},[u.name!=="米饭"?(i(),r("div",Es,[l("img",{src:je(u.name),alt:u.name},null,8,qs)])):y("",!0),l("div",Ls,[l("div",Fs,[l("span",Ws,d(u.name),1)]),u.specs?(i(),r("div",Qs,d(u.specs),1)):y("",!0),l("div",Js,[l("span",Xs,"x"+d(u.quantity),1),l("span",Zs,"¥"+d(u.price),1)])])]))),128))])]),l("div",Gs,[l("div",Ks,[l("div",el,[e[67]||(e[67]=l("span",{class:"total-label"},"总计：",-1)),l("span",tl,"¥"+d(s.total),1)]),s.remark?(i(),r("div",al,[a(o,null,{default:n(()=>[a(h(Ge))]),_:1}),l("span",null,d(s.remark),1)])):y("",!0)]),l("div",sl,[s.status==="待处理"?(i(),r(U,{key:0},[a(c,{type:"primary",size:"small",onClick:u=>it(s)},{default:n(()=>e[68]||(e[68]=[m(" 接单 ")])),_:2},1032,["onClick"]),a(c,{type:"danger",size:"small",onClick:u=>dt(s)},{default:n(()=>e[69]||(e[69]=[m(" 拒绝 ")])),_:2},1032,["onClick"])],64)):s.status==="进行中"?(i(),M(c,{key:1,type:"success",size:"small",onClick:u=>ut(s)},{default:n(()=>e[70]||(e[70]=[m(" 完成 ")])),_:2},1032,["onClick"])):y("",!0),a(c,{type:"primary",size:"small",onClick:u=>Ue(s),class:"print-btn"},{default:n(()=>[a(o,null,{default:n(()=>[a(h(Ke))]),_:1}),e[71]||(e[71]=m(" 打印 "))]),_:2},1032,["onClick"])])])],512),[[Xe,s.expanded]])]),_:2},1032,["class"]))),128))]),_:1},8,["modelValue"])])):y("",!0),w.value!=="refund"?(i(),r("div",ll,[a(qe,{"current-page":H.value,"onUpdate:currentPage":e[28]||(e[28]=s=>H.value=s),"page-size":W.value,"onUpdate:pageSize":e[29]||(e[29]=s=>W.value=s),"page-sizes":[10,20,30,50],total:de.value,layout:"total, sizes, prev, pager, next",onSizeChange:nt,onCurrentChange:ot},null,8,["current-page","page-size","total"])])):y("",!0),(L.value||ne.value)&&w.value!=="refund"?(i(),r("div",nl,[L.value?(i(),r("p",ol,"加载中...")):y("",!0),ne.value?(i(),r("p",il,"没有更多订单了")):y("",!0)])):y("",!0),w.value==="refund"?(i(),r(U,{key:7},[l("div",dl,[a(Pe,{modelValue:J.value,"onUpdate:modelValue":e[30]||(e[30]=s=>J.value=s),type:"date",placeholder:"选择日期筛选退款申请",format:"YYYY年MM月DD日","value-format":"YYYY-MM-DD",clearable:!0,onChange:qt,class:"refund-date-picker"},null,8,["modelValue"]),a(c,{type:"default",onClick:Lt,disabled:!J.value,class:"reset-button"},{default:n(()=>[a(o,null,{default:n(()=>[a(h(Qe))]),_:1}),e[72]||(e[72]=m(" 重置 "))]),_:1},8,["disabled"])]),l("div",ul,[(i(!0),r(U,null,R(Be.value,s=>(i(),M(Te,{key:s.id,class:pe(["refund-card",{"pending-refund":s.status==="pending"}])},{default:n(()=>[l("div",rl,[l("div",cl,[l("div",ml,[l("span",pl,"订单号："+d(s.orderNo),1),a(_,{type:Et(s.status),size:"small",class:"status-tag",effect:"light"},{default:n(()=>[m(d(Ft(s.status)),1)]),_:2},1032,["type"])]),l("div",vl," 申请时间："+d(Q(s.applyTime)),1)])]),l("div",fl,[l("div",_l,[a(sa,{size:36,src:s.userAvatar,class:"user-avatar"},{default:n(()=>[m(d(s.userName.charAt(0)),1)]),_:2},1032,["src"]),l("div",gl,[l("span",yl,d(s.userName),1),l("span",hl,"学号："+d(s.userId),1)]),l("div",wl,[l("span",kl,"¥"+d(s.amount),1)])]),l("div",bl,[l("div",Cl,[l("div",Tl,[e[73]||(e[73]=l("span",{class:"label"},"退款原因",-1)),l("span",xl,d(s.reason),1)]),s.description?(i(),r("div",Vl,d(s.description),1)):y("",!0)]),s.images&&s.images.length?(i(),r("div",Dl,[l("div",Ml,[e[74]||(e[74]=l("span",{class:"label"},"图片凭证",-1)),l("span",Sl,"共 "+d(s.images.length)+" 张",1)]),l("div",$l,[(i(!0),r(U,null,R(s.images,(u,V)=>(i(),M(la,{key:V,src:u,"preview-src-list":s.images,fit:"cover",class:"evidence-image"},{error:n(()=>[l("div",Yl,[a(o,null,{default:n(()=>[a(h(ra))]),_:1})])]),_:2},1032,["src","preview-src-list"]))),128))])])):y("",!0)]),s.status==="pending"?(i(),r("div",zl,[a(c,{type:"success",plain:"",onClick:u=>Wt(s),class:"action-button"},{default:n(()=>[a(o,null,{default:n(()=>[a(h(ca))]),_:1}),e[75]||(e[75]=m("同意退款 "))]),_:2},1032,["onClick"]),a(c,{type:"danger",plain:"",onClick:u=>Qt(s),class:"action-button"},{default:n(()=>[a(o,null,{default:n(()=>[a(h(ma))]),_:1}),e[76]||(e[76]=m("拒绝退款 "))]),_:2},1032,["onClick"])])):y("",!0)])]),_:2},1032,["class"]))),128))]),l("div",Nl,[a(qe,{"current-page":te.value,"onUpdate:currentPage":e[31]||(e[31]=s=>te.value=s),"page-size":we.value,"onUpdate:pageSize":e[32]||(e[32]=s=>we.value=s),"page-sizes":[10,20,30,50],total:Ie.value,layout:"total, sizes, prev, pager, next",onSizeChange:Jt,onCurrentChange:Xt},null,8,["current-page","page-size","total"])])],64)):y("",!0)])}}},Bl=va(Al,[["__scopeId","data-v-dcf7c666"]]);export{Bl as default};
