import type { RouteObject } from "react-router"
import App from './App.tsx'
// import Root from "./pages/Root"
// import ProductView from "./pages/ProductView"
// import AboutView from "./pages/AboutView"


const routerConfig: RouteObject[] = [
  {
    path: '/',
    Component: App,
    // children: [
    //   {
    //     path: '/',
    //     Component: ProductView
    //   },
    //   {
    //     path: '/about',
    //     Component: AboutView
    //   }
    // ]
  }
]


export { routerConfig }