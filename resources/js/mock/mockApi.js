/**
 * In-Browser-Mock des Laravel-Backends.
 *
 * Wird nur aktiv, wenn `window.__EQUILIO_DEMO__ === true` gesetzt ist
 * (siehe statische index.html des GitHub-Pages-Builds). Im normalen
 * Laravel-Betrieb wird dieses Modul nicht geladen, der echte API-Server
 * bleibt unangetastet.
 *
 * Daten entsprechen den Laravel-Seedern und werden in localStorage
 * gehalten, damit Änderungen einen Reload überleben. `?reset` in der
 * URL setzt den Demo-Datenstand zurück.
 */

const STORAGE_KEY = 'equilio_demo_db_v1'

const QUALIFICATIONS = [
  { id: 1, description: 'Exam. Pfleger:in' },
  { id: 2, description: 'Qual. Pflegehelfer:in' },
  { id: 3, description: 'Pflegehelfer:in' },
  { id: 4, description: 'Betreuungsassistent:in' },
]

const SHIFT_TYPES = [
  { id: 1, name: 'Frühschicht', active_duty: 1, min_occupation: 3, opt_occupation: 5 },
  { id: 2, name: 'Spätschicht', active_duty: 1, min_occupation: 2, opt_occupation: 3 },
  { id: 3, name: 'Nachtschicht', active_duty: 1, min_occupation: 1, opt_occupation: 2 },
  { id: 4, name: 'Zwischenschicht', active_duty: 1, min_occupation: 0, opt_occupation: 0 },
  { id: 5, name: 'Frei (bezahlt)', active_duty: 0, min_occupation: 0, opt_occupation: 0 },
  { id: 6, name: 'Fort- & Ausbildung', active_duty: 0, min_occupation: 0, opt_occupation: 0 },
]

const SHIFTS = [
  { id: 1, abrv: 'F1', shift_type_id: 1, h_duration: 8, color_hex: '#fe5741' },
  { id: 2, abrv: 'F2', shift_type_id: 1, h_duration: 6, color_hex: '#fe7000' },
  { id: 3, abrv: 'S1', shift_type_id: 2, h_duration: 8, color_hex: '#598ec7' },
  { id: 4, abrv: 'S2', shift_type_id: 2, h_duration: 6, color_hex: '#318ab7' },
  { id: 5, abrv: 'N1', shift_type_id: 3, h_duration: 8, color_hex: '#932092' },
  { id: 6, abrv: 'N2', shift_type_id: 3, h_duration: 6, color_hex: '#702092' },
  { id: 7, abrv: 'U1', shift_type_id: 5, h_duration: 8, color_hex: '#1ddce2' },
  { id: 8, abrv: 'K1', shift_type_id: 5, h_duration: 8, color_hex: '#a00000' },
]

const EMPLOYEES = [
  { id: 1, qualification_id: 1, first_name: 'Vince', last_name: 'Testy', daily_worktime: 8, employment_ratio: 100 },
  { id: 2, qualification_id: 1, first_name: 'Anna', last_name: 'Brandt', daily_worktime: 8, employment_ratio: 100 },
  { id: 3, qualification_id: 1, first_name: 'Markus', last_name: 'Hoffmann', daily_worktime: 8, employment_ratio: 100 },
  { id: 4, qualification_id: 1, first_name: 'Sabine', last_name: 'Keller', daily_worktime: 8, employment_ratio: 75 },
  { id: 5, qualification_id: 2, first_name: 'Tobias', last_name: 'Wagner', daily_worktime: 8, employment_ratio: 100 },
  { id: 6, qualification_id: 2, first_name: 'Lena', last_name: 'Schuster', daily_worktime: 8, employment_ratio: 100 },
  { id: 7, qualification_id: 2, first_name: 'Jonas', last_name: 'Frei', daily_worktime: 8, employment_ratio: 50 },
  { id: 8, qualification_id: 3, first_name: 'Mira', last_name: 'Lorenz', daily_worktime: 8, employment_ratio: 100 },
  { id: 9, qualification_id: 3, first_name: 'David', last_name: 'Köhler', daily_worktime: 8, employment_ratio: 100 },
  { id: 10, qualification_id: 4, first_name: 'Petra', last_name: 'Sommer', daily_worktime: 8, employment_ratio: 75 },
  { id: 11, qualification_id: 4, first_name: 'Erik', last_name: 'Baumann', daily_worktime: 8, employment_ratio: 100 },
]

