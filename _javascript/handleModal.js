document.addEventListener('DOMContentLoaded', () => {

  const tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs li'), 0);
  const tabsWrap = Array.prototype.slice.call(document.querySelectorAll('.tab-wrap'), 0);

  tabs.forEach((i)=>{
    i.addEventListener('click', function(){
      console.log(this);
      if (this.classList.contains('is-active')) {
        console.log('Is - active tab')
      } else {
        tabs.forEach(i=> i.classList.remove('is-active'));
        this.classList.add('is-active');
        // tabsWrap.forEach(i=> i.classList.add('is-invisible'));
        // document.querySelector('.tab-' + this.dataset.targetTab).classList.remove('is-invisible')
      }
    })
  })

  const closeModalBtn = document.querySelector('.modal button.delete');
  closeModalBtn.addEventListener('click', ()=> document.querySelector('.modal').classList.remove('is-active'));
  
});
