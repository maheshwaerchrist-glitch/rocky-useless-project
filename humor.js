// Curated humor / randomization templates. Zero external calls.

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pick = (arr, n) => {
    const c = [...arr];
    const out = [];
    for (let i = 0; i < n && c.length; i++) out.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]);
    return out;
};
const num = (min, max, dec = 1) => {
    const v = Math.random() * (max - min) + min;
    return dec === 0 ? Math.round(v) : parseFloat(v.toFixed(dec));
};
const universeId = () => Math.floor(Math.random() * 90000 + 10000);

// ---------- MULTIVERSE ENGINE ----------
const UNIV_OUTCOMES = [
    "Absolutely nothing happened.",
    "You discovered a pen you thought you had lost.",
    "You somehow became a professional banana reviewer.",
    "You forgot why you entered the room. Again.",
    "You accidentally invented a new type of silence.",
    "A crow judged you from a distance.",
    "You said 'hmm' out loud with unusual confidence.",
    "You made eye contact with a stranger for 0.4 seconds. Nothing came of it.",
    "You reheated tea for the third time and never drank it.",
    "You opened your phone, forgot why, closed it, then opened it again.",
    "You sat down and stared at a wall for 14 minutes.",
    "You became mildly famous in a group chat for 48 hours.",
    "You almost said the wrong name. You caught yourself. Barely.",
    "You bought a plant. It survived. Somehow.",
    "You had a great idea. You did not write it down. It's gone forever.",
    "You laughed at a meme nobody else laughed at.",
    "You walked into a glass door with dignity.",
    "You developed an unshakable craving for something that does not exist.",
    "You waved back at someone who was not waving at you.",
    "You reached peak productivity for 11 seconds.",
    "You confidently opened the wrong app three times in a row.",
];

const BUTTERFLIES = [
    "A pigeon on another continent adjusted its expectations.",
    "The stock price of a company you don't own dipped by 0.001%.",
    "Somewhere, a printer jammed for no reason.",
    "A single email got sorted into the wrong folder.",
    "A stranger's coffee cooled 2 seconds faster than it should have.",
    "A traffic light became slightly more contemplative.",
    "A cat blinked out of order.",
    "One person, somewhere, remembered their PIN correctly.",
    "A cloud tried, and failed, to look like a horse.",
    "An unread notification became slightly more aggressive.",
];

const CONSEQUENCES = [
    "You are now 4% more likely to say 'you too' when a waiter says 'enjoy your meal'.",
    "You gained the ability to hear the Wi-Fi. Very quietly.",
    "You will remember this at 2:47 AM. Tomorrow.",
    "Your future self will nod at nothing in particular.",
    "You'll misplace your keys in a slightly more creative location.",
    "You will accidentally reply to a stranger with 'love you too'.",
    "You will now hum a song you don't know the lyrics to.",
    "You are now the vibe manager of a group chat you never joined.",
    "You'll spend 6 minutes looking for your phone while holding it.",
    "You have unlocked: The Fridge Stare (Silver Tier).",
];

const OBSERVATIONS = [
    "Curiously, this outcome is statistically indistinguishable from doing nothing.",
    "The simulation exhibits mild reluctance to continue.",
    "Note: this reality prefers to remain unnoticed.",
    "Result: elegantly pointless.",
    "Reality declines to comment.",
    "Anomaly detected: everything is fine.",
    "The Multiverse considers this outcome adequately unremarkable.",
    "Observation logged for absolutely no reason.",
];

export function generateUniverses(input, count = 4, context = {}) {
    const seed = String(input || 'a completely ordinary decision').trim();
    const themes = [
        `You went with the decision: "${seed}"`,
        `You did the opposite of: "${seed}"`,
        `You almost decided: "${seed}", then didn't`,
        `You made the objectively optimal decision`,
        `You made a decision no one was expecting`,
    ];
    // context tweaks: high chaos -> lower stability
    const chaosBias = (context.chaos || 0) / 100;
    return pick(themes, count).map((theme) => {
        const stab = Math.max(4, Math.min(99, num(20 - chaosBias * 15, 95 - chaosBias * 10, 1)));
        return {
            id: universeId(),
            decision: theme,
            outcome: rand(UNIV_OUTCOMES),
            probability: num(0.3, 42.9, 1),
            stability: stab,
            butterfly: rand(BUTTERFLIES),
            consequence: rand(CONSEQUENCES),
            observation: rand(OBSERVATIONS),
        };
    });
}

