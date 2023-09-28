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

const standardCards = ["1","2","3","4","5","6","7","8","9","10","J","Q","K","A"];
const hearts = new Suit("hearts", standardCards);
const spades = new Suit("spades", standardCards);
const diamonds = new Suit("diamonds", standardCards);
const clubs = new Suit("clubs", standardCards);

function Deck(name, suits) {
    this.name = name;
    this.suits = suits;
}

const standardDeck = new Deck("standardDeck", [hearts, spades, diamonds, clubs]);

function parseInput(input){
    const declarations = [];
    const formulas = [];
    const pattern_declaration = /^\s*new\s+([A-Za-z]*)\s+([A-Za-z_][A-Za-z_0-9]*)\s*=\s*{(\s*[0-9A-Za-z_][0-9A-Za-z_]*(?:\s*:\s*[0-9]+\s*)?(?:,\s*\s*[0-9A-Za-z_][0-9A-Za-z_]*(?:\s*:\s*[0-9]+)?\s*)*)}\s*$/;
                                                                                                    //syntax: new OBJECT OBJNAME = {VALUENAME:VALUE, ...} //:VALUE is optional
    const pattern_formula = /^\s*output\s+([A-Za-z_][A-Za-z_0-9]*)\s+([0-9]*)\s+from\s+{([A-Za-z_][A-Za-z_0-9]*|(?:[0-9]+|[A-Za-z][A-Za-z_0-9]*):[0-9]+(?:,\s*(?:[0-9]+|[A-Za-z][A-Za-z_0-9]*):[0-9]+)*)}\s*$/; 
                                                                                                    //syntax: output COMMAND VALUE from {DECK | VALUENAME:VALUE, ...}

    const listOfLines = input.split('\n');

    for (const line of listOfLines){
        const match_declaration = line.match(pattern_declaration);
        const match_formula = line.match(pattern_formula);

        if (match_declaration) {
            const objectType = match_declaration[1];
            const objectName = match_declaration[2];
            const deck = match_declaration[3];

            const parsedDeclaration = {
                objectType: objectType,
                objectName: objectName,
                deck: deck
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
}

function runCommands(formulas){ //commands listed in commands.js
    for (let i = 0; i < formulas.length; i++) {
        window[formulas[i].command](formulas[i].value, formulas[i].deck);
    }
}

$(document).ready(function() {
    if (unparsedInput != "") {
        const [declarations, formulas] = parseInput(unparsedInput);

        initializeDeclarations(declarations);
        runCommands(formulas);
    }
});