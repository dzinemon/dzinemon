document.addEventListener('DOMContentLoaded', () => {

  setTimeout(()=>{
    console.log('List JS ');
    const listJsOptions = {
      valueNames: ['country', 'confirmed', 'death', 'recovered' ]
    };
    const countryList = new List('countries_data', listJsOptions);
  }, 1000)

  
});
