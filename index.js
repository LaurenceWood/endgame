const ROW_COUNT = 100;
const COLUMN_COUNT = 100;

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

    // Set cells as editable.
    document.querySelectorAll('.cell').forEach(div => div.contentEditable = true);
}


// Note that Rows and Columns are indexed from 1.
const createRow = (id, isHeaderRow = false) => {
    const row = createDiv({ id: `row-${id}`, className: 'row' });

    // Side header cell.
    const headerCell = createDiv({ 
        id: 'cell-header',
        className: 'cell header header-column',
        content: isHeaderRow ? undefined : id
    })
    row.appendChild(headerCell);
    
    // Columns.
    for (let i = 0; i <= COLUMN_COUNT; i++) {
        const columnId = toAlphaId(i);

        const cell = createDiv({
            id: `cell-${columnId}`,
            className: isHeaderRow ? 'cell header header-row' : 'cell',
            content: isHeaderRow ? columnId : undefined
        })
        row.appendChild(cell);
    }

    return row;
}

const createDiv = (options = {}) => {
    const { id, className, content } = options;
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

    return div;
}


/**
 * Converts a number to an 'excel-like' alphabetical representation.
 *  e.g. 0-25 to A-Z, 26-55 to AA-AZ.
 *  Simple recursive solution resolves & concatenates individual digits.
 */
const toAlphaId = (num) => (num < 26) 
    ? String.fromCharCode(65 + num)
    : toAlphaId(Math.floor(num / 26) - 1) + toAlphaId(num % 26);
