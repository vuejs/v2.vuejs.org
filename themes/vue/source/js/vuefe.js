var funcGetSelectText = function(){
  var txt = '';
  if(document.selection){
    txt = document.selection.createRange().text;//ie
  }else{
    txt = document.getSelection();
  }
  return txt.toString();
}

var container = container || document;
container.onmouseup = function(){
  var txt = funcGetSelectText();
  if(txt)
  {
  console.log('vuefe.cn : ' + txt);
  }
}
