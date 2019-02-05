import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import About from './pages/About'
import Details from './pages/Details'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Publish from './pages/Publish'
import Search from './pages/Search'

const Routes = () => (
    <Router>
        <Switch>
            <Route exact component={Home} path="/" />
            <Route component={About} path="/about" />
            <Route component={Publish} path="/publish" />
            <Route component={Search} path="/search" />
            <Route component={Details} path="/asset/:did" />
            <Route component={NotFound} />
        </Switch>
    </Router>
)

export default Routes