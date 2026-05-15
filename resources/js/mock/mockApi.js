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

import {
  RR_QUALIFICATIONS,
  RR_SHIFT_TYPES,
  RR_SHIFTS,
  RR_EMPLOYEES,
  RR_DUTIES_RAW,
} from './realRosterData.js'

// v2: anonymisierter Real-Datensatz (löst die alten Beispieldaten ab).
const STORAGE_KEY = 'equilio_demo_db_v2'

const QUALIFICATIONS = RR_QUALIFICATIONS
const SHIFT_TYPES = RR_SHIFT_TYPES
const SHIFTS = RR_SHIFTS
const EMPLOYEES = RR_EMPLOYEES

// Quelle deckt 5 aufeinanderfolgende Monate (Jan–Mai) ab. Auf ein
// rollierendes Fenster mappen, das im *aktuellen* Monat endet
// (Quellmonat 5 -> aktueller Monat) – identisch zur Logik in
// database/seeders/RealRosterSeeder.php.
function buildSeedDuties() {
  const now = new Date()
  const map = {}
  for (let m = 1; m <= 5; m++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - m), 1)
    map[m] = { year: d.getFullYear(), month: d.getMonth() + 1 }
  }
  return RR_DUTIES_RAW.map(([employee_id, shift_id, day, srcMonth], i) => ({
    id: i + 1,
    employee_id,
    shift_id,
    day,
    month: map[srcMonth].month,
    year: map[srcMonth].year,
    wish_injury: 0,
    preference_injury: 0,
  }))
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
  w: { understaffed: 50, isolated: 8, third: -2, twoFree: -5, missingQual: 30 },
  typePriority: ['Frühschicht', 'Spätschicht', 'Nachtschicht'],
  requiredQualification: 'Examinierte Pflegefachkraft',
  fullTimeWeekly: 39,
  annealing: { iterations: 3000, startTemp: 10, cooling: 0.999, seed: 1337 },
}

