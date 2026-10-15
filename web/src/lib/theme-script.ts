// Runs before hydration, so the theme works even while React is still loading.
export const themeScript = `(function(){
  if(window.__portfolioThemeReady)return;
  window.__portfolioThemeReady=true;
  var root=document.documentElement;
  function apply(theme){
    root.dataset.theme=theme;
    root.style.colorScheme=theme;
    root.classList.toggle('dark',theme==='dark');
    document.querySelectorAll('[data-theme-toggle]').forEach(function(button){
      button.setAttribute('aria-label',theme==='dark'?'Activar modo claro':'Activar modo oscuro');
      button.setAttribute('aria-pressed',String(theme==='light'));
      button.setAttribute('title',theme==='dark'?'Cambiar a modo claro':'Cambiar a modo oscuro');
    });
  }
  try{apply(localStorage.getItem('portfolio-theme')==='light'?'light':'dark')}catch(e){apply('dark')}
  document.addEventListener('click',function(event){
    var button=event.target instanceof Element?event.target.closest('[data-theme-toggle]'):null;
    if(!button)return;
    var next=root.dataset.theme==='light'?'dark':'light';
    apply(next);
    try{localStorage.setItem('portfolio-theme',next)}catch(e){}
  });
  document.addEventListener('DOMContentLoaded',function(){apply(root.dataset.theme)});
  window.addEventListener('storage',function(event){
    if(event.key==='portfolio-theme')apply(event.newValue==='light'?'light':'dark');
  });
})();`;
