import ReactDOM from "react-dom";

// https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=CSIH30269&begin=1775313306853&period=day&type=before&count=-284&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance
// https://www.csindex.com.cn/csindex-home/perf/index-perf?indexCode=H20169&startDate=20260304&endDate=20260403

fetch("https://www.baidu.com").then(res => {
  res.text().then(text => {
    console.log(text);
  });
});

ReactDOM.render(<div>background</div>, document.getElementById("root"));
