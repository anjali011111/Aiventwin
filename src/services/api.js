/**
 * API service layer. TODAY: returns synthetic mock data after a short delay.
 * LATER: replace each body with a call to the FastAPI backend (see blueprint §10),
 * e.g. `return http.get('/api/v1/patients')`. Pages only import from here, so they won't change.
 */
import * as mock from '../data/mock';

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

export const api = {
  async getPatients() { await delay(); return mock.clinicianPatients; },
  async getPatient(id) { await delay(250); return mock.clinicianPatients.find((p) => p.id === id) ?? null; },
  async getRecords() { await delay(); return mock.records; },
  async getMedications() { await delay(300); return mock.medications; },
  async getDoctors() { await delay(); return mock.doctors; },
  async getTimeline() { await delay(300); return mock.timeline; },
  async getPredictionQueue() { await delay(); return mock.predictionQueue; },
  async searchEvidence(query) {
    await delay(500);
    const q = query.trim().toLowerCase();
    if (!q) return { results: mock.evidenceDocs, abstained: false };
    const results = mock.evidenceDocs.filter((d) => d.tags.some((t) => q.includes(t) || t.includes(q)) || d.title.toLowerCase().includes(q));
    // Abstain when nothing relevant is retrieved (blueprint §9: abstain if evidence missing)
    return { results, abstained: results.length === 0 };
  },
};
