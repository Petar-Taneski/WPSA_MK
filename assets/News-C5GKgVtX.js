import{u as o,a as h,j as e,b as d,r as f}from"./index-Cft_GOt8.js";import{R as j,N as b}from"./NewsCard-CPav6BY8.js";import{E as w,L as v}from"./EmptyState-CgQ3pfNW.js";const N=({article:s})=>{const{t:r,i18n:a}=o(),{id:l,title:n,summary:t,publishDate:i,author:c}=s,m=h(),u=()=>a.language==="mk"?`/mk/вести/${l}`:`/en/news/${l}`,p=new Date(i).toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"}),g=s.imageUrl||s.thumbnailUrl||"/placeholder.jpg";return e.jsx("div",{className:"hover:shadow-md shadow-sm transition-shadow duration-300 group rounded-sm mb-1",children:e.jsxs("div",{className:"flex flex-col h-full lg:flex-row",children:[e.jsxs("div",{className:"lg:w-3/5 flex flex-col order-2 lg:order-1 py-6 px-8",children:[e.jsx("h2",{className:"text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800/85 mb-3 pb-3 border-b border-primary-500",children:n}),e.jsxs("div",{className:"flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500/70 mb-4",children:[e.jsx("span",{children:p}),c&&e.jsxs("span",{children:["• ",c]}),e.jsxs("span",{className:"font-medium text-primary",children:["• ",r("news.featured")]})]}),e.jsx("p",{className:"text-base md:text-lg text-gray-700/90 leading-relaxed mb-6 flex-grow",children:t}),e.jsx(j,{articleId:l,className:"mt-auto self-end"})]}),e.jsx("div",{onClick:()=>m(u()),className:"lg:w-1/2 mb-4 lg:mb-0 order-1 lg:order-2 cursor-pointer",children:e.jsx("div",{className:"aspect-video lg:aspect-auto lg:h-full rounded-sm overflow-hidden",children:e.jsx("img",{src:g,alt:n,className:"w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"})})})]})})},x=["Webinars","Courses","Education and training","WPSA Events"],y=()=>{const{t:s}=o(),{activeFilter:r,setActiveFilter:a}=d(),l=f.useRef(null),n=t=>{const i=t.target.value;a(i===""?null:i)};return e.jsx("div",{className:"sticky top-[13vh] max-md:top-[15vh] z-10 bg-white/90 backdrop-blur-sm py-8 border-gray-100",children:e.jsxs("div",{className:"flex justify-center items-center gap-4 md:gap-8 px-4 md:px-0",children:[e.jsxs("div",{ref:l,className:"hidden md:flex flex-shrink-0 gap-2",children:[e.jsx("button",{onClick:()=>a(null),className:`px-3 py-1 text-sm rounded transition-colors whitespace-nowrap ${r===null?"bg-primary/10 text-primary font-medium":"text-gray-600 hover:bg-gray-100"}`,children:s("news.allTopics")}),x.map(t=>e.jsx("button",{onClick:()=>a(t),className:`px-3 py-1 text-sm rounded transition-colors whitespace-nowrap ${r===t?"bg-primary/10 text-primary font-medium":"text-gray-600 hover:bg-gray-100"}`,children:t},t))]}),e.jsx("div",{className:"block md:hidden w-full max-w-xs",children:e.jsxs("select",{value:r===null?"":r,onChange:n,className:"w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary","aria-label":s("news.filterByCategory"),children:[e.jsx("option",{value:"",children:s("news.allTopics")}),x.map(t=>e.jsx("option",{value:t,children:t},t))]})})]})})};function C(){const{filteredArticles:s}=d();return e.jsxs(e.Fragment,{children:[e.jsx(y,{}),s.length===0&&e.jsx(w,{}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12",children:s.map(r=>e.jsx(b,{article:r},r.id))})]})}const k=()=>{const{t:s}=o(),{loading:r,error:a,featuredArticle:l}=d();return e.jsxs("div",{className:"px-20 py-8 page news-page max-sm:px-4 max-lg:px-20 max-xl:px-10",children:[e.jsxs("div",{className:"container px-6 mx-auto mb-12",children:[e.jsx("h2",{className:"mb-3 text-3xl font-bold text-center md:text-4xl text-primary/85",children:s("news.recentTitle")}),e.jsx("p",{className:"max-w-2xl mx-auto text-center text-slate-700/80",children:s("news.recentDescription")}),e.jsx("div",{className:"w-24 h-1 mx-auto mt-4 rounded bg-primary"})]}),r&&e.jsx(v,{}),a&&!r&&e.jsx("div",{className:"p-4 text-red-700 border border-red-200 rounded-md bg-red-50",children:a}),!r&&!a&&e.jsxs(e.Fragment,{children:[l&&e.jsx(N,{article:l}),e.jsx(C,{})]})]})},D=()=>e.jsx(k,{});export{D as default};
