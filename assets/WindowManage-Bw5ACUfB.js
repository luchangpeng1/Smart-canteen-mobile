import{p as C,m as h,q as _,t,b as s,w as l,D as m,d as J,J as B,L as T,W as E,E as g,e as d,a as f,u as c,ak as Y,Y as U,y as v,Z,ac as A,ab as G,a1 as K,F as Q}from"./vendor-CrV3p34f.js";import{_ as X}from"./_plugin-vue_export-helper-DlAUqK2U.js";const ee={class:"window-manage-container"},te={class:"page-header"},se={class:"window-content"},le={class:"window-info-card"},oe={class:"window-header"},ae={class:"info-list"},ne={class:"info-item"},ie={class:"item-value"},de={class:"info-item"},re={class:"item-value"},ue={class:"info-item"},ce={class:"item-value"},pe={class:"info-item"},me={class:"item-value"},_e={class:"status-card"},fe={class:"status-header"},ve={key:0,class:"operation-time"},ge={class:"photos-card"},we={class:"photos-header"},ye={class:"photos-grid"},be={class:"image-placeholder"},he={class:"photo-actions"},ke={class:"description-card"},Ve={class:"description-header"},xe={class:"description-content"},Ce={class:"dialog-footer"},Be={__name:"WindowManage",setup(Te){const D=Q(),o=C({name:"大荤窗口",code:"W001",canteen:"第一食堂",type:"大荤菜",isOpen:!0,businessHours:"10:30 - 13:30",description:"主营各类炒菜、炖菜，提供美味可口的大荤菜品。",photos:[{url:"/photos/window1.jpg"},{url:"/photos/window2.jpg"}]}),O=[{label:"大荤菜",value:"大荤菜"},{label:"小炒",value:"小炒"},{label:"面食",value:"面食"},{label:"饮品",value:"饮品"},{label:"小吃",value:"小吃"}],p=h(!1),w=h(!1),y=h(null),n=C({name:"",type:"",description:""}),M={name:[{required:!0,message:"请输入窗口名称",trigger:"blur"},{min:2,max:20,message:"长度在 2 到 20 个字符",trigger:"blur"}],type:[{required:!0,message:"请选择经营类型",trigger:"change"}]},N=()=>{D.push("/m/admin/profile")},W=async i=>{try{await E.confirm(`确定要${i?"开始营业":"打烊"}吗？`,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:i?"success":"warning"}),g.success(`已${i?"开始营业":"打烊"}`)}catch{o.isOpen=!i}},$=()=>{n.name=o.name,n.type=o.type,n.description=o.description,p.value=!0},q=async()=>{if(y.value)try{await y.value.validate(),w.value=!0,await new Promise(i=>setTimeout(i,1e3)),o.name=n.name,o.type=n.type,o.description=n.description,g.success("保存成功"),p.value=!1}catch(i){console.error("保存失败：",i)}finally{w.value=!1}},F=()=>{g.info("照片上传功能开发中")},R=async i=>{try{await E.confirm("确定要删除这张照片吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}),o.photos.splice(i,1),g.success("删除成功")}catch{}},S=()=>{n.description=o.description,p.value=!0};return(i,e)=>{const r=d("el-icon"),u=d("el-button"),j=d("el-switch"),H=d("el-image"),k=d("el-input"),b=d("el-form-item"),I=d("el-option"),L=d("el-select"),P=d("el-form"),z=d("el-dialog");return f(),_("div",ee,[t("div",te,[s(u,{class:"back-button",link:"",onClick:N},{default:l(()=>[s(r,null,{default:l(()=>[s(c(Y))]),_:1})]),_:1}),e[6]||(e[6]=t("span",{class:"page-title"},"窗口管理",-1))]),t("div",se,[t("div",le,[t("div",oe,[e[8]||(e[8]=t("div",{class:"window-title"},"基本信息",-1)),s(u,{type:"primary",link:"",onClick:$},{default:l(()=>[s(r,null,{default:l(()=>[s(c(U))]),_:1}),e[7]||(e[7]=v(" 编辑 "))]),_:1})]),t("div",ae,[t("div",ne,[e[9]||(e[9]=t("span",{class:"item-label"},"窗口名称",-1)),t("span",ie,m(o.name),1)]),t("div",de,[e[10]||(e[10]=t("span",{class:"item-label"},"窗口编号",-1)),t("span",re,m(o.code),1)]),t("div",ue,[e[11]||(e[11]=t("span",{class:"item-label"},"所属食堂",-1)),t("span",ce,m(o.canteen),1)]),t("div",pe,[e[12]||(e[12]=t("span",{class:"item-label"},"经营类型",-1)),t("span",me,m(o.type),1)])])]),t("div",_e,[t("div",fe,[e[13]||(e[13]=t("div",{class:"status-title"},"营业状态",-1)),s(j,{modelValue:o.isOpen,"onUpdate:modelValue":e[0]||(e[0]=a=>o.isOpen=a),"active-text":"营业中","inactive-text":"已打烊",onChange:W,class:"status-switch"},null,8,["modelValue"])]),o.isOpen?(f(),_("div",ve,[s(r,null,{default:l(()=>[s(c(Z))]),_:1}),t("span",null,"营业时间："+m(o.businessHours),1)])):J("",!0)]),t("div",ge,[t("div",we,[e[15]||(e[15]=t("div",{class:"photos-title"},"窗口照片",-1)),s(u,{type:"primary",link:"",onClick:F},{default:l(()=>[s(r,null,{default:l(()=>[s(c(A))]),_:1}),e[14]||(e[14]=v(" 上传照片 "))]),_:1})]),t("div",ye,[(f(!0),_(B,null,T(o.photos,(a,V)=>(f(),_("div",{key:V,class:"photo-item"},[s(H,{src:a.url,fit:"cover","preview-src-list":o.photos.map(x=>x.url)},{error:l(()=>[t("div",be,[s(r,null,{default:l(()=>[s(c(G))]),_:1})])]),_:2},1032,["src","preview-src-list"]),t("div",he,[s(u,{type:"danger",circle:"",size:"small",onClick:x=>R(V)},{default:l(()=>[s(r,null,{default:l(()=>[s(c(K))]),_:1})]),_:2},1032,["onClick"])])]))),128))])]),t("div",ke,[t("div",Ve,[e[17]||(e[17]=t("div",{class:"description-title"},"窗口介绍",-1)),s(u,{type:"primary",link:"",onClick:S},{default:l(()=>[s(r,null,{default:l(()=>[s(c(U))]),_:1}),e[16]||(e[16]=v(" 编辑 "))]),_:1})]),t("div",xe,m(o.description||"暂无介绍"),1)])]),s(z,{modelValue:p.value,"onUpdate:modelValue":e[5]||(e[5]=a=>p.value=a),title:"编辑窗口信息",width:"90%","close-on-click-modal":!1},{footer:l(()=>[t("div",Ce,[s(u,{onClick:e[4]||(e[4]=a=>p.value=!1)},{default:l(()=>e[18]||(e[18]=[v("取消")])),_:1}),s(u,{type:"primary",onClick:q,loading:w.value},{default:l(()=>e[19]||(e[19]=[v(" 保存 ")])),_:1},8,["loading"])])]),default:l(()=>[s(P,{ref_key:"formRef",ref:y,model:n,rules:M,"label-position":"top"},{default:l(()=>[s(b,{label:"窗口名称",prop:"name"},{default:l(()=>[s(k,{modelValue:n.name,"onUpdate:modelValue":e[1]||(e[1]=a=>n.name=a),placeholder:"请输入窗口名称"},null,8,["modelValue"])]),_:1}),s(b,{label:"经营类型",prop:"type"},{default:l(()=>[s(L,{modelValue:n.type,"onUpdate:modelValue":e[2]||(e[2]=a=>n.type=a),placeholder:"请选择经营类型"},{default:l(()=>[(f(),_(B,null,T(O,a=>s(I,{key:a.value,label:a.label,value:a.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),s(b,{label:"窗口介绍",prop:"description"},{default:l(()=>[s(k,{modelValue:n.description,"onUpdate:modelValue":e[3]||(e[3]=a=>n.description=a),type:"textarea",rows:"4",placeholder:"请输入窗口介绍"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}},De=X(Be,[["__scopeId","data-v-c8be8206"]]);export{De as default};
