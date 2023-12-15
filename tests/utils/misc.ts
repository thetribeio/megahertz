export const convertToNumericPrice = (price: string): number => {
    const split = price.split("€");

    return Number(split[0]);
}