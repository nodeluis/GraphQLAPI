module.exports=function(cad){
  cad=cad.substr(0,cad.indexOf('variables'));
  cad=filtrar(cad);
  return cad;
}

function filtrar(cad){
  let res='';
  for (let i = 11; i < cad.length-11; i++) {
    if(cad.charAt(i)!='\\'&&cad.charAt(i)!=' '&&((cad.charAt(i-1)=='\\'&&cad.charAt(i)=='n')?false:true)){
      res+=cad.charAt(i);
    }
  }
  return res;
}
