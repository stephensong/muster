!function(e){function n(n){for(var r,i,c=n[0],l=n[1],s=n[2],u=0,d=[];u<c.length;u++)i=c[u],o[i]&&d.push(o[i][0]),o[i]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(e[r]=l[r]);for(p&&p(n);d.length;)d.shift()();return a.push.apply(a,s||[]),t()}function t(){for(var e,n=0;n<a.length;n++){for(var t=a[n],r=!0,c=1;c<t.length;c++){var l=t[c];0!==o[l]&&(r=!1)}r&&(a.splice(n--,1),e=i(i.s=t[0]))}return e}var r={},o={3:0},a=[];function i(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=e,i.c=r,i.d=function(e,n,t){i.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,n){if(1&n&&(e=i(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)i.d(t,r,function(n){return e[n]}.bind(null,r));return t},i.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(n,"a",n),n},i.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},i.p="";var c=window.webpackJsonp=window.webpackJsonp||[],l=c.push.bind(c);c.push=n,c=c.slice();for(var s=0;s<c.length;s++)n(c[s]);var p=l;a.push([467,1,0]),t()}({22:function(e,n){e.exports=React},451:function(e,n){e.exports=Babel},467:function(e,n,t){"use strict";(function(e){var r;(r=t(24).enterModule)&&r(e);var o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)Object.hasOwnProperty.call(e,t)&&(n[t]=e[t]);return n.default=e,n},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0}),t(359),t(396);const i=o(t(22)),c=o(t(93)),l=t(24),s=a(t(668));function p(e){c.render(i.createElement(l.AppContainer,null,i.createElement(e,null)),document.getElementById("app"))}var u,d;p(s.default),u=t(24).default,d=t(24).leaveModule,u&&(u.register(o,"__importStar","/home/circleci/repo/packages/muster-playground/src/index.tsx"),u.register(a,"__importDefault","/home/circleci/repo/packages/muster-playground/src/index.tsx"),u.register(i,"React","/home/circleci/repo/packages/muster-playground/src/index.tsx"),u.register(c,"ReactDOM","/home/circleci/repo/packages/muster-playground/src/index.tsx"),u.register(s,"main_1","/home/circleci/repo/packages/muster-playground/src/index.tsx"),u.register(p,"render","/home/circleci/repo/packages/muster-playground/src/index.tsx"),d(e))}).call(this,t(61)(e))},668:function(e,n,t){"use strict";(function(e){var r;(r=t(24).enterModule)&&r(e);var o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)Object.hasOwnProperty.call(e,t)&&(n[t]=e[t]);return n.default=e,n},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});const i=t(176),c=o(t(22)),l=t(852),s=a(t(452));var p,u;t(453),t(888),n.default=(()=>c.createElement(i.Provider,{muster:s.default()},c.createElement(l.App,null))),p=t(24).default,u=t(24).leaveModule,p&&(p.register(o,"__importStar","/home/circleci/repo/packages/muster-playground/src/main.tsx"),p.register(a,"__importDefault","/home/circleci/repo/packages/muster-playground/src/main.tsx"),p.register(c,"React","/home/circleci/repo/packages/muster-playground/src/main.tsx"),p.register(s,"router_1","/home/circleci/repo/packages/muster-playground/src/main.tsx"),u(e))}).call(this,t(61)(e))},852:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});const r=t(853),o=t(886);n.App=o.AppContainer(r.AppView)},853:function(e,n,t){"use strict";(function(e){var r;(r=t(24).enterModule)&&r(e);var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)Object.hasOwnProperty.call(e,t)&&(n[t]=e[t]);return n.default=e,n};Object.defineProperty(n,"__esModule",{value:!0});const i=o(t(194)),c=a(t(22)),l=o(t(854)),s=o(t(450));var p,u;t(884),n.AppView=(({className:e,title:n})=>c.createElement("div",{className:i.default("App",e)},c.createElement("div",{className:"App__header"},c.createElement(l.default,{title:n})),c.createElement("div",{className:"App__main"},c.createElement(s.default,null)))),p=t(24).default,u=t(24).leaveModule,p&&(p.register(o,"__importDefault","/home/circleci/repo/packages/muster-playground/src/components/app/app.tsx"),p.register(a,"__importStar","/home/circleci/repo/packages/muster-playground/src/components/app/app.tsx"),p.register(i,"classnames_1","/home/circleci/repo/packages/muster-playground/src/components/app/app.tsx"),p.register(c,"React","/home/circleci/repo/packages/muster-playground/src/components/app/app.tsx"),p.register(l,"app_header_1","/home/circleci/repo/packages/muster-playground/src/components/app/app.tsx"),p.register(s,"query_editor_1","/home/circleci/repo/packages/muster-playground/src/components/app/app.tsx"),u(e))}).call(this,t(61)(e))},854:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t(855);n.default=r.default},855:function(e,n,t){"use strict";(function(e){var r;(r=t(24).enterModule)&&r(e);var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)Object.hasOwnProperty.call(e,t)&&(n[t]=e[t]);return n.default=e,n};Object.defineProperty(n,"__esModule",{value:!0});const i=o(t(194)),c=a(t(22));function l(e){switch(e){case"basic":s("graph=IntcbiAgZ3JlZXRpbmc6ICdIZWxsbycsXG4gIHVzZXI6ICd3b3JsZCcsXG4gIHdlbGNvbWU6IGZvcm1hdCgnJHtzYWx1dGF0aW9ufSwgJHtuYW1lfSEnLCB7XG4gICAgc2FsdXRhdGlvbjogcmVmKCdncmVldGluZycpLFxuICAgIG5hbWU6IHJlZigndXNlcicpLFxuICB9KSxcbn0i&toggles=eyJzaG93R3JhcGgiOnRydWUsInNob3dRdWVyeSI6dHJ1ZSwic2hvd1F1ZXJ5UmVzdWx0Ijp0cnVlLCJzaG93Q29udGFpbmVyIjp0cnVlLCJzaG93VmlldyI6dHJ1ZSwic2hvd1ZpZXdSZXN1bHQiOnRydWV9","basic");break;case"recursion":s("graph=IntcbiAgW21hdGNoKHR5cGVzLmludGVnZXIsICdpJyldOiB7XG4gICAgZmlib25hY2NpOiBjb21wdXRlZChcbiAgICAgIFtwYXJhbSgnaScpXSxcbiAgICAgIChpKSA9PiAoXG4gICAgICAgIGkgPCAyXG4gICAgICAgICAgPyBpXG4gICAgICAgICAgOiBhZGQocmVmKGkgLSAxLCAnZmlib25hY2NpJyksIHJlZihpIC0gMiwgJ2ZpYm9uYWNjaScpKVxuICAgICAgKVxuICAgIClcbiAgfVxufSI%3D&toggles=eyJzaG93R3JhcGgiOnRydWUsInNob3dRdWVyeSI6dHJ1ZSwic2hvd1F1ZXJ5UmVzdWx0Ijp0cnVlLCJzaG93Q29udGFpbmVyIjpmYWxzZSwic2hvd1ZpZXciOmZhbHNlLCJzaG93Vmlld1Jlc3VsdCI6ZmFsc2V9&query=InJlZigxMCwgJ2ZpYm9uYWNjaScpIg%3D%3D","recursion");break;case"fetch":s("graph=IntcbiAgZ3JlZXRpbmc6ICdIZWxsbycsXG4gIHVzZXI6IGZyb21Qcm9taXNlKCgpID0%2BXG4gICAgZmV0Y2goJ2h0dHBzOi8vanNvbnBsYWNlaG9sZGVyLnR5cGljb2RlLmNvbS91c2Vycy8xJylcbiAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgLnRoZW4odXNlciA9PiB1c2VyLm5hbWUpXG4gICksXG4gIHdlbGNvbWU6IGZvcm1hdCgnJHtzYWx1dGF0aW9ufSwgJHtuYW1lfSEnLCB7XG4gICAgc2FsdXRhdGlvbjogcmVmKCdncmVldGluZycpLFxuICAgIG5hbWU6IHJlZigndXNlcicpLFxuICB9KSxcbn0i&toggles=eyJzaG93R3JhcGgiOnRydWUsInNob3dRdWVyeSI6dHJ1ZSwic2hvd1F1ZXJ5UmVzdWx0Ijp0cnVlLCJzaG93Q29udGFpbmVyIjp0cnVlLCJzaG93VmlldyI6dHJ1ZSwic2hvd1ZpZXdSZXN1bHQiOnRydWV9","fetch")}}function s(e,n){const{location:t}=window;t.assign(`${t.origin}${t.pathname}?${e}#${n}`)}var p,u;t(856),n.default=(({className:e,title:n})=>c.createElement("header",{className:i.default("AppHeader",e)},c.createElement("div",{className:"AppHeader__examples"},"Examples",c.createElement("select",{className:"AppHeader__examples__select",onChange:e=>l(e.target.value)},c.createElement("option",{value:"basic",selected:"#basic"===window.location.hash},"Basic"),c.createElement("option",{value:"recursion",selected:"#recursion"===window.location.hash},"Recursion"),c.createElement("option",{value:"fetch",selected:"#fetch"===window.location.hash},"Fetching APIs"))),c.createElement("div",{className:"AppHeader__title"},c.createElement("div",{className:"AppHeader__title__title"},"Muster"),c.createElement("div",{className:"AppHeader__title__subtitle"},n)),c.createElement("div",{className:"AppHeader__version"},"6.6.0"))),p=t(24).default,u=t(24).leaveModule,p&&(p.register(o,"__importDefault","/home/circleci/repo/packages/muster-playground/src/components/app-header/app-header.tsx"),p.register(a,"__importStar","/home/circleci/repo/packages/muster-playground/src/components/app-header/app-header.tsx"),p.register(i,"classnames_1","/home/circleci/repo/packages/muster-playground/src/components/app-header/app-header.tsx"),p.register(c,"React","/home/circleci/repo/packages/muster-playground/src/components/app-header/app-header.tsx"),p.register(l,"setExample","/home/circleci/repo/packages/muster-playground/src/components/app-header/app-header.tsx"),p.register(s,"changeLocation","/home/circleci/repo/packages/muster-playground/src/components/app-header/app-header.tsx"),u(e))}).call(this,t(61)(e))},856:function(e,n,t){var r=t(857);"string"==typeof r&&(r=[[e.i,r,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};t(140)(r,o);r.locals&&(e.exports=r.locals)},857:function(e,n,t){(e.exports=t(139)(!1)).push([e.i,".AppHeader {\n  background: #6d294a;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  margin: 0 auto;\n  box-shadow: 0 2px 5px 0 #aeb1b4;\n  padding: 0 1.5rem;\n  height: 56px;\n  color: #fff;\n}\n\n.AppHeader__title {\n  flex: 1;\n  line-height: 1;\n  text-align: center;\n}\n\n.AppHeader__title__subtitle {\n  color: #d04990;\n}\n\n.AppHeader__version {\n  flex: 1;\n  font-size: 14px;\n  text-align: right;\n}\n\n.AppHeader__examples {\n  flex: 1;\n}\n\n.AppHeader__examples__select {\n  margin-left: 1em;\n}\n",""])},884:function(e,n,t){var r=t(885);"string"==typeof r&&(r=[[e.i,r,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};t(140)(r,o);r.locals&&(e.exports=r.locals)},885:function(e,n,t){(e.exports=t(139)(!1)).push([e.i,"html,\nbody,\n#app {\n  height: 100%;\n}\n\n.App {\n  height: 100%;\n  margin: 0 auto;\n  display: flex;\n  flex-direction: column;\n}\n\n.App__header {\n  flex: 0;\n  flex-basis: 56px;\n  position: relative;\n  z-index: 1;\n}\n\n.App__main {\n  flex: 1;\n  overflow: hidden;\n}\n\n.App__main > * {\n  height: 100%;\n}\n",""])},886:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});const r=t(176);n.AppContainer=r.container({graph:{title:r.ref(r.global("ui","title"))},props:{title:r.propTypes.string}})},888:function(e,n,t){var r=t(889);"string"==typeof r&&(r=[[e.i,r,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};t(140)(r,o);r.locals&&(e.exports=r.locals)},889:function(e,n,t){(e.exports=t(139)(!1)).push([e.i,".btn {\n  cursor: pointer;\n  display: inline-block;\n  font-weight: 400;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: middle;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  border: 1px solid transparent;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  border-radius: 0.25rem;\n  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,\n    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n\n.btn:hover,\n.btn:focus {\n  text-decoration: none;\n}\n\n.btn:focus,\n.btn.focus {\n  outline: 0;\n  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n\n.btn-primary {\n  color: #fff;\n  background-color: #007bff;\n  border-color: #007bff;\n}\n\n.btn-primary:hover {\n  color: #fff;\n  background-color: #0069d9;\n  border-color: #0062cc;\n}\n\n.btn-primary:focus,\n.btn-primary.focus {\n  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);\n}\n\n.btn-light {\n  color: #212529;\n  background-color: #f8f9fa;\n  border-color: #f8f9fa;\n}\n\n.btn-light:hover {\n  color: #212529;\n  background-color: #e2e6ea;\n  border-color: #dae0e5;\n}\n\n.btn-light:focus,\n.btn-light.focus {\n  box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5);\n}\n\n.btn-light.disabled,\n.btn-light:disabled {\n  color: #212529;\n  background-color: #f8f9fa;\n  border-color: #f8f9fa;\n}\n\n.btn-sm,\n.btn-group-sm > .btn {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  border-radius: 0.2rem;\n}\n\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  vertical-align: middle;\n}\n\n.btn-group > .btn,\n.btn-group-vertical > .btn {\n  position: relative;\n  -ms-flex: 0 1 auto;\n  flex: 0 1 auto;\n}\n\n.btn-group > .btn:hover,\n.btn-group-vertical > .btn:hover {\n  z-index: 1;\n}\n\n.btn-group > .btn:focus,\n.btn-group > .btn:active,\n.btn-group > .btn.active,\n.btn-group-vertical > .btn:focus,\n.btn-group-vertical > .btn:active,\n.btn-group-vertical > .btn.active {\n  z-index: 1;\n}\n\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group,\n.btn-group-vertical .btn + .btn,\n.btn-group-vertical .btn + .btn-group,\n.btn-group-vertical .btn-group + .btn,\n.btn-group-vertical .btn-group + .btn-group {\n  margin-left: -1px;\n}\n\n.btn-group > .btn:first-child {\n  margin-left: 0;\n}\n\n.btn-group > .btn:not(:first-child),\n.btn-group > .btn-group:not(:first-child) > .btn {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.btn-group > .btn:not(:last-child):not(.dropdown-toggle),\n.btn-group > .btn-group:not(:last-child) > .btn {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n",""])},93:function(e,n){e.exports=ReactDOM}});
//# sourceMappingURL=main.js.map