// Deterministischer PRNG (mulberry32) — Pendant zu mt_srand/mt_rand,
// damit die Demo-SA wie das Backend reproduzierbar ist.
function mulberry32(seed) {
  let t = seed >>> 0
  return function () {
    t = (t + 0x6d2b79f5) >>> 0
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
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

  const reqQual = ROSTER_CFG.requiredQualification
  const qualDescById = Object.fromEntries(
    db.qualifications.map((q) => [q.id, q.description])
  )
  const isQualified = (emp) =>
    reqQual === null || qualDescById[emp.qualification_id] === reqQual

  const assigned = {}
  const dutyCount = {}
  const runLen = {}
  const prevType = {}
  const target = {}
  const sollHours = {}
  const activeShiftHours = ROSTER_CFG.typePriority
    .filter((n) => shiftByType[n])
    .map((n) => shiftByType[n].h_duration || 8)
  const avgShiftHours = activeShiftHours.length
    ? activeShiftHours.reduce((a, b) => a + b, 0) / activeShiftHours.length
    : 8
  for (const e of employees) {
    dutyCount[e.id] = 0
    runLen[e.id] = 0
    prevType[e.id] = null
    sollHours[e.id] =
      Math.round(
        ROSTER_CFG.fullTimeWeekly * ((e.employment_ratio || 100) / 100) * (days / 7) * 100
      ) / 100
    target[e.id] = Math.max(0, Math.round(sollHours[e.id] / avgShiftHours))
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
      let fill = cands.slice(0, slots)
      if (reqQual !== null && fill.length) {
        if (!fill.some((c) => isQualified(c.e))) {
          const q = cands.find((c) => isQualified(c.e))
          if (q) {
            fill.pop()
            fill.unshift(q)
          }
        }
      }
      for (const c of fill) {
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

  // Phase 2b: arbeitslast-/besetzungserhaltender 2-Tausch (Hill-Climbing),
  // kongruent zu RosterGenerator::localSearch (siehe algorithm-notes.md).
  const seqOf = (id) => {
    const s = {}
    for (let d = 1; d <= days; d++) {
      const sh = assigned[id] && assigned[id][d]
      s[d] = sh ? typeById[sh.shift_type_id].name : null
    }
    return s
  }
  const empById = Object.fromEntries(employees.map((e) => [e.id, e]))
  const qualCovered = (typeName, day) => {
    for (const id of Object.keys(assigned)) {
      const sh = assigned[id] && assigned[id][day]
      if (
        sh &&
        typeById[sh.shift_type_id].name === typeName &&
        empById[id] &&
        isQualified(empById[id])
      )
        return true
    }
    return false
  }
  for (let pass = 0; pass < 6; pass++) {
    let improved = false
    for (const a of employees) {
      const aId = a.id
      const workDays = []
      const freeDays = []
      for (let d = 1; d <= days; d++) {
        if (assigned[aId] && assigned[aId][d]) workDays.push(d)
        else if (!isAbsent(aId, d)) freeDays.push(d)
      }
      if (!workDays.length || !freeDays.length) continue
      const aStrain = sequenceStrain(seqOf(aId), days)
      let done = false
      for (const d of workDays) {
        for (const e of freeDays) {
          for (const b of employees) {
            const bId = b.id
            if (bId === aId) continue
            if (!(assigned[bId] && assigned[bId][e]) || (assigned[bId] && assigned[bId][d]))
              continue
            if (isAbsent(bId, d)) continue
            const shiftA = assigned[aId][d]
            const shiftB = assigned[bId][e]
            let before = aStrain + sequenceStrain(seqOf(bId), days)
            if (!isFinite(before)) before = Number.MAX_VALUE
            const typeA = typeById[shiftA.shift_type_id].name
            const typeB = typeById[shiftB.shift_type_id].name
            const covAd = qualCovered(typeA, d)
            const covBe = qualCovered(typeB, e)
            delete assigned[aId][d]
            assigned[aId][e] = shiftB
            delete assigned[bId][e]
            assigned[bId][d] = shiftA
            const aNew = sequenceStrain(seqOf(aId), days)
            const bNew = sequenceStrain(seqOf(bId), days)
            const qualOk =
              (!covAd || qualCovered(typeA, d)) &&
              (!covBe || qualCovered(typeB, e))
            if (
              qualOk &&
              isFinite(aNew) &&
              isFinite(bNew) &&
              aNew + bNew < before - 0.0001
            ) {
              improved = true
              done = true
              break
            }
            delete assigned[aId][e]
            assigned[aId][d] = shiftA
            delete assigned[bId][d]
            assigned[bId][e] = shiftB
          }
          if (done) break
        }
        if (done) break
      }
    }
    if (!improved) break
  }

  // Phase 2g: Simulated Annealing (kongruent zu
  // RosterGenerator::simulatedAnnealing) — selbe sichere 2-Tausch-
  // Nachbarschaft + Qual-Guard, deterministischer PRNG, beste Lösung
  // gesichert (nie schlechter als die lokale Suche).
  {
    const sa = ROSTER_CFG.annealing
    const rnd = mulberry32(sa.seed)
    const list = employees
    const N = list.length
    if (N >= 2) {
      const snapshot = () => {
        const c = {}
        for (const id of Object.keys(assigned)) c[id] = { ...assigned[id] }
        return c
      }
      let best = snapshot()
      let cum = 0
      let bestCum = 0
      let temp = sa.startTemp
      for (let i = 0; i < sa.iterations; i++, temp *= sa.cooling) {
        const a = list[Math.floor(rnd() * N)]
        const b = list[Math.floor(rnd() * N)]
        if (a.id === b.id) continue
        const aDays = Object.keys(assigned[a.id] || {}).map(Number)
        const bDays = Object.keys(assigned[b.id] || {}).map(Number)
        if (!aDays.length || !bDays.length) continue
        const d = aDays[Math.floor(rnd() * aDays.length)]
        if ((assigned[b.id] && assigned[b.id][d]) || isAbsent(b.id, d)) continue
        const e = bDays[Math.floor(rnd() * bDays.length)]
        if ((assigned[a.id] && assigned[a.id][e]) || isAbsent(a.id, e)) continue

        const shiftA = assigned[a.id][d]
        const shiftB = assigned[b.id][e]
        const typeA = typeById[shiftA.shift_type_id].name
        const typeB = typeById[shiftB.shift_type_id].name
        const covAd = qualCovered(typeA, d)
        const covBe = qualCovered(typeB, e)

        const aOld = sequenceStrain(seqOf(a.id), days)
        const bOld = sequenceStrain(seqOf(b.id), days)
        delete assigned[a.id][d]
        assigned[a.id][e] = shiftB
        delete assigned[b.id][e]
        assigned[b.id][d] = shiftA
        const aNew = sequenceStrain(seqOf(a.id), days)
        const bNew = sequenceStrain(seqOf(b.id), days)
        const delta = aNew + bNew - aOld - bOld

        const qualOk =
          (!covAd || qualCovered(typeA, d)) &&
          (!covBe || qualCovered(typeB, e))
        const accept =
          qualOk &&
          isFinite(delta) &&
          (delta <= 0 || rnd() < Math.exp(-delta / Math.max(temp, 1e-6)))

        if (accept) {
          cum += delta
          if (cum < bestCum - 1e-9) {
            bestCum = cum
            best = snapshot()
          }
        } else {
          delete assigned[a.id][e]
          assigned[a.id][d] = shiftA
          delete assigned[b.id][d]
          assigned[b.id][e] = shiftB
        }
      }
      for (const id of Object.keys(assigned)) delete assigned[id]
      for (const id of Object.keys(best)) assigned[id] = best[id]
    }
  }

  const newDuties = []
  const countByType = {}
  const qualByType = {}
  const istHours = {}
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
      ;(qualByType[tName] ||= {})[day] =
        (qualByType[tName]?.[day] || false) || isQualified(e)
      istHours[e.id] = (istHours[e.id] || 0) + (shift.h_duration || 0)
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

  let missingQual = 0
  if (reqQual !== null) {
    for (const tName of Object.keys(countByType)) {
      for (const day of Object.keys(countByType[tName])) {
        if (countByType[tName][day] > 0 && !qualByType[tName]?.[day]) missingQual++
      }
    }
  }
  const qualStrain = ROSTER_CFG.w.missingQual * missingQual

  // Soll-/Ist-Stundenkonto
  const hours = []
  let imbalance = 0
  for (const e of employees) {
    const soll = Math.round((sollHours[e.id] || 0) * 100) / 100
    const ist = Math.round((istHours[e.id] || 0) * 100) / 100
    const diff = Math.round((ist - soll) * 100) / 100
    hours.push({ employee_id: e.id, soll, ist, diff })
    imbalance += Math.abs(diff)
  }

  // Monat ersetzen + persistieren
  db.duties = db.duties.filter((d) => !(d.year === year && d.month === month))
  const maxId = db.duties.reduce((m, d) => Math.max(m, d.id), 0)
  newDuties.forEach((d, i) => (d.id = maxId + 1 + i))
  db.duties.push(...newDuties)
  for (const h of hours) {
    let row = db.working_hours_diffs.find(
      (w) => w.employee_id === h.employee_id && w.month === month && w.year === year
    )
    if (row) row.diff = h.diff
    else
      db.working_hours_diffs.push({
        id: nextId(db.working_hours_diffs),
        employee_id: h.employee_id,
        month,
        year,
        diff: h.diff,
      })
  }
  persist()

  return {
    duties: newDuties.map(dutyWithRelations),
    hours,
    summary: {
      employee_strain: Math.round(empStrain * 100) / 100,
      occupation_strain: Math.round(occStrain * 100) / 100,
      qualification_strain: Math.round(qualStrain * 100) / 100,
      missing_qualification: missingQual,
      hours_imbalance: Math.round(imbalance * 100) / 100,
      total_strain:
        Math.round((empStrain + occStrain + qualStrain) * 100) / 100,
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
