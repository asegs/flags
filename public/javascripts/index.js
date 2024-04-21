const randomIndex = (list) => {
    return Math.floor(Math.random() * list.length);
}

function onLoad () {
    fetch("/flags/getOptions/region/8?cutoff=196")
        .then(res => res.json())
        .then(body => {
            const countryIndex = randomIndex(body);
            const selectedCountry = body[countryIndex];
            displayFlag(selectedCountry);
            addButtons(body, countryIndex);
        })
}

function displayFlag (countryData) {
    const code = countryData['cca2'].toLowerCase();
    const mainDiv = document.getElementById("flag-options");
    const newImage = document.createElement("img");
    newImage.src = "/resources/svg/" + code + ".svg";
    newImage.style.height = "300px";
    mainDiv.append(newImage);
}

function addButtons (countries, correctIndex) {
    const mainDiv = document.getElementById("flag-options");
    countries.forEach((country, i) => {
        const button = document.createElement("button");
        button.innerHTML = country['name']['common'];
        button.style.width = "15%"
        button.style.maxHeight = "100px"
        button.style.minHeight = "100px"
        button.style.fontSize = "22px"
        button.id = country['cca2'];
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
                document.getElementById(countries[correctIndex]['cca2']).style.background = "green"
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