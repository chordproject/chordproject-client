export type DiffRow = {
    left: string | null;
    right: string | null;
    type: 'equal' | 'removed' | 'added' | 'changed';
};

// Line-based LCS diff, aligned into two columns (VS Code-style side-by-side view).
export function computeLineDiff(oldText: string, newText: string): DiffRow[] {
    const oldLines = (oldText || '').split('\n');
    const newLines = (newText || '').split('\n');
    const oldLength = oldLines.length;
    const newLength = newLines.length;

    const lcs: number[][] = Array.from({ length: oldLength + 1 }, () => new Array(newLength + 1).fill(0));
    for (let i = oldLength - 1; i >= 0; i--) {
        for (let j = newLength - 1; j >= 0; j--) {
            lcs[i][j] =
                oldLines[i] === newLines[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
        }
    }

    const rows: DiffRow[] = [];
    let i = 0;
    let j = 0;
    while (i < oldLength && j < newLength) {
        if (oldLines[i] === newLines[j]) {
            rows.push({ left: oldLines[i], right: newLines[j], type: 'equal' });
            i++;
            j++;
        } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
            rows.push({ left: oldLines[i], right: null, type: 'removed' });
            i++;
        } else {
            rows.push({ left: null, right: newLines[j], type: 'added' });
            j++;
        }
    }
    while (i < oldLength) {
        rows.push({ left: oldLines[i], right: null, type: 'removed' });
        i++;
    }
    while (j < newLength) {
        rows.push({ left: null, right: newLines[j], type: 'added' });
        j++;
    }

    return pairAdjacentChanges(rows);
}

// Merge an adjacent removed-block/added-block pair into single "changed" rows so a
// modified line lines up on the same row instead of appearing one row apart.
function pairAdjacentChanges(rows: DiffRow[]): DiffRow[] {
    const result: DiffRow[] = [];
    let i = 0;

    while (i < rows.length) {
        if (rows[i].type !== 'removed') {
            result.push(rows[i]);
            i++;
            continue;
        }

        const removedStart = i;
        while (i < rows.length && rows[i].type === 'removed') {
            i++;
        }
        const removedBlock = rows.slice(removedStart, i);

        const addedStart = i;
        while (i < rows.length && rows[i].type === 'added') {
            i++;
        }
        const addedBlock = rows.slice(addedStart, i);

        const pairCount = Math.min(removedBlock.length, addedBlock.length);
        for (let k = 0; k < pairCount; k++) {
            result.push({ left: removedBlock[k].left, right: addedBlock[k].right, type: 'changed' });
        }
        for (let k = pairCount; k < removedBlock.length; k++) {
            result.push(removedBlock[k]);
        }
        for (let k = pairCount; k < addedBlock.length; k++) {
            result.push(addedBlock[k]);
        }
    }

    return result;
}
