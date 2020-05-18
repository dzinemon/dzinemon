var colors = {
  primary: '#00d1b2',
  info: '#209cee',
  dark: '#4a4a4a',
  danger: '#ff3860',
  lighter: '#dbdbdb',
  light: '#b5b5b5',
  success: '#23d160',
}

var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function formatChartDate(timestamp) {
  
  var thisDate = new Date(parseFloat(timestamp) * 1000);

  var formattedDate =  mS[thisDate.getMonth()] + ' ' + thisDate.getDate();
  // console.log(formattedDate);
  return formattedDate;
}

function formatBigNums(num) {
  return ('' + num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

document.addEventListener('DOMContentLoaded', () => {
  

  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded. 

  // Get data from JSON wuth AJAX
  function httpGet(theUrl) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
      xmlHttp.send();
      var data = JSON.parse(xmlHttp.responseText);
      return data;
  }
  var url = '/output/main_report.json';

  var allData = httpGet(url);
  // Function to generate Array of data countries with currentvalue
  function getArray(theData, currentValue) {
    let currentArray = [];
    // Get sorted data Descending 
    var sorted = theData.sort((a, b) => {
      return b[currentValue] - a[currentValue];
    });
    // Generate array for chart
    sorted.map(i => {
      currentArray.push([i.country, i[currentValue]]);
    });
    // console.log(currentArray);
    return currentArray;
  }

  function countTotal(theData, type) {
    // console.log(theData);
    var total;
    total = theData.map((i) => i[type]).reduce((a,c)=>{
      return a + c
    }, 0);
    // console.log(total)
    return total

  }


  // run

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function getCountryData(theData, type) {
    var dataByDate = theData.byDate;
    console.log(dataByDate)
    var currentArray = [];

    var sortedData = dataByDate.sort((a, b) => {
      return a['timestamp'] - b['timestamp']
    });

    sortedData.map(i=>{
      currentArray.push([formatChartDate(i.timestamp), i[type]]);
    });

    return currentArray;
  }


  function drawParByDate(theData, id, color, type) {
    var dateSet = getCountryData(theData, type);
    // console.log(dateSet)
    var data = new google.visualization.DataTable();

    var options = {
      backgroundColor: {
        fill: '#242424'
      },
      pointSize: 4,
      'title': "Data",
      colors: [color],
      animation:{
        duration: 500,
        startup: true,
        easing: 'inAndOut',
      },
      legend: {
        position: 'top', 
        textStyle: {color: 'white', fontSize: 16, bold: true}
      },
      chartArea:{left:50,top:40,right:20,bottom:40},
      vAxis: {
        textStyle: {
          color: colors.light,
          fontSize: '12',
        },
        baselineColor: colors.lighter,
        gridlines: {color: colors.lighter, minSpacing: 40}
      },
      hAxis: {
        textStyle: {
          color: colors.light,
          fontSize: '10',
        },
        // format: 'MMM d',
        baselineColor: colors.lighter,
        gridlines: {color: colors.lighter, minSpacing: 40}
      },
    };

    var columnName =  type.charAt(0).toUpperCase() + type.slice(1) + ' cases';

    data.addColumn('string', 'Date');
    data.addColumn('number', columnName);
    // data.addColumn('number', "Deceased");

    data.addRows(dateSet);

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.LineChart(document.getElementById(id));
    chart.draw(data, options);
  }

  function getPercentage(a,b) {
    return (a/b*100).toFixed(2);
  } 
  

  window.onload = function () {


  if (window.location.pathname === '/ua/') {
    var CURRENT_LANG = 'ukrainian'
  } else if (window.location.pathname === '/ru/') {
    var CURRENT_LANG = 'russian'
  } else {
    var CURRENT_LANG = 'english'
  }

  function generateTableItem(item) {
    return (`
      <tr>
        <td class="td-c country he-opac hoverable he-tu" style="min-width: 160px;" data-country="${item.country}">${getTheTranslation(item.country, CURRENT_LANG)}</td>
        <td class="td-d confirmed" data-nums="${item.confirmed}">${formatBigNums(item.confirmed)}</td>
        <td class="td-d death has-text-danger" data-nums="${item.death}">${formatBigNums(item.death)}</td>
        <td class="td-p has-text-danger death-perc">${getPercentage(item.death, item.confirmed)}</td>
        <td width="150" class="td-d recovered has-text-success" data-nums="${item.recovered}">${formatBigNums(item.recovered)}</td>
        <td class="td-p has-text-success recovered-perc">${getPercentage(item.recovered, item.confirmed)}</td>  
      </tr>
    `)
  };

  function generateTable(theData) {
    var html = '';
    html = theData.sort((a, b) => {
      return b['confirmed'] - a['confirmed'];
    }).reduce((a, c) => a + generateTableItem(c), '');
    return html
  };

    var LOCAL_DATA = httpGet('/output/localization.json');

    function getTheTranslation(country, currentLang) {
      var currentCountryObj = Array.from(LOCAL_DATA).filter(i => i.id === country);
      return currentCountryObj[0][currentLang];
    }

    console.log('Loaded');

    var totalCasesGlobal = countTotal(allData, 'confirmed');
    var totalDeathGlobal = countTotal(allData, 'death');
    var totalRecoveredGlobal = countTotal(allData, 'recovered');
    var deathPercentage = getPercentage(totalDeathGlobal, totalCasesGlobal);
    var recoveredPercentage = getPercentage(totalRecoveredGlobal, totalCasesGlobal);

    var totalActive = totalCasesGlobal - (totalRecoveredGlobal + totalDeathGlobal);
    var totalActivePercentage = getPercentage(totalActive, totalCasesGlobal);

    document.getElementById('countries_body').innerHTML = generateTable(allData);
    document.getElementById('countries_data').classList.remove('is-invisible');

    var getAllItemsForConfirmed = Array.prototype.slice.call(document.querySelectorAll('.total_confirmed'), 0);
    var getAllItemsForDeath = Array.prototype.slice.call(document.querySelectorAll('.total_death'), 0);
    var getAllItemsForRecovered = Array.prototype.slice.call(document.querySelectorAll('.total_recovered'), 0);
    var getAllItemsForDeathPercent = Array.prototype.slice.call(document.querySelectorAll('.percent_death'), 0);
    var getAllItemsForRecoveredPercent = Array.prototype.slice.call(document.querySelectorAll('.percent_recovered'), 0);
    var getAllItemsForActive = Array.prototype.slice.call(document.querySelectorAll('.total_active'), 0);
    var getAllItemsForActivePercent = Array.prototype.slice.call(document.querySelectorAll('.percent_active'), 0);

    getAllItemsForActive.forEach(i =>{
      i.innerHTML = formatBigNums(totalActive);
    });

    getAllItemsForActivePercent.forEach(i =>{
      i.innerHTML = `${totalActivePercentage}%`;
    })

    getAllItemsForConfirmed.forEach((i)=>{
      i.innerHTML = formatBigNums(totalCasesGlobal);
    });
    
    getAllItemsForDeath.forEach((i)=>{
      i.innerHTML = formatBigNums(totalDeathGlobal);
    });
    getAllItemsForRecovered.forEach((i)=>{
      i.innerHTML = formatBigNums(totalRecoveredGlobal);
    });
    
    getAllItemsForDeathPercent.forEach((i)=>{
      i.innerHTML = `${deathPercentage}%`;
    })
    
    getAllItemsForRecoveredPercent.forEach((i)=>{
      i.innerHTML = `${recoveredPercentage}%`;
    })
    

    var allCountryBtns = Array.prototype.slice.call(document.querySelectorAll('#countries_body td.country'), 0)
    // console.log(allCountryBtns);
    allCountryBtns.forEach(function(element){
      element.addEventListener('click', function(e) {
        document.querySelector('.modal').classList.add('is-active');
        document.getElementById('country_name').innerText = getTheTranslation(this.dataset.country, CURRENT_LANG);
        
        document.getElementById('country_data_confirmed').innerText = '';
        document.getElementById('country_data_death').innerText = '';
        document.getElementById('country_data_recovered').innerText = '';
        var currentCountry = this.dataset.country;
        var currentData = httpGet('/output/' + currentCountry + '.json');
        
        drawParByDate(currentData[0], 'country_data_confirmed', colors.light, 'confirmed');
        drawParByDate(currentData[0], 'country_data_death', colors.danger, 'death');
        drawParByDate(currentData[0], 'country_data_recovered', colors.success, 'recovered');
      })
    });

  }
});
