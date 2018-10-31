import React, { Component } from 'react';
import { connect } from 'react-redux';

import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';

import { SketchPicker } from 'react-color';
import socketFun from '../../playerview/SocketApi'

import { ADDNEWCOMBATANT } from '../../ducks/CompReducers/CombatantsReducer'
import AddWeapon from './AddWeapon'
import makeid from '../../components/makeid'

class AddNewFighter extends Component {
    constructor() {
        super()

        this.state = {
            open: false,
            color: '#fff',
            name: '',
            weapons: [{id: 1, weapon: 'Unarmed', speed: 10, selected: '1'}],
            action: null,
            weapon: false
        }

    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

//==========================================

    handleChange = (color, event) => {
        this.setState({ color: color.hex });
    }

    handleName = (name) => {
        this.setState({ name: name })
    }

    handleAction = (action) => {
        var totalAction = +this.props.count + +action - 1
        this.setState({ action: totalAction })
    }

// ============================ \\

    addWeapon = (weapon) => {
        let weaponArray = this.state.weapons.slice()
        weaponArray.push({...weapon, id: makeid()})
        this.setState({weapons: weaponArray})
    }

    editWeapon = (weapon) => {
        let weaponArray = this.state.weapons.slice()
        weaponArray.forEach((v, i) => {
            if (v.id == weapon.id) {
                let selected = v.selected
                weaponArray.splice(i, 1, {...weapon, selected})
            }
        })
        this.setState({weapons: weaponArray})
    }

    selectWeapon = (wid) => {
        let weaponsArray = this.state.weapons.map(val => {
            if (val.id == wid) {
                val.selected = '1'
            } else {
                val.selected = '0'
            }
            return val
        })
        this.setState({weapons: weaponsArray})
    }

    deleteWeapon = (wid) => {
        let weaponsArray = this.state.weapons.slice()
        if (wid !== 1) { weaponsArray = this.state.weapons.filter(val => val.id != wid) }
        this.setState({weapons: weaponsArray})
    }

    doneWithWeapon = () => {
        this.setState({weapon: false})
    }

// ============================ \\

    handleSubmit = (c, n, w, a, id) => {
        if (n !== '') {
            var newId = makeid()
    
            var newFighter = {
                id: newId,
                namefighter: n,
                colorcode: c,
                weapons: w,
                actioncount: a,
                topcheck: '0',
                acting: '0',
                dead: '0',
                idcombat: id
            }
    
            this.props.ADDNEWCOMBATANT(newFighter)
            socketFun.playerAdd({ hash: this.props.hash, fighter: newFighter })
            this.onCloseModal()
    
            this.forceUpdate()
        } else {
            this.onCloseModal()
        }
    }

    render() {

        const { open, color, name, weapons, action } = this.state;
        const { combatId } = this.props

        let show = () => {
            if (!this.state.weapon) {
                return (
                    <div className="inModalNew">
                        <div className="modalLeft">
                            <SketchPicker
                                color={this.state.color}
                                onChange={this.handleChange} />
                        </div>
                        <div className="modalRight">

                            <h1 id="newCombat">Add New Combatant</h1>

                            <div className="border modalBorder"></div>
                            <input placeholder="Name" id="modalEditInput" value={this.state.name}
                                onChange={e => this.handleName(e.target.value)} />

                            <button className="newFighterButton"
                                onClick={_ => this.setState({weapon: true})}
                                >Add Weapons</button>

                            <input placeholder="Initiative" className="inputFinder" id="modalEditInput" type='number' placeholder={this.state.action}
                                onChange={e => this.handleAction(+e.target.value)} />

                            <button id="modalAddButton"
                                onClick={_ => this.handleSubmit(color, name, weapons, action, combatId)}>SUBMIT</button>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div>
                        <AddWeapon 
                            weapons={this.state.weapons}
                            addWeapon={this.addWeapon}
                            selectWeapon={this.selectWeapon}
                            deleteWeapon={this.deleteWeapon}
                            editWeapon={this.editWeapon}
                            doneWithWeapon={this.doneWithWeapon}/>
                    </div>
                )
            }
        }

        return (
            <div>
                <button
                    className="workshopButton"
                    onClick={this.onOpenModal}>Add New Combatant</button>

                <Modal open={open} onClose={this.onCloseModal} little
                    classNames={{ modal: 'modalBaseToP' }}>>
                <div className="outModalNew">
                        <div className="modalBannerNew"></div >

                            {show()}

                    </div>
                </Modal>
            </div>
        )
    }

}

function mapStateToProps(state) {
    var { count, combatId, hash } = state

    return {
        count,
        combatId,
        hash
    }
}

export default connect(mapStateToProps, { ADDNEWCOMBATANT })(AddNewFighter)