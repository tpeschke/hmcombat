import React, { Component } from 'react'
import axios from 'axios'
import io from 'socket.io-client'

import { connect } from 'react-redux'

import socketFun from './SocketApi'
import './playerview.css'

// import getBattle from '../playerview/SocketApi'

const socket = io(process.env.PORT)

export default class PlayerView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            count: 'none yet',
            combatName: "Battleplaceholder",
            statusList: [],
            fighterList: [],
            view: false
        }
    }

    componentDidMount() {
        this.socket = io('/')
        this.socket.on(`${this.props.match.params.battle}`, data => {
            console.log(data)
            this.updateDisplay(data)
        })
    }

    updateDisplay = (data) => {
        this.setState({ count: data.count, view: data.playerview })
    }

    render() {

        return (
            <div className="playerBody">
                <h1>Player view</h1>
                <p>{this.state.combatName}</p>
                <p>{this.state.count}</p>
                {this.state.view}
            </div>
        )
    }
}
