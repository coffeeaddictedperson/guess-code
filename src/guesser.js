import {getResult} from "./helpers";

export function guesser (checkedValue, conceivedNumber) {
  const callNActions = (action, times) => {
    for (let i = 0; i < times; i++) action(i);
  };
  const CODE_LEN = 4;
  const ALL_NUM = 10;

  let initialArray = Array.from(Array(ALL_NUM).keys());


  //const maybe1 = new Set(Array(10).keys());
  const maybeCows = new Set();
  const wrong = new Set();
  const sureCows = new Set();

  let success = false;

  let lastResult;

  const result = [];

  const logResult = () => {
    console.log('Wrong:', wrong, '\nSure:', sureCows, '\nMaybe:', maybeCows, '\nLeft:', initialArray, '\nSteps', result);
  };

  const checkInUniqueArray = () => {
    console.log('iteration start:')
    let iterationNumbers = initialArray.splice(0, 4);
    lastResult = getResult(iterationNumbers, conceivedNumber);

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

    // SUCCESS: we have all {CODE_LEN} numbers
    if (sureCows.size === CODE_LEN) {
      success = true;
      return;
    }

    // check until unique check possible
    let cowCount = 0;
    result.forEach(iteration => {
      cowCount += iteration.tempCow;
    });
    if(cowCount < CODE_LEN && initialArray.length >= CODE_LEN) {
      checkInUniqueArray();
    }
  };
  // start iterations
  checkInUniqueArray();

  // GOTCHA!
  if(success) return result;

  // check right guess in first and second
  const cowCount = result[0].tempCow + result[1].tempCow;
  const leftNums = initialArray.length;

  // numbers which are in initialArray are Correct numbers
  // todo: solve position problem [bulls]
  // NOTE: this "if" possible only for ALL_NUM % CODE_LEN == 0
  if (leftNums === CODE_LEN && sureCows.size === 0) {
    console.log('HERE WE ARE: right numbers in leftovers', maybeCows);
    result.push({
      tempCow: CODE_LEN,
      countBull: 'X',
      cowCount: CODE_LEN,
      checkedValue: initialArray
    });
    logResult();
  }
  // right numbers in "maybeCows array"
  else if(cowCount === CODE_LEN) {
    console.log('HERE WE ARE: right numbers in maybeCows numbers', maybeCows.values());
    // todo: right numbers in maybeCows numbers

  } else if(cowCount + leftNums === CODE_LEN) {
    console.log('HERE WE ARE: leftovers = sureCows, other should be found')
    // leftovers in initialArray -> sureCows numbers
    initialArray.forEach(num => sureCows.add(num));
    initialArray.splice(0, leftNums);

    // todo: check for left nums {x = CODE_LEN - leftNums}
    logResult();

  } else {
    // we have for example sureCows x 1, and others are maybeCows
    // todo: leftovers should be moved from maybeCows [start again with shuffled array]
    console.log('HERE WE ARE: start again')
    initialArray = [...maybeCows];
    wrong.clear();
    logResult();
  }


  // checkInUniqueArray();



  return result;





  //return getResult(checkedValue, conceivedNumber);
}