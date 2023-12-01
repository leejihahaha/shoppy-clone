import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthContextProvider } from "./context/AuthContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

//new 키워드를 사용하여 객체를 생성할 때 객체를 초기화하고 설정하는 데 사용
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Navbar />
        <Outlet />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
