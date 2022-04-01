const puppeteer = require("puppeteer");
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www.pokepedia.fr/Liste_des_Pok%C3%A9mon_dans_l%27ordre_du_Pok%C3%A9dex_National", { waitUntil: "networkidle2" });
    const pokemons = await page.evaluate(() => {
        let pokes = [];
        let els = document.querySelectorAll("#mw-content-text > div.mw-parser-output > table.tableaustandard.sortable.entetefixe.jquery-tablesorter > tbody > tr");
        for (const el of els) {
            pokes.push(el.children[2].children[0].innerHTML);
        }
        return pokes;
    })

    await browser.close()

    const words = {
        words : pokemons
    }

    fs.writeFileSync("Pokémon (French).json", JSON.stringify(words), err => {
        if (err) {
            console.log("erreur réécriture!");
            console.error(err);
            return;
        }
    })

})();