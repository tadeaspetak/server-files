# Vymena souboru mezi pocitaci

Funguje to jednoduše. Na `adresátovi` aplikace na daném portu rozběhne node.js server, který čeká na příchozí soubory. `Odesílatel` odesílá soubory na danou adresu, kde čeká, že je `adresát` zpracuje a odešle potvrzení.

Lze samozřejně otestovat je jednom počítači, tak jsem to vyvíjel.

## Příprava

Jak na `odesílatele` tak `adresáta`:

1.  Nainstaluj [node.js](https://nodejs.org/en/download).
2.  [Stáhni aplikaci](https://github.com/tadeaspetak/server-files/raw/main/server-files.zip) a rozbal na oba počítače.
3.  V souboru `defaults.ts` nastav port (nejspíš `80`).

Na `adresátovi` nastav v souboru `deafults.ts` v atributu `recipient`:

1. `storage` je cesta, kam by se měly ukládat přijaté soubory. Absolutní cesty jsou absolutní, relativní jsou relativní vůči adresáři aplikace. Soubory se uloží do podadresáře s datumem odeslání.

Na `odesílateli` nastav v souboru `defaults.ts` v atributu `sender`:

1. `source` je zdrojový adresář. Absolutní cesty jsou absolutní, relativní jsou relativní vůči adresáři aplikace. Momentálně to čte jen soubory přímo v danym adresáři, nic hlubšího.
2. `to` je adresa adresáta včetně `http` či `https`. Testuješ-li lokálně, bude to prostě `http://localhost`.

## Pošta chodí 🤞

```bash
# nastartuj adresáta
npm run recieve

# odešli soubory
npm run send
```
