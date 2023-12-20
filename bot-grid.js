import xeggexApi from "./xeggexApi.js";
import fs from "fs";
import util from "util";
import funcgu from './funcgu.js';

const yourApiKeyRead = "";
const yourApiSecretRead = "";

const yourApiKeyTrade = "";
const yourApiSecretTrade = "";

const restapiRead = new xeggexApi(yourApiKeyRead, yourApiSecretRead);
const restapiTrade = new xeggexApi(yourApiKeyTrade, yourApiSecretTrade);
const readFileContent = util.promisify(fs.readFile)
const writeFileContent = util.promisify(fs.writeFile)
new funcgu().welcome();
var intervalID
, usdt_wallet = 0
, market_price = []
, myWallet = []
,project_path = './'
,project_name = 'nuttapoom'
;
console.log('Start ...'+project_name)

/**
 * Setting minimun USDT in my wallet 
 */
const usdt_active = 0.3; //  when usdt have enough then start bot
const keep_coin = 20/100; // buy 100 => keep 20 => sale 80

/**
 * Grid public Setting
 */
const grid_near = 5; // 0-100 Ex. 8 % of 50 point = 8/100 * 50 
const grid_amount = 100; // amount
const grid_profit = 30; // 0 = disabled, 1-100 use all coin 25% of grid buys
const grid_limit_ref_cost = 0.2; // 0 = disabled, 0.25 usdt per one grid.

/**
 * Interval 1 minutes
 */
const minutes = 0.5 // 1 = minute
const break_minutes = 5 // 1 = 1 minute

var runs = () => {

  console.log("Running... "+ (new Date()).getHours() +":"+ (new Date()).getMinutes()+":"+ (new Date()).getSeconds());

  let m = 0;
  //FEE
  setTimeout(()=>{ ActionLimitOrder("XPE") }, m+=200);
  // นิยม เก็บ อยู่มานาน
  setTimeout(()=>{  ActionLimitOrder("LTC") }, m+=200);
  setTimeout(()=>{  ActionLimitOrder("TRX") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("SHIB") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("DOGE") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("ADA") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("XRP") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("MATIC") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("EOS") }, m+=200);
  // setTimeout(()=>{ ActionLimitOrder("DOT") }, m+=200);

  // FINANCE & SWAP
  setTimeout(()=>{ ActionLimitOrder("FTM") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("CAKE") }, m+=200);

  // โอนออก
  setTimeout(()=>{ ActionLimitOrder("XLM") }, m+=200);

  // ปั่น
  setTimeout(()=>{ ActionLimitOrder("NOVO") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("GOLD") }, m+=200);
  // setTimeout(()=>{ ActionLimitOrder("NEXA") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("TCC") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("TAFT") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("ARGY") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("PEPE") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("PEPEW") }, m+=200);
  // setTimeout(()=>{ ActionLimitOrder("MAXE") }, m+=200);
  // setTimeout(()=>{ ActionLimitOrder("AVN") }, m+=200);
  setTimeout(()=>{  ActionLimitOrder("NXT") }, m+=200);
  setTimeout(()=>{  ActionLimitOrder("COMP") }, m+=200);
  // setTimeout(()=>{  ActionLimitOrder("GPRX") }, m+=200);
  // setTimeout(()=>{  ActionLimitOrder("XGU") }, m+=200);
  // setTimeout(()=>{ ActionLimitOrder("2X2") }, m+=200);
  // setTimeout(()=>{ ActionLimitOrder("FEVO") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("IOTX") }, m+=200);
  // setTimeout(()=>{ ActionLimitOrder("PHP") }, m+=200);
  // setTimeout(()=>{ ActionLimitOrder("RVN") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("VET") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("XLA") }, m+=200);
  setTimeout(()=>{ ActionLimitOrder("NEKA") }, m+=200);
  // setTimeout(()=>{ ActionLimitOrder("BIG") }, m+=200);
  setTimeout(()=>{  ActionLimitOrder("HOW") }, m+=200); // 100000m is ok.

}