// ---------- BRAIN WEATHER ----------
const WEATHER_TEMPLATES = [
    { min: 0, label: 'BRAIN HAS LEFT THE BUILDING', icon: 'satellite-dish', tone: 'crit' },
    { min: 15, label: 'SEVERE OVERTHINKING STORM', icon: 'cloud-lightning', tone: 'crit' },
    { min: 30, label: 'ACADEMIC THUNDERSTORM', icon: 'cloud-rain', tone: 'warn' },
    { min: 45, label: 'PROCRASTINATION FOG', icon: 'cloud-fog', tone: 'warn' },
    { min: 55, label: 'MILD CONFUSION FRONT', icon: 'wind', tone: 'warn' },
    { min: 68, label: 'PARTLY FOCUSED', icon: 'cloud-sun', tone: 'online' },
    { min: 80, label: 'CLEAR SKIES', icon: 'sun', tone: 'online' },
    { min: 92, label: 'DANGEROUSLY PRODUCTIVE', icon: 'zap', tone: 'online' },
];

export function computeBrainWeather({ sleep = 6, tasks = 4, classes = 3, phoneChecks = 40, embarrassing = 2, chaosLevel = 30, overthinking = 40, confusion = 30 }) {
    // Composite score 0..100 higher = clearer
    const sleepScore = Math.min(100, (sleep / 8) * 100);
    const overloadPenalty = Math.min(60, tasks * 4 + classes * 3);
    const phonePenalty = Math.min(35, phoneChecks * 0.4);
    const embarrassPenalty = Math.min(30, embarrassing * 5);
    const focus = Math.max(4, Math.min(99, sleepScore - overloadPenalty * 0.5 - phonePenalty * 0.4 - embarrassPenalty * 0.3 - chaosLevel * 0.15 - overthinking * 0.2 - confusion * 0.15));
    const stress = Math.max(4, Math.min(99, overloadPenalty + chaosLevel * 0.4 + overthinking * 0.3 + confusion * 0.2));
    const overthink = Math.max(4, Math.min(99, overthinking + phonePenalty * 0.6 + embarrassPenalty));
    const confusionPct = Math.max(4, Math.min(99, confusion + phonePenalty * 0.4 + (100 - sleepScore) * 0.4));
    let condition = WEATHER_TEMPLATES[0];
    for (const w of WEATHER_TEMPLATES) if (focus >= w.min) condition = w;
    return {
        condition,
        focus: Math.round(focus),
        stress: Math.round(stress),
        overthinking: Math.round(overthink),
        confusion: Math.round(confusionPct),
        randomThoughts: Math.round(Math.min(99, overthink + num(-8, 8, 0))),
        operationalCapacity: focus < 20 ? 'QUESTIONABLE' : focus < 50 ? 'BARELY' : focus < 80 ? 'ACCEPTABLE' : 'IMPRESSIVE',
    };
}

// ---------- ROOM AMNESIA ----------
const AMNESIA_CONCLUSIONS = [
    "You probably came here for something.",
    "The purpose has entered another dimension.",
    "Memory recovery: statistically improbable.",
    "You will remember this after leaving the room.",
    "Reason vaporized on entry. Standard protocol.",
    "The room ate the intent. It's fine.",
    "Try returning to the previous room. It might remember.",
];

const AMNESIA_ANSWERS = [
    { id: 'forgot', label: 'I forgot.' },
    { id: 'supposed', label: 'I was supposed to get something.' },
    { id: 'dontknow', label: "I don't remember." },
    { id: 'remembered-again', label: 'I remembered, then forgot again.' },
    { id: 'no-idea', label: 'I have absolutely no idea.' },
];

export function getAmnesiaAnswers() { return AMNESIA_ANSWERS; }

export function computeRoomAmnesia(answerId) {
    const base = {
        forgot: { purpose: 8, memory: 18, confusion: 82 },
        supposed: { purpose: 24, memory: 32, confusion: 66 },
        dontknow: { purpose: 4, memory: 12, confusion: 89 },
        'remembered-again': { purpose: 12, memory: 6, confusion: 93 },
        'no-idea': { purpose: 1, memory: 3, confusion: 97 },
    }[answerId] || { purpose: 5, memory: 10, confusion: 91 };
    return {
        purposeDetection: base.purpose + num(-3, 3, 0),
        memoryStability: base.memory + num(-4, 4, 0),
        confusion: Math.min(99, base.confusion + num(-3, 3, 0)),
        returnProbability: num(60, 92, 0),
        conclusion: rand(AMNESIA_CONCLUSIONS),
    };
}

