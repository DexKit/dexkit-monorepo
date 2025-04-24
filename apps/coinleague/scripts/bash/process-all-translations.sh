#!/bin/bash
yarn lang-diff 
yarn sync-language-files 
yarn compile lang/de-DE.json --out-file compiled-lang/de-DE.json 
yarn compile lang/pt-BR.json --out-file compiled-lang/pt-BR.json 
yarn compile lang/es-ES.json --out-file compiled-lang/es-ES.json 
yarn compile lang/fr-FR.json --out-file compiled-lang/fr-FR.json 
yarn compile lang/nn-NO.json --out-file compiled-lang/nn-NO.json 
yarn compile lang/it-IT.json --out-file compiled-lang/it-IT.json 
yarn compile lang/en-US.json --out-file compiled-lang/en-US.json 
yarn compile lang/cs-CZ.json --out-file compiled-lang/cs-CZ.json 
yarn translate-ai



