let input = document.querySelector('input'),
    btn = document.querySelector('button'),
    info = document.querySelector('.info'),
    keyword,
    valor, ultimoValor,
    loader = document.getElementById('loader');

function loading() {
    loader.classList.add('ativo')
    setTimeout(() => {
        loader.classList.remove('ativo')
        info.classList.add('show');
    }, 1000);
}

input.addEventListener('input', () => {
    keyword = input.value.toLocaleLowerCase();
    valor = 1;
    ultimoValor = valor;

    if (keyword.length !== 0) {
        btn.addEventListener('click', procura)
        window.addEventListener('keypress', e => {
            if (e.keyCode == 13) procura();
        })
    }
})

function procura() {
    if (valor == ultimoValor) {
        loading();
        fetch(`https://pokeapi.co/api/v2/pokemon/${keyword}/`)
            .then(r => r.json())
            .then(r => {
                let vida = document.querySelector('.num'),
                    loc = document.querySelector('.lop'),
                    img = document.querySelector('.foto');

                //vida
                vida.innerText = r.stats[0].base_stat;

                //foto
                for (let i = 0; i < 1; i++) {
                    let fotos = [r.sprites.front_default, r.sprites.back_default];
                    fotos.forEach(e => {
                        let foto = document.createElement('img');
                        foto.src = e;
                        img.appendChild(foto)
                    })
                }

                //Localizações
                fetch(`https://pokeapi.co/api/v2/pokemon/${r.id}/encounters`)
                    .then(r => r.json())
                    .then(l => {
                        let locations = [];
                        for (let i = 0; i < l.length; i++) {
                            locations.push(l[i].location_area.name)
                        }
                        // console.log(locations)

                        locations.forEach(e => {
                            let limpeza = e.replace('-', ' ').slice(0, e.length - 5);

                            let local = document.createElement('p');
                            local.innerText = limpeza;
                            loc.appendChild(local)
                            // console.log(local)
                        })
                    })
                valor++;

            })
    }
}

//bulbasaur