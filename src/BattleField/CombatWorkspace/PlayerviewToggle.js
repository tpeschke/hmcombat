import React from 'react'

export default function PlayerviewToggle (props) {

        let { user, playerview, TOGGLEPLAYERVIEW, hash } = props
        return (
            <div>
                <div className="inTooltip">
                    <div className={user.data && playerview ? "switchOuter" : "switchOuter OuterOff"}
                        onClick={_ => TOGGLEPLAYERVIEW()}>
                        <div className={user.data && playerview ? "switch" : "switch off"}></div>
                    </div>
                    <h7 className="switchLabel">Player View</h7>
                </div>

                <div>
                    <div className="inTooltip hash">
                        <h7 className="switchLabel" id="hashTitle">Player View Hash</h7>
                        <div className="hashUrl">
                            <div className="innerHashUrl">
                                <p className="hashUrlText" id="hashBaseUrl">hmcombat.tpeschke.com/player/</p>
                                <p className="hashUrlText" id="hashBattleUrl">{hash}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}