import React, { Component } from 'react';

import { connect } from 'react-redux';

import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';
import { checkStr, checkNum } from '../../../components/validation'

import { SketchPicker } from 'react-color';

import socketFun from '../../../playerview/SocketApi'
import { OPENMODAL } from '../../../ducks/reducer'
import { EDITFIGHTER } from '../../../ducks/CompReducers/CombatantsReducer'

class DeckEditFighter extends Component {
    constructor() {
        super()

        this.state = {
            color: '',
            name: '',
            max_health: 0,
            encumbrance: 0,
            id: 0
        }

    }

    componentWillReceiveProps(next) {
        this.setState({
            color: next.color,
            name: next.name,
            id: next.id,
            max_health: next.max_health ? next.max_health : 10,
            encumbrance: next.encumbrance
        })
    }

    handleChange = (color) => {
        this.setState({ color: color.hex });
    }

    handleSubmit = () => {
        var editedFighter = {
            id: this.state.id,
            namefighter: this.state.name,
            colorcode: this.state.color,
            max_health: this.state.max_health,
            encumbrance: this.state.encumbrance
        }

        this.props.EDITFIGHTER(editedFighter);
        socketFun.playerEdit({ fighter: editedFighter, hash: this.props.hash });
        this.props.OPENMODAL();

        this.forceUpdate()

    }

    render() {

        const { color, name, max_health, encumbrance } = this.state;
        const { editopen, theme } = this.props

        return (
            <div>

                <Modal open={editopen} onClose={this.props.OPENMODAL} little
                    classNames={{ modal: 'modalBaseToP' }}
                    showCloseIcon={false}>
                    <div className={`outModalNew ${theme}-outModalNew`}>
                        <div className={`${theme}-modalBannerEdit`}></div>

                        <div className="inModalNew">

                            <div className="modalLeft">
                                <SketchPicker
                                    color={color}
                                    onChange={this.handleChange} />
                            </div>
                            <div className="modalRight">

                                <h1 className={`${theme}-secFont ${theme}-secColor`} id="newCombat">Edit Combatant</h1>

                                <div className={`${theme}-border modalBorder border-non-centered`}></div>

                                <div className="modalEditInputs">
                                    <p>Name</p>
                                    <input placeholder={name} className={`modalEditInput ${theme}-inputSpecial`} id="modalEditInput"
                                        value={name}
                                        onChange={e => checkStr(e.target.value) ? this.setState({ name: e.target.value }) : null} />

                                    <p>Max Vitality</p>
                                    <input placeholder={max_health} className={`modalEditInput ${theme}-inputSpecial`} id="modalEditInput"
                                        value={max_health}
                                        onChange={e => checkNum(+e.target.value) ? this.setState({ max_health: e.target.value }) : null} />

                                    <p>Encumbrance</p>
                                    <input placeholder={encumbrance} className={`modalEditInput ${theme}-inputSpecial`} id="modalEditInput"
                                        value={encumbrance}
                                        onChange={e => checkNum(+e.target.value) ? this.setState({ encumbrance: e.target.value }) : null} />

                                    <button className={`${theme}-secColor ${theme}-secFont`} id="modalAddButton"
                                        onClick={_ => this.handleSubmit()}
                                    >SUBMIT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

}

function mapStateToProps(state) {
    var { editopen, hash, theme } = state

    return {
        editopen,
        hash,
        theme
    }
}

export default connect(mapStateToProps, { OPENMODAL, EDITFIGHTER })(DeckEditFighter)