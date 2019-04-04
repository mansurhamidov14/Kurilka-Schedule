/**
 * Created by user on 04.04.2019.
 */
export const SAVE_SMOKING_TIME = 'SAVE_SMOKING_TIME';
export const DELETE_SMOKING_TIME = 'DELETE_SMOKING_TIME';

export const addSmokingTime = payload => {
    return {
        type: SAVE_SMOKING_TIME,
        payload
    }
};

export const deleteSmokingTime = id => {
    return {
        type: DELETE_SMOKING_TIME,
        id
    }
};