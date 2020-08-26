import diff from 'diff-sequences'

const a = "ABCBBA"
const b = "BBCAAAC"

function countCommonItems(a: string, b: string) {
  let n = 0;
  function isCommon(aIndex: number, bIndex: number) {
    return a[aIndex] === b[bIndex];
  }
  function foundSubsequence(nCommon: number) {
    n += nCommon;
  }

  diff(a.length, b.length, isCommon, foundSubsequence);

  return n;
}

const findCommonItems = (a: string, b: string) => {
  const array: string[] = [];
  diff(
    a.length,
    b.length,
    (aIndex, bIndex) => Object.is(a[aIndex], b[bIndex]),
    (nCommon, aCommon) => {
      for (; nCommon !== 0; nCommon -= 1, aCommon += 1) {
        array.push(a[aCommon]);
      }
    },
  );
  return array;
};

const commonLength = countCommonItems(a, b)

console.log(commonLength)

const commonItems = findCommonItems(a, b)

console.log(commonItems)
console.log(commonItems.join(''))