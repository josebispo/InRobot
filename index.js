// Importando puppeteer
const puppeteer = require('puppeteer')

// Variáveis que usaremos no decorrer do código.
var url = 'https://www.linkedin.com/';

// email de login no linkedin
var email = 'josebispo@ucl.br';

// sua senha de login
var password = 'Jbn@3282#';

let linkedin = async () => {

    // Criamos uma função anônimo assíncrona, que vai permitir acessar o potencial da ferramenta.
    const browser = await puppeteer.launch({headless: false});

    // Inicia uma nova página/aba para a navegação
    const page = await browser.newPage();

    // Acessa a url informada na promisse.
    await page.goto(url)

    // Carrega as dimensões padrão ou personalizadas, bom pra testar mobile.
    await page.setViewport({
        width: 1200,
        height: 720,
    });

    // Algumas páginas não terminam de carregar antes do screenshot, geralmente leva-se alguns ms
    // Mas por garantia eu aguardo 3 segundos antes de printar a tela.
    await page.waitFor(3000);

    // Screenshot é uma função poderosa, gerando imagens em diversos formatos por exemplo pdf A4, A3, ....
    await page.screenshot({
        path: 'home.jpg',
    });

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

    // Usamos o page.evaluate para rodar nosso JS no navegador como se fosse na unha mesmo no Browser.
    let network = await page.evaluate(() => {

        // iremos listar todos os contatos disponiveis nesse array;
        var contacts = [];

        // Pegamos os elementos que possuem os dados dos contatos.
        var container = document.querySelectorAll(".discover-entity-type-card.artdeco-card.ember-view");

        // Varemos os elementos usando o ForEach pegando os dados de um por um.
        container.forEach(function (userItem) {

            // Nome do contato.
            let name = userItem.getElementsByClassName("discover-person-card__name")[0];

            // Sua profissão ou carreira.
            let occupation = userItem.getElementsByClassName("discover-person-card__occupation")[0];

            // Número de amigos em comum
            let friends = userItem.getElementsByClassName("member-insights__reason text-align-center t-12")[0];


            // Verificamos se  possuem occupation pois a mesma página também exibe empresas e isso acaba gerando um erro de elemento indefinido.
            if ((typeof occupation) !== "undefined" && (typeof friends) !== "undefined") {

                occupation = occupation.innerText;
                friends = friends.innerText;
                name = name.innerText;

                // Tratando o texto removendo letras e parseando pra inteiro.
                friends = parseInt(friends.match(/(\d+)/)[0]);

                contacts.push({"Nome": name, "cargo": occupation, "amigos": friends});

            }
        });

        // Retornamos a lista com todos os possiveis contatos, cargos e amigos em comum.
        return contacts;
    });

    // Fechamos a instancia que foi aberta inicialmente no  .launch.
    await browser.close();

    // Retorno de sucesso no final da execução.
    return network;
};


linkedin().then((result) => {
    console.log(result);
});
