import React from 'react';
import { Switch, Route } from 'react-router-dom';

import BattleField from './BattleField/BattleFieldMain';
import SavedField from './SavedFields/SaveFieldMain'

export default (

    <Switch>
        <Route exact path= '/' component={ SavedField } />
        <Route path= '/BattleField' component={ BattleField } />
    </Switch>

)