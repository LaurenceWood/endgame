const ROW_COUNT = 100;
const COLUMN_COUNT = 100;

function init() {
    const root = document.getElementById('root');

    // Create rows.
    for (let i = 0; i < ROW_COUNT; i++) {
        const row = createRow(i);
        root.appendChild(row);
    }

    // Set cells as editable.
    document.querySelectorAll('.cell').forEach(div => div.contentEditable = true);
}

// Note that Rows and Columns are indexed from 0.
const createRow = (number) => {
    const row = createDiv(`row-${number}`, { className: 'row' });

    for (let i = 0; i < COLUMN_COUNT; i++) {
        const column = toAlphaId(i);
        const cell = createDiv(`cell-${column}`, { className: 'cell'})
        row.appendChild(cell);
    }

    return row;
}

const createDiv = (id, options = {}) => {
    const { className, contentString } = options;
    const div = document.createElement('div');

    if (id) { div.id = id };
    if (className) { div.className = className; }
    if (contentString) {
        const inner = document.createTextNode(contentString);
        div.appendChild(inner);
    }

    return div;
}


/**
 * Converts a number to an 'excel like' alphabetical representation.
 *  e.g. 1-26 to A-Z, 27-56 to AA-AZ.
 *  NOTE: This is not a general case solution and only supports values up to ZZ.
 */
const toAlphaId = (num) => {
    if (num >= 26 * 27) {
        throw new Error('Invalid argument: cannot convert alpha ID beyond ZZ.');
    }
    return (num < 26) 
        ? String.fromCharCode(65 + num)
        : String.fromCharCode(65 - 1 + num / 26) + toAlphaId(num % 26);
}