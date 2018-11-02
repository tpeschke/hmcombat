import React, { Component } from 'react';
import FlipMove from 'react-flip-move';
import socketFun from '../../playerview/SocketApi'

import ActEditFighter from './ActingOnDeckComponents/ActEditFighter'
import ActToP from './ActingOnDeckComponents/ActThresholdOfPain'
import ActWeapon from './ActingOnDeckComponents/ActWeapon'
import HiddenEye from './ActingOnDeckComponents/HiddenEye'

export default class Acting extends Component {
    constructor(props) {
        super(props)

        this.state = {
            list: [],
            count: props.count,
            hold: '',

            holdcolor: '',
            holdname: '',
            holdspeed: 0,
            holdid: 0,
            holdweapons: [],
        }
    }

    componentWillReceiveProps(next) {
        this.setState({ list: next.list })
    }

    modifyFighter = (d) => {
        this.setState({
            holdcolor: d.colorcode,
            holdname: d.namefighter,
            holdspeed: d.speed,
            holdid: d.id
        }, _ => this.props.modal2())
    }

    chooseWeapon = (id, weapons) => {
        this.setState({ holdid: id, holdweapons: weapons })
        this.props.weaponModal2()
    }

    handleTop = (id) => {
        this.setState({ holdid: id })
        this.props.top2()
    }

    handleDeath = (id) => {
        this.props.kill(id)
        socketFun.playerKill({ id: id, hash: this.props.hash })
    }

    handleHide = (id) => {
        socketFun.playerHide({ id: id, hash: this.props.hash })
    }

    render() {

        if (this.state.list) {

            var actingList = this.state.list.map((d, i) => {

                if (d.acting === '1' && d.dead === '0') {

                    let color = { background: d.colorcode }

                    let speed = +d.weapons.filter(val => val.selected == 1)[0].speed

                    let action = (<div className="actionLocked">
                        <div className="ListItem">
                            {speed}
                        </div>

                        <button className="ListItem actionDice"
                            onClick={_ => this.props.rollInit(d.id, d.actioncount[0], d.actioncount[1])}
                        >1d{d.actioncount[0]}+{d.actioncount[1]}</button>
                    </div>)

                    if (!isNaN(d.actioncount)) {
                        action = (<div>
                            <button className="ListItem"
                                onClick={_ => this.props.advance(d.id, speed)}
                            >{speed}</button>

                            <input className="ListItem inputFinder"
                                value={d.actioncount}
                                onChange={e => this.props.action(d.id, +e.target.value, true)}
                                onBlur={e => this.props.action(d.id, +e.target.value, false)} />
                        </div>)
                    }

                    return <div
                        className={d.hidden === '1' ? 'List hidden' : d.topcheck === '1' ? 'List top' : 'List'}
                        key={d.id}>

                        <HiddenEye 
                            on={d.hidden}
                            hide={this.props.hide}
                            id={d.id}
                            toggleHide={this.handleHide}/>

                        <div className="color" style={color}></div>

                        <p className="ListItem Name">{d.namefighter}</p>

                        <div className="ListItem"
                            onClick={_ => this.chooseWeapon(d.id, d.weapons)}>
                            <div class="arrow right"></div>
                        </div>

                        {action}

                        <button className="ListItem"
                            onClick={_ => this.handleTop(d.id)}
                        >(ง'̀-'́)ง</button>

                        <button className="ListItem"
                            onClick={_ => this.handleDeath(d.id)}
                        >X</button>

                        <button className="ListItem"
                            onClick={_ => this.modifyFighter(d)}
                        >---</button>

                    </div>
                }
            })
        }

        return (
            <div className="Main">
                <p>Acting</p>
                <div className="border sectionborder"></div>
                <div className="Header" id="sectionHeader">
                    <p className="ListItem Name NameHeader listHeader">Name</p>
                    <p className="ListItem listHeader">Speed</p>
                    <p className="ListItem listHeader">Action</p>
                    <p className="ListItem listHeader">ToP</p>
                    <p className="ListItem listHeader">Kill</p>
                    <p className="ListItem listHeader">Edit</p>
                </div>
                <div className="border"></div>

                <FlipMove duration={750} easing="ease-out">
                    {actingList}
                </FlipMove>

                <div className="border"></div>

                <ActEditFighter
                    color={this.state.holdcolor}
                    name={this.state.holdname}
                    speed={this.state.holdspeed}
                    id={this.state.holdid} />

                <ActWeapon
                    weapons={this.state.holdweapons}
                    id={this.state.holdid} />

                <ActToP
                    id={this.state.holdid}
                    hash={this.props.hash} />
            </div>
        )
    }
}