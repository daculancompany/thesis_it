import "antd-css-utilities/utility.min.css";
import { ConfigProvider, Empty } from "antd";
import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
//import "../css/app.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./assets/scss/app.scss";
// import "./assets/styles/main.css";
// import "./assets/styles/responsive.css";
import NoLayout from "./components/NoLayout";
import Pages404 from "./pages/ErrorPages/Pages404";
import {
    adminRoutes,
    authRoutes,
    noLayoutRoutes,
    facultyRoutes,
    studentRoutes,
} from "./routes";

const NonAuthmiddleware = ({ component: Component, layout: Layout }) => (
    <Route
        exact
        render={(props) => {
            return (
                <Layout>
                    <Component {...props} />
                </Layout>
            );
        }}
    />
);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnmount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: 5 * 60 * 1000,
        },
    },
});

function Main() {
    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#f9b317",
                    },
                }}
                renderEmpty={() => <Empty description="No Data"/>}
            >
                <Router>
                    <Switch>
                        {authRoutes.map((route, idx) => (
                            <NonAuthmiddleware
                                path={route.path}
                                layout={NoLayout}
                                component={route.component}
                                key={idx}
                                exact
                            />
                        ))}
                        {adminRoutes.map((route, idx) => (
                            <NonAuthmiddleware
                                path={route.path}
                                layout={NoLayout}
                                component={route.component}
                                key={idx}
                                exact
                            />
                        ))}
                        {facultyRoutes.map((route, idx) => (
                            <NonAuthmiddleware
                                path={route.path}
                                layout={NoLayout}
                                component={route.component}
                                key={idx}
                                exact
                            />
                        ))}
                        {studentRoutes.map((route, idx) => (
                            <NonAuthmiddleware
                                path={route.path}
                                layout={NoLayout}
                                component={route.component}
                                key={idx}
                                exact
                            />
                        ))}

                        {noLayoutRoutes.map((route, idx) => (
                            <NonAuthmiddleware
                                path={route.path}
                                layout={NoLayout}
                                component={route.component}
                                key={idx}
                                exact
                            />
                        ))}
                        <Route component={Pages404} />
                    </Switch>
                </Router>
            </ConfigProvider>
        </QueryClientProvider>
    );
}

export default Main;

if (document.getElementById("app")) {
    ReactDOM.render(<Main />, document.getElementById("app"));
}
