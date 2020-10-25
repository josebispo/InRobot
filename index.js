// Importando puppeteer
const puppeteer = require('puppeteer');

// Variáveis que usaremos no decorrer do código.
var url = 'https://www.linkedin.com/';

// email de login no linkedin
var email = 'josebispo@ucl.br';

// sua senha de login
var password = 12345678';

let invites = [];

let total = 0;

let linkedin = async () => {

    let date = new Date();
    console.log("Inicio");
    console.log(date);

    // Criamos uma função anônimo assíncrona, que vai permitir acessar o potencial da ferramenta.
    const browser = await puppeteer.launch({headless: false});

    // Inicia uma nova página/aba para a navegação
    const page = await browser.newPage();

    // Acessa a url informada na promisse.
    await page.goto(url);

    // Carrega as dimensões padrão ou personalizadas, bom pra testar mobile.
    await page.setViewport({
        width: 1200,
        height: 720,
    });

    // Algumas páginas não terminam de carregar antes do screenshot, geralmente leva-se alguns ms
    // Mas por garantia eu aguardo 3 segundos antes de printar a tela.
    await page.waitFor(3000);

    // invoca o evento click no elemento passando para a função a classe.
    await page.click('.nav__button-secondary');
    await page.waitFor(3000);

    // invoca o evento click no elemento passando para a função a referência id.
    await page.click('#username');

    // Digita os dados contidos na nossa variável no campo clicado anteriormente.
    await page.keyboard.type(email);
    await page.waitFor(2000);

    await page.click('#password');
    await page.keyboard.type(password);

    // invoca o evento click no elemento
    await page.click('[type="submit"]');

    // Aguardamos a página carregar completamente pode levar de ms a segundos, achei 3 segundo um tempo  suficiente.
    await page.waitFor(3000);

    // Clicamos no elemento para a página de contatos
    await page.click('#mynetwork-tab-icon');

    // Aguardando somente o tempo necessário para ter certeza que os elementos foram carregados.
    await page.waitFor(5000);

    console.log('Lista de contatos carregados com sucesso  ....');

    let pages_contact = 0;

    while (pages_contact < 10) {

        await page.waitFor(10000);

        /*   Get elements by class and check the company if have some company restriction, like old shit company */
        let network = await page.evaluate(() => {

            let sum = 0;
            // iremos listar todos os contatos disponiveis nesse array;
            let contacts = [];

            var container = document.querySelectorAll(".discover-entity-type-card.artdeco-card.ember-view");

            container.forEach(function (userItem) {

                let name = userItem.getElementsByClassName("discover-person-card__name")[0];
                let occupation = userItem.getElementsByClassName("discover-person-card__occupation")[0];
                let friends = userItem.getElementsByClassName("member-insights__reason text-align-center t-12")[0];

                if ((typeof occupation) !== "undefined" && (typeof friends) !== "undefined") {

                    name = name.innerText;
                    occupation = occupation.innerText;
                    friends = friends.innerText;

                    // Tratando o texto removendo letras e parseando pra inteiro.
                    friends = parseInt(friends.match(/(\d+)/)[0]);

                    if ((typeof occupation) !== "undefined") {

                        if ((friends >= 100) && sum <= 10) {

                            var connect = userItem.getElementsByClassName("full-width artdeco-button artdeco-button--2 artdeco-button--full artdeco-button--secondary ember-view")[0];
                            connect.click();
                            sum++;
                            contacts.push({"nome": name, "cargo": occupation, "amigos": friends});
                            console.log(contacts);

                            setTimeout(() => {
                                console.log("Pera maluco!");
                            }, 3000);
                        }
                        setTimeout(() => {
                            console.log("Pera maluco!");
                        }, 1000);
                    }
                }
            });

            return {
                'invites': contacts,
                'total': sum
            };
        });

        total += network.total;
        invites.push({
            "Invited": network.invites[0],
        });

        pages_contact++;
        await page.reload();
        await page.waitFor(10000);
    }

    // Fechamos a instancia que foi aberta inicialmente no  .launch.
    await browser.close();

    invites.push({"Total": total});


    // Retorno de sucesso no final da execução.
    return invites;
};


linkedin().then((result) => {
    console.log(result);
    console.log("FIM");
    let d = new Date();
    console.log(d);
});


if (true) {
    return [];
} else {
    return [];
}
