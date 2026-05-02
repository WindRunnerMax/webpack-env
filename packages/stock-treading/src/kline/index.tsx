import "./styles/index.less";
import "@arco-design/web-react/es/style/index.less";
import "./styles/index.less";

import ReactDOM from "react-dom";

import { Chart } from "./components/chart";

const App = () => {
  return <Chart />;
};

ReactDOM.render(<App />, document.getElementById("root"));
