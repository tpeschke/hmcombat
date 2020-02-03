import React, { Component } from 'react'
import FlipMove from 'react-flip-move'
import socketFun from '../../playerview/SocketApi'

import DeckEditFighter from './ActingOnDeckComponents/DeckEditFighter'
import DeckToP from './ActingOnDeckComponents/DeckThresholdOfPain'
import DeckWeapon from './ActingOnDeckComponents/DeckWeapon'
import HiddenEye from './ActingOnDeckComponents/HiddenEye'
import WeaponSquare from './ActingOnDeckComponents/weaponSquare'
import { checkNum } from '../../components/validation'

export default class OnDeck extends Component {
    constructor(props) {
        super(props)

        this.state = {
            list: [],
            count: props.count,

            holdcolor: '',
            holdname: '',
            holdspeed: 0,
            holdid: 0,
            holdweapons: [],

            topId: 0
        }
    }

    componentWillReceiveProps(next) {
        this.setState({ list: next.list })
    }

    modifyFighter = (d) => {
        this.setState({
            holdcolor: d.colorcode,
            holdname: d.namefighter,
            holdid: d.id,
            holdmax_health: d.max_health,
            holdencumbrance: d.encumbrance
        })
        this.props.modal()
    }

    chooseWeapon = (id, weapons) => {
        this.setState({ holdid: id, holdweapons: weapons })
        this.props.weaponModal()
    }

    handleTop = (id) => {
        this.setState({ topId: id })
        this.props.top()
    }

    handleDeath = (id) => {
        this.props.kill(id)
        socketFun.playerKill({ id: id, hash: this.props.hash })
    }

    handleHide = (id) => {
        socketFun.playerHide({ id: id, hash: this.props.hash })
    }

