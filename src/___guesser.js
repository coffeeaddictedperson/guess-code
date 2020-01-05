import {getResult} from "./helpers";
export function guesser (checkedValue, conceivedNumber) {
  const callNActions = (action, times) => {
    for (let i = 0; i < times; i++) action(i);
  };
  const generateItem = (obj, i) => {
    obj[i] = {
      x: null,
      wrong: new Set(),
      possibleCow: new Set(),
      possibleBull: new Set(),
    };
  };
  const guess = {};
  callNActions((i) => generateItem(guess, i), 4);

  const markArrayAsType = (arr, type) => {
    for (let i = 0; i < CODE_LEN; i++) {
      arr.forEach(num => guess[i][type].add(num));
    }

  };
  const CODE_LEN = 4;

  const initialArray = Array.from(Array(10).keys());

  const wrongNumbers = [];
  // const markAsType = (num, pos, type) => {
  //   guess[pos][type] = guess[pos][type].concat[num];
  //   return guess;
  // };
  // const markAllAsType = (num, type) => {
  //   for (let i = 0; i < CODE_LEN; i++) {
  //     markAsType(num, i, type);
  //   }
  // };


  // check 4 / 10 [0,1,2,3]
  // no - add to excluded
  // cow - add to possible , and mark that other positions can't be
  // bull - mark as possible bull


  let lastResult;

  const result = [];

  const iterationCheck = () => {
    let iterationNumbers = initialArray.splice(0,4);
    lastResult = getResult(iterationNumbers, conceivedNumber);

    // no results: mark each and mark all
    if((lastResult.countBull + lastResult.countCow) === 0) {

      console.log(' mark as wrong', iterationNumbers)
      markArrayAsType(iterationNumbers, 'wrong');
      wrongNumbers.push(...iterationNumbers);
    }

    // mark 3/4 as possible and 1 as impossible
    // todo: concatenate with next else
    else if(lastResult.countCow && !lastResult.countBull) {

      console.log('mark as possible cow', iterationNumbers)
      for (let i = 0; i< CODE_LEN; i++) {
        for (let j = 0; j < CODE_LEN; j++) {
          if(i===j) {
            guess[i]['wrong'].add(iterationNumbers[i])
          } else {
            guess[j]['possibleCow'].add(iterationNumbers[i])
          }
        }
      }
    }

    // mark as possible bull and possible cow
    else {
      console.log('mark as possible bull and possible cow', iterationNumbers)
      for (let i = 0; i < CODE_LEN; i++) {
        for (let j = 0; j < CODE_LEN; j++) {
          if (lastResult.countBull) {
            guess[i]['possibleBull'].add(iterationNumbers[j])
          }
          if (lastResult.countCow) {
            guess[i]['possibleCow'].add(iterationNumbers[j])
          }
        }
      }
    }

    result.push(lastResult)
  };

  iterationCheck();
  // iterationCheck();
  // iterationCheck();

  console.log(guess);


  return result;





  //return getResult(checkedValue, conceivedNumber);
}