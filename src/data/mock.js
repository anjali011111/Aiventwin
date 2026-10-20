/**
 * ALL DATA IN THIS FILE IS SYNTHETIC. No real patient, clinician or evidence record.
 * Replace via src/services/api.js once the FastAPI backend exists.
 */

export const patient = {
  id: 'P-001', name: 'Priya Reddy', first: 'Priya', age: 24, sex: 'Female', blood: 'B+',
  allergies: 'None recorded', conditions: 'None recorded', lastVisit: '10 Aug 2026', status: 'Active',
};

export const doctorUser = { name: 'Dr. Ananya Sharma', role: 'General Physician' };

export const trend6m = [
  { m: 'May', heartRate: 74, systolic: 122, glucose: 97 },
  { m: 'Jun', heartRate: 71, systolic: 119, glucose: 94 },
  { m: 'Jul', heartRate: 76, systolic: 124, glucose: 99 },
  { m: 'Aug', heartRate: 70, systolic: 118, glucose: 93 },
  { m: 'Sep', heartRate: 73, systolic: 121, glucose: 96 },
  { m: 'Oct', heartRate: 72, systolic: 120, glucose: 95 },
];

export const vitalSeries = {
  heartRate: [68, 70, 74, 71, 69, 72, 75, 72],
  systolic: [118, 121, 120, 123, 119, 122, 120, 120],
  glucose: [92, 96, 94, 99, 93, 97, 95, 95],
  spo2: [98, 97, 98, 99, 98, 98, 97, 98],
  sleep: [6.8, 7.2, 7.5, 6.5, 7.9, 7.1, 7.3, 7.5],
  steps: [5200, 7800, 3100, 9600, 4400, 8100, 6000, 4230],
};

export const organs = {
  brain:   { name: 'Brain',   system: 'Neurological',   metrics: [['Sleep', '7.5 hrs', 'normal'], ['Reported stress', 'Low', 'normal']], note: 'Sleep-derived indicators only in this prototype.' },
  heart:   { name: 'Heart',   system: 'Cardiovascular', metrics: [['Heart rate', '72 bpm', 'normal'], ['Blood pressure', '120/80 mmHg', 'normal'], ['LDL (last lab)', '110 mg/dL', 'normal']], note: 'Values derive from the latest Twin snapshot.' },
  lungs:   { name: 'Lungs',   system: 'Respiratory',    metrics: [['SpO₂', '98 %', 'normal'], ['Resp. rate', '15 /min', 'normal']], note: 'Chest X-ray 10 Aug 2026: no acute findings (synthetic).' },
  stomach: { name: 'Stomach', system: 'Digestive',      metrics: [['Fasting glucose', '95 mg/dL', 'normal'], ['Reported symptoms', 'None', 'normal']], note: 'Placeholder module — future organ-system twin.' },
  liver:   { name: 'Liver',   system: 'Hepatic',        metrics: [['ALT', '24 U/L', 'normal'], ['AST', '22 U/L', 'normal']], note: 'Placeholder module — future organ-system twin.' },
  kidneys: { name: 'Kidneys', system: 'Renal',          metrics: [['Creatinine', '0.8 mg/dL', 'normal'], ['eGFR', '112', 'normal']], note: 'Placeholder module — future organ-system twin.' },
};

export const records = [
  { id: 'r1', type: 'Lab', title: 'Complete Blood Count (CBC)', date: '12 Aug 2026', status: 'Normal' },
  { id: 'r2', type: 'Lab', title: 'Lipid Profile', date: '12 Aug 2026', status: 'High' },
  { id: 'r3', type: 'Imaging', title: 'Chest X-Ray', date: '10 Aug 2026', status: 'View' },
  { id: 'r4', type: 'Prescription', title: 'Prescription — Diabetes Medication', date: '10 Aug 2026', status: 'View' },
  { id: 'r5', type: 'Visit', title: 'Doctor Visit Summary — Dr. Sharma', date: '10 Aug 2026', status: 'View' },
  { id: 'r6', type: 'Lab', title: 'HbA1c', date: '02 Jun 2026', status: 'Normal' },
];

export const medications = [
  { id: 'm1', name: 'Atorvastatin', dose: '10 mg', freq: 'Once daily, evening', start: '10 Aug 2026', status: 'Active', for: 'Lipid management (synthetic)' },
  { id: 'm2', name: 'Vitamin D3', dose: '1000 IU', freq: 'Once daily', start: '02 Jun 2026', status: 'Active', for: 'Supplement' },
  { id: 'm3', name: 'Amoxicillin', dose: '500 mg', freq: 'Three times daily', start: '14 Feb 2026', end: '21 Feb 2026', status: 'Completed', for: 'Short course' },
];