// ---------- CLASSROOM CHAOS ----------
export const CLASSROOM_SITUATIONS = [
    { id: 'late', label: 'Teacher is late', c: 22, p: -15, cf: 8 },
    { id: 'sudden-q', label: 'Teacher suddenly asks a question', c: 18, p: -8, cf: 26 },
    { id: 'everyone-talking', label: 'Everyone is talking', c: 30, p: -22, cf: 12 },
    { id: 'is-this-marks', label: 'Someone asks "Is this for marks?"', c: 10, p: -4, cf: 6 },
    { id: 'assignment-due', label: 'Assignment is due today', c: 24, p: 4, cf: 22 },
    { id: 'projector-broken', label: 'The projector is not working', c: 20, p: -20, cf: 14 },
    { id: 'student-explaining', label: 'One student starts explaining the topic', c: -6, p: 12, cf: 10 },
    { id: 'very-important', label: 'Teacher says "This is very important"', c: 8, p: 18, cf: 20 },
    { id: 'sudden-silence', label: 'The entire class suddenly becomes silent', c: 14, p: -6, cf: 24 },
];

export function computeClassroomChaos(selectedIds) {
    let chaos = 22, productivity = 40, confusion = 20, teacherPatience = 78, energy = 55;
    selectedIds.forEach((id) => {
        const s = CLASSROOM_SITUATIONS.find(x => x.id === id);
        if (s) { chaos += s.c; productivity += s.p; confusion += s.cf; teacherPatience -= Math.abs(s.c) * 0.4; energy += s.cf * 0.3; }
    });
    const clamp = (v) => Math.max(1, Math.min(99, Math.round(v)));
    const teacherDelay = selectedIds.includes('late') ? num(4, 18, 0) : num(0, 3, 0);
    return {
        teacherDelay,
        chaos: clamp(chaos),
        productivity: clamp(productivity),
        confusion: clamp(confusion),
        teacherPatience: clamp(teacherPatience),
        studentEnergy: clamp(energy),
        actualLearning: clamp(productivity * 0.15),
        sirNotComeProb: selectedIds.includes('late') ? 100 : num(6, 42, 0),
    };
}

// ---------- TIME MACHINE ----------
const TIME_OUTCOMES = {
    'do-again': [
        "You made the exact same decision. Reality was relieved.",
        "You did it again. This time with slightly less enthusiasm.",
        "The universe rolled its eyes but complied.",
    ],
    'make-worse': [
        "You made it significantly worse. A new low was achieved.",
        "Reality now has a cautionary example of your name in the footnotes.",
        "You have set a personal record. It is not a good record.",
    ],
    'pretend': [
        "You pretended nothing happened. Everyone else pretended too.",
        "The situation was surgically ignored by all parties.",
        "Nothing to see here. There never was.",
    ],
    'return': [
        "Temporal correction failed. Reason: the event was too useless to alter.",
        "The past politely declined your revision request.",
        "You returned to the present slightly more tired and no wiser.",
    ],
};
export const TIME_CHOICES = [
    { id: 'do-again', label: 'DO IT AGAIN', tone: 'cyan' },
    { id: 'make-worse', label: 'MAKE IT WORSE', tone: 'rose' },
    { id: 'pretend', label: 'PRETEND NOTHING HAPPENED', tone: 'violet' },
    { id: 'return', label: 'RETURN TO PRESENT', tone: 'cyan' },
];
export function generateTimeOutcome(choiceId, originalDecision) {
    return {
        summary: rand(TIME_OUTCOMES[choiceId] || TIME_OUTCOMES.return),
        anomaly: num(1, 8, 0),
        newUniverseId: universeId(),
        loopedDecision: originalDecision,
    };
}

// ---------- CONVERSATION REPLAY ----------
const REPLAY_OBSERVATIONS = [
    "You will replay this in your head at 2:47 AM.",
    "The other person has already forgotten this happened.",
    "There was a better response. It arrived 6 hours late.",
    "You made a small face. Nobody saw it. You will remember it forever.",
    "The conversation has been logged in your permanent record. You are the only reader.",
    "You said 'yeah, no, totally' three times. It counted as agreement.",
];

