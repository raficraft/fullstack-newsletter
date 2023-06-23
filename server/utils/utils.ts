export function convertDatesToStrings(data: any) {
  for (let key in data) {
    if (data[key] instanceof Date) {
      data[key] = data[key].toISOString();
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      convertDatesToStrings(data[key]);
    }
  }
}
