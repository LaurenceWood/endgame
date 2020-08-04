const ROW_COUNT = 100;
const COLUMN_COUNT = 100;

const VALUES = Array(ROW_COUNT).fill().map(() => []);
const getCell = (row, col) => VALUES[row - 1][col - 1];
const setCell = (row, col, value) => VALUES[row - 1][col - 1] = value;

let root;
const getRoot = () => root || (root = document.getElementById('root'));

const init = () => {
    // Top header row.
    const row = createRow('header', true);
    getRoot().appendChild(row);

    // Create rows, indexed from 1.
    for (let i = 1; i <= ROW_COUNT; i++) {
        const row = createRow(i);
        getRoot().appendChild(row);
    }

    console.info('Initialised sheet.');
}

// Clears contents of root element and forces re-creation of elements.
const redraw = () => {
    // Clear contents of root element;
    getRoot().innerHTML = '';
    init();
}


// Note that Rows and Columns are indexed from 1.
const createRow = (rowId, isHeaderRow = false) => {
    const row = createDiv({ id: `row-${rowId}`, className: 'row' });

    // Side header cell.
    const headerCell = createDiv({ 
        id: 'cell-header',
        className: 'cell header header-column',
        content: isHeaderRow ? '-' : rowId
    })
    row.appendChild(headerCell);
    
    // Columns.
    for (let colId = 1; colId <= COLUMN_COUNT; colId++) {
        const columnId = toAlphaId(colId - 1);

        const cell = createDiv({
            id: `cell-${columnId}`,
            className: isHeaderRow ? 'cell header header-row' : 'cell',
            content: isHeaderRow ? columnId : resolveCellValue(rowId, colId),
            handleInput: cellInputHandler(rowId, colId),
            editable: !isHeaderRow,
        })
        row.appendChild(cell);
    }

    return row;
}

const createDiv = (options = {}) => {
    const { id, className, content, handleInput, editable } = options;
    const div = document.createElement('div');

    if (id !== undefined) {
        div.id = id
    };
    if (className !== undefined) {
        div.className = className;
    }
    if (content !== undefined) {
        div.textContent = content;
    }
    if (handleInput !== undefined) {
        div.addEventListener('input', handleInput);
    }
    if (editable) {
        div.contentEditable = true;
    }

    return div;
}

const cellInputHandler = (row, col) => (e) => {
    const value = e?.srcElement?.textContent;
    setCell(row, col, value);

    console.log(`!! Updated value for row ${row} column ${col}:`, value);
}

/**
 * Resolves a cell value for display or further calculations. 
 */
const resolveCellValue = (row, col) => {
    const rawValue = getCell(row, col);

    if (!rawValue) {
        return rawValue;
    }
    if (simpleOperationRegex.test(rawValue)) {
        return simpleOperationValue(rawValue);
    }
    // Follow established pattern here to support functions.

    return rawValue;
}

const simpleOperationValue = (rawValue) => {
    const [ref1, operator, ref2] = rawValue.matchAll(simpleOperationRegex);
    if (!ref1 || !operator || !ref2) {
        return rawValue;
    }

    // Decode ref1 and ref2 from AlphaId to Row/Column & get resolved values.
    // Switch on supported 'operand' values & return calculated result.
    
    throw new Error('Not implemented');
}

/**
 * Converts a number to an 'excel-like' alphabetical representation.
 *  e.g. 0-25 to A-Z, 26-55 to AA-AZ.
 *  Simple recursive solution resolves & concatenates individual digits.
 */
const toAlphaId = (num) => (num < 26) 
    ? String.fromCharCode(65 + num)
    : toAlphaId(Math.floor(num / 26) - 1) + toAlphaId(num % 26);

// Three match groups: Cell/Operation/Cell.
const simpleOperationRegex = /^=([a-zA-Z]+[\d]+)([\+\-\*\/]+)([a-zA-Z]+[\d]+)/;