export const doctors = [
  { id: 'd1', name: 'Dr. Ananya Sharma', specialty: 'General Physician', rating: 4.8, reviews: 320, slots: ['10:00 AM', '11:00 AM', '12:00 PM'] },
  { id: 'd2', name: 'Dr. Rahul Mehta', specialty: 'Cardiologist', rating: 4.7, reviews: 280, slots: ['11:00 AM', '01:00 PM', '03:00 PM'] },
  { id: 'd3', name: 'Dr. Priya Nair', specialty: 'Endocrinologist', rating: 4.9, reviews: 410, slots: ['09:00 AM', '10:30 AM', '04:00 PM'] },
];

export const upcoming = [{ id: 'a1', doctor: 'Dr. Ananya Sharma', specialty: 'General Physician', when: '24 Oct 2026 · 11:00 AM', reason: 'Repeat lipid profile review' }];

export const clinicianPatients = [
  { id: 'P-001', name: 'Priya Reddy', age: 24, sex: 'F', condition: 'Routine follow-up', risk: 'Low', fresh: '2 d', twin: 'v22' },
  { id: 'P-002', name: 'Arjun Verma', age: 58, sex: 'M', condition: 'Hypertension', risk: 'Moderate', fresh: '3 h', twin: 'v41' },
  { id: 'P-003', name: 'Meera Iyer', age: 47, sex: 'F', condition: 'Type 2 diabetes', risk: 'High', fresh: '1 d', twin: 'v37' },
  { id: 'P-004', name: 'Kiran Rao', age: 33, sex: 'M', condition: 'Asthma', risk: 'Low', fresh: '6 h', twin: 'v18' },
  { id: 'P-005', name: 'Sunita Das', age: 66, sex: 'F', condition: 'CKD stage 2', risk: 'High', fresh: '5 d', twin: 'v52' },
  { id: 'P-006', name: 'Vikram Singh', age: 52, sex: 'M', condition: 'Hyperlipidaemia', risk: 'Moderate', fresh: '12 h', twin: 'v29' },
  { id: 'P-007', name: 'Lakshmi Pillai', age: 41, sex: 'F', condition: 'Hypothyroidism', risk: 'Low', fresh: '2 h', twin: 'v24' },
  { id: 'P-008', name: 'Rohan Gupta', age: 29, sex: 'M', condition: 'Healthy', risk: 'Low', fresh: '9 h', twin: 'v12' },
];

export const risks = [
  { id: 'dm', label: 'Diabetes risk (next 5 years)', value: 12, level: 'Low' },
  { id: 'hd', label: 'Heart disease risk', value: 28, level: 'Moderate' },
  { id: 'ht', label: 'Hypertension risk', value: 10, level: 'Low' },
];

/** Illustrative feature contributions — NOT output of a trained model. */
export const featureContrib = [
  { f: 'Family history (grandparent)', v: 9 }, { f: 'LDL cholesterol', v: 7 }, { f: 'Resting heart rate', v: -3 },
  { f: 'Sleep duration', v: -4 }, { f: 'Daily activity', v: -5 }, { f: 'Age', v: -2 },
];

export const recommendations = [
  { id: 1, text: 'Maintain regular exercise', icon: 'run' }, { id: 2, text: 'Follow a balanced diet', icon: 'food' },
  { id: 3, text: 'Get adequate sleep', icon: 'sleep' }, { id: 4, text: 'Regular health check-ups', icon: 'check' },
];

export const timeline = [
  { id: 't1', date: '10 Aug 2026', kind: 'visit', title: 'Consultation with Dr. Sharma', sub: 'Routine checkup' },
  { id: 't2', date: '10 Aug 2026', kind: 'lab', title: 'Lipid Profile', sub: 'LDL: 110 mg/dL' },
  { id: 't3', date: '10 Aug 2026', kind: 'rx', title: 'Prescription', sub: 'Atorvastatin 10 mg' },
  { id: 't4', date: '10 Aug 2026', kind: 'ecg', title: 'ECG Report', sub: 'Normal' },
  { id: 't5', date: '05 Jun 2026', kind: 'lab', title: 'Blood Test (CBC)', sub: 'Normal' },
  { id: 't6', date: '14 Feb 2026', kind: 'rx', title: 'Antibiotic course', sub: 'Amoxicillin 500 mg × 7 days' },
];

export const familyNodes = [
  { id: 'gf', name: 'Grandfather', cond: 'Heart disease', tag: 'heart', x: 22, y: 5 },
  { id: 'gm', name: 'Grandmother', cond: 'Diabetes', tag: 'diabetes', x: 66, y: 5 },
  { id: 'fa', name: 'Father', cond: 'Hypertension', tag: 'hypertension', x: 22, y: 39 },
  { id: 'mo', name: 'Mother', cond: 'Thyroid issue', tag: 'thyroid', x: 66, y: 39 },
  { id: 'you', name: 'You', cond: 'No diagnosis', tag: null, x: 44, y: 73 },
];
/** [from, to, kind] — descent lines run top→bottom; "partner" joins the two parents. */
export const familyEdges = [['gf', 'fa', 'descent'], ['gm', 'mo', 'descent'], ['fa', 'mo', 'partner'], ['fa', 'you', 'descent'], ['mo', 'you', 'descent']];
export const inheritedRisks = [
  { id: 'i1', name: 'Type 2 diabetes', level: 'Moderate', tag: 'diabetes' },
  { id: 'i2', name: 'Heart disease', level: 'Low', tag: 'heart' },
  { id: 'i3', name: 'Hypertension', level: 'Moderate', tag: 'hypertension' },
];

