import {combineReducers} from 'redux'
import {initialState} from "../initialState";
import {ADD_COUNTER, MIN_COUNTER, RESET_COUNTER, PORTFOLIO_DATA, CHANGE_WALLET, SELECT_MENU} from "../actionTypes";

export function portfolioData(state = [], action) {
    switch (action.type) {
        case PORTFOLIO_DATA:
            return action.payload
        default:
            return state
    }

    // return state;
}
export function walletAddress(state = {address:''}, action) {
    console.log(action)
    switch (action.type) {
        case CHANGE_WALLET:
            return {
                address: action.payload
            }
        default:
            return state
    }

    // return state;
}
export function menuSelectItem(state = {item:0}, action) {
    switch (action.type) {
        case SELECT_MENU:
            return {
                item: action.payload
            }
        default:
            return state
    }

    // return state;
}

const rootReducer = combineReducers({portfolioData,walletAddress,menuSelectItem})

export default rootReducer;