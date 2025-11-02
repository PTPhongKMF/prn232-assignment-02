import { Route, Router } from "@solidjs/router";
import Layout from "./pages/Layout.tsx";
import News from "./pages/News.tsx";
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile.tsx";
import Account from "./pages/Account.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import Statistic from "./pages/Statistic.tsx";
import Category from "./pages/Category.tsx";
import Tag from "./pages/Tag.tsx";

function App() {
  return (
    <Router root={Layout}>
      <Route path="/" component={News} />
      <Route path="/login" component={Login} />
      <Route path="/profile" component={Profile} />

      <Route
        component={(props) => ProtectedRoutes({ allowedRoles: [3], ...props })}
      >
        <Route path="/accounts" component={Account} />
        <Route path="/statistic" component={Statistic} />
      </Route>

      <Route
        component={(props) => ProtectedRoutes({ allowedRoles: [1], ...props })}
      >
        <Route path="/categories" component={Category} />
        <Route path="/tags" component={Tag} />
      </Route>
    </Router>
  );
}

export default App;