/** PLACEHOLDER evidence entries. Replace with verified, licensed guideline sources before any real use. */
export const evidenceDocs = [
  { id: 'E-01', title: 'Sample guideline: lipid management in adults (PLACEHOLDER)', publisher: 'Placeholder Publisher A', date: '2026-01-01', version: 'v0-demo', license: 'n/a — synthetic',
    section: 'Section 3.2', passage: 'Demo passage: Adults with elevated LDL cholesterol are typically reassessed after a defined interval following lifestyle changes or therapy.', tags: ['ldl', 'cholesterol', 'lipid', 'statin', 'heart'], relevance: 0.91 },
  { id: 'E-02', title: 'Sample guideline: blood pressure monitoring (PLACEHOLDER)', publisher: 'Placeholder Publisher B', date: '2026-01-01', version: 'v0-demo', license: 'n/a — synthetic',
    section: 'Section 1.4', passage: 'Demo passage: Home or wearable blood-pressure readings should be interpreted alongside clinic measurements and the patient’s history.', tags: ['blood pressure', 'hypertension', 'bp', 'wearable'], relevance: 0.84 },
  { id: 'E-03', title: 'Sample review: family history as a risk factor (PLACEHOLDER)', publisher: 'Placeholder Publisher C', date: '2026-01-01', version: 'v0-demo', license: 'n/a — synthetic',
    section: 'Section 2.1', passage: 'Demo passage: A first- or second-degree relative with a condition can increase estimated risk, and does not by itself establish a diagnosis.', tags: ['family', 'genetic', 'inherited', 'diabetes', 'history'], relevance: 0.78 },
  { id: 'E-04', title: 'Sample guidance: sleep and cardiometabolic health (PLACEHOLDER)', publisher: 'Placeholder Publisher D', date: '2026-01-01', version: 'v0-demo', license: 'n/a — synthetic',
    section: 'Section 4.0', passage: 'Demo passage: Habitual short sleep is associated with less favourable cardiometabolic markers in observational studies.', tags: ['sleep', 'glucose', 'metabolic'], relevance: 0.72 },
];

/** Prediction review queue (synthetic, illustrative; no trained model behind these). */
export const predictionQueue = [
  { id: 'PR-101', patient: 'Priya Reddy', pid: 'P-001', target: 'Illustrative: 5-yr diabetes risk', horizon: '5 years', prob: 0.12, lo: 0.07, hi: 0.19, model: 'demo-baseline-0.0', snapshot: 'v22', evidence: ['E-03', 'E-04'], status: 'pending' },
  { id: 'PR-102', patient: 'Meera Iyer', pid: 'P-003', target: 'Illustrative: glycaemic excursion', horizon: '24 hours', prob: 0.41, lo: 0.28, hi: 0.56, model: 'demo-baseline-0.0', snapshot: 'v37', evidence: ['E-04'], status: 'pending' },
  { id: 'PR-103', patient: 'Arjun Verma', pid: 'P-002', target: 'Illustrative: BP control drift', horizon: '30 days', prob: 0.33, lo: 0.2, hi: 0.49, model: 'demo-baseline-0.0', snapshot: 'v41', evidence: ['E-02'], status: 'pending' },
];

export const cohortTrend = [
  { m: 'May', avgHR: 76, avgGlucose: 108 }, { m: 'Jun', avgHR: 75, avgGlucose: 110 }, { m: 'Jul', avgHR: 77, avgGlucose: 112 },
  { m: 'Aug', avgHR: 74, avgGlucose: 107 }, { m: 'Sep', avgHR: 75, avgGlucose: 109 }, { m: 'Oct', avgHR: 74, avgGlucose: 106 },
];
export const riskDistribution = [{ level: 'Low', n: 4 }, { level: 'Moderate', n: 2 }, { level: 'High', n: 2 }];

export const consultSummary = [
  'Patient visited for routine checkup.', 'Lab reports show slightly elevated LDL cholesterol.',
  'Blood pressure and heart rate are within normal range.', 'No signs of acute risk based on current data.',
  'Suggested for clinician consideration: continue current medication, maintain diet and exercise, repeat lipid profile in 3 months.',
];

export const languages = ['English', 'हिन्दी', 'తెలుగు', 'தமிழ்', 'ಕನ್ನಡ'];
