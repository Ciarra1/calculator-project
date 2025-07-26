

function getInfix(){
    const infix = document.querySelector(".equation").textContent.trim();
    return infix;
}
const operations = {
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide,
    '%': modulo
};

class TreeNode{
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}
function getOperatorTokens() {
  const equation = getInfix();
  
  // Replace negative numbers temporarily
  const temp = equation.replace(/(?<!\d)-\d+(\.\d+)?/g, 'temp');
  
  // Match only real operators (not negative signs)
  return temp.match(/[+\-*/%]/g) || [];
}
function isOperator(token) {
  return ['+', '-', '*', '/', '%'].includes(token);
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

function tokenize(expression) {
  // Match numbers (including decimals) or operators
  return expression.match(/(?<!\d|\))-\d+(\.\d+)?|\d+(\.\d+)?|[+\-*/%]/g);
}
function precedence(op) {
  if (op === '+' || op === '-') return 1;
  if (op === '*' || op === '/' || op === '%') return 2;
  return 0;
}

function findRootIndex(tokens){
    let minPrec = Infinity;
    let rootIndex = -1;

    for(let i = tokens.length -1; i>=0; i--){
        const token = tokens[i];
        if(isOperator(token)){
            let prec = precedence(token);
            if(prec <= minPrec){
                minPrec = prec;
                rootIndex = i;
            }
        }
    }
    return rootIndex;
}
function buildTree(tokens){
    if(tokens.length === 1){
        return new TreeNode(tokens[0]);
    }

    const rootIndex = findRootIndex(tokens);
    const root = new TreeNode(tokens[rootIndex]);

      if (rootIndex === -1) {
    // If no operator found, treat entire expression as single operand
    return new TreeNode(tokens.join(""));
  }

    let leftSubtree = tokens.slice(0,rootIndex);
    let rightSubtree = tokens.slice(rootIndex+1);

    root.left = buildTree(leftSubtree);
    root.right = buildTree(rightSubtree);

    return root;
}
function inorder(node) {
  if (!node) return '';
  if (!node.left && !node.right) return node.value;
  return '(' + inorder(node.left) + node.value + inorder(node.right) + ')';
}

function postorder(node){
    if(!node) return [];
    return [...postorder(node.left), ...postorder(node.right), node.value];
}

function postfix(tokens) {
  const output = [];
  const opStack = [];

  for (const token of tokens) {
    if (!isOperator(token)) {
      output.push(token);
    } else {
      while (
        opStack.length > 0 &&
        precedence(opStack[opStack.length - 1]) >= precedence(token)
      ) {
        output.push(opStack.pop());
      }
      opStack.push(token);
    }
  }

  while (opStack.length > 0) {
    output.push(opStack.pop());
  }

  return output;
}

function evalPostfix(postfix){
    let flag = 0;
    let operandStack = [];
    let operatorStack = [];
    let result;
    for(let i = 0; i < postfix.length; i++){
        if(!isOperator(postfix[i])){
            operandStack.push(postfix[i]);
        } else {
            //an operator has been found
            let op = postfix[i];
            operatorStack.push(op);
 
            let secondOperand = parseFloat(operandStack.pop());
            let firstOperand = parseFloat(operandStack.pop());
            result = operations[operatorStack.pop()](firstOperand,secondOperand);
            operandStack.push(result);
            
        }
    }
    return result;
}
function add(a,b){
    return a + b;
}
function subtract(a,b){
    return a-b;
}
function multiply(a,b){
    return a*b;
}
function divide(a,b){
    return a/b
} 
function modulo(a,b){
    return a%b;
}


let lastEquation;
function restoreLastEquation(){
  document.querySelector(".equation").textContent = lastEquation;
}
function deleteLast(){
  document.querySelector(".equation").textContent = document.querySelector(".equation").textContent.slice(0,-1);
} 
function evaluateExpression(){

  if(getInfix() == ""){
    return;
  }
  lastEquation = getInfix();
  
  //getting the input from calculator
  console.log("calculator input");
  let tokens = tokenize(getInfix());
  let postfixExpre = postfix(tokens);
  let result = evalPostfix(postfixExpre);
  console.log("Calculator result:" +result);
  console.log(" Calculator tokens: " + tokens);

  //
  console.log("String input");
  let strTokens = tokenize("-3.2 + 6 * 2 - 8 / -4 + 7 % 3");
  let strPostfixExpre = postfix(strTokens);
  let strResult = evalPostfix(strPostfixExpre);
  console.log("String result:" +strResult);
  console.log(" String tokens: " + strTokens);
  document.querySelector(".equation").textContent = result.toString();
}



