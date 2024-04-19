function getNonAlphabeticItems(array) {
    const nonAlphabeticItems = [];
  
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
  
      // Check if the item contains non-alphabetic characters
      if (item.match(/^[^a-zA-Z]+$/)) {
        nonAlphabeticItems.push(item);
      }
    }
  
    return nonAlphabeticItems;
  }

const getTotal = (totalArray) => {
    const nonAlpha = getNonAlphabeticItems(totalArray)
    if(nonAlpha.length == 0) {
        return totalArray[0]
    }
    return nonAlpha[0]
}
module.exports.getTotal = getTotal