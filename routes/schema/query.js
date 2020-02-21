const puppeteer=require('puppeteer');
const express=require('express');
const router=express.Router();
const fill=require('./fill');

router.post('/',async(req,res)=>{
  //let query='{estudiantes{apellido,_id,nombre}}';
  let query=req.body.query+'';
  console.log(query);
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('http://192.168.1.3:8000/graphql?query='+query);
  await page.click('.execute-button');
  await page.screenshot({path: 'public/titiritero.png'});
  try {
    let content = await page.content()+'';
    const inte=content.indexOf('ReactDOM.render');
    content=content.substr(inte,content.length);
    content=content.substr(content.indexOf('response:'),content.length);
    content=fill(content);
    let datas=JSON.parse(content);
    await browser.close();
    res.json(datas);
  } catch (e) {
    res.json({message:'insertado'});
  }
});


module.exports=router;
