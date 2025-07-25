function getInfix(){
    const infix = document.querySelector(".equation").textContent;
    return infix;
}

class TreeNode{
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}
function getTokens(){
    const infix = getInfix();
    const tokens = infix.split("");

    return tokens;
}
function getOperatorTokens(){
    const equation = getInfix();
    return equation.split(/(?<=[\d)])(?=[+\-*/%])|(?<=[+\-*/%])(?=[\d])/);
}
function getNegativeNumberFromEquation(equation) {
  const regex = /(?<!\d|\))-(\d+(\.\d+)?)/g;
  const negatives = [];
  let match;

  while ((match = regex.exec(equation)) !== null) {
    negatives.push('-' + match[1]);
  }

  return negatives;
}
function findRoot(){
    let currentPrec = -1;
    let addSub = [];
    let mulDiv = [];
    const precLevel = {
        '*':2,
        '/':2,
        '+':1,
        '-':1,
    }
    const operatorTokens = getOperatorTokens();
    const firstOperator = operatorTokens[0];
    console.log("operator tokens: " + operatorTokens);
    for(let i = 0; i < operatorTokens.length; i++){
        const op = operatorTokens[i];
        currentPrec = precLevel[op];

        if(currentPrec === 1){
            addSub.push(op); 
        }else{
            mulDiv.push(op);
        }
    }
    if(addSub.length == 0){
        return mulDiv[mulDiv.length-1];
    }else{
        return addSub[addSub.length-1];
    }
}
console.log("negatives" + getNegativeNumberFromEquation(getInfix()));
console.log("Root: " + findRoot());
