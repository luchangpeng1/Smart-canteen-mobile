import{m as f,o as pe,G as _e,H as fe,I as ve,J as R,L as ge,q as c,t as d,D as v,b as t,w as l,d as C,M as j,N as I,O as S,P as q,E as _,e as i,a as r,y as g,u as w,Q as we,R as he,S as ye,T as Te,c as h,r as G,U as J,V as ke,F as Ve,W as be,X as Ce,Y as Ie,Z as Se,_ as Pe}from"./vendor-qvz31vGP.js";import{_ as He}from"./_plugin-vue_export-helper-DlAUqK2U.js";const De={class:"mobile-admin-layout"},Ue={key:0,class:"header"},$e={class:"window-info"},xe={class:"location-info"},Be={class:"canteen-name"},Me={class:"floor-info"},Ne={class:"window-detail"},ze={class:"window-name"},Fe={class:"operation-time"},We={class:"actions"},Ae={class:"tabbar"},Ee=["onClick"],Le=["src"],Oe={key:1,class:"upload-placeholder"},Re={class:"time-periods-container"},je={class:"time-pickers"},qe={class:"dialog-footer"},Ge={__name:"Layout",setup(Je){const M=Ve(),N=be(),u=f({name:"大荤窗口",status:"open",canteen:{id:1,name:"中央食堂"},floor:1,operatingHours:"10:30-13:30, 16:30-19:00",type:"大荤窗口"}),P=f(u.value.status==="open"),z=f(0),Q=[{name:"订单管理",path:"/m/admin/orders",icon:Ce},{name:"菜单管理",path:"/m/admin/menu",icon:Ie},{name:"营业统计",path:"/m/admin/stats",icon:Se},{name:"提现管理",path:"/m/admin/withdraw",icon:Pe}],X=a=>N.path===a,Y=a=>{M.push(a)},Z=async a=>{try{await q.confirm(`确定要${a?"开始营业":"打烊"}吗？`,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:a?"success":"warning"}),u.value.status=a?"open":"closed",_.success(`已${a?"开始营业":"打烊"}`)}catch{P.value=!a}},F=async()=>{},W=async()=>{};let H=null;pe(()=>{F(),W(),H=setInterval(W,3e4)}),_e(()=>{H&&clearInterval(H)});const K=async a=>{if(a==="editWindow"){y.value=!0;const e=u.value.operatingHours.split(",").map(s=>{const[T,m]=s.trim().split("-"),[p,V]=T.split(":").map(Number),[$,x]=m.split(":").map(Number);return{startTime:new Date(2e3,0,1,p,V),endTime:new Date(2e3,0,1,$,x)}});o.value={canteenId:u.value.canteen.id,floor:u.value.floor,name:u.value.name,image:u.value.image,address:u.value.address,operatingPeriods:e}}else if(a==="logout")try{await q.confirm("确定要退出登录吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}),localStorage.removeItem("token"),localStorage.removeItem("user"),M.push("/login"),_.success("已退出登录")}catch{}};fe(()=>{}),ve(()=>{});const y=f(!1),o=f({canteenId:"",floor:"",name:"",image:"",address:"",operatingPeriods:[{startTime:new Date(2e3,0,1,10,30),endTime:new Date(2e3,0,1,13,30)}]}),D=f(""),ee=a=>{D.value=a.url,o.value.image=a.url},te=()=>{const a=o.value.operatingPeriods;for(const e of a){if(!e.startTime||!e.endTime)return _.warning("请填写完整的营业时间"),!1;if(e.endTime<=e.startTime)return _.warning("结束时间必须晚于开始时间"),!1}for(let e=0;e<a.length;e++)for(let s=e+1;s<a.length;s++)if(a[e].startTime<=a[s].endTime&&a[e].endTime>=a[s].startTime||a[s].startTime<=a[e].endTime&&a[s].endTime>=a[e].startTime)return _.warning("营业时间段不能重叠"),!1;return!0},ae=async()=>{if(te())try{const a=o.value.operatingPeriods.map(s=>{const T=`${s.startTime.getHours().toString().padStart(2,"0")}:${s.startTime.getMinutes().toString().padStart(2,"0")}`,m=`${s.endTime.getHours().toString().padStart(2,"0")}:${s.endTime.getMinutes().toString().padStart(2,"0")}`;return`${T}-${m}`}).join(", "),e={...o.value,operatingHours:a};_.success("窗口信息更新成功"),y.value=!1,await F()}catch{_.error("更新窗口信息失败")}},ne=()=>{o.value.operatingPeriods.push({startTime:new Date(2e3,0,1,10,0),endTime:new Date(2e3,0,1,22,0)})},le=a=>{o.value.operatingPeriods.splice(a,1)},U=[{id:"1",name:"中央食堂",floors:3},{id:"2",name:"沁园餐厅",floors:2},{id:"3",name:"馨园餐厅",floors:1},{id:"4",name:"仲园餐厅",floors:3},{id:"5",name:"雅园餐厅",floors:1},{id:"6",name:"F区服务点",floors:1},{id:"7",name:"A区服务点",floors:1}],oe=R(()=>{const a=U.find(e=>e.id===o.value.canteenId);return a?Array.from({length:a.floors},(e,s)=>s+1):[]});ge(()=>o.value.canteenId,a=>{const e=U.find(s=>s.id===a);e&&o.value.floor>e.floors&&(o.value.floor=1)});const A=R(()=>N.path==="/m/admin/orders");return(a,e)=>{const s=i("el-divider"),T=i("el-tag"),m=i("el-icon"),p=i("el-button"),V=i("el-dropdown-item"),$=i("el-dropdown-menu"),x=i("el-dropdown"),se=i("el-switch"),ie=i("router-view"),de=i("el-badge"),re=i("el-upload"),k=i("el-form-item"),E=i("el-option"),L=i("el-select"),ue=i("el-input"),O=i("el-time-picker"),me=i("el-form"),ce=i("el-dialog");return r(),c("div",De,[A.value?(r(),c("div",Ue,[d("div",$e,[d("div",xe,[d("span",Be,v(u.value.canteen.name),1),t(s,{direction:"vertical"}),d("span",Me,v(u.value.floor)+"层",1)]),d("div",Ne,[d("span",ze,v(u.value.name),1),d("span",Fe,v(u.value.operatingHours),1)]),t(T,{size:"small",type:u.value.status==="open"?"success":"danger"},{default:l(()=>[g(v(u.value.status==="open"?"营业中":"已打烊"),1)]),_:1},8,["type"])]),d("div",We,[t(x,{onCommand:K,trigger:"click"},{dropdown:l(()=>[t($,null,{default:l(()=>[t(V,{command:"editWindow"},{default:l(()=>[t(m,null,{default:l(()=>[t(w(we))]),_:1}),e[6]||(e[6]=g("编辑窗口 "))]),_:1}),t(V,{command:"logout"},{default:l(()=>[t(m,null,{default:l(()=>[t(w(he))]),_:1}),e[7]||(e[7]=g("退出登录 "))]),_:1})]),_:1})]),default:l(()=>[t(p,{size:"small",type:"primary",plain:""},{default:l(()=>[t(m,null,{default:l(()=>[t(w(ye))]),_:1})]),_:1})]),_:1}),t(se,{modelValue:P.value,"onUpdate:modelValue":e[0]||(e[0]=n=>P.value=n),"active-text":"营业","inactive-text":"打烊",onChange:Z},null,8,["modelValue"])])])):C("",!0),d("div",{class:j(["page-content",{"has-header":A.value}])},[t(ie,null,{default:l(({Component:n})=>[t(Te,{name:"fade",mode:"out-in"},{default:l(()=>[(r(),h(G(n)))]),_:2},1024)]),_:1})],2),d("div",Ae,[(r(),c(I,null,S(Q,n=>d("div",{key:n.path,class:j(["tab-item",{active:X(n.path)}]),onClick:B=>Y(n.path)},[t(m,null,{default:l(()=>[(r(),h(G(n.icon)))]),_:2},1024),d("span",null,v(n.name),1),n.path==="/m/admin/orders"&&z.value>0?(r(),h(de,{key:0,value:z.value,class:"order-badge"},null,8,["value"])):C("",!0)],10,Ee)),64))]),t(ce,{modelValue:y.value,"onUpdate:modelValue":e[5]||(e[5]=n=>y.value=n),title:"编辑窗口信息",width:"90%",class:"window-edit-dialog","close-on-click-modal":!1},{footer:l(()=>[d("div",qe,[t(p,{onClick:e[4]||(e[4]=n=>y.value=!1)},{default:l(()=>e[11]||(e[11]=[g("取消")])),_:1}),t(p,{type:"primary",onClick:ae},{default:l(()=>e[12]||(e[12]=[g("确定")])),_:1})])]),default:l(()=>[t(me,{model:o.value,"label-width":"4.5em",class:"window-edit-form"},{default:l(()=>[t(k,{label:"图片"},{default:l(()=>[t(re,{class:"window-image-uploader",action:"/api/upload","show-file-list":!1,"on-success":ee},{default:l(()=>[D.value?(r(),c("img",{key:0,src:D.value,class:"window-image"},null,8,Le)):(r(),c("div",Oe,[t(m,{class:"window-uploader-icon"},{default:l(()=>[t(w(J))]),_:1}),e[8]||(e[8]=d("span",null,"点击上传图片",-1))]))]),_:1})]),_:1}),t(k,{label:"餐厅"},{default:l(()=>[t(L,{modelValue:o.value.canteenId,"onUpdate:modelValue":e[1]||(e[1]=n=>o.value.canteenId=n),placeholder:"请选择餐厅",class:"full-width-input"},{default:l(()=>[(r(),c(I,null,S(U,n=>t(E,{key:n.id,label:n.name,value:n.id},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),t(k,{label:"楼层"},{default:l(()=>[t(L,{modelValue:o.value.floor,"onUpdate:modelValue":e[2]||(e[2]=n=>o.value.floor=n),placeholder:"请选择楼层",class:"full-width-input",disabled:!o.value.canteenId},{default:l(()=>[(r(!0),c(I,null,S(oe.value,n=>(r(),h(E,{key:n,label:`${n}层`,value:n},null,8,["label","value"]))),128))]),_:1},8,["modelValue","disabled"])]),_:1}),t(k,{label:"名称"},{default:l(()=>[t(ue,{modelValue:o.value.name,"onUpdate:modelValue":e[3]||(e[3]=n=>o.value.name=n),class:"full-width-input",placeholder:"请输入窗口名称"},null,8,["modelValue"])]),_:1}),t(k,{label:"时间"},{default:l(()=>[d("div",Re,[(r(!0),c(I,null,S(o.value.operatingPeriods,(n,B)=>(r(),c("div",{key:B,class:"time-period"},[d("div",je,[t(O,{modelValue:n.startTime,"onUpdate:modelValue":b=>n.startTime=b,format:"HH:mm",placeholder:"开始时间",clearable:!1,class:"time-picker"},null,8,["modelValue","onUpdate:modelValue"]),e[9]||(e[9]=d("span",{class:"time-separator"},"至",-1)),t(O,{modelValue:n.endTime,"onUpdate:modelValue":b=>n.endTime=b,format:"HH:mm",placeholder:"结束时间",clearable:!1,class:"time-picker"},null,8,["modelValue","onUpdate:modelValue"])]),o.value.operatingPeriods.length>1?(r(),h(p,{key:0,type:"danger",circle:"",size:"small",class:"delete-time-btn",onClick:b=>le(B)},{default:l(()=>[t(m,null,{default:l(()=>[t(w(ke))]),_:1})]),_:2},1032,["onClick"])):C("",!0)]))),128)),o.value.operatingPeriods.length<3?(r(),h(p,{key:0,type:"primary",link:"",size:"small",class:"add-time-btn",onClick:ne},{default:l(()=>[t(m,null,{default:l(()=>[t(w(J))]),_:1}),e[10]||(e[10]=g("添加时间段 "))]),_:1})):C("",!0)])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}},Ye=He(Ge,[["__scopeId","data-v-63599fef"]]);export{Ye as default};
