let scrolldown = document.getElementById('scrolldown');
scrolldown.addEventListener('click', () => {
    let topo = document.getElementById('busca');
    topo.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
})

window.addEventListener('scroll', () => {
    let busca = document.getElementById('busca').getBoundingClientRect(),
        buscatopo = busca.top,
        footer = document.querySelector('footer');

    if (buscatopo < -100) {
        footer.classList.add('show');
    } else {
        footer.classList.remove('show');
    }
})

let voltatopo = document.getElementById('voltatopo');
voltatopo.addEventListener('click', () => {
    let topo = document.body;
    topo.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
})

let input = document.querySelector('input'),
    btn = document.querySelector('#busca button'),
    info = document.querySelector('.info'),
    keyword,
    valor, ultimoValor,
    loader = document.getElementById('loader');

input.addEventListener('input', () => {
    keyword = input.value.toLocaleLowerCase();
    valor = 1;
    ultimoValor = valor;

    if (keyword.length !== 0) {
        btn.addEventListener('click', procura)
    }
})

function loading() {
    loader.classList.add('ativo');
    setTimeout(() => {
        loader.classList.remove('ativo')
        info.classList.add('show');
    }, 1200);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function procura() {
    let topo = document.getElementById('busca');
    topo.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })

    let img = document.querySelector('.foto'),
        tipo = document.querySelector('.tipo'),
        vida = document.querySelector('.vida-p'),
        ataque = document.querySelector('.ataque-p'),
        ataqueEsp = document.querySelector('.ataque-esp-p'),
        defesa = document.querySelector('.defesa-p'),
        defesaEsp = document.querySelector('.defesa-esp-p'),
        velocidade = document.querySelector('.velocidade-p'),
        ataques = document.querySelector('.ataques ul'),
        skills = document.querySelector('.skills ul'),
        loc = document.querySelector('.lop');

    [img, tipo, vida, ataque, ataqueEsp, defesa, defesaEsp, velocidade, ataques, skills, loc].forEach(e => e.innerHTML = '');

    if (valor == ultimoValor) {
    info.classList.remove('show');
        fetch(`https://pokeapi.co/api/v2/pokemon/${keyword}/`)
            .then(r => {
                if (!r.ok) {
                    loader.classList.add('ativo');
                    setTimeout(() => {
                        loader.classList.remove('ativo')
                        info.classList.remove('show');
                        erro.classList.add("ativo");
                        throw new Error('alguma coisa deu errado');
                    }, 1200);

                } else {
                    erro.classList.remove("ativo");
                    return r;
                }
            })
            .then(r => r.json())
            .then(r => {
                loading();
                
                //FOTOS
                for (let i = 0; i < 1; i++) {
                    let fotos = [r.sprites.front_default, r.sprites.back_default];
                    fotos.forEach(e => {
                        let foto = document.createElement('img');
                        foto.src = e;
                        img.appendChild(foto)
                    })
                }

                //TIPOS
                r.types.forEach(e => {
                    let limpeza = e.type.name.charAt(0).toUpperCase() + e.type.name.slice(1);
                    let tipos = document.createElement('li');
                    tipos.innerHTML = `<p>${limpeza}</p>`;
                    tipo.append(tipos)
                })

                // STATUS
                //VIDA
                let hp = document.createElement('p');
                hp.innerText = r.stats[0].base_stat;
                vida.append(hp)

                //ATAQUE
                let atk = document.createElement('p');
                atk.innerText = r.stats[1].base_stat;
                ataque.append(atk)

                //ATAQUE ESPECIA
                let atkesp = document.createElement('p');
                atkesp.innerText = r.stats[3].base_stat;
                ataqueEsp.append(atkesp)

                //DEFESA
                let def = document.createElement('p');
                def.innerText = r.stats[2].base_stat;
                defesa.append(def)

                //DEFESA ESPECIAL
                let desfesp = document.createElement('p');
                desfesp.innerText = r.stats[4].base_stat;
                defesaEsp.append(desfesp)

                //VELOCIDADE
                let vel = document.createElement('p');
                vel.innerText = r.stats[5].base_stat;
                velocidade.append(vel)

                //TOOLTIP
                let tooltip = document.querySelectorAll('.tooltip');
                tooltip.forEach(e => {
                    let span = e.querySelector("span");
                    e.addEventListener('click', () => {
                        span.classList.add('ativo');
                        setTimeout(() => {
                            span.classList.remove("ativo")
                        }, 2000);
                    })
                })

                //HABILIDADES
                for (let i = 0; i < 2; i++) {
                    let skillnome = document.createElement('h3'),
                        skillCom = document.createElement('li');

                    let limpezaNome = r.abilities[i].ability.name.replace('-', ' ').split(' ').map(capitalize).join(' ');

                    skillnome.innerText = limpezaNome;
                    skillCom.append(skillnome)
                    fetch(r.abilities[i].ability.url).then(r => r.json())
                        .then(r => {
                            let limpezaEx = r.effect_entries[1].effect.replace(/(?:\r\n|\r|\n)/g, '<br>').split('<br><br>');
                            limpezaEx.forEach(e => {
                                let skillex = document.createElement('p');
                                skillex.innerText = e;
                                skillCom.append(skillex)
                            })
                        })
                    skills.append(skillCom)
                }

                //ATAQUES
                for (let i = 0; i < 4; i++) {
                    let ataqueCom = document.createElement('li'),
                        ataquenome = document.createElement('h3'),
                        ataqueAcc = document.createElement('p'),
                        ataqueDC = document.createElement('p'),
                        ataqueEx = document.createElement('p');

                    let limpezaNome = r.moves[i].move.name.replace('-', ' ').split(' ').map(capitalize).join(' ');
                    ataquenome.innerText = limpezaNome;

                    fetch(r.moves[i].move.url).then(r => r.json())
                        .then(r => {
                            let limpezaDC = r.damage_class.name.split(' ').map(capitalize).join(' ');
                            let limpezaEx = r.effect_entries[0].effect.replace(/(?:\r\n|\r|\n)/g, ' ');
                            ataqueAcc.innerHTML = `<span>Accuracy:</span> ${r.accuracy}`;
                            ataqueDC.innerHTML = `<span>Damage class:</span> ${limpezaDC}`;
                            ataqueEx.innerHTML = `<p>${limpezaEx}</p>`;

                            [ataquenome, ataqueEx, ataqueAcc, ataqueDC].forEach(e => ataqueCom.append(e))
                        })

                    ataques.append(ataqueCom)
                }

                //LOCALIZAÇÃO
                fetch(`https://pokeapi.co/api/v2/pokemon/${r.id}/encounters`)
                    .then(r => r.json())
                    .then(l => {
                        let locations = [];
                        for (let i = 0; i < 3; i++) {
                            locations.push(l[i].location_area.name)
                        }

                        locations.forEach(e => {
                            let LimpezaCap = e.replaceAll('-', ' ').split(' ').map(capitalize).join(' ');

                            let local = document.createElement('li');
                            local.innerHTML = `<p>${LimpezaCap}</p>`;
                            loc.appendChild(local)
                        })
                    })
                valor++;

            })
    }
}


