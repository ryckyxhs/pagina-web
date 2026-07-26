"use strict";
const SUBJECTS = ["Algebra", "Fisica", "Calculo", "Programacion", "Estadistica"];
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const BLOCKS = ["14:00 - 16:00", "16:00 - 18:00", "19:00 - 21:00"];
const ALL_SLOTS = DAYS.flatMap(d => BLOCKS.map(b => `${d} | ${b}`));
const K = {
    students: "nx_students",
    tutors: "nx_tutors",
    bookings: "nx_bookings",
    session: "nx_session",
    version: "nx_seed_version"
};
const DATA_VERSION = "java-final-v2";
const DS = [{
    id: "s1",
    name: "Pedro Valencia",
    username: "pedro",
    password: "456"
}, {
    id: "s2",
    name: "Camila Diaz",
    username: "camila",
    password: "1234"
}, {
    id: "s3",
    name: "Diego Salinas",
    username: "diego",
    password: "2345"
}, {
    id: "s4",
    name: "Erika Molina",
    username: "erika",
    password: "3456"
}, {
    id: "s5",
    name: "Franco Ibarra",
    username: "franco",
    password: "4567"
}, {
    id: "s6",
    name: "Gabriela Nunez",
    username: "gabriela",
    password: "5678"
}, {
    id: "s7",
    name: "Hector Paredes",
    username: "hector",
    password: "6789"
}, {
    id: "s8",
    name: "Ivonne Chavez",
    username: "ivonne",
    password: "7890"
}, {
    id: "s9",
    name: "Jonathan Vega",
    username: "jonathan",
    password: "8901"
}, {
    id: "s10",
    name: "Karina Espin",
    username: "karina",
    password: "9012"
}];
const DT = [{
    id: "t1",
    name: "Ana Vera",
    username: "ana",
    password: "123",
    subject: "Programacion",
    mode: "Virtual",
    rate: 12.50,
    availability: [ALL_SLOTS[0], ALL_SLOTS[4], ALL_SLOTS[8]],
    sessions: 6,
    hours: 12
}, {
    id: "t2",
    name: "Carlos Mendoza",
    username: "carlos",
    password: "234",
    subject: "Algebra",
    mode: "Virtual",
    rate: 8.00,
    availability: [ALL_SLOTS[1], ALL_SLOTS[6], ALL_SLOTS[10]],
    sessions: 4,
    hours: 8
}, {
    id: "t3",
    name: "Maria Torres",
    username: "maria",
    password: "1234",
    subject: "Fisica",
    mode: "Presencial",
    rate: 10.50,
    availability: [ALL_SLOTS[2], ALL_SLOTS[5], ALL_SLOTS[12]],
    sessions: 5,
    hours: 10
}, {
    id: "t4",
    name: "Jose Ramirez",
    username: "jose",
    password: "1234",
    subject: "Calculo",
    mode: "Virtual",
    rate: 7.00,
    availability: [ALL_SLOTS[3], ALL_SLOTS[7], ALL_SLOTS[14]],
    sessions: 3,
    hours: 6
}, {
    id: "t5",
    name: "Luis Castro",
    username: "luis",
    password: "1234",
    subject: "Estadistica",
    mode: "Presencial",
    rate: 6.50,
    availability: [ALL_SLOTS[0], ALL_SLOTS[9], ALL_SLOTS[13]],
    sessions: 2,
    hours: 4
}, {
    id: "t6",
    name: "Diana Suarez",
    username: "diana",
    password: "1234",
    subject: "Algebra",
    mode: "Presencial",
    rate: 9.00,
    availability: [ALL_SLOTS[1], ALL_SLOTS[5], ALL_SLOTS[11]],
    sessions: 5,
    hours: 10
}, {
    id: "t7",
    name: "Pedro Flores",
    username: "pedro",
    password: "1234",
    subject: "Programacion",
    mode: "Virtual",
    rate: 15.00,
    availability: [ALL_SLOTS[2], ALL_SLOTS[6], ALL_SLOTS[12]],
    sessions: 7,
    hours: 14
}, {
    id: "t8",
    name: "Karla Ochoa",
    username: "karla",
    password: "1234",
    subject: "Fisica",
    mode: "Virtual",
    rate: 8.50,
    availability: [ALL_SLOTS[3], ALL_SLOTS[8], ALL_SLOTS[10]],
    sessions: 4,
    hours: 8
}, {
    id: "t9",
    name: "Andres Leon",
    username: "andres",
    password: "1234",
    subject: "Calculo",
    mode: "Presencial",
    rate: 11.00,
    availability: [ALL_SLOTS[4], ALL_SLOTS[9], ALL_SLOTS[14]],
    sessions: 6,
    hours: 12
}, {
    id: "t10",
    name: "Sofia Rios",
    username: "sofia",
    password: "1234",
    subject: "Estadistica",
    mode: "Virtual",
    rate: 5.50,
    availability: [ALL_SLOTS[0], ALL_SLOTS[7], ALL_SLOTS[13]],
    sessions: 8,
    hours: 16
}];
let students = load(K.students, [])
  , tutors = load(K.tutors, [])
  , bookings = load(K.bookings, [])
  , session = load(K.session, null);
