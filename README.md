# Výměna souborů mezi počítači

Funguje to jednoduše. Na `adresátovi` tahle aplikace roběhne na daném portu node.js server, který čeká na příchozí soubory. `Odesílatel` odesílá soubory na danou adresu, kde čeká, že je `adresát` zpracuje a odešle potvrzení.

Lze samozřejně otestovat na jednom počítači, tak jsem to vyvíjel.

## Příprava

Jak na `odesílatele` tak `adresáta`:

1.  Nainstaluj [node.js](https://nodejs.org/en/download).
2.  [Stáhni aplikaci](https://github.com/tadeaspetak/server-files/raw/main/server-files.zip) a rozbal na oba počítače.
3.  V adresáři aplikace zadej `npm i`, to lokálně nainstaluj knihovny (do adresáře `node_modules`).

Na `adresátovi` nastav v souboru `deafults.ts` v atributu `recipient`:

1. `port` je port, na kterém server poběží.
2. `storage` je cesta, kam by se měly ukládat přijaté soubory. Absolutní cesty jsou absolutní, relativní jsou relativní vůči adresáři aplikace. Soubory se uloží do podadresáře s datumem odeslání.

Na `odesílateli` nastav v souboru `defaults.ts` v atributu `sender`:

1. `source` je zdrojový adresář. Absolutní cesty jsou absolutní, relativní jsou relativní vůči adresáři aplikace. Momentálně to čte jen soubory přímo v daném adresáři, nic hlubšího. Až budeme vědět, jak by to přesně mělo fungovat, snadno upravíme.
2. `to` je adresa adresáta včetně `http` či `https` a portu. Testuješ-li lokálně, bude to prostě `http://localhost:80`.

## Pošta chodí 🤞

```bash
# nastartuj adresáta
npm run receive

# odešli soubory
npm run send
```
