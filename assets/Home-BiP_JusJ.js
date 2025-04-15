import{u as x,r as t,a as N,j as e,f as p}from"./index-Cft_GOt8.js";import{A as v,E as b}from"./EventCarousel-BS2Oi-cK.js";import{N as y}from"./NewsCard-CPav6BY8.js";const A=()=>{const{t:s,i18n:o}=x(),[m,l]=t.useState(!0),[a,n]=t.useState(null),[c,h]=t.useState([]),u=N(),i=o.language,f=()=>{switch(i){case"mk":return"/mk/вести";case"en":default:return"/en/news"}};return t.useEffect(()=>{(async()=>{try{l(!0),n(null);const j=[...await p()].sort((g,w)=>new Date(w.publishDate).getTime()-new Date(g.publishDate).getTime());h(j.slice(0,3))}catch(d){console.error("Error loading articles:",d),n(s("news.errorLoading"))}finally{l(!1)}})()},[i,s]),m?e.jsx("div",{className:"w-full py-12 bg-white",children:e.jsx("div",{className:"container px-4 mx-auto",children:e.jsx("div",{className:"flex items-center justify-center h-64",children:e.jsx("div",{className:"w-12 h-12 border-b-2 rounded-full animate-spin border-primary-600"})})})}):a?e.jsx("div",{className:"w-full py-12 bg-white",children:e.jsx("div",{className:"container px-4 mx-auto",children:e.jsx("div",{className:"flex flex-col items-center justify-center h-64",children:e.jsx("div",{className:"px-4 py-3 text-red-600 border border-red-200 rounded-lg bg-red-50",children:a})})})}):e.jsx("section",{className:"w-full py-16 bg-white",children:e.jsxs("div",{className:"container px-4 mx-auto sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"mb-12 text-center",children:[e.jsx("h2",{className:"mb-4 text-3xl font-bold md:text-4xl text-primary/85",children:s("news.recentTitle")}),e.jsx("p",{className:"max-w-2xl mx-auto text-lg text-slate-600/80",children:s("news.recentDescription")})]}),c.length>0?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"mx-auto max-w-7xl",children:e.jsx("div",{className:"flex flex-col items-stretch justify-center gap-10 md:flex-row lg:gap-12",children:c.map(r=>e.jsx("div",{className:"flex flex-col w-full md:w-64 lg:w-72",children:e.jsx("div",{className:"h-full",children:e.jsx(y,{article:r})})},r.id))})}),e.jsx("div",{className:"mt-8 text-center",children:e.jsx(v,{text:s("news.viewAllNews"),onClick:()=>u(f())})})]}):e.jsx("div",{className:"py-10 text-center rounded-lg shadow-sm bg-slate-50",children:e.jsx("p",{className:"text-slate-600",children:s("news.noArticlesFound")})})]})})},E=()=>{const{t:s}=x();return e.jsx("div",{className:"overflow-hidden",children:e.jsx("div",{className:"overflow-hidden",children:e.jsx("div",{className:"parallax",style:{backgroundImage:"url('/images/header.png')"},children:e.jsx("div",{className:"flex items-center justify-center h-full min-h-screen text-white",children:e.jsx("div",{className:"container px-4 mx-auto",children:e.jsxs("div",{className:"flex flex-col w-full gap-2 text-center md:pr-10 pb-30",children:[e.jsx("h1",{className:"text-6xl font-extrabold text-white/98",children:s("about.shortName")}),e.jsx("span",{className:"text-lg break-words text-gray-100/80 ",children:s("about.name")})]})})})})})})},C=()=>e.jsxs("div",{children:[e.jsx(E,{}),e.jsx(b,{}),e.jsx(A,{})]});export{C as default};
