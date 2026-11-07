const origins=new Set(['https://bani-teplo.by','https://teplo-bani.sasha-sandrozd.workers.dev','https://alexandro222-0d.github.io']);
function reply(body,status,origin){return Response.json(body,{status,headers:{'Cache-Control':'no-store','Access-Control-Allow-Origin':origin,'Vary':'Origin'}});}
export default {async fetch(request,env){
 const url=new URL(request.url);if(url.pathname!='/api/request')return env.ASSETS.fetch(request);
 const origin=request.headers.get('Origin')||'';
 if(!origins.has(origin))return reply({ok:false,error:'Недопустимый источник запроса'},403,'');
 if(request.method==='OPTIONS')return new Response(null,{headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'}});
 if(request.method!=='POST')return reply({ok:false},405,origin);
 if(Number(request.headers.get('Content-Length')||0)>10000)return reply({ok:false},413,origin);
 let data;try{const raw=await request.text();if(raw.length>10000)return reply({ok:false},413,origin);data=JSON.parse(raw);}catch{return reply({ok:false,error:'Неверный формат заявки'},400,origin);}
 const clean=(v,max=160)=>typeof v==='string'?v.trim().slice(0,max):'';
 if(data.website)return reply({ok:false,error:'Не удалось отправить заявку'},400,origin);
 const name=clean(data.name,80),phone=clean(data.phone,40),kind=clean(data.kind,40);
 if(!name||phone.replace(/\D/g,'').length<9||!['booking','certificate'].includes(kind))return reply({ok:false,error:'Укажите имя и полный номер телефона'},400,origin);
 if(!(await env.REQUEST_LIMIT.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'})).success)return reply({ok:false,error:'Слишком много заявок. Подождите минуту или позвоните нам.'},429,origin);
 let text,subject;
 if(kind==='booking'){
 const hours=Number(data.hours),guests=Number(data.guests),date=clean(data.date,10),time=clean(data.time,5);
 if(!Number.isInteger(hours)||hours<3||hours>12||!Number.isInteger(guests)||guests<1||guests>12||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time))return reply({ok:false,error:'Проверьте дату, время и количество гостей'},400,origin);
 subject='ТЕПЛО — заявка на бронирование';text=`Баня: ${clean(data.bath)}\nДата: ${date}\nВремя: ${time}\nЧасов: ${hours}\nГостей: ${guests}\nЧан: ${data.chan?'да':'нет'}`;
 }else{
 const certificate=clean(data.certificate);if(!['На сумму','На количество часов','На парение с пар-мастером'].includes(certificate))return reply({ok:false,error:'Выберите сертификат'},400,origin);
 subject='ТЕПЛО — заказ сертификата';text=`Сертификат: ${certificate}\nПожелания: ${clean(data.note,1000)||'не указаны'}`;
 }
 const id=crypto.randomUUID();
 try{
 const result=await env.EMAIL.send({from:'site@bani-teplo.by',to:env.MAIL_TO,subject,text:`${subject}\n\nИмя: ${name}\nТелефон: ${phone}\n${text}\n\nНомер заявки: ${id}\nВремя: ${new Date().toISOString()}`});
 return reply({ok:true,id},200,origin);
 }catch(e){console.error('Request delivery failed',e.code||'EMAIL_ERROR');return reply({ok:false,error:'Не удалось отправить заявку. Попробуйте позже или свяжитесь с нами по телефону или в Instagram.'},503,origin);}
}};
