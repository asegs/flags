const randomIndex = (list) => {
    return Math.floor(Math.random() * list.length);
}

const nRandomItems = (list, n) => {
    if (list.length < n) {
        return list;
    }
    const selectedIndexes = new Set();
    while (selectedIndexes.size < n) {
        selectedIndexes.add(randomIndex(list))
    }
    return Array.from(selectedIndexes).map(i => list[i]);
}
const randomRegionList = (countries, key) => {
    if (key !== 'region' || key !== 'subregion') {
        return countries;
    }
    const regions = Array.from(new Set(countries.map(country => country[key])));
    const randomRegion = regions[randomIndex(regions)];
    return countries.filter(country => country[key] === randomRegion);
}

const truncateCountries = (cutoff) => {
    return getCountries().then(countries => {
        if (!cutoff) {
            cutoff = countries.length;
        }
        return countries.slice(0, cutoff)
    });
}

const getCountries = () => {
    return fetch('../resources/countries.json').then(res => res.json());
}

const getResults = (grouping, count, cutoff) => {
    return truncateCountries(cutoff).then(subset => randomRegionList(subset, grouping)).then(selection => nRandomItems(selection, count));
}

function onLoad () {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    const grouping = params['grouping'] || 'world';
    const count = Number(params['count'] || 4);
    const cutoff = Number(params['cutoff'] || 0);

    getResults(grouping, count, cutoff)
        .then(body => {
            const countryIndex = randomIndex(body);
            const selectedCountry = body[countryIndex];
            displayFlag(selectedCountry);
            addButtons(body, countryIndex);
        })
}

function displayFlag (countryData) {
    const code = countryData['code'];
    const mainDiv = document.getElementById("flag-options");
    const newImage = document.createElement("img");
    newImage.src = "https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/" + code + ".svg";
    newImage.style.height = "300px";
    mainDiv.append(newImage);
}

function addButtons (countries, correctIndex) {
    const mainDiv = document.getElementById("flag-options");
    countries.forEach((country, i) => {
        const button = document.createElement("button");
        button.innerHTML = country['name'];
        button.style.width = "15%"
        button.style.maxHeight = "100px"
        button.style.minHeight = "100px"
        button.style.fontSize = "22px"
        button.id = country['code'];
        if (i % 2 === 0) {
            mainDiv.append(document.createElement("br"))
        }

        if (i === correctIndex) {
            button.onclick = () => {
                document.getElementById(button.id).style.background = "green";
            }
        } else {
            button.onclick = () => {
                document.getElementById(button.id).style.background = "red";
                document.getElementById(countries[correctIndex]['code']).style.background = "green"
                const message = document.createElement("p")
                message.innerHTML = "The country you selected has this flag:"
                mainDiv.append(message)
                mainDiv.append(document.createElement("br"))
                displayFlag(countries[i])
            }
        }

        mainDiv.append(button)
    })
}