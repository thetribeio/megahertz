import DecodedCursor from "src/core/domain/common/types/cursor";

/**
 * Encodes a cursor address to a base64 format.
 *
 * @param cursor The cursor address to encode
 * @param order The order of the cursor (gte for next, lte for prev)
 */
export const encodeCursor = (cursor: string, order: string): string => {
    if (cursor === ''){
        return '';
    }
    return btoa(`${order === 'gte' ? 'next' : 'prev'}___${cursor}`);
}

export const decodeCursor = (cursor: string): DecodedCursor => {
    if (cursor === '') {
        return {
            order: 'gte',
            address: ''
        }
    }
    // eslint-disable-next-line prefer-regex-literals
    const cursorMatch = atob(cursor).match(new RegExp('^(?<order>(next|prev))___(?<address>[\\w\'-]+)$')) as RegExpMatchArray;
    const groups = cursorMatch.groups as any;

    return {
        order: groups.order === 'next' ? 'gte' : 'lte',
        address: groups.address as string,
    }
}