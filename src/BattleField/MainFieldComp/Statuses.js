import React, { Component } from 'react'

import { connect } from 'react-redux'

import { DELETESTATUSES } from '../../ducks/CompReducers/StatusReducer'

import './Statuses.css'

class Statuses extends Component {

    render() {

        if (this.props.statusList) {
            var statuses = this.props.statusList.map((d, i) => {
                
                if (d.timestatus - this.props.count > 0) {
                    return <button key={d.id}
                        className="StatusItemBox"
                        id={this.props.page === '/SavedFields' || this.props.page === '/' ? 'modalClose' : null}
                        onClick={_=>this.props.DELETESTATUSES(d.id)}>
                        <h5 className="StatusItem">{d.namestatus}</h5>
                        <div className="border"></div>
                        <h6 className="StatusItem">{+d.timestatus - +this.props.count}</h6>
                    </button>
                }
            })
        }

        return (
            <div className="StatusList">
                {statuses}
            </div>
        )
    }
}

function mapStateToProps(state) {
    var { statusList, count, page } = state

    return {
        statusList,
        count, 
        page
    }
}

export default connect(mapStateToProps, { DELETESTATUSES })(Statuses)