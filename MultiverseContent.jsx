import React, { createContext, useContext, useMemo, useReducer, useCallback } from 'react';
import * as sfx from '../lib/audio';

const MultiverseContext = createContext(null);

const initialState = {
    universes: [],           // { id, decision, outcome, probability, stability, ... }
    brainWeather: null,      // last computed
    roomAmnesia: [],         // list of results
    classroomRuns: [],       // list
    timeInterventions: [],   // list
    conversations: [],       // list
    active: 'core',          // active module id
    audioOn: false,
    booted: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'ADD_UNIVERSES':
            return { ...state, universes: [...action.payload, ...state.universes].slice(0, 60) };
        case 'SET_BRAIN_WEATHER':
            return { ...state, brainWeather: action.payload };
        case 'ADD_ROOM_AMNESIA':
            return { ...state, roomAmnesia: [action.payload, ...state.roomAmnesia].slice(0, 30) };
        case 'ADD_CLASSROOM':
            return { ...state, classroomRuns: [action.payload, ...state.classroomRuns].slice(0, 30) };
        case 'ADD_TIME':
            return { ...state, timeInterventions: [action.payload, ...state.timeInterventions].slice(0, 30) };
        case 'ADD_CONVERSATION':
            return { ...state, conversations: [action.payload, ...state.conversations].slice(0, 30) };
        case 'SET_ACTIVE':
            return { ...state, active: action.payload };
        case 'SET_AUDIO':
            return { ...state, audioOn: action.payload };
        case 'SET_BOOTED':
            return { ...state, booted: action.payload };
        case 'RESET':
            return { ...initialState, audioOn: state.audioOn, booted: state.booted };
        default:
            return state;
    }
}

export function MultiverseProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const setActive = useCallback((id) => { sfx.tick(); dispatch({ type: 'SET_ACTIVE', payload: id }); }, []);
    const setAudio = useCallback((on) => { sfx.setEnabled(on); dispatch({ type: 'SET_AUDIO', payload: on }); }, []);
    const setBooted = useCallback((v) => dispatch({ type: 'SET_BOOTED', payload: v }), []);
    const addUniverses = useCallback((list) => { sfx.chord(); dispatch({ type: 'ADD_UNIVERSES', payload: list }); }, []);
    const setBrainWeather = useCallback((w) => { sfx.tick(); dispatch({ type: 'SET_BRAIN_WEATHER', payload: w }); }, []);
    const addRoomAmnesia = useCallback((r) => { sfx.warn(); dispatch({ type: 'ADD_ROOM_AMNESIA', payload: r }); }, []);
    const addClassroom = useCallback((r) => { sfx.tick(); dispatch({ type: 'ADD_CLASSROOM', payload: r }); }, []);
    const addTime = useCallback((r) => { sfx.chord(); dispatch({ type: 'ADD_TIME', payload: r }); }, []);
    const addConversation = useCallback((r) => { sfx.tick(); dispatch({ type: 'ADD_CONVERSATION', payload: r }); }, []);
    const reset = useCallback(() => { sfx.warn(); dispatch({ type: 'RESET' }); }, []);

    const value = useMemo(() => ({
        state, setActive, setAudio, setBooted,
        addUniverses, setBrainWeather, addRoomAmnesia, addClassroom, addTime, addConversation, reset,
        sfx,
    }), [state, setActive, setAudio, setBooted, addUniverses, setBrainWeather, addRoomAmnesia, addClassroom, addTime, addConversation, reset]);

    return <MultiverseContext.Provider value={value}>{children}</MultiverseContext.Provider>;
}

export function useMultiverse() {
    const ctx = useContext(MultiverseContext);
    if (!ctx) throw new Error('useMultiverse must be used inside MultiverseProvider');
    return ctx;
}
