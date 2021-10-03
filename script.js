const barra = document.querySelector('input');
barra.addEventListener('change', procura);
const local = document.querySelector('.lop');


function procura() {
    let valor = barra.value;
    let pokemon = valor.toLowerCase();
    // console.log(pokemon);

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
        .then(r => r.json())
        .then(r => {
            // r.location_area_encounters
            // fetch(r.url + 'encounters').then(r => r.json());
            return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/encounters`).then(r => r.json())
                .then(r => {
                    r.forEach(e => {
                        let nome = e.location_area.name;
                        let acerta = nome.replace('-area', '').replace('-', ' ');
                        let upper = acerta.split(' ');
                        for (let i = 0; i < upper.length; i++) {
                            upper[i] = upper[i].charAt(0).toUpperCase() + upper[i].substring(1);
                        }
                        return upper.join(' ');
                        console.log(upper)
                        local.innerText = 'caralho';
                    })
                })

        })
}

// bulbasaur