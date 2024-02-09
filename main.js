const main = document.querySelector(".pokecont");
const selector = document.querySelector("#sort");
const pokeSearch = document.querySelector("#pokeSearch");
const pokeRandom = document.querySelector("#randomPoke");
const pokeball = document.querySelector("#pokeball");

const loadingMessage = document.createElement("h1");
loadingMessage.textContent = "Cargando...";
main.classList = 'pokeDataCont'
main.appendChild(loadingMessage);

async function getPokemons() {
  console.time('Carga de pokemon')

  const promises = [];

  for (let i = 1; i <= 60; i++) {
    const request = fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    promises.push(request);
  }

  try {
    const responses = await Promise.all(promises);
    const pokemonDataArray = await Promise.all(responses.map((response) => response.json()));
    main.removeChild(loadingMessage);
    main.classList = 'pokecont'

    
    pokemonDataArray.forEach((pokemonData) => {
      cardsPoke(pokemonData);
      pokemonCards.push(pokemonData);
    });
    console.timeEnd('Carga de pokemon')
  } catch (error) {
    console.error("Error al cargar los Pokémon:", error);
  }

  
}

function cardsPoke(pokeData) {
  const card = document.createElement("div");

  const pokeTypes = pokeData.types.map(
    (t) => `<p class='${t.type.name}' >${t.type.name}</p>`
  );

  card.classList = "cardPoke";
  card.innerHTML = `
  <img src="${pokeData.sprites.front_default}">
  <p>${
    pokeData.name[0].toUpperCase() +
    pokeData.name.slice(1, pokeData.name.length)
  }</p>
  <p class='pokeID'>${
    pokeData.id < 10 ? "00" + pokeData.id : "0" + pokeData.id
  }</p>
  <section class="types">${pokeTypes.join(" ")}</section>
  `;

  pokeData.types.forEach((types) => card.classList.add(types.type.name));

  main.appendChild(card);

  card.addEventListener("click", () => {
    // Borra el contenido actual de 'main'
    main.innerHTML = "";

    // Muestra los detalles del Pokémon seleccionado
    displayPokemonDetails(pokeData);
  });
}

function displayPokemonDetails(pokemonData) {
  const detailsContainer = document.createElement("div");
  const section = document.createElement("section");
  const imgPoke = document.createElement("img");
  const buttonLeft = document.createElement("button");
  const buttonRight = document.createElement("button");
  const h2 = document.createElement("h2");
  const h4 = document.createElement("h4");
  const sectionPoke = document.createElement("section");
  const pokeDetails = document.createElement("section");

  section.classList = "pokedetaCont";
  pokeDetails.classList = "pokeDetails";

  const labelDetails = pokemonData.stats
    .map(
      (poke) =>
        `<label for='${poke.stat.name}' >${poke.stat.name.toUpperCase()}</label>
        <progress id='${poke.stat.name}' max='150' value='${poke.base_stat}' ></progress>
        <p style="${
          poke.base_stat >= 100 ? 'color: red;' : 'color: white;'
        }">${poke.base_stat}%</p>`
    )
    .join("\n");

  buttonLeft.addEventListener("click", () => {
    imgPoke.src = pokemonData.sprites.back_default;
    h4.textContent = "Back";
  });

  buttonRight.addEventListener("click", () => {
    imgPoke.src = pokemonData.sprites.front_default;
    h4.textContent = "Front";
  });

  detailsContainer.appendChild(section);

  h4.textContent = "Front";

  h2.textContent = `${
    pokemonData.name[0].toUpperCase() +
    pokemonData.name.slice(1, pokemonData.name.length)
  }`;

  buttonLeft.textContent = "<";
  buttonRight.textContent = ">";

  imgPoke.src = `${pokemonData.sprites.front_default}`;

  sectionPoke.appendChild(buttonLeft);
  sectionPoke.appendChild(buttonRight);
  sectionPoke.insertBefore(imgPoke, buttonRight);
  section.appendChild(sectionPoke);
  section.insertBefore(h4, sectionPoke);
  main.appendChild(h2);
  main.classList = "pokeDataCont";
  detailsContainer.classList.add("pokemon-details");
  detailsContainer.appendChild(section);
  detailsContainer.appendChild(pokeDetails);
  pokeDetails.innerHTML = labelDetails;
  main.appendChild(detailsContainer);
}

const pokemonCards = [];

getPokemons((pokemonData) => {
  cardsPoke(pokemonData);
  pokemonCards.push(pokemonData);
});

pokeball.addEventListener("click", () => {
  pokemonCards.sort((a, b) => a.id - b.id);
  main.classList = "pokecont";

  main.innerHTML = "";

  pokemonCards.map((data) => cardsPoke(data));
});

pokeRandom.addEventListener("click", () => {
  const random = pokemonCards[Math.floor(Math.random() * pokemonCards.length)];

  main.classList = "pokeDataCont";
  main.innerHTML = "";

  cardsPoke(random);
});

let searchTimeout;

pokeSearch.addEventListener("input", (e) => {
  const text = e.target.value.toLowerCase().trim();

  // Cancelar la búsqueda anterior si existe
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Establecer un nuevo temporizador para realizar la búsqueda
  searchTimeout = setTimeout(() => {
    const filteredPokemon = pokemonCards.filter((poke) =>
      poke.name.includes(text)
    );

    main.innerHTML = "";

    if (filteredPokemon.length > 0) {
      main.classList = "pokecont";
      filteredPokemon.forEach((data) => cardsPoke(data));
    } else {
      // Si no se encontraron resultados, muestra un mensaje "Pokemon not found"
      const notFoundMessage = document.createElement("h1");
      main.classList = "pokeDataCont";
      notFoundMessage.textContent = "Pokemon not found";
      notFoundMessage.style.textAlign = "center";
      main.appendChild(notFoundMessage);
    }
  }, 300);
});

selector.addEventListener("change", (e) => {
  const selected = e.target.value;
  main.classList = "pokecont";
  if (selected === "High Number") {
    pokemonCards.sort((a, b) => b.id - a.id);

    main.innerHTML = "";

    pokemonCards.forEach((pokemonData) => {
      cardsPoke(pokemonData);
    });
  }

  if (selected === "Min Number") {
    pokemonCards.sort((a, b) => a.id - b.id);

    main.innerHTML = "";

    pokemonCards.forEach((pokemonData) => {
      cardsPoke(pokemonData);
    });
  }

  if (selected === "A-Z") {
    pokemonCards.sort((a, b) => a.name.localeCompare(b.name));

    main.innerHTML = "";

    pokemonCards.forEach((pokemonData) => {
      cardsPoke(pokemonData);
    });
  }

  if (selected === "Z-A") {
    pokemonCards.sort((a, b) => b.name.localeCompare(a.name));

    main.innerHTML = "";

    pokemonCards.forEach((pokemonData) => {
      cardsPoke(pokemonData);
    });
  }
});
