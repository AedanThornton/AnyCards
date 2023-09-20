function parseFormulas(input){
    const formulas = [];
    const pattern = /^\s*output\s+([A-Za-z_][A-Za-z_0-9]*)\s+([0-9]*)\s+from\s+{(.*)}\s*$/; //syntax: output COMMAND VALUE from {DECK}

    const listOfFormulas = input.split('\n');

    for (const formula of listOfFormulas){
        const match = formula.match(pattern);

        if (match) {
            const command = match[1];
            const value = parseInt(match[2], 10);
            const deck = match[3];
            
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

    return formulas;
}

$(document).ready(function() {
    if (unparsedFormulas != "") {
        console.log(parseFormulas(unparsedFormulas));
    }
});