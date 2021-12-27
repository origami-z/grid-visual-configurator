var B=Object.defineProperty,V=Object.defineProperties;var k=Object.getOwnPropertyDescriptors;var N=Object.getOwnPropertySymbols;var G=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var A=(e,t,r)=>t in e?B(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,y=(e,t)=>{for(var r in t||(t={}))G.call(t,r)&&A(e,r,t[r]);if(N)for(var r of N(t))L.call(t,r)&&A(e,r,t[r]);return e},D=(e,t)=>V(e,k(t));import{j as a,a as f,r as h,M as p,B as T,D as I,A as K,R as Y,b as j}from"./vendor.45a64714.js";const $=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))c(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&c(l)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}};$();const O="Grid.ValueFormatter.DivideByThousand",J=()=>e=>Number.parseFloat(e)/1e3,U=()=>a("div",{children:"Divide by 1e3"}),_="Grid.ValueFormatter.FixedDecimalPlaces",X=e=>t=>Number.parseFloat(t).toFixed(e.dp),q=e=>{var t;return a("div",{children:f("label",{children:["Decimal Places",a("input",{value:(t=e.param)==null?void 0:t.dp,type:"number",onChange:r=>{var c;return(c=e.onParamChange)==null?void 0:c.call(e,{dp:Number.parseInt(r.currentTarget.value)})}})]})})},b="Grid.ValueFormatter.SuffixBy",H=e=>t=>t.toString()+e.suffix,z=e=>{var t;return a("div",{children:f("label",{children:["Suffix",a("input",{value:(t=e.param)==null?void 0:t.suffix,onChange:r=>{var c;return(c=e.onParamChange)==null?void 0:c.call(e,{suffix:r.currentTarget.value})}})]})})},E={[O]:{defaultKey:{type:O},editor:U,converter:J},[_]:{defaultKey:{type:_,param:{dp:2}},editor:q,converter:X},[b]:{defaultKey:{type:b,param:{suffix:" k"}},editor:z,converter:H}},x="Grid.ValueFormatter.",Q=Object.keys(E).map(e=>e.replace(x,""));const C="Grid.Field",W=(e,t)=>D(y({},e),{field:t.field}),Z={type:C,param:{field:""}},ee=e=>{var t;return a("div",{children:f("label",{children:["Field",a("input",{value:(t=e.param)==null?void 0:t.field,onChange:r=>{var c;return(c=e.onParamChange)==null?void 0:c.call(e,{field:r.currentTarget.value})}})]})})},w="Grid.ValueFormatter",te=(e,t)=>D(y({},e),{valueFormatter:r=>t.formatter(r.value)}),re={type:w,param:{formatter:e=>e}},ae=e=>{const[t,r]=h.exports.useState([]),n=a(p,{onClick:l=>{const s=x+l.key;r(i=>[...i,E[s].defaultKey])},children:Q.map(l=>a(p.Item,{disabled:t.some(s=>s.type===x+l),children:l},l))});h.exports.useEffect(()=>{var s;const l=i=>{let d=i;for(let u=0;u<t.length;u++){const m=t[u].type;d=E[m].converter(t[u].param)(d)}return d};(s=e.onParamChange)==null||s.call(e,{formatter:l})},[t]);const o=t.map(l=>{const s=l.type,i=d=>{r(u=>u.map(m=>m.type===s?D(y({},m),{param:d}):m))};return f("div",{className:"GridEditor-FormatterRenderer",children:[a(T,{onClick:()=>r(d=>d.filter(u=>u.type!==s)),children:"X"}),h.exports.createElement(E[s].editor,{param:l.param,onParamChange:i})]},s)});return f("div",{children:[f("div",{children:["Value Formatter",a(I,{overlay:n,children:a(T,{children:"+"})})]}),o]})},F={[C]:{defaultDescriptor:Z,editor:ee,composer:W},[w]:{defaultDescriptor:re,editor:ae,composer:te}},ne=[[{type:C,param:{field:"make"}}],[{type:C,param:{field:"model"}}],[{type:C,param:{field:"price"}}]],oe=e=>{const[t,r]=h.exports.useState(ne);h.exports.useEffect(()=>{var o;const n=t.map((l,s)=>{let i={};return l.map(d=>{i=F[d.type].composer(i,d.param)}),i});(o=e.onColDefsChange)==null||o.call(e,n)},[t]);const c=t.map((n,o)=>{const s=a(p,{onClick:i=>{const d=i.key;r(u=>u.map((m,v)=>v===o&&!m.some(g=>g.type===d)?[...m,F[d].defaultDescriptor]:m))},children:Object.keys(F).map(i=>a(p.Item,{disabled:n.some(d=>d.type===i),children:i},i))});return f("div",{children:[f("div",{children:["Column ",o+1]}),n.map((i,d)=>{const u=`column-${o}-editor-${d}`,m=v=>{r(g=>g.map((R,S)=>S===o?R.map((P,M)=>M===d?D(y({},P),{param:v}):P):R))};return h.exports.createElement(F[i.type].editor,{key:u,param:i.param,onParamChange:m})}),a(I,{overlay:s,children:a(T,{children:"Add +"})})]},o)});return a("div",{className:"ColDefEditor",children:c})};const le=[{make:"Toyota",model:"Celica",price:35e3},{make:"Ford",model:"Mondeo",price:32e3},{make:"Porsche",model:"Boxter",price:72e3}],ie=e=>{const[t,r]=h.exports.useState('[{"make":"Toyota","model":"Celica","price":35000},{"make":"Ford","model":"Mondeo","price":32000},{"make":"Porsche","model":"Boxter","price":72000}]'),[c,n]=h.exports.useState(le);return h.exports.useEffect(()=>{var l;(l=e.onDataChanged)==null||l.call(e,c)},[]),f("label",{className:"DataInput",children:["Input data JSON ",c===null?"ERROR":"OK",a("br",{}),a("textarea",{value:t,onChange:l=>{var i,d;const s=l.currentTarget.value;r(s);try{const u=JSON.parse(s);n(u),(i=e.onDataChanged)==null||i.call(e,u)}catch(u){console.error(u),n(null),(d=e.onDataChanged)==null||d.call(e,null)}},className:"DataInput-textarea"})]})};const de=e=>a("div",{className:"ag-theme-alpine",style:{height:400,width:600},children:a(K,{columnDefs:e.columnDefs,rowData:e.rowData,reactUi:!0})});function ce(){const[e,t]=h.exports.useState([]),[r,c]=h.exports.useState([]);return f("div",{className:"App",children:[f("div",{className:"LeftColumn",children:[a("div",{className:"LeftColumn-TopPanel",children:a(oe,{onColDefsChange:c})}),a("div",{className:"LeftColumn-BottomPanel",children:a(ie,{onDataChanged:t})})]}),a("div",{className:"RightColumn",children:a(de,{rowData:e,columnDefs:r})})]})}Y.render(a(j.StrictMode,{children:a(ce,{})}),document.getElementById("root"));
