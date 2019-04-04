/**
 * Created by user on 04.04.2019.
 */
import {SAVE_SMOKING_TIME, DELETE_SMOKING_TIME} from '../actions';

export default schedule = (state = [], action) => {
    switch (action.type) {
        case SAVE_SMOKING_TIME:
            return [...state, action.payload];
        case DELETE_SMOKING_TIME:
            return state.filter(smoking => smoking.id !== action.id);
        default:
            return state;
    }
}