function buildSeedDuties() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const daysInMonth = new Date(year, month, 0).getDate()
  // einfache rollierende Schicht-Rotation als Anschauungsbeispiel
  const pattern = ['F1', 'F1', 'S1', 'S1', 'N1', 'U1', 'U1']
  const duties = []
  let id = 1
  EMPLOYEES.forEach((emp, empIdx) => {
    for (let day = 1; day <= daysInMonth; day++) {
      const abrv = pattern[(day + empIdx) % pattern.length]
      const shift = SHIFTS.find((s) => s.abrv === abrv)
      duties.push({
        id: id++,
        employee_id: emp.id,
        shift_id: shift.id,
        day,
        month,
        year,
        wish_injury: 0,
        preference_injury: 1,
      })
    }
  })
  return duties
}

function buildSeedAbsences() {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const d = (day) =>
    `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return [
    { id: 1, employee_id: 1, type: 'vacation', start_date: d(5), end_date: d(12), note: 'Jahresurlaub' },
    { id: 2, employee_id: 2, type: 'sick', start_date: d(18), end_date: d(20), note: null },
    { id: 3, employee_id: 3, type: 'training', start_date: d(25), end_date: d(26), note: 'Fortbildung' },
  ]
}

function freshDb() {
  return {
    qualifications: clone(QUALIFICATIONS),
    shift_types: clone(SHIFT_TYPES),
    shifts: clone(SHIFTS),
    employees: clone(EMPLOYEES),
    duties: buildSeedDuties(),
    wishes: [],
    preferences: [],
    working_hours_diffs: [],
    absences: buildSeedAbsences(),
  }
}

const clone = (v) => JSON.parse(JSON.stringify(v))

let db

function loadDb() {
  const params = new URLSearchParams(window.location.search)
  if (params.has('reset')) {
    window.localStorage.removeItem(STORAGE_KEY)
  }
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      db = JSON.parse(raw)
      return
    } catch (e) {
      /* fällt unten auf frischen Stand zurück */
    }
  }
  db = freshDb()
  persist()
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch (e) {
    /* localStorage evtl. nicht verfügbar – Demo läuft trotzdem im Speicher */
  }
}

const nextId = (list) =>
  list.reduce((max, item) => Math.max(max, item.id), 0) + 1

const withQualification = (emp) => ({
  ...emp,
  qualification: db.qualifications.find((q) => q.id === emp.qualification_id) || null,
})

const withShiftType = (shift) => ({
  ...shift,
  shift_type: db.shift_types.find((t) => t.id === shift.shift_type_id) || null,
})

function dutyWithRelations(duty) {
  const shift = db.shifts.find((s) => s.id === duty.shift_id)
  return { ...duty, shift: shift ? withShiftType(shift) : null }
}

// --- Generator-Portierung (kongruent zu App\Services\* ; siehe
//     .claude/memory/algorithm-notes.md). Vereinfacht, da kein PHP im Browser.
const ROSTER_CFG = {
  maxConsecutive: 6,
  forbidden: [{ from: 'Nachtschicht', to: 'Frühschicht' }],
  w: { understaffed: 50, isolated: 8, third: -2, twoFree: -5 },
  typePriority: ['Frühschicht', 'Spätschicht', 'Nachtschicht'],
}

function sequenceStrain(seq, days) {
  let strain = 0
  let run = 0
  for (let d = 1; d <= days; d++) {
    const cur = seq[d]
    if (d > 1 && cur && seq[d - 1]) {
      for (const t of ROSTER_CFG.forbidden) {
        if (seq[d - 1] === t.from && cur === t.to) return Infinity
      }
    }
    if (cur) {
      run++
    } else {
      if (run > ROSTER_CFG.maxConsecutive) return Infinity
      if (run === 3) strain += ROSTER_CFG.w.third
      run = 0
    }
  }
  if (run > ROSTER_CFG.maxConsecutive) return Infinity
  if (run === 3) strain += ROSTER_CFG.w.third
  for (let d = 1; d <= days; d++) {
    if (seq[d]) continue
    const prevDuty = d > 1 && seq[d - 1]
    const nextDuty = d < days && seq[d + 1]
    const nextFree = d < days && !seq[d + 1]
    if (prevDuty && nextDuty) strain += ROSTER_CFG.w.isolated
    else if (nextFree && !(d > 1 && !seq[d - 1])) strain += ROSTER_CFG.w.twoFree
  }
  return strain
}

function runGenerator(year, month) {
  const days = new Date(year, month, 0).getDate()
  const employees = [...db.employees].sort((a, b) => a.id - b.id)
  const typeById = Object.fromEntries(db.shift_types.map((t) => [t.id, t]))
  const shiftByType = {}
  for (const s of [...db.shifts].sort((a, b) => a.id - b.id)) {
    const t = typeById[s.shift_type_id]
    if (t && t.active_duty && !shiftByType[t.name]) shiftByType[t.name] = s
  }
  const activeTypes = ROSTER_CFG.typePriority
    .filter((n) => shiftByType[n])
    .map((n) => db.shift_types.find((t) => t.name === n))

  const pad = (n) => String(n).padStart(2, '0')
  const isAbsent = (empId, day) => {
    const date = `${year}-${pad(month)}-${pad(day)}`
    return db.absences.some(
      (a) => a.employee_id === empId && date >= a.start_date && date <= a.end_date
    )
  }
  const wishAt = (empId, day) =>
    db.wishes.filter(
      (w) => w.employee_id === empId && w.day === day && w.month === month && w.year === year
    )
  const hasPref = (empId, shiftId) =>
    db.preferences.some((p) => p.employee_id === empId && p.shift_id === shiftId)

  const assigned = {}
  const dutyCount = {}
  const runLen = {}
  const prevType = {}
  const target = {}
  for (const e of employees) {
    dutyCount[e.id] = 0
    runLen[e.id] = 0
    prevType[e.id] = null
    target[e.id] = Math.round((days * ((e.employment_ratio || 100) / 100) * 5) / 7)
  }

  for (let day = 1; day <= days; day++) {
    const today = {}
    for (const type of activeTypes) {
      const slots = Math.max(type.opt_occupation || 0, type.min_occupation || 0)
      if (slots <= 0) continue
      const shift = shiftByType[type.name]
      const cands = []
      for (const e of employees) {
        if (today[e.id]) continue
        if (isAbsent(e.id, day)) continue
        if (dutyCount[e.id] >= target[e.id]) continue
        if (runLen[e.id] >= ROSTER_CFG.maxConsecutive) continue
        if (
          prevType[e.id] &&
          ROSTER_CFG.forbidden.some(
            (t) => t.from === prevType[e.id] && t.to === type.name
          )
        )
          continue
        let bonus = 0
        if (wishAt(e.id, day).some((w) => w.shift_id === shift.id)) bonus -= 3
        if (hasPref(e.id, shift.id)) bonus -= 1
        cands.push({ e, key: [bonus, dutyCount[e.id], e.id] })
      }
      cands.sort((a, b) =>
        a.key[0] - b.key[0] || a.key[1] - b.key[1] || a.key[2] - b.key[2]
      )
      for (const c of cands.slice(0, slots)) {
        ;(assigned[c.e.id] ||= {})[day] = shift
        today[c.e.id] = true
        dutyCount[c.e.id]++
      }
    }
    for (const e of employees) {
      if (assigned[e.id] && assigned[e.id][day]) {
        runLen[e.id]++
        prevType[e.id] = typeById[assigned[e.id][day].shift_type_id].name
      } else {
        runLen[e.id] = 0
        prevType[e.id] = null
      }
    }
  }

  const newDuties = []
  const countByType = {}
  let nid = 1
  for (const e of employees) {
    for (let day = 1; day <= days; day++) {
      const shift = assigned[e.id] && assigned[e.id][day]
      if (!shift) continue
      const tName = typeById[shift.shift_type_id].name
      const wishes = wishAt(e.id, day)
      const wishInjury = wishes.length
        ? wishes.some((w) => w.shift_id === shift.id)
          ? 0
          : 1
        : 0
      newDuties.push({
        id: nid++,
        employee_id: e.id,
        shift_id: shift.id,
        day,
        month,
        year,
        wish_injury: wishInjury,
        preference_injury: hasPref(e.id, shift.id) ? 0 : 1,
      })
      ;(countByType[tName] ||= {})[day] = (countByType[tName]?.[day] || 0) + 1
    }
  }

  let empStrain = 0
  let forbidden = false
  for (const e of employees) {
    const seq = {}
    for (let d = 1; d <= days; d++) {
      const s = assigned[e.id] && assigned[e.id][d]
      seq[d] = s ? typeById[s.shift_type_id].name : null
    }
    const v = sequenceStrain(seq, days)
    if (!isFinite(v)) forbidden = true
    else empStrain += v
  }
  let occStrain = 0
  for (const type of activeTypes) {
    const min = type.min_occupation || 0
    if (min <= 0) continue
    for (const cnt of Object.values(countByType[type.name] || {})) {
      if (cnt < min) occStrain += ROSTER_CFG.w.understaffed * (min - cnt)
    }
  }

  // Monat ersetzen + persistieren
  db.duties = db.duties.filter((d) => !(d.year === year && d.month === month))
  const maxId = db.duties.reduce((m, d) => Math.max(m, d.id), 0)
  newDuties.forEach((d, i) => (d.id = maxId + 1 + i))
  db.duties.push(...newDuties)
  persist()

  return {
    duties: newDuties.map(dutyWithRelations),
    summary: {
      employee_strain: Math.round(empStrain * 100) / 100,
      occupation_strain: Math.round(occStrain * 100) / 100,
      total_strain: Math.round((empStrain + occStrain) * 100) / 100,
      forbidden,
      assigned_duties: newDuties.length,
    },
  }
}

function ok(data, status = 200) {
  return Promise.resolve({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
    request: {},
  })
}

function fail(data, status) {
  const error = new Error('Request failed with status code ' + status)
  error.response = { data, status, statusText: 'Error', headers: {}, config: {} }
  return Promise.reject(error)
}

function recalcDutyInjuries(duty) {
  const wish = db.wishes.find(
    (w) =>
      w.employee_id === duty.employee_id &&
      w.day === duty.day &&
      w.month === duty.month &&
      w.year === duty.year
  )
  duty.wish_injury = !wish ? 0 : wish.shift_id === duty.shift_id ? 0 : 1

  const pref = db.preferences.find(
    (p) => p.employee_id === duty.employee_id && p.shift_id === duty.shift_id
  )
  duty.preference_injury = pref ? 0 : 1
  return duty
}

function handle(method, path, body) {
  const seg = path.replace(/^\/+|\/+$/g, '').split('/') // z.B. ['api','duties','2026','5']
  // seg[0] === 'api'
  const r = seg.slice(1)

  // ---- duties ----
  if (r[0] === 'duty' && method === 'patch') {
    const d = body.dutyData
    const shift = db.shifts.find((s) => s.abrv === d.value)
    if (!shift) return fail({ exception: 'Schicht mit diesem Kürzel nicht gefunden.' }, 404)
    let duty = db.duties.find(
      (x) =>
        x.employee_id === d.employee_id &&
        x.day === d.day &&
        x.month === d.month &&
        x.year === d.year
    )
    if (!duty) {
      duty = {
        id: nextId(db.duties),
        employee_id: d.employee_id,
        shift_id: shift.id,
        day: d.day,
        month: d.month,
        year: d.year,
        wish_injury: 0,
        preference_injury: 1,
      }
      db.duties.push(duty)
    } else {
      duty.shift_id = shift.id
    }
    recalcDutyInjuries(duty)
    persist()
    return ok({ new_duty: dutyWithRelations(duty) })
  }

  if (r[0] === 'duty' && method === 'delete') {
    const d = body.dutyData
    const idx = db.duties.findIndex(
      (x) =>
        x.employee_id === d.employee_id &&
        x.day === d.day &&
        x.month === d.month &&
        x.year === d.year
    )
    const deleted = idx >= 0 ? db.duties.splice(idx, 1)[0] : null
    persist()
    return ok({ deleted_duty: deleted })
  }

  if (r[0] === 'duties' && r[1] === 'generate' && method === 'post') {
    const result = runGenerator(Number(body.year), Number(body.month))
    return ok(result)
  }

  if (r[0] === 'duties') {
    if (r.length === 1) {
      return ok({ employees: db.employees.map(withQualification), duties: [] })
    }
    const year = Number(r[1])
    const month = Number(r[2])
    let list = db.duties.filter((x) => x.year === year && x.month === month)
    if (r[3]) list = list.filter((x) => x.employee_id === Number(r[3]))
    return ok({ duties: list.map(dutyWithRelations) })
  }

  // ---- employees ----
  if (r[0] === 'employees') {
    if (method === 'get' && r.length === 1)
      return ok({ employees: db.employees.map(withQualification) })
    if (method === 'get' && r[1]) {
      const emp = db.employees.find((e) => e.id === Number(r[1]))
      return ok({ employee: emp ? withQualification(emp) : null })
    }
    if (method === 'post') {
      const e = body.employeeData
      const created = {
        id: nextId(db.employees),
        first_name: e.first_name,
        last_name: e.last_name,
        daily_worktime: e.daily_worktime,
        employment_ratio: e.employment_ratio,
        qualification_id: Number(e.qualification_id),
      }
      db.employees.push(created)
      persist()
      return ok([null], 201)
    }
    if (method === 'patch') {
      const e = body.employeeData
      const emp = db.employees.find((x) => x.id === Number(r[1]))
      if (emp) {
        emp.first_name = e.first_name
        emp.last_name = e.last_name
        emp.daily_worktime = e.daily_worktime
        emp.employment_ratio = e.employment_ratio
        emp.qualification_id = Number(e.qualification_id)
        persist()
      }
      return ok({ employee: emp }, 201)
    }
    if (method === 'delete') {
      const idx = db.employees.findIndex((x) => x.id === Number(r[1]))
      const deleted = idx >= 0 ? db.employees.splice(idx, 1)[0] : null
      persist()
      return ok({ deleted_employee: deleted })
    }
  }

  // ---- generische Resource-Endpoints ----
  const RES = {
    qualifications: { col: 'qualifications', payload: 'qualificationsData', single: 'qualification', del: 'deleted_qualification' },
    shifts: { col: 'shifts', payload: 'shiftsData', single: 'shift', del: 'deleted_shift' },
    shift_types: { col: 'shift_types', payload: 'shiftTypesData', single: 'shift_type', del: 'deleted_shift_type' },
  }
  if (RES[r[0]]) {
    const cfg = RES[r[0]]
    const col = db[cfg.col]
    if (method === 'get') {
      // Echtes Backend liefert Shifts mit eager-loaded shift_type
      // (ShiftController@index: Shift::with('shift_type')).
      const payloadCol =
        cfg.col === 'shifts' ? col.map(withShiftType) : col
      return ok({ [cfg.col]: payloadCol })
    }
    if (method === 'post') {
      const data = body[cfg.payload] || {}
      const created = { ...data, id: nextId(col) }
      col.push(created)
      persist()
      return ok([null], 201)
    }
    if (method === 'patch') {
      const id = Number(r[1])
      const data =
        body[cfg.payload] ||
        body[cfg.single + 'Data'] ||
        body.qualificationData ||
        body.shiftsData ||
        body.shiftTypeData ||
        {}
      const item = col.find((x) => x.id === id)
      if (item) Object.assign(item, data, { id })
      persist()
      return ok({ [cfg.single]: item }, 201)
    }
    if (method === 'delete') {
      const id = Number(r[1])
      const idx = col.findIndex((x) => x.id === id)
      const deleted = idx >= 0 ? col.splice(idx, 1)[0] : null
      persist()
      return ok({ [cfg.del]: deleted })
    }
  }

  // ---- wishes ----
  if (r[0] === 'wishes' && method === 'get') {
    const list = db.wishes.map((w) => ({
      ...w,
      employee: db.employees.find((e) => e.id === w.employee_id) || null,
      shift: db.shifts.find((s) => s.id === w.shift_id) || null,
    }))
    return ok({ wishes: list })
  }
  if (r[0] === 'wishesByEmployee') {
    const empId = Number(r[1])
    const list = db.wishes
      .filter((w) => w.employee_id === empId)
      .map((w) => ({ ...w, shift: db.shifts.find((s) => s.id === w.shift_id) || null }))
    return ok(list)
  }
  if (r[0] === 'wish' && method === 'post') {
    const w = body.wishData
    let existing = db.wishes.find(
      (x) =>
        x.employee_id === w.employee_id &&
        x.day === w.day &&
        x.month === w.month &&
        x.year === w.year
    )
    if (!existing) {
      existing = {
        id: nextId(db.wishes),
        employee_id: w.employee_id,
        shift_id: w.shift_id,
        day: w.day,
        month: w.month,
        year: w.year,
      }
      db.wishes.push(existing)
      const duty = db.duties.find(
        (x) =>
          x.employee_id === w.employee_id &&
          x.day === w.day &&
          x.month === w.month &&
          x.year === w.year
      )
      if (duty) recalcDutyInjuries(duty)
    }
    persist()
    return ok(
      {
        new_wish: {
          ...existing,
          shift: db.shifts.find((s) => s.id === existing.shift_id) || null,
        },
      },
      201
    )
  }
  if (r[0] === 'wishes' && method === 'delete') {
    const id = Number(r[1])
    const idx = db.wishes.findIndex((x) => x.id === id)
    const deleted = idx >= 0 ? db.wishes.splice(idx, 1)[0] : null
    if (deleted) {
      const duty = db.duties.find(
        (x) =>
          x.employee_id === deleted.employee_id &&
          x.day === deleted.day &&
          x.month === deleted.month &&
          x.year === deleted.year
      )
      if (duty) recalcDutyInjuries(duty)
    }
    persist()
    return ok({ deleted_wish: deleted })
  }

  // ---- preferences ----
  if (r[0] === 'preferences' && method === 'get') {
    return ok({ preferences: db.preferences })
  }
  if (r[0] === 'preference' && method === 'post') {
    const p = body.preferenceData
    let existing = db.preferences.find(
      (x) => x.employee_id === p.employee_id && x.shift_id === p.shift_id
    )
    if (p.active == 1) {
      if (!existing) {
        existing = { id: nextId(db.preferences), employee_id: p.employee_id, shift_id: p.shift_id }
        db.preferences.push(existing)
        db.duties
          .filter((d) => d.employee_id === p.employee_id && d.shift_id === p.shift_id)
          .forEach((d) => (d.preference_injury = 0))
      }
      persist()
      return ok({ preference: existing }, 201)
    } else {
      if (existing) {
        db.preferences = db.preferences.filter((x) => x.id !== existing.id)
        db.duties
          .filter((d) => d.employee_id === p.employee_id && d.shift_id === p.shift_id)
          .forEach((d) => (d.preference_injury = 1))
      }
      persist()
      return ok({ preference: existing || { id: null } }, 201)
    }
  }
  if (r[0] === 'preference' && method === 'delete') {
    const p = body.preferenceData
    const removed = db.preferences.filter(
      (x) => x.employee_id === p.employee_id && x.shift_id === p.shift_id
    )
    db.preferences = db.preferences.filter(
      (x) => !(x.employee_id === p.employee_id && x.shift_id === p.shift_id)
    )
    persist()
    return ok({ deleted_preference: removed }, 201)
  }

  // ---- working hours diffs ----
  if (r[0] === 'working_hours_diffs') {
    if (method === 'get') return ok({ workingHoursDiffs: db.working_hours_diffs })
    if (method === 'post') {
      const w = body.workingHoursDiffData
      let item = db.working_hours_diffs.find(
        (x) =>
          x.employee_id === w.employee_id &&
          x.month === w.month &&
          x.year === w.year
      )
      if (!item) {
        item = {
          id: nextId(db.working_hours_diffs),
          employee_id: w.employee_id,
          month: w.month,
          year: w.year,
          diff: w.diff,
        }
        db.working_hours_diffs.push(item)
      } else {
        item.diff = w.diff
      }
      persist()
      return ok({
        new_working_hours_diff: {
          ...item,
          employee: db.employees.find((e) => e.id === item.employee_id) || null,
        },
      })
    }
  }

  // ---- absences (Urlaub/Krankheit/Fortbildung) ----
  if (r[0] === 'absences') {
    const withEmployee = (a) => ({
      ...a,
      employee: db.employees.find((e) => e.id === a.employee_id) || null,
    })
    if (method === 'get' && !r[1]) {
      return ok({ absences: db.absences.map(withEmployee) })
    }
    if (method === 'get' && r[1]) {
      const a = db.absences.find((x) => x.id === Number(r[1]))
      return ok({ absence: a ? withEmployee(a) : null })
    }
    if (method === 'post') {
      const created = {
        id: nextId(db.absences),
        employee_id: Number(body.employee_id),
        type: body.type,
        start_date: body.start_date,
        end_date: body.end_date,
        note: body.note ?? null,
      }
      db.absences.push(created)
      persist()
      return ok({ absence: withEmployee(created) }, 201)
    }
    if ((method === 'put' || method === 'patch') && r[1]) {
      const a = db.absences.find((x) => x.id === Number(r[1]))
      if (a) {
        Object.assign(a, {
          employee_id: Number(body.employee_id ?? a.employee_id),
          type: body.type ?? a.type,
          start_date: body.start_date ?? a.start_date,
          end_date: body.end_date ?? a.end_date,
          note: body.note ?? a.note,
        })
        persist()
      }
      return ok({ absence: a ? withEmployee(a) : null })
    }
    if (method === 'delete' && r[1]) {
      const idx = db.absences.findIndex((x) => x.id === Number(r[1]))
      const deleted = idx >= 0 ? db.absences.splice(idx, 1)[0] : null
      persist()
      return ok({ deleted_absence: deleted })
    }
  }

  return fail({ message: 'Mock: unbekannte Route ' + method.toUpperCase() + ' ' + path }, 404)
}

function mockAdapter(config) {
  loadDbOnce()
  const method = (config.method || 'get').toLowerCase()
  let pathname
  try {
    pathname = new URL(config.url, window.location.origin).pathname
  } catch (e) {
    pathname = config.url
  }
  let body = {}
  if (config.data) {
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    } catch (e) {
      body = {}
    }
  }
  // kleine künstliche Latenz, damit Lade-Spinner sichtbar werden
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      handle(method, pathname, body).then(resolve, reject)
    }, 120)
  })
}

let dbLoaded = false
function loadDbOnce() {
  if (!dbLoaded) {
    loadDb()
    dbLoaded = true
  }
}

export function installMockApi() {
  loadDbOnce()
  if (window.axios) {
    window.axios.defaults.adapter = mockAdapter
  }
}
