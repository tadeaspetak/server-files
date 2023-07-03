# Vymena souboru mezi pocitaci

Jak na `odesílatele` tak `adresáta`:

1.  Nainstaluj [node.js](https://nodejs.org/en/download).
2.  [Stáhni aplikaci](https://github.com/tadeaspetak/server-files/raw/main/server-files.zip) a rozbal na oba počítače.
3.  V souboru `defaults.ts` nastav port (nejspíš `80`).

Na `odesílateli` nastav v souboru `defaults.ts` v atributu `sender`:

1. `source` je zdrojový adresář. Absolutní cesty jsou absolutní, relativní jsou relativní vůči adresáři aplikace.
2. `to` je adresa adresáta včetně `http` či `https`.

Na `adresátovi` nastav v souboru `deafults.ts` v atributu `recipient`:

1. `storage` je cesta, kam by se měly ukládat přijaté soubory. Absolutní cesty jsou absolutní, relativní jsou relativní vůči adresáři aplikace.