let authRole = "student"
  , authMode = "login"
  , selectedTutor = null
  , recommendContext = null;
function load(k, f) {
    try {
        return JSON.parse(localStorage.getItem(k)) || f
    } catch {
        return f
    }
}
function applyOfficialSeed() {
    if (localStorage.getItem(K.version) === DATA_VERSION)
        return;
    const customStudents = students.filter(x => !DS.some(d => d.username.toLowerCase() === String(x.username || "").toLowerCase()));
    const customTutors = tutors.filter(x => !DT.some(d => d.username.toLowerCase() === String(x.username || "").toLowerCase()));
    students = [...DS, ...customStudents];
    tutors = [...DT, ...customTutors];
    localStorage.setItem(K.version, DATA_VERSION);
}
function save() {
    localStorage.setItem(K.students, JSON.stringify(students));
    localStorage.setItem(K.tutors, JSON.stringify(tutors));
    localStorage.setItem(K.bookings, JSON.stringify(bookings))
}
function normalizeBookings() {
    let changed = false;
    bookings = bookings.map(b => {
        const normalized = {
            ...b
        };
        if (!normalized.status) {
            normalized.status = "programada";
            changed = true
        }
        // Las reservas creadas con la versión anterior ya sumaban horas y sesiones al reservar.
        if (typeof normalized.countedInStats !== "boolean") {
            normalized.countedInStats = true;
            changed = true
        }
        return normalized;
    }
    );
    if (changed)
        localStorage.setItem(K.bookings, JSON.stringify(bookings));
}
function isActiveBooking(b) {
    return (b.status || "programada") === "programada"
}
function statusLabel(status) {
    return status === "finalizada" ? "Finalizada" : "Programada"
}
function id(p) {
    return `${p}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
function money(v) {
    return new Intl.NumberFormat("es-EC",{
        style: "currency",
        currency: "USD"
    }).format(Number(v) || 0)
}
function label(s) {
    return ({
        Algebra: "Álgebra",
        Fisica: "Física",
        Calculo: "Cálculo",
        Programacion: "Programación",
        Estadistica: "Estadística"
    })[s] || s
}
function currentStudent() {
    return students.find(x => x.id === session?.userId)
}
function currentTutor() {
    return tutors.find(x => x.id === session?.userId)
}
function toast(m) {
    const t = document.getElementById("toast");
    t.textContent = m;
    t.classList.remove("hidden");
    setTimeout( () => t.classList.add("hidden"), 2800)
}
function showView(v) {
    document.querySelectorAll(".view").forEach(x => x.classList.remove("active"));
    document.getElementById(v).classList.add("active");
    scrollTo(0, 0)
}
function scrollToId(x) {
    showView("landing");
    setTimeout( () => document.getElementById(x).scrollIntoView({
        behavior: "smooth"
    }), 50)
}
function updateTop() {
    guestActions.classList.toggle("hidden", !!session);
    sessionActions.classList.toggle("hidden", !session);
    if (session) {
        const u = session.role === "student" ? currentStudent() : currentTutor();
        sessionName.textContent = `Hola, ${u?.name.split(" ")[0] || ""}`
    }
}
function route() {
    if (!session)
        return showView("landing");
    session.role === "student" ? (renderStudent(),
    showView("student")) : (renderTutor(),
    showView("tutor"))
}
function logout() {
    session = null;
    localStorage.removeItem(K.session);
    updateTop();
    showView("landing");
    toast("Sesión cerrada")
}
function studentScreen(x, b) {
    document.querySelectorAll("#student .screen").forEach(s => s.classList.toggle("active", s.id === x));
    document.querySelectorAll("#student .side-link").forEach(s => s.classList.remove("active"));
    if (b)
        b.classList.add("active")
}
function tutorScreen(x, b) {
    document.querySelectorAll("#tutor .screen").forEach(s => s.classList.toggle("active", s.id === x));
    document.querySelectorAll("#tutor .side-link").forEach(s => s.classList.remove("active"));
    if (b)
        b.classList.add("active")
}
function openAuth(m="login", r="student") {
    authMode = m;
    authRole = r;
    authBg.classList.remove("hidden");
    authMsg.textContent = "";
    document.querySelector("#authBg form").reset();
    refreshAuth()
}
function closeAuth() {
    authBg.classList.add("hidden")
}
function setAuthRole(r) {
    authRole = r;
    refreshAuth()
}
function setAuthMode(m) {
    authMode = m;
    refreshAuth()
}
function refreshAuth() {
    roleStudent.classList.toggle("active", authRole === "student");
    roleTutor.classList.toggle("active", authRole === "tutor");
    modeLogin.classList.toggle("active", authMode === "login");
    modeRegister.classList.toggle("active", authMode === "register");
    const reg = authMode === "register";
    nameField.classList.toggle("hidden", !reg);
    authName.required = reg;
    authTitle.textContent = reg ? "Crea tu cuenta" : "Bienvenido de nuevo";
    authSub.textContent = `${reg ? "Regístrate" : "Inicia sesión"} como ${authRole === "student" ? "estudiante" : "tutor"}.`;
    authButton.textContent = reg ? "Registrarse" : "Iniciar sesión"
}
function submitAuth(e) {
    e.preventDefault();
    const name = authName.value.trim()
      , u = authUser.value.trim()
      , p = authPass.value;
    const list = authRole === "student" ? students : tutors;
    if (authMode === "login") {
        const found = list.find(x => x.username.toLowerCase() === u.toLowerCase() && x.password === p);
        if (!found)
            return authMsg.textContent = "Usuario o contraseña incorrectos.";
        session = {
            role: authRole,
            userId: found.id
        }
    } else {
        if (list.some(x => x.username.toLowerCase() === u.toLowerCase()))
            return authMsg.textContent = "Ese usuario ya existe.";
        if (authRole === "student") {
            const n = {
                id: id("s"),
                name,
                username: u,
                password: p
            };
            students.push(n);
            session = {
                role: "student",
                userId: n.id
            }
        } else {
            const n = {
                id: id("t"),
                name,
                username: u,
                password: p,
                subject: "Algebra",
                mode: "Virtual",
                rate: 5,
                availability: [],
                sessions: 0,
                hours: 0
            };
            tutors.push(n);
            session = {
                role: "tutor",
                userId: n.id
            }
        }
        save()
    }
    localStorage.setItem(K.session, JSON.stringify(session));
    closeAuth();
    updateTop();
    route();
    toast(authMode === "login" ? "Bienvenido" : "Cuenta creada")
}
function compatibility(t, m, slot, b) {
    const a = t.availability.includes(slot)
      , mm = t.mode === m
      , bb = Number(t.rate) <= Number(b);
    return {
        p: Math.round(((a + mm + bb) * 100 / 3) * 100) / 100,
        a,
        mm,
        bb
    }
}
function row(n, v) {
    return `<span><b>${n}</b><b class="${v ? "yes" : "no"}">${v ? "Compatible ✓" : "No compatible"}</b></span>`
}
function card(t, c, recommended) {
    const initials = t.name.split(" ").map(x => x[0]).join("").slice(0, 2);
    return `<article class="tutor-card"><div class="tutor-head"><div class="avatar">${initials}</div><div><h3>${t.name}</h3><p>${label(t.subject)} · ${t.mode}</p></div></div><div class="tutor-body"><div class="compat"><span>Costo/hora</span><strong>${money(t.rate)}</strong></div>${recommended ? `<div class="compat"><span>Compatibilidad</span><strong>${c.p}%</strong></div><div class="match-list">${row("Horario", c.a)}${row("Modalidad", c.mm)}${row("Presupuesto", c.bb)}</div>` : `<div class="match-list"><span><b>Modalidad</b><b>${t.mode}</b></span><span><b>Horarios</b><b>${t.availability.length}</b></span></div>`}</div><button class="btn primary block" onclick="openBook('${t.id}',${recommended})">Reservar tutoría</button></article>`
}
function searchRecommended(e) {
    e.preventDefault();
    const subject = rSubject.value
      , slot = `${rDay.value} | ${rBlock.value}`
      , mode = rMode.value
      , budget = +rBudget.value;
    recommendContext = {
        slot,
        budget
    };
    const list = tutors.filter(t => t.subject === subject).map(t => ({
        t,
        c: compatibility(t, mode, slot, budget)
    })).filter(x => x.c.p > 0).sort( (a, b) => b.c.p - a.c.p).slice(0, 3);
    recommendedResults.innerHTML = list.length ? list.map(x => card(x.t, x.c, true)).join("") : `<div class="empty">No se encontraron tutores compatibles.</div>`
}
function searchDirect(e) {
    e.preventDefault();
    const list = tutors.filter(t => t.subject === dSubject.value);
    directResults.innerHTML = list.length ? list.map(t => card(t, null, false)).join("") : `<div class="empty">No existen tutores para esa materia.</div>`
}
function openBook(tid, recommended) {
    selectedTutor = tutors.find(t => t.id === tid);
    bookSummary.innerHTML = `<strong>${selectedTutor.name}</strong><p>${label(selectedTutor.subject)} · ${selectedTutor.mode} · ${money(selectedTutor.rate)} por hora</p>`;
    bookSlot.innerHTML = selectedTutor.availability.length ? selectedTutor.availability.map(s => `<option>${s}</option>`).join("") : `<option value="">Sin horarios</option>`;
    if (recommended && recommendContext) {
        if (selectedTutor.availability.includes(recommendContext.slot))
            bookSlot.value = recommendContext.slot;
        bookBudget.value = recommendContext.budget
    } else
        bookBudget.value = selectedTutor.rate;
    bookDuration.value = "1";
    bookMsg.textContent = "";
    updateTotal();
    bookBg.classList.remove("hidden")
}
function closeBook() {
    bookBg.classList.add("hidden");
    selectedTutor = null
}
function updateTotal() {
    bookTotal.textContent = selectedTutor ? money(selectedTutor.rate * (+bookDuration.value)) : money(0)
}
function submitBooking(e) {
    e.preventDefault();
    const s = currentStudent()
      , slot = bookSlot.value
      , d = +bookDuration.value
      , b = +bookBudget.value;
    if (!slot)
        return bookMsg.textContent = "El tutor no tiene horarios disponibles.";
    const bk = {
        id: id("b"),
        studentId: s.id,
        tutorId: selectedTutor.id,
        subject: selectedTutor.subject,
        slot,
        mode: selectedTutor.mode,
        duration: d,
        costHour: +selectedTutor.rate,
        budget: b,
        total: +selectedTutor.rate * d,
        status: "programada",
        countedInStats: false,
        createdAt: new Date().toISOString()
    };
    bookings.push(bk);
    selectedTutor.availability = selectedTutor.availability.filter(x => x !== slot);
    save();
    closeBook();
    renderStudent();
    studentScreen("myBookings");
    updateStats();
    toast("Tutoría reservada correctamente")
}
function renderStudent() {
    const s = currentStudent()
      , list = bookings.filter(b => b.studentId === s.id).sort( (a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      , active = list.filter(isActiveBooking);
    studentName.textContent = s.name.split(" ")[0];
    mBookings.textContent = list.length;
    mHours.textContent = list.reduce( (a, b) => a + b.duration, 0);
    mSpent.textContent = money(list.reduce( (a, b) => a + b.total, 0));
    nextBooking.innerHTML = active.length ? bookingHTML(active[0]) : "No tienes tutorías programadas en este momento.";
    nextBooking.className = active.length ? "" : "empty";
    studentBookings.innerHTML = list.length ? list.map(bookingHTML).join("") : `<div class="empty">Todavía no existen tutorías reservadas.</div>`
}
function bookingHTML(b) {
    const t = tutors.find(x => x.id === b.tutorId)
      , s = students.find(x => x.id === b.studentId);
    const status = b.status || "programada";
    const canFinish = session?.role === "tutor" && session.userId === b.tutorId && status === "programada";
    return `<article class="booking ${status === "finalizada" ? "is-finished" : ""}"><div class="booking-person"><strong>${session?.role === "tutor" ? (s?.name || "Estudiante") : (t?.name || "Tutor")}</strong><small>${label(b.subject)}</small><span class="booking-status ${status}">${statusLabel(status)}</span></div><div><span>Horario</span><strong>${b.slot}</strong></div><div><span>Modalidad</span><strong>${b.mode}</strong></div><div><span>Duración</span><strong>${b.duration} h</strong></div><div><span>Costo/hora</span><strong>${money(b.costHour)}</strong></div><div><span>Total</span><strong>${money(b.total)}</strong></div>${canFinish ? `<div class="booking-actions"><button class="btn finish" onclick="finishBooking('${b.id}')">Finalizar tutoría</button></div>` : ""}</article>`;
}
function finishBooking(bookingId) {
    if (!session || session.role !== "tutor")
        return toast("Solo el tutor puede finalizar la tutoría");
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.tutorId !== session.userId)
        return toast("No se encontró esa tutoría");
    if (!isActiveBooking(booking))
        return toast("La tutoría ya fue finalizada");
    booking.status = "finalizada";
    booking.completedAt = new Date().toISOString();
    const tutor = currentTutor();
    if (!booking.countedInStats) {
        tutor.sessions = (tutor.sessions || 0) + 1;
        tutor.hours = (tutor.hours || 0) + Number(booking.duration || 0);
        booking.countedInStats = true;
    }
    if (booking.slot && !tutor.availability.includes(booking.slot))
        tutor.availability.push(booking.slot);
    save();
    renderTutor();
    updateStats();
    toast("Tutoría finalizada y enviada al historial");
}

function renderPublicRanking() {
    const ranked = [...tutors].sort( (a, b) => (b.sessions || 0) - (a.sessions || 0)).slice(0, 3);
    publicRankingList.innerHTML = ranked.map( (t, i) => {
        const avg = t.sessions ? (t.hours / t.sessions).toFixed(2) : "0";
        return `<div class="public-rank-row"><span class="rank-medal">${i + 1}</span><div><strong>${t.name}</strong><span>${label(t.subject)} · ${t.mode}</span></div><div class="rank-stat"><span>Asesorías</span><strong>${t.sessions || 0}</strong></div><div class="rank-stat rank-extra"><span>Horas</span><strong>${t.hours || 0}</strong></div><div class="rank-stat rank-extra"><span>Promedio</span><strong>${avg}</strong></div></div>`;
    }
    ).join("");
    const servedIds = new Set(bookings.map(b => b.studentId));
    const served = students.filter(s => servedIds.has(s.id)).length;
    const unserved = students.length - served;
    const percentage = students.length ? Math.round((served * 100 / students.length) * 100) / 100 : 0;
    attentionRegistered.textContent = students.length;
    attentionServed.textContent = served;
    attentionUnserved.textContent = unserved;
    attentionPercent.textContent = `${percentage}%`;
}
function renderTutor() {
    const t = currentTutor()
      , list = bookings.filter(b => b.tutorId === t.id).sort( (a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      , active = list.filter(isActiveBooking)
      , unique = new Set(list.map(b => b.studentId));
    tutorName.textContent = t.name.split(" ")[0];
    tSessions.textContent = sSessions.textContent = t.sessions || 0;
    tHours.textContent = sHours.textContent = t.hours || 0;
    tAverage.textContent = sAverage.textContent = t.sessions ? (t.hours / t.sessions).toFixed(2) : 0;
    tStudents.textContent = unique.size;
    tSubject.value = t.subject;
    tMode.value = t.mode;
    tRate.value = t.rate;
    renderAvailability();
    tUpcoming.innerHTML = active.length ? active.map(bookingHTML).join("") : `<div class="empty">No tienes tutorías programadas.</div>`;
    assignedList.innerHTML = list.length ? list.map(bookingHTML).join("") : `<div class="empty">Todavía no existen reservas asignadas.</div>`;
    const ranked = [...tutors].sort( (a, b) => (b.sessions || 0) - (a.sessions || 0));
    sRank.textContent = `#${ranked.findIndex(x => x.id === t.id) + 1}`;
    ranking.innerHTML = ranked.map( (x, i) => `<div style="display:grid;grid-template-columns:50px 1fr 100px;gap:12px;padding:14px;border-radius:12px;background:#f4edf3;margin-bottom:10px"><b>${i + 1}</b><span><strong>${x.name}</strong><small style="display:block;color:#6e6874">${label(x.subject)}</small></span><strong>${x.sessions || 0} sesiones</strong></div>`).join("")
}
function saveTutorConfig(e) {
    e.preventDefault();
    const t = currentTutor();
    t.subject = tSubject.value;
    t.mode = tMode.value;
    t.rate = +tRate.value;
    save();
    renderTutor();
    toast("Configuración guardada")
}
function renderAvailability() {
    const t = currentTutor();
    availabilityGrid.innerHTML = ALL_SLOTS.map( (s, i) => `<label class="slot"><input type="checkbox" value="${s}" ${t.availability.includes(s) ? "checked" : ""}><span>${i + 1}. ${s}</span></label>`).join("")
}
function saveAvailability(e) {
    e.preventDefault();
    currentTutor().availability = [...availabilityGrid.querySelectorAll("input:checked")].map(x => x.value);
    save();
    renderTutor();
    toast("Disponibilidad guardada")
}
function updateStats() {
    statBookings.textContent = bookings.length;
    statTutors.textContent = tutors.length;
    renderPublicRanking()
}
function start() {
    applyOfficialSeed();
    normalizeBookings();
    save();
    updateTop();
    updateStats();
    route()
}
start();