var startGrid = () => {
  (async () => {
    console.log('... ')
    let markets = await restapiRead.getMarkets();
    fs.writeFile(project_path+"/"+project_name+"/markets.json", JSON.stringify(markets), (err) => {
      if (err) {
        console.log(err);
      } else {
        // console.log("update Markets \n");
        // market_price = [];
        markets.forEach((item) => {
          market_price[item.symbol] = {
            lastPrice: item.lastPrice,
            bestBidNumber: item.bestBidNumber,
            bestAskNumber: item.bestAskNumber,
          }
        });
      }
      // console.log("update markets file\n");
    });

    let balances = await restapiTrade.getBalances();
    await writeFileContent(project_path+"/"+project_name+"/myWallet.json", JSON.stringify(balances)).then(() => {  
      for(let j = 0; j < balances.length; j++){
        myWallet[balances[j].asset] = balances[j]
      }
    });

  })();

  //Delay run...
  setTimeout(()=>{
    usdt_wallet = (myWallet['USDT']) ? parseFloat(myWallet['USDT'].available) : 0 ;
    if(parseFloat(myWallet['USDT'])) console.log(parseFloat(myWallet['USDT'].available)+' USD.');

    if(myWallet['USDT'] === undefined ){
      console.log('Begin = +'+minute+' minutes')
      // return;
    }else if(usdt_wallet > usdt_active){
      runs();
      minute = minutes
      console.log('delay time (minute) = +'+minute)
    }else{
      minute = minutes + break_minutes
      // console.log('usdt not enough!!!, delay time (minute) = +'+ minute)
      // return;
    }

    clearInterval(intervalID);
    intervalID = setInterval(startGrid, minute * 60 * 1000);
  }
  , 500); 
}

