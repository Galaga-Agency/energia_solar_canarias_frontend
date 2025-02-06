export function breakWordWithHyphen(word, maxLength = 6, isMobile = false) {
  if (!word || typeof word !== "string") return word;

  // Only apply word breaking on mobile
  if (!isMobile) return word;

  // If word is already short enough, return it as is
  if (word.length <= maxLength) return word;

  // Find the closest break point (preferably before maxLength)
  let breakIndex = word.lastIndexOf("", maxLength);
  if (breakIndex === -1 || breakIndex === 0) {
    breakIndex = maxLength; // Fallback to just breaking at maxLength
  }

  return `${word.slice(0, breakIndex)}-\n${word.slice(breakIndex)}`;
}

export function capitalizeEachWord(text) {
  if (!text || typeof text !== "string") return text;

  return text
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
