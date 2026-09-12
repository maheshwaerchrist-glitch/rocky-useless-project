import React, { useEffect, useState } from 'react';
import './App.css';
import { MultiverseProvider, useMultiverse } from './context/MultiverseContext';
import Landing from './components/Landing';
import { TopBar, Dock, MobileTabs } from './components/Shell';
import CentralCore from './components/CentralCore';
import MultiverseEngine from './components/modules/MultiverseEngine';
import BrainWeather from './components/modules/BrainWeather';
import RoomAmnesia from './components/modules/RoomAmnesia';
import ClassroomChaos from './components/modules/ClassroomChaos';
import TimeMachine from './components/modules/TimeMachine';
import ConversationReplay from './components/modules/ConversationReplay';
import UselessStatistics from './components/modules/UselessStatistics';
import FinalReport from './components/modules/FinalReport';

function ActiveModule() {
    const { state } = useMultiverse();
    switch (state.active) {
        case 'engine': return <MultiverseEngine />;
        case 'weather': return <BrainWeather />;
        case 'amnesia': return <RoomAmnesia />;
        case 'chaos': return <ClassroomChaos />;
        case 'time': return <TimeMachine />;
        case 'replay': return <ConversationReplay />;
        case 'stats': return <UselessStatistics />;
        case 'report': return <FinalReport />;
        case 'core':
        default:
            return <CentralCore />;
    }
}

function Dashboard() {
    return (
        <div className="min-h-screen">
            <TopBar />
            <MobileTabs />
            <div className="max-w-[1440px] mx-auto flex">
                <Dock />
                <main className="flex-1 p-4 min-w-0" data-testid="main-workspace">
                    <ActiveModule />
                    <footer className="mt-8 py-6 text-center font-mono-tel text-[10px] uppercase tracking-widest text-dim-mv">
                        Multiverse Pro · Reality Simulation Suite · Currently at 0.00% usefulness · This footer exists for the same reason.
                    </footer>
                </main>
            </div>
        </div>
    );
}

function AppInner() {
    const { state, setBooted } = useMultiverse();
    return state.booted ? <Dashboard /> : <Landing onEnter={() => setBooted(true)} />;
}

export default function App() {
    return (
        <MultiverseProvider>
            <div className="App" data-testid="app-root">
                <AppInner />
            </div>
        </MultiverseProvider>
    );
}
