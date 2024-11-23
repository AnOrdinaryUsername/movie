export function convertToReadableTime(movieDuration: number) {
  const hours = Math.floor(movieDuration / 60);
  const minutes = movieDuration % 60;

  if (hours > 1) {
    if (minutes > 1) {
      return `${hours} hours, ${minutes} minutes`;
    } else {
      return `${hours} hours, ${minutes} minute`;
    }
  }

  if (minutes > 1) {
    return `${hours} hour, ${minutes} minutes`;
  } else {
    return `${hours} hour, ${minutes} minute`;
  }
}
