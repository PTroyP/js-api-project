const mainList = document.getElementById('main');
const favsList = document.getElementById('favs');
const sortBtn = document.querySelectorAll('.sortBtn');
const microArr = [];

const url =
  'https://api.openbrewerydb.org/v1/breweries?by_city=san_antonio&per_page=20';

const getData = (url) => {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};

const dataUpdate = (data) => {
  if (data.website_url === null) {
    data.website_url = 'No Current Website';
  }
  if (data.address_1 === null) {
    data.address_1 = 'Location not determined';
  }
  if (data.id === 'f27cfcf7-e5ff-412e-9af2-e3d4cf3b9df1') {
    data.name = 'Kuenstler Brewing';
  }
  if (data.id === '6aa5ecd3-aaec-472c-ba67-c7f8d6b75b40') {
    data.name = 'Black Laboratory Brewing';
  }
};

const createUI = async (url) => {
  const data = await getData(url);

  if (data) {
    data.forEach((item) => {
      createBrewerCard(item);

      // calculate number of micro breweries from object property: brewery_type
      if (item.brewery_type === 'micro') {
        microArr.push(item);
      }
    });
  }
  setListeners('brewer');
  microBrewDisplay(microArr);
};

createUI(url);

// display number of micro-breweries
const microBrewDisplay = (arr) => {
  const microBrews = document.getElementById('mb-number');
  const mbTotal = arr.length;
  microBrews.innerHTML = `${mbTotal}`;
};

// create brewer cards
const createBrewerCard = (data) => {
  const brewer = document.createElement('div');
  brewer.setAttribute('id', data.id);
  brewer.classList.add('brewer');
  //Add html elements to brewerInfo div
  dataUpdate(data);
  brewer.innerHTML = `<div class="brewer-card" id=>
    <img src="beer.png" alt="beer icon">
      <h4 id="brewerName">${data.name}</h4>
      <p class="st-address">${data.address_1}</p>
      <p class="brew-type">Type of Brewery: ${data.brewery_type}</p>
      <p><a href="${data.website_url}">${data.website_url}</a></p>
      <button>Select as a Favorite!</button>

    </div>`;
  //Append new elements to brewer div
  mainList.append(brewer);
};

// update cards in main and favorite collections
const updateCollections = (id, direction) => {
  const card = document.getElementById(id);

  // Abbreviated version below:
  // if (direction === 'toFavs') {
  //   favsList.appendChild(card);
  //   card.classList.remove('brewer');
  //   card.classList.add('fav-brewer');
  //   card.lastChild.children[5].innerHTML = 'Unselect as a Favorite!';
  // }

  // if (direction === 'toMain') {
  //   mainList.appendChild(card);
  //   card.classList.remove('fav-brewer');
  //   card.classList.add('brewer');
  //   card.lastChild.children[5].innerHTML = 'Select as a Favorite!';
  // }

  // Abbreviated version:
  const params =
    direction === 'toFavs'
      ? [favsList, 'brewer', 'fav-brewer', 'Unselect as a Favorite!']
      : [mainList, 'fav-brewer', 'brewer', 'Select as a Favorite!'];

  params[0].appendChild(card);
  card.classList.remove(params[1]);
  card.classList.add(params[2]);
  card.lastChild.children[5].innerHTML = params[3];

  const mainBrewers = document.querySelectorAll('.brewer');
  const newAvailArr = Array.from(mainBrewers);
  const favBrewers = document.querySelectorAll('.fav-brewer');
  const newFavArr = Array.from(favBrewers);

  sortBtn.forEach((item) => {
    item.addEventListener('click', () => {
      const btnDirection = item.dataset.sortdir;
      sortData(btnDirection, newAvailArr, newFavArr);
    });
  });
};

// set event listeners for brewer cards
const setListeners = (className) => {
  const allBrewers = document.querySelectorAll(`.${className}`);

  allBrewers.forEach((item) => {
    item.addEventListener('click', (e) => {
      const parentID = item.parentElement.id;
      const itemID = item.id;
      parentID === 'main' ? (direction = 'toFavs') : (direction = 'toMain');
      updateCollections(itemID, direction);
    });
  });
};

// sort data based on brewery object name
// I couldn't figure out if it was possible to store the notation behind "a" and "b" in a variable in the "if" statement.  Tried, but unsuccessful
const sortData = (order, arr1, arr2) => {
  // Abbreviated version below
  // const sortAsc = (a, b) => {
  //   if (
  //     a.children[0].children[1].innerText > b.children[0].children[1].innerText
  //   )
  //     return 1;
  //   else if (
  //     a.children[0].children[1].innerText < b.children[0].children[1].innerText
  //   )
  //     return -1;
  //   else return 0;
  // };

  // const sortDesc = (a, b) => {
  //   if (
  //     a.children[0].children[1].innerText < b.children[0].children[1].innerText
  //   )
  //     return 1;
  //   else if (
  //     a.children[0].children[1].innerText > b.children[0].children[1].innerText
  //   )
  //     return -1;
  //   else return 0;
  // };

  // Abbreviated version
  const sortItems = (a, b) => {
    const firstVal = a.children[0].children[1].innerText;
    const secondVal = b.children[0].children[1].innerText;
    if (firstVal > secondVal) return order === 'asc' ? 1 : -1;
    else if (firstVal < secondVal) return order === 'asc' ? -1 : 1;
    else return 0;
  };

  // Abbreviated version below:
  // if (order === 'asc') {
  //   arr1.sort(sortAsc);
  //   arr2.sort(sortAsc);
  // } else if (order === 'desc') {
  //   arr1.sort(sortDesc);
  //   arr2.sort(sortDesc);
  // }
  // Abbreviated version
  [arr1, arr2].forEach((arr) => arr.sort(sortItems));

  // Abbreviated version below:
  // arr1.forEach((item) => {
  //   mainList.append(item);
  // });

  // arr2.forEach((item) => {
  //   favsList.append(item);
  // });
  // Abbreviated version
  [arr1, arr2].forEach((arr) =>
    arr.forEach((item) => {
      const container = arr === arr1 ? mainList : favsList;
      container.append(item);
    })
  );
};