export function analyzeConversation(text, iteration = 1) {
    const len = (text || '').length;
    const base = Math.max(0, Math.min(99, 90 - iteration * 6));
    return {
        confidence: Math.max(1, Math.min(99, num(20, 70, 0) - iteration * 3)),
        awkwardness: Math.max(1, Math.min(99, num(40, 88, 0) + iteration * 2)),
        clarity: Math.max(1, Math.min(99, num(20, 70, 0) - iteration * 2)),
        betterSaid: num(3, 24, 0) + iteration,
        didntMatter: Math.max(50, Math.min(99, num(80, 99, 0))),
        rememberAt2am: base + num(-2, 2, 1),
        observation: rand(REPLAY_OBSERVATIONS),
        overthinkingScore: Math.max(5, Math.min(99, iteration * 12 + num(20, 40, 0))),
        charCount: len,
    };
}

// ---------- USELESS STATS ----------
export function computeCoreStats(state) {
    const universeCount = state.universes.length;
    const roomsForgotten = state.roomAmnesia.length;
    const decisionsReconsidered = state.timeInterventions.length;
    const classroomSims = state.classroomRuns.length;
    const convs = state.conversations.length;
    const overthinks = state.conversations.reduce((a, c) => a + (c.iteration || 1), 0);
    const chaosAvg = state.classroomRuns.length ? state.classroomRuns.reduce((a, r) => a + r.chaos, 0) / state.classroomRuns.length : 0;
    const confusionAvg = state.roomAmnesia.length ? state.roomAmnesia.reduce((a, r) => a + r.confusion, 0) / state.roomAmnesia.length : 0;
    const nonsense = Math.min(99, 20 + universeCount * 3 + roomsForgotten * 4 + decisionsReconsidered * 5 + overthinks * 2 + chaosAvg * 0.3);
    const realityIntegrity = Math.max(4, 100 - nonsense * 0.7 - confusionAvg * 0.15);
    const causalStability = Math.max(4, 90 - decisionsReconsidered * 8 - universeCount * 2);
    const logicalConsistency = Math.max(1, 40 - overthinks * 3 - universeCount * 1.5);
    return {
        universeCount,
        roomsForgotten,
        decisionsReconsidered,
        classroomSims,
        conversations: convs,
        overthinks,
        anomalies: decisionsReconsidered,
        realityIntegrity: Math.round(realityIntegrity),
        causalStability: Math.round(causalStability),
        logicalConsistency: Math.round(logicalConsistency),
        nonsense: Math.round(nonsense),
        chaosAvg: Math.round(chaosAvg),
        confusionAvg: Math.round(confusionAvg),
    };
}

// ---------- BOOT LOG ----------
export const BOOT_LINES = [
    { key: 'quantum', label: 'Quantum Coherence Matrix' },
    { key: 'core', label: 'Multiverse Core Reactor' },
    { key: 'engine', label: 'Decision Engine' },
    { key: 'weather', label: 'Brain Weather Diagnostic' },
    { key: 'amnesia', label: 'Room Amnesia Detector' },
    { key: 'chaos', label: 'Classroom Chaos Sensor' },
    { key: 'time', label: 'Temporal Retrieval Array' },
    { key: 'replay', label: 'Conversation Overthinker' },
    { key: 'stats', label: 'Useless Statistics Aggregator' },
];

export const LOADING_LINES = [
    'Recalibrating pointlessness matrix...',
    'Aligning irrelevant vectors...',
    'Consulting the nonsense oracle...',
    'Compressing indecision into byte-sized regrets...',
    'Confirming that this is, in fact, unnecessary...',
    'Cross-referencing with parallel disappointments...',
    'Rendering elegant uselessness...',
];

export function randomLoadingLine() { return rand(LOADING_LINES); }

// Final report
export function generateFinalReport(state, stats) {
    const conclusions = [
        "You could have done literally anything. You chose this.",
        "The multiverse has reviewed your session and has no comments.",
        "Reality remains, on balance, unimpressed.",
        "The optimal universe still requires you to log off eventually.",
    ];
    const brainW = state.brainWeather?.condition?.label || 'UNDEFINED';
    return {
        primaryReality: 'Unconfirmed',
        universesGenerated: stats.universeCount,
        temporalInterventions: stats.decisionsReconsidered,
        brainWeather: brainW,
        classroomStability: stats.chaosAvg > 60 ? 'Unstable' : stats.chaosAvg > 30 ? 'Precarious' : 'Nominal',
        memoryIntegrity: stats.confusionAvg > 60 ? 'Questionable' : 'Suspicious',
        logicalConsistency: stats.logicalConsistency,
        usefulInformation: 0,
        realityStability: stats.realityIntegrity,
        conclusion: rand(conclusions),
    };
}