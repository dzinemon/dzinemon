document.addEventListener('DOMContentLoaded', () => {

  const closeModalBtn = document.querySelector('.modal button.delete');
  closeModalBtn.addEventListener('click', ()=> document.querySelector('.modal').classList.remove('is-active'));
  
});