var ActionLimitOrder = (coin_symbol)=>{

  (async () => {

    // console.log('-------'+ coin_symbol +'-------');
    /**
     * read config coin
     */
    let coin_config = await readFileContent(project_path+"/"+project_name+"/" + coin_symbol + ".json", "utf8").then(buff => {  
      return JSON.parse(buff.toString());  
    });

    /**
     * read config markets && wallets
     */
    if( market_price[coin_symbol+'/USDT'] === undefined || myWallet[coin_symbol] === undefined  ){
      console.log('cannot myWallet='+myWallet[coin_symbol]+' OR markets='+market_price[coin_symbol+'/USDT']+' !!!')
      return;
    }

    /**
     * Maximum Coins
     */
    if( myWallet[coin_symbol].max_coins === undefined || myWallet[coin_symbol].max_coins === null){
      coin_config.max_coins = 10;
    }

    /**
     * read config markets && wallets
     */
    if( grid_amount <= coin_config.gridBuy.length ){
      console.log(coin_symbol+': GRID Buy is full GRID. ')
      return;
    }
    
    /**
     * check grid_profit
     */
    let profit = coin_config.profit
    if(grid_profit){
      profit = 1+(grid_profit/100) // ex. 1.05
    }

    /**
     * Update GRID
     */
    if(parseFloat(coin_config.min_price) * (1-(grid_profit/100)) >= parseFloat(market_price[coin_symbol+'/USDT'].lastPrice)){ // less than // - (parseFloat(coin_config.min_price)*(1-profit)) 
      console.log('------- Check GRID : '+coin_symbol+' It\'s very Low Price YEAH! YEAH! YEAH! -------'+(parseFloat(market_price[coin_symbol+'/USDT'].lastPrice)));
      coin_config.gridBuy = []
      coin_config.min_price = Math.floor(parseFloat(coin_config.min_price) * (1-(grid_profit/2/100)) * coin_config.pad_diff) / coin_config.pad_diff
      coin_config.max_price = Math.floor(parseFloat(coin_config.max_price) * (1-(grid_profit/2/100)) * coin_config.pad_diff) / coin_config.pad_diff
      await writeFileContent(project_path+"/"+project_name+"/" + coin_symbol + ".json", JSON.stringify(coin_config));
      return;
    }else 
    if(parseFloat(coin_config.max_price) * (1+(grid_profit/100)) <= parseFloat(market_price[coin_symbol+'/USDT'].lastPrice)){ // more than profit price
      console.log('------- Check GRID : '+coin_symbol+' It\'s very High Price YEAH! YEAH! YEAH! -------'+(parseFloat(market_price[coin_symbol+'/USDT'].lastPrice)));
      coin_config.gridBuy = []
      coin_config.min_price = Math.floor(parseFloat(coin_config.min_price) * (1+(grid_profit/2/100)) * coin_config.pad_diff) / coin_config.pad_diff
      coin_config.max_price = Math.floor(parseFloat(coin_config.max_price) * (1+(grid_profit/2/100)) * coin_config.pad_diff) / coin_config.pad_diff
      await writeFileContent(project_path+"/"+project_name+"/" + coin_symbol + ".json", JSON.stringify(coin_config));
      return;
    }

    /**
     * Clean Grid Over SELL remove once.
     */
    for (let j = 0; j < coin_config.gridSell.length; j++){
      if(coin_config.gridSell[j] < parseFloat(market_price[coin_symbol+'/USDT'].lastPrice)){
        console.log(coin_symbol+' delete gridSell = '+ coin_config.gridSell[j])
        coin_config.gridSell.splice(j, 1)
        // update grid buy/sell
        await writeFileContent(project_path+"/"+project_name+"/" + coin_symbol + ".json", JSON.stringify(coin_config));
        break;
      }
    }
    for (let j = 0; j < coin_config.gridBuy.length; j++){
      if(coin_config.gridBuy[j] * profit < parseFloat(market_price[coin_symbol+'/USDT'].lastPrice)){
        console.log(coin_symbol+' delete gridBuy = '+ coin_config.gridBuy[j])
        coin_config.gridBuy.splice(j, 1)
        // update grid buy/sell
        await writeFileContent(project_path+"/"+project_name+"/" + coin_symbol + ".json", JSON.stringify(coin_config));
        break;
      }
    }
    
    /**
     * check balances
     */
    usdt_wallet = parseFloat(myWallet['USDT'].available);
    if ( usdt_wallet <= usdt_active || parseFloat(myWallet[coin_symbol].available) < parseFloat(coin_config.available)) {
      console.log(coin_symbol+': coin available OR usdt_wallet not enough!!!')
      return;
    }

    /**
     *  Inner Grids
     */
    if (parseFloat(coin_config.max_price) < market_price[coin_symbol+'/USDT'].lastPrice
      || parseFloat(coin_config.min_price) > market_price[coin_symbol+'/USDT'].lastPrice
    ) {
      console.log(coin_symbol+': Out of the GRID = '+coin_config.min_price+'<==>'+ coin_config.max_price)
      return;
    }

    /**
     * Check Passed
     */

    // let  bestBidNumber = Math.floor(market_price[coin_symbol+'/USDT'].bestBidNumber * coin_config.pad_diff) // บางตัวไม่มีข้อมูล
    let lastPrice = Math.floor(parseFloat(market_price[coin_symbol+'/USDT'].lastPrice) * coin_config.pad_diff)
    let step = Math.floor(coin_config.step_price * coin_config.pad_diff)
    let limit = coin_config.limit
    let diff =  lastPrice  %  step 
    let grid = lastPrice - diff;
    let grid_price = grid / coin_config.pad_diff; // DB
    let grid_buy = grid / coin_config.pad_diff // Open Buy Limit Order
    let grid_forward = (grid - step) / coin_config.pad_diff // Open Buy Limit Order
    let grid_next = (grid + step) / coin_config.pad_diff // Open Buy Limit Order
    // let grid_buy = ( diff >= 3 ) ? (grid / coin_config.pad_diff) : ((lastPrice-1) / coin_config.pad_diff)
    // let grid_sell =  Math.floor(grid * profit) / coin_config.pad_diff ; // Open Sell Limit Order
    
    /**
     *  LOGIC build Grid 
     */
    if (diff == 0 || (diff / step) * 100 <= grid_near ) { // % of grid  // || (diff / step) * 100 >= (100-grid_near)

      let found0 = coin_config.gridBuy.find((value) => value == grid_buy);
      if (found0 === undefined) {
        coin_config.gridBuy.push(grid_buy);
        if(grid_limit_ref_cost > 0 && coin_config.auto !== false){
        /**
         * amount use config on coin or app
         */
          limit = Math.floor((grid_limit_ref_cost / grid_buy) * coin_config.pad_diff) / coin_config.pad_diff    
          // console.log(coin_symbol+'=='+limit);
        }

        /**
         * BUY ทันที
         */
        let newBuyOrder = await restapiTrade.createMarketOrder(coin_config.coin_market, 'buy', limit);
        /**
         * BUY Set Price
         */
        // let newBuyOrder = await restapiTrade.createLimitOrder(coin_config.coin_market, 'buy', limit, grid_buy);
        if(newBuyOrder.isActive === true){
          /**
           * SELL ทันที
           */
          let target_limit = (limit - (Math.floor((limit*coin_config.pad_diff)*keep_coin) / coin_config.pad_diff))
          let target_price = Math.floor((parseFloat(newBuyOrder.price)*coin_config.pad_diff)*profit) / coin_config.pad_diff
          console.log('%c cost='+(Math.floor(grid_price*coin_config.pad_diff*limit)/coin_config.pad_diff)+'USDT, coin='+coin_symbol+', grid_buy='+grid_buy + ', target_limit='+target_limit +"target_price ="+target_price+" \n",  "color: red;")
          // console.log(newBuyOrder)
          if(myWallet[coin_symbol].available >= target_limit){
            let newSellOrder = await restapiTrade.createLimitOrder(coin_config.coin_market, 'sell', target_limit, target_price);
            // let newSellOrder = await restapiTrade.createLimitOrder(coin_config.coin_market, 'sell', target_limit, target_price);
            // console.log(newSellOrder)
            coin_config.gridSell.push(target_price);

          }
          coin_config.total = parseFloat(newBuyOrder.quantity) + coin_config.total;

          if(coin_config.average_price == 0){
            coin_config.average_price = parseFloat(newBuyOrder.remainTotalWithFee) / parseFloat(newBuyOrder.quantity);
          }else{
            coin_config.average_price = ((parseFloat(newBuyOrder.remainTotalWithFee) / parseFloat(newBuyOrder.quantity)) + coin_config.average_price) / 2;
          }
          // save to storage
          console.log(coin_symbol+': Save GRID is successful \n')
          fs.writeFileSync( project_path+"/"+project_name+"/" + coin_symbol + ".json", JSON.stringify(coin_config) );

        }

      } // end found

      // let foundForward = coin_config.gridBuy.find((value) => value == grid_forward);
      // if (foundForward === undefined) {
      //   coin_config.gridBuy.push(grid_forward);
      //   /**
      //    * BUY ทันที
      //    */
      //   let newBuyOrder = await restapiTrade.createLimitOrder(coin_config.coin_market, 'buy', limit, grid_forward);
      //   if(newBuyOrder.isActive === true){
      //     console.log('%c cost='+(Math.floor(grid_next*coin_config.pad_diff*limit)/coin_config.pad_diff)+'USDT, coin='+coin_symbol+', grid_next='+grid_next + ', limit='+limit +" \n",  "color: red;")
      //     // console.log(newBuyOrder)
      //     // Math.floor(grid * profit) / coin_config.pad_diff

      //     /**
      //      * SELL ทันที
      //      */
      //     let sell_limit = (limit - (Math.floor((limit*10000)*keep_coin) / 10000))
      //     if(myWallet[coin_symbol].available > sell_limit){
      //       let newSellOrder = await restapiTrade.createLimitOrder(coin_config.coin_market, 'sell', sell_limit, grid_next*profit);
      //       // console.log(newSellOrder)
      //       coin_config.gridSell.push(grid_next*profit);

      //     }
      //     coin_config.total = parseFloat(newBuyOrder.quantity) + coin_config.total;

      //     if(coin_config.average_price == 0){
      //       coin_config.average_price = parseFloat(newBuyOrder.remainTotalWithFee) / parseFloat(newBuyOrder.quantity);
      //     }else{
      //       coin_config.average_price = ((parseFloat(newBuyOrder.remainTotalWithFee) / parseFloat(newBuyOrder.quantity)) + coin_config.average_price) / 2;
      //     }
      //     // save to storage
      //     console.log(coin_symbol+': Save GRID is successful \n')
      //     fs.writeFileSync( project_path+"/"+project_name+"/" + coin_symbol + ".json", JSON.stringify(coin_config) );

      //   }

      // } // end found

    } // end diff


    // console.log('------- END '+ coin_symbol +'-------');

  })();

}

/**
 * update Markets
 */
var minute = minutes
intervalID = setInterval(startGrid, minute * 60 * 1000); //Interval