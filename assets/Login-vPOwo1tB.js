import{m as i,p as F,q as de,s as ne,t as u,b as l,w as o,e as v,a as ie,u as t,v as B,x as h,y as m,A as ue,B as E,C as N,D as T,F as pe,E as f}from"./vendor-qvz31vGP.js";import{_ as me}from"./_plugin-vue_export-helper-DlAUqK2U.js";const ce="/Smart-canteen-mobile/assets/logo-BwmisXlG.png",fe={class:"mobile-login"},ge={class:"login-card"},ve={class:"test-account"},we={class:"code-input"},be={class:"qrcode-container"},Ve={class:"qrcode-wrapper"},_e=["src"],ye={class:"login-footer"},xe={class:"code-input"},ke={class:"dialog-footer"},Ie={class:"code-input"},he={class:"dialog-footer"},qe={__name:"Login",setup(Ce){const A=pe(),D=i("account"),w=i(!1),$=i(null),g=F({workId:"",password:""}),X={workId:[{required:!0,message:"请输入工号",trigger:"blur"},{pattern:/^\d{8}$/,message:"工号格式不正确",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:6,max:20,message:"密码长度在 6 到 20 个字符",trigger:"blur"}]},q=i(null),x=F({phone:"",code:""}),j={phone:[{required:!0,message:"请输入手机号",trigger:"blur"},{pattern:/^1[3-9]\d{9}$/,message:"手机号格式不正确",trigger:"blur"}],code:[{required:!0,message:"请输入验证码",trigger:"blur"},{pattern:/^\d{6}$/,message:"验证码格式不正确",trigger:"blur"}]},b=i(0);let G=null;const z=async()=>{try{await q.value.validateField("phone"),b.value=60,G=setInterval(()=>{b.value--,b.value<=0&&clearInterval(G)},1e3),f.success("验证码已发送")}catch(a){console.error("发送验证码失败:",a)}},k={workId:"22005801",password:"123456"},H=async()=>{if($.value)try{if(await $.value.validate(),w.value=!0,g.workId===k.workId&&g.password===k.password){localStorage.setItem("token","test-token"),localStorage.setItem("user",JSON.stringify({workId:k.workId,name:"测试账号",role:"window_admin"})),f.success("登录成功"),A.push("/m/admin/orders");return}f.error("账号或密码错误")}catch(a){console.error("登录失败:",a),f.error(a.message||"登录失败")}finally{w.value=!1}},K=async()=>{if(q.value)try{await q.value.validate(),w.value=!0,f.success("登录成功"),A.push("/m/admin/orders")}catch(a){console.error("登录失败:",a)}finally{w.value=!1}},Q=i("https://example.com/qrcode.png"),C=i(!1),P=i(!1),R=i(null),d=F({phone:"",code:"",workId:"",name:"",password:"",confirmPassword:""}),W={phone:[{required:!0,message:"请输入手机号",trigger:"blur"},{pattern:/^1[3-9]\d{9}$/,message:"手机号格式不正确",trigger:"blur"}],code:[{required:!0,message:"请输入验证码",trigger:"blur"},{pattern:/^\d{6}$/,message:"验证码格式不正确",trigger:"blur"}],workId:[{required:!0,message:"请输入工号",trigger:"blur"},{pattern:/^\d{8}$/,message:"工号格式不正确",trigger:"blur"}],name:[{required:!0,message:"请输入姓名",trigger:"blur"},{min:2,max:20,message:"姓名长度在 2 到 20 个字符",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:6,max:20,message:"密码长度在 6 到 20 个字符",trigger:"blur"}],confirmPassword:[{required:!0,message:"请再次输入密码",trigger:"blur"},{validator:(a,e,s)=>{e!==d.password?s(new Error("两次输入密码不一致")):s()},trigger:"blur"}]},V=i(0);let J=null;const Y=async()=>{try{await R.value.validateField("phone"),V.value=60,J=setInterval(()=>{V.value--,V.value<=0&&clearInterval(J)},1e3),f.success("验证码已发送")}catch(a){console.error("发送验证码失败:",a)}},Z=async()=>{if(R.value)try{await R.value.validate(),P.value=!0,f.success("注册成功"),C.value=!1}catch(a){console.error("注册失败:",a)}finally{P.value=!1}},I=i(!1),L=i(!1),_=i(null),c=F({phone:"",code:"",password:"",confirmPassword:""}),ee={phone:[{required:!0,message:"请输入手机号",trigger:"blur"},{pattern:/^1[3-9]\d{9}$/,message:"手机号格式不正确",trigger:"blur"}],code:[{required:!0,message:"请输入验证码",trigger:"blur"},{pattern:/^\d{6}$/,message:"验证码格式不正确",trigger:"blur"}],password:[{required:!0,message:"请输入新密码",trigger:"blur"},{min:6,max:20,message:"密码长度在 6 到 20 个字符",trigger:"blur"}],confirmPassword:[{required:!0,message:"请再次输入密码",trigger:"blur"},{validator:(a,e,s)=>{e!==c.password?s(new Error("两次输入密码不一致")):s()},trigger:"blur"}]},y=i(0);let M=null;const le=async()=>{try{await _.value.validateField("phone"),y.value=60,M=setInterval(()=>{y.value--,y.value<=0&&clearInterval(M)},1e3),f.success("验证码已发送")}catch(a){console.error("发送验证码失败:",a)}},oe=()=>{I.value=!0,_.value&&_.value.resetFields()},re=async()=>{if(_.value)try{await _.value.validate(),L.value=!0,f.success("密码重置成功"),I.value=!1}catch(a){console.error("重置密码失败:",a)}finally{L.value=!1}},se=()=>{g.workId=k.workId,g.password=k.password,f({message:"已填入测试账号，点击登录按钮即可登录",type:"info"})};return(a,e)=>{const s=v("el-input"),n=v("el-form-item"),U=v("el-form"),p=v("el-button"),ae=v("el-icon"),S=v("el-tab-pane"),te=v("el-tabs"),O=v("el-dialog");return ie(),de("div",fe,[e[28]||(e[28]=ne('<div class="login-bg" data-v-6630bb42><div class="circle circle-1" data-v-6630bb42></div><div class="circle circle-2" data-v-6630bb42></div><div class="circle circle-3" data-v-6630bb42></div></div><div class="login-header" data-v-6630bb42><div class="logo-wrapper" data-v-6630bb42><img src="'+ce+'" alt="智慧食堂" class="school-logo" data-v-6630bb42></div><h2 class="title" data-v-6630bb42>智慧食堂管理系统</h2><p class="subtitle" data-v-6630bb42>窗口工作人员端</p></div>',2)),u("div",ge,[l(te,{modelValue:D.value,"onUpdate:modelValue":e[4]||(e[4]=r=>D.value=r),class:"login-tabs"},{default:o(()=>[l(S,{label:"账号密码登录",name:"account"},{default:o(()=>[l(U,{ref_key:"accountFormRef",ref:$,model:g,rules:X},{default:o(()=>[l(n,{prop:"workId"},{default:o(()=>[l(s,{modelValue:g.workId,"onUpdate:modelValue":e[0]||(e[0]=r=>g.workId=r),placeholder:"请输入工号","prefix-icon":t(B),class:"custom-input"},null,8,["modelValue","prefix-icon"])]),_:1}),l(n,{prop:"password"},{default:o(()=>[l(s,{modelValue:g.password,"onUpdate:modelValue":e[1]||(e[1]=r=>g.password=r),type:"password",placeholder:"请输入密码","prefix-icon":t(h),"show-password":"",class:"custom-input"},null,8,["modelValue","prefix-icon"])]),_:1})]),_:1},8,["model"]),l(p,{type:"primary",class:"submit-btn",loading:w.value,onClick:H},{default:o(()=>e[19]||(e[19]=[m(" 登录 ")])),_:1},8,["loading"]),u("div",ve,[l(p,{link:"",type:"info",class:"test-btn",onClick:se},{default:o(()=>[l(ae,null,{default:o(()=>[l(t(ue))]),_:1}),e[20]||(e[20]=m(" 使用测试账号 "))]),_:1})])]),_:1}),l(S,{label:"手机号登录",name:"phone"},{default:o(()=>[l(U,{ref_key:"phoneFormRef",ref:q,model:x,rules:j},{default:o(()=>[l(n,{prop:"phone"},{default:o(()=>[l(s,{modelValue:x.phone,"onUpdate:modelValue":e[2]||(e[2]=r=>x.phone=r),placeholder:"请输入手机号","prefix-icon":t(E),class:"custom-input"},null,8,["modelValue","prefix-icon"])]),_:1}),l(n,{prop:"code"},{default:o(()=>[u("div",we,[l(s,{modelValue:x.code,"onUpdate:modelValue":e[3]||(e[3]=r=>x.code=r),placeholder:"请输入验证码","prefix-icon":t(N),class:"custom-input"},null,8,["modelValue","prefix-icon"]),l(p,{type:"primary",disabled:!!b.value,onClick:z,class:"code-btn"},{default:o(()=>[m(T(b.value?`${b.value}s`:"获取验证码"),1)]),_:1},8,["disabled"])])]),_:1})]),_:1},8,["model"]),l(p,{type:"primary",class:"submit-btn",loading:w.value,onClick:K},{default:o(()=>e[21]||(e[21]=[m(" 登录 ")])),_:1},8,["loading"])]),_:1}),l(S,{label:"微信扫码登录",name:"wechat"},{default:o(()=>[u("div",be,[u("div",Ve,[u("img",{src:Q.value,alt:"微信扫码",class:"qrcode"},null,8,_e)]),e[22]||(e[22]=u("p",{class:"qrcode-tip"},"请使用微信扫描二维码登录",-1))])]),_:1})]),_:1},8,["modelValue"])]),u("div",ye,[l(p,{link:"",class:"footer-btn",onClick:oe},{default:o(()=>e[23]||(e[23]=[m("忘记密码")])),_:1})]),l(O,{modelValue:C.value,"onUpdate:modelValue":e[12]||(e[12]=r=>C.value=r),title:"注册账号",width:"90%","show-close":!1,class:"register-dialog"},{footer:o(()=>[u("div",ke,[l(p,{onClick:e[11]||(e[11]=r=>C.value=!1)},{default:o(()=>e[24]||(e[24]=[m("取消")])),_:1}),l(p,{type:"primary",loading:P.value,onClick:Z},{default:o(()=>e[25]||(e[25]=[m(" 注册 ")])),_:1},8,["loading"])])]),default:o(()=>[l(U,{ref_key:"registerFormRef",ref:R,model:d,rules:W,"label-position":"top"},{default:o(()=>[l(n,{label:"手机号",prop:"phone"},{default:o(()=>[u("div",xe,[l(s,{modelValue:d.phone,"onUpdate:modelValue":e[5]||(e[5]=r=>d.phone=r),placeholder:"请输入手机号","prefix-icon":t(E)},null,8,["modelValue","prefix-icon"]),l(p,{type:"primary",disabled:!!V.value,onClick:Y},{default:o(()=>[m(T(V.value?`${V.value}s`:"获取验证码"),1)]),_:1},8,["disabled"])])]),_:1}),l(n,{label:"验证码",prop:"code"},{default:o(()=>[l(s,{modelValue:d.code,"onUpdate:modelValue":e[6]||(e[6]=r=>d.code=r),placeholder:"请输入验证码","prefix-icon":t(N)},null,8,["modelValue","prefix-icon"])]),_:1}),l(n,{label:"工号",prop:"workId"},{default:o(()=>[l(s,{modelValue:d.workId,"onUpdate:modelValue":e[7]||(e[7]=r=>d.workId=r),placeholder:"请输入工号","prefix-icon":t(B)},null,8,["modelValue","prefix-icon"])]),_:1}),l(n,{label:"姓名",prop:"name"},{default:o(()=>[l(s,{modelValue:d.name,"onUpdate:modelValue":e[8]||(e[8]=r=>d.name=r),placeholder:"请输入姓名","prefix-icon":t(B)},null,8,["modelValue","prefix-icon"])]),_:1}),l(n,{label:"设置密码",prop:"password"},{default:o(()=>[l(s,{modelValue:d.password,"onUpdate:modelValue":e[9]||(e[9]=r=>d.password=r),type:"password",placeholder:"请设置登录密码","prefix-icon":t(h),"show-password":""},null,8,["modelValue","prefix-icon"])]),_:1}),l(n,{label:"确认密码",prop:"confirmPassword"},{default:o(()=>[l(s,{modelValue:d.confirmPassword,"onUpdate:modelValue":e[10]||(e[10]=r=>d.confirmPassword=r),type:"password",placeholder:"请再次输入密码","prefix-icon":t(h),"show-password":""},null,8,["modelValue","prefix-icon"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),l(O,{modelValue:I.value,"onUpdate:modelValue":e[18]||(e[18]=r=>I.value=r),title:"重置密码",width:"90%","show-close":!1,class:"reset-dialog"},{footer:o(()=>[u("div",he,[l(p,{onClick:e[17]||(e[17]=r=>I.value=!1)},{default:o(()=>e[26]||(e[26]=[m("取消")])),_:1}),l(p,{type:"primary",loading:L.value,onClick:re},{default:o(()=>e[27]||(e[27]=[m(" 重置密码 ")])),_:1},8,["loading"])])]),default:o(()=>[l(U,{ref_key:"resetFormRef",ref:_,model:c,rules:ee,"label-position":"top"},{default:o(()=>[l(n,{label:"手机号",prop:"phone"},{default:o(()=>[u("div",Ie,[l(s,{modelValue:c.phone,"onUpdate:modelValue":e[13]||(e[13]=r=>c.phone=r),placeholder:"请输入手机号","prefix-icon":t(E)},null,8,["modelValue","prefix-icon"]),l(p,{type:"primary",disabled:!!y.value,onClick:le},{default:o(()=>[m(T(y.value?`${y.value}s`:"获取验证码"),1)]),_:1},8,["disabled"])])]),_:1}),l(n,{label:"验证码",prop:"code"},{default:o(()=>[l(s,{modelValue:c.code,"onUpdate:modelValue":e[14]||(e[14]=r=>c.code=r),placeholder:"请输入验证码","prefix-icon":t(N)},null,8,["modelValue","prefix-icon"])]),_:1}),l(n,{label:"新密码",prop:"password"},{default:o(()=>[l(s,{modelValue:c.password,"onUpdate:modelValue":e[15]||(e[15]=r=>c.password=r),type:"password",placeholder:"请设置新密码","prefix-icon":t(h),"show-password":""},null,8,["modelValue","prefix-icon"])]),_:1}),l(n,{label:"确认密码",prop:"confirmPassword"},{default:o(()=>[l(s,{modelValue:c.confirmPassword,"onUpdate:modelValue":e[16]||(e[16]=r=>c.confirmPassword=r),type:"password",placeholder:"请再次输入密码","prefix-icon":t(h),"show-password":""},null,8,["modelValue","prefix-icon"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}},Fe=me(qe,[["__scopeId","data-v-6630bb42"]]);export{Fe as default};
