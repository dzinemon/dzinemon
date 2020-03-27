function getSearchHelpText() {
  // get all items in tbody and count them
  setTimeout(() => {
    var allItems = Array.prototype.slice.call(document.querySelectorAll('#countries_body tr'), 0);

    var helpText = document.getElementById('countries_found');
    if (allItems.length === 0) {
      helpText.innerText = `No results found`;
    } else if (allItems.length === 1) {
      helpText.innerText = `1 country found`;
    } else {
      helpText.innerText = `${allItems.length} countries found`;
    }
  }, 200);
}

document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.getElementById('country_search');
  searchInput.addEventListener('keyup', getSearchHelpText);
});