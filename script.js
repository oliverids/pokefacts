let input = document.querySelector('input'),
    btn = document.querySelector('#busca button'),
    info = document.querySelector('.info'),
    keyword,
    valor, ultimoValor,
    loader = document.getElementById('loader');

function loading() {
    info.classList.remove('show');
    loader.classList.add('ativo');
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
        // window.addEventListener('keyup', e => {
        //     if (e.keyCode == 13) procura();
        // })
    }
})

function procura() {
    let img = document.querySelector('.foto'),
        tipo = document.querySelector('.tipo'),
        vida = document.querySelector('.vida-p'),
        ataque = document.querySelector('.ataque-p'),
        ataqueEsp = document.querySelector('.ataque-esp-p'),
        defesa = document.querySelector('.defesa-p'),
        defesaEsp = document.querySelector('.defesa-esp-p'),
        velocidade = document.querySelector('.velocidade-p'),
        skills = document.querySelector('.skills ul'),
        loc = document.querySelector('.lop');

    [loc, img, vida, ataque, ataqueEsp, defesa, defesaEsp, velocidade].forEach(e => e.innerHTML = '');

    if (valor == ultimoValor) {
        loading();
        fetch(`https://pokeapi.co/api/v2/pokemon/${keyword}/`)
            .then(r => r.json())
            .then(r => {

                //foto
                for (let i = 0; i < 1; i++) {
                    let fotos = [r.sprites.front_default, r.sprites.back_default];
                    fotos.forEach(e => {
                        let foto = document.createElement('img');
                        foto.src = e;
                        img.appendChild(foto)
                    })
                }

                //tipo
                r.types.forEach(e => {
                    let limpeza = e.type.name.charAt(0).toUpperCase() + e.type.name.slice(1);
                    let tipos = document.createElement('li');
                    tipos.innerHTML = `<p>${limpeza}</p>`;
                    tipo.append(tipos)
                })


                //vida
                let hp = document.createElement('p');
                hp.innerText = r.stats[0].base_stat;
                vida.append(hp)

                //ataque
                let atk = document.createElement('p');
                atk.innerText = r.stats[1].base_stat;
                ataque.append(atk)

                //ataque especial
                let atkesp = document.createElement('p');
                atkesp.innerText = r.stats[3].base_stat;
                ataqueEsp.append(atkesp)

                //defesa
                let def = document.createElement('p');
                def.innerText = r.stats[2].base_stat;
                defesa.append(def)

                //defesa especial
                let desfesp = document.createElement('p');
                desfesp.innerText = r.stats[4].base_stat;
                defesaEsp.append(desfesp)

                //velocidade
                let vel = document.createElement('p');
                vel.innerText = r.stats[5].base_stat;
                velocidade.append(vel)

                //skills
                let tooltip = document.querySelector('.tooltip'),
                    span = tooltip.querySelector('span');
                ['click', 'mouseover'].forEach(evt => {
                    tooltip.addEventListener(evt, () => {
                        span.classList.add("ativo");
                        setTimeout(() => span.classList.remove("ativo"), 2000);
                    })

                })

                for (let i = 0; i < 4; i++) {
                    let skillCom = document.createElement('li'),
                        skillnome = document.createElement('h3'),
                        skillAcc = document.createElement('p'),
                        skillDC = document.createElement('p'),
                        skillEx = document.createElement('p');

                    skillnome.innerText = r.moves[i].move.name;
                    fetch(r.moves[i].move.url).then(r => r.json())
                        .then(r => {
                            let limpezaDC = r.damage_class.name.charAt(0).toUpperCase() + r.damage_class.name.slice(1);
                            let limpezaEx = r.effect_entries[0].effect.replace(/(?:\r\n|\r|\n)/g, ' ');
                            skillAcc.innerHTML = `<span>Accuracy:</span> ${r.accuracy}`;
                            skillDC.innerHTML = `<span>Damage class:</span> ${limpezaDC}`;
                            skillEx.innerHTML = `<p>${limpezaEx}</p>`;

                            [skillnome, skillEx, skillAcc, skillDC].forEach(e => skillCom.append(e))
                        })

                    skills.append(skillCom)
                }

                //Localizações
                fetch(`https://pokeapi.co/api/v2/pokemon/${r.id}/encounters`)
                    .then(r => r.json())
                    .then(l => {
                        let locations = [];
                        for (let i = 0; i < l.length; i++) {
                            locations.push(l[i].location_area.name)
                        }

                        locations.forEach(e => {
                            let limpeza = e.replace('-', ' ').slice(0, e.length - 5);

                            let local = document.createElement('p');
                            local.innerText = limpeza;
                            loc.appendChild(local)
                        })
                    })
                valor++;

            })
    }
}

//bulbasaur

