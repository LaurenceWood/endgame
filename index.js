const ROW_COUNT = 100;
const COLUMN_COUNT = 100;

const VALUES = Array(ROW_COUNT).fill().map(() => []);

function init() {
    const root = document.getElementById('root');

    // Top header row.
    const row = createRow('header', true);
    root.appendChild(row);

    // Create rows, indexed from 1.
    for (let i = 1; i <= ROW_COUNT; i++) {
        const row = createRow(i);
        root.appendChild(row);
    }
}

// Clears contents of root element and forces re-creation of elements.
const redraw = () => {
    // Clear contents of root element;
    const root = document.getElementById('root');
    root.innerHTML = '';
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
            content: isHeaderRow ? columnId : undefined,
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
        const inner = document.createTextNode(content);
        div.appendChild(inner);
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
    const value = e?.srcElement?.textContent
    VALUES[row - 1][col - 1] = value; // 0-based arrays vs 1-based grid.

    console.log(`!! Updated value for row ${row} column ${col}:`, value);
}


/**
 * Converts a number to an 'excel-like' alphabetical representation.
 *  e.g. 0-25 to A-Z, 26-55 to AA-AZ.
 *  Simple recursive solution resolves & concatenates individual digits.
 */
const toAlphaId = (num) => (num < 26) 
    ? String.fromCharCode(65 + num)
    : toAlphaId(Math.floor(num / 26) - 1) + toAlphaId(num % 26);
