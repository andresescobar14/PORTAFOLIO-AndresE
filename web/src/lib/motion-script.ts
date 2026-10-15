// Motion is enabled by default as requested; only an explicit site pause disables it.
export const motionScript = `(function(){
  if(window.__portfolioMotionReady===3)return;
  window.__portfolioMotionReady=3;
  var root=document.documentElement;

  var preference=null;
  try{preference=localStorage.getItem('portfolio-motion-v3')}catch(e){}
  function apply(){
    var mode=preference==='reduced'?'reduced':'full';
    root.dataset.motion=mode;
    document.querySelectorAll('[data-motion-toggle]').forEach(function(button){
      button.setAttribute('aria-pressed',String(mode==='full'));
      button.setAttribute('aria-label',mode==='full'?'Pausar animaciones':'Activar animaciones');
    });
    window.dispatchEvent(new Event('portfolio:motion-change'));
  }
  apply();
  document.addEventListener('DOMContentLoaded',apply);
  document.addEventListener('click',function(event){
    var button=event.target instanceof Element?event.target.closest('[data-motion-toggle]'):null;
    if(!button)return;
    preference=root.dataset.motion==='full'?'reduced':'full';
    try{localStorage.setItem('portfolio-motion-v3',preference)}catch(e){}
    apply();
  });

  window.addEventListener('storage',function(event){
    if(event.key==='portfolio-motion-v3'){preference=event.newValue;apply()}
  });
})();`;
