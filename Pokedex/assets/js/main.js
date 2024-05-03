const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 150;
const limit = 10;
let offset = 0;

function createModal() {
    const modalHTML = `
    <div id="pokemonModal" class="modal">
        <div class="modal-content">
            <span class="close-button" id="closeModal">&times;</span>
            <div id="pokemonModalContent">
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const closeButton = document.getElementById('closeModal');
    closeButton.addEventListener('click', () => {
        const modal = document.getElementById('pokemonModal');
        modal.style.display = 'none';

        // Oculta as habilidades novamente nos cards
        const pokemonAbilities = document.querySelectorAll('.ability');
        pokemonAbilities.forEach(ability => {
            ability.classList.add('hidden-info');
        });
    });

    const modal = document.getElementById('pokemonModal');
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';

            // Oculta as habilidades novamente nos cards
            const pokemonAbilities = document.querySelectorAll('.ability');
            pokemonAbilities.forEach(ability => {
                ability.classList.add('hidden-info');
            });
        }
    });
}

function convertPokemonToLi(pokemon) {
    return `
<li class="pokemon ${pokemon.type}"}">
    <span class="number">#${pokemon.number}</span>
    <span class="name">${pokemon.name}</span>
    <span class="ability hidden-info">${pokemon.abilities.join('<br>')}</span>
    <div class="detail">
        <ol class="types">
           ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
    </div>
</li>
    `;
}

function loadPokemonItens(offset, limit) {
    return pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;

        attachClickEvents();
    });
}

function attachClickEvents() {
    const pokemonItems = document.querySelectorAll('#pokemonList .pokemon');
    pokemonItems.forEach((item) => {
        item.addEventListener('click', () => {
            const pokemonName = item.querySelector('.name').textContent;
            const pokemonNumber = item.querySelector('.number').textContent;
            const pokemonTypes = Array.from(item.querySelectorAll('.type')).map((type) => type.textContent);
            const pokemonPhoto = item.querySelector('img').src;
            const pokemonAbility = item.querySelector('.ability')
            pokemonAbility.classList.remove('hidden-info');

            const modalContent = `
                <h2>${pokemonName} (#${pokemonNumber})</h2>
                <div class=modalSquares>
                    <div class="modalContentDetail">
                    <img src="${pokemonPhoto}" alt="${pokemonName}">
                    <ol class="modalDetails">
                    ${pokemonTypes.map(type => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    </div>
                    <div class="skills"><ul>
                    <div class="skills">
                    <h3>Habilidades:</h3>
                    <ul>${pokemonAbility.innerHTML}</ul>
                </div>

                    </div>
                </div>
            `;

            document.getElementById('pokemonModalContent').innerHTML = modalContent;
            document.getElementById('pokemonModal').style.display = 'block'; // Mostra o modal
        });
    });
}

createModal();

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton); 
    } else {
        loadPokemonItens(offset, limit);
    }
});