import {getResult} from "./helpers";

// CODE_LEN = 4
export function guesser (checkedValue, conceivedNumber, code_len) {
  // const callNActions = (action, times) => {
  //   for (let i = 0; i < times; i++) action(i);
  // };

  // NOTE: Limited to 10 digits
  const ALL_NUM = 10;

  let initialArray = Array.from(Array(ALL_NUM).keys());
  const maybeCows = new Set();
  const wrong = new Set();
  const sureCows = new Set();

  let success = false;

  let lastResult;

  const finalResult = [];

  const logResult = () => {
    console.log('Wrong:', wrong, '\nSure:', sureCows, '\nMaybe:', maybeCows, '\nLeft:', initialArray, '\nSteps', finalResult);
  };

  // check first two in each check
  const isDefined = item => item !== undefined;

  // get 02 | 02, 13 | 13
  // FIXME: limited to 8 leftover
  const convertSetToShuffledArray = originSet => {
    const tempArr = [...originSet];
    const halfLen = Math.ceil(tempArr.length / 2);
    const shuffledArray = [];
    let ind = 0;
    for(let i = 0; i<halfLen; i++) {
       shuffledArray[ind++] = tempArr[i];
       if(isDefined(tempArr[halfLen + i])) shuffledArray[ind++] = tempArr[halfLen + i];
    }
    return shuffledArray;
  };
  // get 01 | 23, 23 | 01
  // FIXME: works only for code_len = 4
  const convertSetToShuffledArrayV2 = originSet => {
    const tempArr = [...originSet];
    const shuffledArray = [];
    const quoteLen = Math.ceil(tempArr.length / 4);
    let ind = 0;
    for (let i = 0; i < tempArr.length; i += 4) {
      shuffledArray[ind++] = tempArr[i];
      if(isDefined(tempArr[i+1])) shuffledArray[ind++] = tempArr[i+1];
      if(isDefined(tempArr[code_len+2])) shuffledArray[ind++] = tempArr[4+2];
      if(isDefined(tempArr[code_len+3])) shuffledArray[ind++] = tempArr[4+3];
    }
    console.log('convertSetToShuffledArrayV2', shuffledArray);
    return shuffledArray;
  };

  let tries = 0;
  const checkInUniqueArray = (result) => {
    console.log('iteration start: ', ++tries)
    let iterationNumbers = initialArray.splice(0, code_len);
    lastResult = getResult(iterationNumbers.join(''), conceivedNumber);

    // initial check
    // wrong
    if (lastResult.tempCow === 0) {
      iterationNumbers.forEach(num => wrong.add(num));
      // sureCows
    } else if (lastResult.tempCow === 4) {
      iterationNumbers.forEach(num => sureCows.add(num))
      // maybeCows
    } else {
      iterationNumbers.forEach(num => maybeCows.add(num))
    }

    // save iteration
    result.push(lastResult);
    // log
    logResult();

    // SUCCESS: we have all {code_len} numbers
    if (sureCows.size === code_len) {
      success = true;
      return result;
    }

    // check until unique check possible [first step]
    let cowCount = 0;
    result.forEach(iteration => {
      cowCount += iteration.tempCow;
    });
    if(cowCount < code_len && initialArray.length >= code_len) {
      return checkInUniqueArray(result);
    }
    return result;
  };


  const secondCheck = (shuffleMethod) => {
    // GOTCHA!
    if(success) {
      console.log('SecondCheck: success = ', success);
      return;
    }

    // check right guess in first and second
    const cowCount = finalResult[0].tempCow + finalResult[1].tempCow;
    const leftNums = initialArray.length;

    // numbers which are in initialArray are Correct numbers
    // todo: solve position problem [bulls]
    // NOTE: this "if" possible only for ALL_NUM % code_len == 0
    if (leftNums === code_len && sureCows.size === 0) {
      console.log('HERE WE ARE: right numbers in leftovers', maybeCows);
      finalResult.push({
        tempCow: code_len,
        countBull: 'X',
        cowCount: code_len,
        checkedValue: initialArray
      });
      logResult();
    }
    // right numbers in "maybeCows array"
    else if (cowCount === code_len) {
      // todo: right numbers in maybeCows numbers

      // todo: optional
      initialArray = shuffleMethod(maybeCows);
      // clear last iterations
      wrong.clear();
      maybeCows.clear();

      console.log('HERE WE ARE: right numbers in maybeCows numbers\n', initialArray);

      // check again
      finalResult.push(...checkInUniqueArray([]));


      logResult();

    } else if (cowCount + leftNums === code_len) {
      console.log('HERE WE ARE: leftovers = sureCows, other should be found')
      // leftovers in initialArray -> sureCows numbers
      initialArray.forEach(num => sureCows.add(num));
      initialArray.splice(0, leftNums);

      // todo: check for left nums {x = code_len - leftNums}
      logResult();

    } else {
      // we have for example sureCows x 1, and others are maybeCows
      // todo: leftovers should be moved from maybeCows [start again with shuffled array]
      console.log('HERE WE ARE: start again')
      // initialArray = [...maybeCows];
      // wrong.clear();
      logResult();
    }
  }


  // start iterations
  finalResult.push(...checkInUniqueArray([]));

  secondCheck(convertSetToShuffledArrayV2);




  return finalResult;





  //return getResult(checkedValue, conceivedNumber);
}