    render() {
        let { theme } = this.props

        if (this.state.list) {

            var deckList = this.state.list.map((d, i) => {
                if (d.acting === '0' && d.dead === '0') {
                    let color = { background: d.colorcode }
                    let healthFatigueModifier = (
                        <div className="fatigue-shell">
                            <div className="fatigue">
                                <input className={`${theme}-input inputFinder`}
                                    value={d.stress}
                                    onChange={e => this.props.fatigue(d.id, +e.target.value, true)}
                                    onBlur={e => this.props.fatigue(d.id, +e.target.value, false)} />
                            </div>
                        </div>)
                    let healthPercent = d.health / d.max_health
                    let woundCategory = 1;

                    //Tired
                    if (healthPercent > .01 && healthPercent < .25) {
                        woundCategory = 2;
                        healthFatigueModifier = (
                            <div className="fatigue-shell">
                                <div className="fatigue">
                                    <input className={`${theme}-input inputFinder`}
                                        value={d.stress}
                                        onChange={e => this.props.fatigue(d.id, +e.target.value, true)}
                                        onBlur={e => this.props.fatigue(d.id, +e.target.value, false)} />
                                    <p>+{d.encumbrance}</p>
                                </div>
                            </div>)
                        //Hurt
                    } else if (healthPercent >= .25 && healthPercent < .5) {
                        woundCategory = 3;
                        healthFatigueModifier = (
                            <div className="fatigue-shell">
                                <div className="fatigue">
                                    <input className={`${theme}-input inputFinder`}
                                        value={d.stress}
                                        onChange={e => this.props.fatigue(d.id, +e.target.value, true)}
                                        onBlur={e => this.props.fatigue(d.id, +e.target.value, false)} />
                                    <p>+{d.encumbrance * 2}</p>
                                </div>
                            </div>)
                        //Bloodied
                    } else if (healthPercent >= .5 && healthPercent < .75) {
                        woundCategory = 4;
                        healthFatigueModifier = (
                            <div className="fatigue-shell">
                                <div className="fatigue">
                                    <input className={`${theme}-input inputFinder`}
                                        value={d.stress}
                                        onChange={e => this.props.fatigue(d.id, +e.target.value, true)}
                                        onBlur={e => this.props.fatigue(d.id, +e.target.value, false)} />
                                    <p>+{d.encumbrance * 3}</p>
                                </div>
                            </div>)
                        //Wounded
                    } else if (healthPercent >= .75 && healthPercent < 1) {
                        woundCategory = 5;
                        healthFatigueModifier = (
                            <div className="fatigue-shell">
                                <div className="fatigue">
                                    <input className={`${theme}-input inputFinder`}
                                        value={d.stress}
                                        onChange={e => this.props.fatigue(d.id, +e.target.value, true)}
                                        onBlur={e => this.props.fatigue(d.id, +e.target.value, false)} />
                                    <p>+{d.encumbrance * 4}</p>
                                </div>
                            </div>)
                        //Bleeding Out
                    } else if (healthPercent >= 1) {
                        woundCategory = 6;
                        healthFatigueModifier = (
                            <div className="fatigue-shell">
                                <div className="fatigue">
                                    <input className={`${theme}-input inputFinder`}
                                        value={d.stress}
                                        onChange={e => this.props.fatigue(d.id, +e.target.value, true)}
                                        onBlur={e => this.props.fatigue(d.id, +e.target.value, false)} />
                                    <i className="fas fa-tint wounded"></i>
                                </div>
                            </div>)
                    }

                    socketFun.playerUnTop({ id: d.id, hash: this.props.hash })

                    let selected = d.weapons.filter(val => val.selected === '1')[0]

                    let action = (<div className="actionLocked">
                        <div className={`ListItem ${theme}-font`}>
                            {selected.speed}
                        </div>

                        <button className={`ListItem ${theme}-font actionDice`}
                            onClick={_ => this.props.rollInit(d.id, d.actioncount[0], d.actioncount[1])}
                        >1d{d.actioncount[0]}+{d.actioncount[1]}</button>
                    </div>)

                    if (!isNaN(d.actioncount)) {
                        action = (<div className="actionLocked">
                            <button className={`ListItem ${theme}-font`}
                                onClick={_ => this.props.advance(d.id, selected.speed)}
                            >{selected.speed}</button>

                            <input className={`ListItem ${theme}-input inputFinder`}
                                value={d.actioncount}
                                onChange={e => checkNum(e.target.value) ? this.props.action(d.id, +e.target.value, true) : null}
                                onBlur={e => checkNum(e.target.value) ? this.props.action(d.id, +e.target.value, false) : null} />
                        </div>)
                    }

                    let nameStyle = `${theme}-font`

                    if (woundCategory + Math.floor(d.stress / 10) >= d.broken && d.broken) {
                        nameStyle += " broken";
                    } else if (woundCategory + Math.floor(d.stress / 10) >= d.panic && d.panic) {
                        nameStyle += " panic";
                    }

                    return <div className={d.hidden === '1' ? 'List hidden' : 'List'}
                        key={d.id}>

                        <HiddenEye
                            on={d.hidden}
                            hide={this.props.hide}
                            id={d.id}
                            toggleHide={this.handleHide} />

                        <div className="color" style={color}></div>

                        <div className="ListItem Name">
                            <p className={nameStyle}>{d.namefighter}</p>
                        </div>

                        <div className={`ListItem ${theme}-font weaponIcon`}
                            onClick={_ => this.chooseWeapon(d.id, d.weapons)}>
                            <div className="arrow right"></div>

                            <WeaponSquare
                                atk={selected.atk}
                                def={selected.def}
                                encumb={selected.encumb}
                                damage={selected.damage}
                                parry={selected.parry}
                                measure={selected.measure}
                                shield_dr={selected.shield_dr}
                                dr={selected.dr}
                                init={selected.init}
                                spd={selected.speed}
                            ></WeaponSquare>
                        </div>

                        <input className={`ListItem ${theme}-input inputFinder`}
                            value={d.health}
                            onChange={e => this.props.health(d.id, +e.target.value, true)}
                            onBlur={e => this.props.health(d.id, +e.target.value, false)} />

                        {healthFatigueModifier}

                        {action}

                        <button className={`ListItem ${theme}-font`}
                            onClick={_ => this.handleTop(d.id)}
                        >(ง'̀-'́)ง</button>

                        <button className={`ListItem ${theme}-font`}
                            onClick={_ => this.handleDeath(d.id)}
                        ><i className="fas fa-skull-crossbones"></i></button>

                        <button className={`ListItem ${theme}-font`}
                            onClick={_ => this.modifyFighter(d)}>
                            <i className="fas fa-edit editIconMini"></i>
                        </button>

                    </div>
                }
            })
        }

        return (
            <div className="Main">
                <p>On Deck</p>
                <div className={`${this.props.theme}-border sectionborder`}></div>
                <div className={`Header ${this.props.theme}-Header`}>
                    <div className="ListItem hiddenShell"></div>
                    <div className="color" id="no-border"></div>
                    <p className={`ListItem ${theme}-font Name listHeader`}>Name</p>
                    <div className="ListItem weaponIcon"></div>
                    <p className={`ListItem ${theme}-font listHeader`}>Damage</p>
                    <p className={`ListItem ${theme}-font listHeader`}>Stress</p>
                    <p className={`ListItem ${theme}-font listHeader`}>Speed</p>
                    <p className={`ListItem ${theme}-font listHeader action`}>Action</p>
                    <p className={`ListItem ${theme}-font listHeader`}>ToP</p>
                    <p className={`ListItem ${theme}-font listHeader`}>Kill</p>
                    <p className={`ListItem ${theme}-font listHeader`}>Edit</p>
                </div>
                <div className={`${this.props.theme}-border`}></div>

                <FlipMove>
                    {deckList}
                </FlipMove>

                <DeckEditFighter
                    color={this.state.holdcolor}
                    name={this.state.holdname}
                    id={this.state.holdid}
                    max_health={this.state.holdmax_health}
                    encumbrance={this.state.holdencumbrance} />

                <DeckWeapon
                    weapons={this.state.holdweapons}
                    id={this.state.holdid} />

                <DeckToP
                    id={this.state.topId}
                    hash={this.props.hash} />
            </div>
        )
    }
}