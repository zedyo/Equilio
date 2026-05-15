/**
 * In-Browser-Mock des Laravel-Backends.
 *
 * Wird nur aktiv, wenn `window.__YETI_DEMO__ === true` gesetzt ist
 * (siehe statische index.html des GitHub-Pages-Builds). Im normalen
 * Laravel-Betrieb wird dieses Modul nicht geladen, der echte API-Server
 * bleibt unangetastet.
 *
 * Daten entsprechen den Laravel-Seedern und werden in localStorage
 * gehalten, damit Änderungen einen Reload überleben. `?reset` in der
 * URL setzt den Demo-Datenstand zurück.
 */

const STORAGE_KEY = 'yeti_demo_db_v1'

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

  if (r[0] === 'duty' && method === 'post') {
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
  if (r[0] === 'preference' && method === 'patch') {
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
