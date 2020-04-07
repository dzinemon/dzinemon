document.addEventListener('DOMContentLoaded', () => {

  setTimeout(() => {
    console.log('List JS ');
    const listJsOptions = {
      valueNames: ['country', { name: 'confirmed', attr: 'data-nums' }, { name: 'death', attr: 'data-nums' }, { name: 'recovered', attr: 'data-nums' }, 'recovered-perc', 'death-perc']
    };
    const countryList = new List('countries_data', listJsOptions);
  }, 1000);
});