//build the server
import 'babel-polyfill'
const express = require('express')
const app = express()
const http = require('http').Server(app)
const path = require('path')
const proxy = require('express-http-proxy')
//for SSR
import staticPath from '../build/asset-manifest.json'
import { renderToString } from 'react-dom/server'
import csshook from 'css-modules-require-hook/preset' 
import assethook from 'asset-require-hook'
assethook({
  extensions: ['png'],
  name: '[hash].[ext]',
  publicPath: '/'
})

import React from 'react'
import { applyMiddleware, compose } from 'redux'
import { StaticRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import App from '../src/App.js'
//for loader icon
import '../src/config'
import { LoaderCon } from '../src/loader'
//import store for server side render

import myCreateStore from './renderer/renderer_store'
import serialize from 'serialize-javascript';
//import some action creators
import {updateSuccess} from '../src/redux/userlist.redux'
import {updateUserInfo} from '../src/redux/register.redux'
import {recvList} from '../src/redux/chat.redux'
import axios from 'axios'

//body parser and cookie parser for post
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')

//build app

//use the middleware to process data
app.use(cookieparser())
app.use(bodyparser.json())
//run nodemon server/server.js server static files
app.use('/pics/',express.static(path.resolve('pics')))
app.use('/cv/', express.static(path.resolve('CV')))



//proxy to api server
app.use(
    '/api',
    proxy('http://localhost:3030/')
)

const renderContent = (store, req, context) => {
    console.log(store.getState())
    const markup = renderToString(
        <Provider store={store}>
            <div className="container">

                <StaticRouter
                    location={req.url}
                    context={context}
                >
                    
                    <App />
                    

                </StaticRouter>
                <LoaderCon />
            </div>
            
        </Provider>
    )
    console.log(markup)
    const htmlPage = `<!DOCTYPE html>
                        <html lang="en">
                          <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                            <meta name="theme-color" content="#000000">

                            <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
                            <link rel="shortcut icon" href="/favicon.ico">
                            <link rel="stylesheet" href="/${staticPath['main.css']}">
                            <title>React App</title>
                          </head>
                          <body>
                            
                            <div id="root" style="height:100%">${markup}</div>
                            <script>
                                      window.INITIAL_STATE = ${serialize(store.getState())}
                            </script>
                            <script src="/${staticPath['main.js']}"></script>
                          </body>
                        </html>`
    return htmlPage
}

app.use(function(req, res, next){
    if(req.url.startsWith('/api/')||req.url.startsWith('/favicon.ico')||req.url.startsWith('/static/')||req.url.startsWith('/pics/')||req.url.startsWith('/cv/')||req.url.startsWith('/debug/')){
        return next()
    }else{
        let context = {}
        //seperately create a store for server side rendering , get cookies form req
        const store = myCreateStore(req)
        //fetch data from api as much as possible
        const request = axios.post('http://localhost:3030/user/renderer', {
            data: req.cookies
        })
        request.then(resAxios => {
            if(resAxios.status === 200 && resAxios.data.code === 0){
                if(resAxios.data.data){
                    const result = resAxios.data.data
                    console.log(result)
                    store.dispatch(recvList(result.chatInfo, result.userInfo._id))
                    store.dispatch(updateSuccess(result.usrListInfo))
                    store.dispatch(updateUserInfo(result.userInfo))
                }   
            }else{
                console.log('fetch data before rendering failed 1')
                console.log(resAxios)
            }
            const content = renderContent(store, req, context)
            //for <Redirect />   not necessary because <AuthRoute /> use this.props.history.push
            // if(context.url){
            //     return res.redirect(301, context.url)
            // }
            res.send(content)

        }, err => {
            console.log('fetch data before rendering failed 2')
            res.send(renderContent(store, req, context))
        })
        
        
    }

})
app.use('/', express.static(path.resolve('build')))


const PORT = 4000
http.listen(PORT, function(){
    console.log(`Renderer & Proxy server is running at PORT ${PORT}`)
})