let globalObjects = {};

function Suit(name, cards, quantities) {
    if (!cards) {
        console.error('A list of cards is required.');
        return undefined;
    }
    if (!quantities) {
        quantities = Array(cards.length).fill(1);
    }

    this.name = name;
    this.cards = {};

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        this.cards[card] = quantities[i];
    }
}

const standardCards = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
globalObjects["hearts"] = new Suit("hearts", standardCards);
globalObjects["spades"] = new Suit("spades", standardCards);
globalObjects["diamonds"] = new Suit("diamonds", standardCards);
globalObjects["clubs"] = new Suit("clubs", standardCards);

function Deck(name, suits, quantities) {
    if (!suits) {
        console.error('ERROR: A list of suits is required.');
        return undefined;
    }
    if (!quantities) {
        quantities = Array(suits.length).fill(1);
    }

    this.name = name;
    this.suits = [];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < quantities[i]; j++) {
            if (suits[i] in globalObjects) {
                this.suits.push(globalObjects[suits[i]]);
            } else {
                console.error(`ERROR: Suit "${suits[i]}" not found.`);
            }
        }
    }
}

globalObjects["standardDeck"] = new Deck("standardDeck", ["hearts", "spades", "diamonds", "clubs"]);

function parseInput(input){
    const declarations = [];
    const formulas = [];
    const pattern_declaration = /^\s*new\s+([A-Za-z]*)\s+([A-Za-z_][A-Za-z_0-9]*)\s*=\s*{(\s*[0-9A-Za-z_][0-9A-Za-z_]*(?:\s*:\s*[0-9]+\s*)?(?:,\s*\s*[0-9A-Za-z_][0-9A-Za-z_]*(?:\s*:\s*[0-9]+)?\s*)*)}\s*$/;
                                            //syntax: new OBJECT OBJNAME = {VALUENAME:VALUE, ...} //`:VALUE` is optional
    const pattern_formula = /^\s*output\s+([A-Za-z_][A-Za-z_0-9]*)\s+([0-9]*)\s+from\s+{([A-Za-z_][A-Za-z_0-9]*|(?:[0-9]+|[A-Za-z][A-Za-z_0-9]*):[0-9]+(?:,\s*(?:[0-9]+|[A-Za-z][A-Za-z_0-9]*):[0-9]+)*)}\s*$/; 
                                            //syntax: output COMMAND VALUE from {DECK | VALUENAME:VALUE, ...}
    const pattern_key = /([A-Za-z_0-9]+)/;
    const pattern_keyvalue = /([A-Za-z_0-9]+):([0-9]+)/;

    const listOfLines = input.split('\n');

    for (const line of listOfLines){
        const match_declaration = line.match(pattern_declaration);
        const match_formula = line.match(pattern_formula);

        if (match_declaration) {
            const objectType = match_declaration[1];
            const objectName = match_declaration[2];
            const value = match_declaration[3];

            keysAndValues = value.split(/,\s*/);

            let keys = [];
            let values = [];
            
            for(const keyValue of keysAndValues) {
                const match_key = keyValue.match(pattern_key);
                const match_keyvalue = keyValue.match(pattern_keyvalue);

                if (!match_key && !match_keyvalue) {
                    console.error("ERROR: Invalid deck declaration!");
                    return;
                }

                if (match_keyvalue) {
                    keys.push(match_keyvalue[1]);
                    values.push(parseInt(match_keyvalue[2]));
                } else if (match_key) {
                    keys.push(match_key[1]);
                    values.push(1);
                }
            }

            const parsedDeclaration = {
                objectType: objectType,
                objectName: objectName,
                keys: keys,
                values: values
            }

            declarations.push(parsedDeclaration);
        } else if (match_formula) {
            const command = match_formula[1];
            const value = parseInt(match_formula[2], 10);
            const deck = match_formula[3];
            
            const parsedFormula = {
                command: command,
                value: value,
                deck: deck
            }

            formulas.push(parsedFormula)
        } else {
            console.error(`Error: Invalid Function Syntax`); //Should be expanded on to provide detail on what went wrong
        }
    }

    return [declarations, formulas];
}

function initializeDeclarations(declarations){
    for (let declaration of declarations){
        switch (declaration.objectType) {
            case "deck":
                globalObjects[declaration.objectName] = new Deck(declaration.objectName, declaration.keys, declaration.values);
                break;
            case "suit":
                globalObjects[declaration.objectName] = new Suit(declaration.objectName, declaration.keys, declaration.values);
                break;
            default:
                console.error("ERROR: Invalid declaration type!");
        }
    }
}

function runCommands(formulas){ //commands listed in commands.js
    for (let i = 0; i < formulas.length; i++) {
        window[formulas[i].command](formulas[i].value, formulas[i].deck);
    }
}

$(document).ready(function() {
    if (unparsedInput !== "") {
        const [declarations, formulas] = parseInput(unparsedInput);

        initializeDeclarations(declarations);
        runCommands(formulas);
    }
});