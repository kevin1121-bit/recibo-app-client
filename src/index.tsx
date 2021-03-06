import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ApolloProvider from "./apolloProvider/apolloProvider";
import ProvicerAuth from "./Context/authContext";
import { Provider } from "react-redux";
import { store } from "./Redux/store";

ReactDOM.render(
  <Provider store={store}>
    <ProvicerAuth>
      <ApolloProvider>
        <App />
      </ApolloProvider>
    </ProvicerAuth>
  </Provider>,
  document.getElementById("root")
);
