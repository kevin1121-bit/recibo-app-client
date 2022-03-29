import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createContext, useContext } from "react";
import { useAuth, IAuth } from "../Context/authContext";

const ApolloContext = createContext<any>(null);

export function useApollo() {
  return useContext(ApolloContext);
}

export default function ContextApollo(props: any) {
  const auth: IAuth | null = useAuth();

  const token = auth?.authState.token;

  const client = new ApolloClient({
    uri: "http://localhost:8080/graphql",
    cache: new InMemoryCache(),
    headers: { authorization: token ? token : "" },
  });

  return (
    <ApolloContext.Provider value={client}>
      <ApolloProvider client={client}>{props.children}</ApolloProvider>
    </ApolloContext.Provider>
  );
}
