# AEVITWIN — AI-Driven Personal Healthcare Digital Twin

**Tagline:** *A Lifetime of Health, Connected.*

**Challenge:** CRP Digital Twin Challenge 2026 — Happiest Health
**Institution:** Vignan's Lara Institute of Technology and Science
**Project Type:** AI-driven healthcare Digital Twin prototype

---

## 1. Team Details

| S. No. | Team Member            | Role        |
| ------ | ---------------------- | ----------- |
| 1      | R Sai Chandrikanjali | Team Leader |
| 2      | Stalin D               | Team Member |
| 3      | Kavya                  | Team Member |
| 4      | Jagdeesh                | Team Member |

**College / Institution:** Vignan's Lara Institute of Technology and Science
**Incubator / Innovation Centre:** Not specified.

---

## 2. Project Overview

AEVITWIN is an AI-driven personal healthcare Digital Twin platform designed to transform fragmented medical records into a continuously updated, patient-specific computational representation.

The platform aims to integrate historical electronic health records, laboratory reports, medications, family history, and dynamic physiological observations into a unified longitudinal health model. By combining data integration, predictive analytics, and evidence-grounded explanations, AEVITWIN aims to support patients and clinicians in understanding health trends and exploring potential future risks.

AEVITWIN is designed as a modular research prototype. Its long-term vision includes a continuously updated Digital Twin state, predictive modeling, evidence retrieval, hypothetical scenario analysis, and clinician-reviewed decision support.

## 3. Problem Statement

Healthcare information is frequently distributed across separate medical records, laboratory reports, prescriptions, clinical encounters, and wearable observations. This fragmentation makes it difficult to maintain a continuous view of a patient's health history and changing physiological state.

Traditional record systems primarily document past events, while predictive systems may operate on isolated datasets without continuously incorporating new observations or preserving the provenance of their inputs.

AEVITWIN addresses this challenge by proposing a unified, evolving patient model that connects historical information with current observations and supports a defined, data-driven health-risk prediction task.

## 4. Proposed Solution

AEVITWIN proposes an integrated workflow:

1. **Data integration:** Collect suitable historical records, laboratory results, medication information, and available dynamic observations.
2. **Data validation and normalization:** Standardize supported records, units, timestamps, and source information.
3. **Digital Twin state construction:** Organize patient information into a longitudinal state with versioned snapshots and traceable inputs.
4. **Predictive analytics:** Evaluate an appropriate machine-learning model for a prediction target supported by the selected dataset.
5. **Evidence-grounded explanations:** Retrieve relevant information from trusted sources where the retrieval component is implemented.
6. **Clinician-facing visualization:** Present health trends, prediction context, uncertainty, and source information through a dashboard.
7. **Human review:** Keep clinical interpretation and decisions under qualified healthcare professional supervision.

The first predictive task will be selected based on the available dataset, labels, and feasibility. The platform will not claim a validated whole-human simulation or autonomous diagnosis.

## 5. Healthcare Use Case

### Continuous Patient Health Monitoring and Risk Exploration

Consider a patient whose medical history includes previous laboratory reports, clinical encounters, medication records, and recent physiological observations.

AEVITWIN aims to organize these inputs into a longitudinal patient representation. When new observations become available, the system can update the relevant state, display changes over time, and support an eligible predictive model.

A patient interface is intended to provide accessible health summaries, records, timelines, and insights. A clinician interface is intended to provide a more detailed view of the patient's history, Twin state, prediction context, and evidence for review.

This workflow is intended to support—not replace—professional medical judgment.

## 6. Objectives

- Integrate fragmented health information into a unified longitudinal representation.
- Track changes in patient state as new observations become available.
- Explore machine-learning methods for a clearly defined prediction task.
- Maintain traceability between observations, Twin snapshots, and predictions.
- Present information through patient and clinician interfaces.
- Explore evidence-grounded explanations and hypothetical scenario analysis.
- Follow privacy, security, transparency, and responsible-AI principles.

## 7. Key Modules

### Patient Interface

- Health summary dashboard.
- Medical records and laboratory reports.
- Medication history.
- Appointment interface.
- Vital trends and longitudinal timeline.
- Health insights.
- Family-history visualization.
- AI assistant interface.
- Profile and privacy settings.

### Clinician Interface

- Patient directory and profile.
- Patient Digital Twin visualization.
- Historical observations and trends.
- Prediction and explanation interface.
- Clinical timeline.
- Evidence and review interface.
- Consultation-summary draft.
- Review and audit-history concepts.

### Digital Twin Engine

- Longitudinal patient state.
- Observation timestamps and source provenance.
- Versioned Twin snapshots.
- Historical state comparison.
- Derived features for eligible predictive tasks.

### AI and Research Components

- Classical machine-learning baseline.
- Optional deep-learning experiments where data supports them.
- Retrieval-Augmented Generation (RAG) with source citations as a planned or experimental module.
- Controlled AI workflow and clinician review.
- Optional quantum machine-learning comparison as a research experiment.
- Hypothetical what-if simulations as a future extension.

**Implementation note:** These modules describe the intended project scope. Individual features must be marked as implemented only after they have been verified in the submitted code.

## 8. Technical Stack

| Component        | Technology / Approach                                                |
| ---------------- | -------------------------------------------------------------------- |
| Frontend         | React.js with Vite and JavaScript                                    |
| Routing          | React Router                                                         |
| UI and animation | Existing CSS or Tailwind CSS; Framer Motion where appropriate        |
| Charts and icons | Recharts and Lucide React                                            |
| Authentication   | Supabase Auth — planned integration                                  |
| Database         | PostgreSQL through Supabase — proposed                               |
| Backend          | Python with FastAPI — proposed                                       |
| Data modeling    | FHIR-aligned structures where feasible                               |
| Classical ML     | Python and scikit-learn; XGBoost if justified                        |
| Deep learning    | PyTorch, if the dataset and task support it                          |
| RAG              | Embeddings with pgvector, FAISS, or Chroma — proposed                |
| Quantum ML       | Qiskit Machine Learning or PennyLane — optional experiment           |
| Testing          | pytest and frontend tests                                            |
| Deployment       | Frontend and backend hosting configured for the selected environment |

The final repository should distinguish technologies actually used in the working prototype from proposed extensions.

## 9. System Architecture

The proposed high-level architecture is:

```text
Patient / Clinician Interface
             |
             v
     React.js Frontend
             |
             v
  Authentication and API Layer
             |
             v
       FastAPI Backend
             |
             v
    Data Validation Layer
             |
             v
  PostgreSQL / FHIR-Aligned Data
             |
             v
      Digital Twin Engine
             |
             v
    Feature Engineering Layer
             |
             v
   Classical ML Prediction Model
             |
             v
  Prediction + Uncertainty + Provenance
             |
             v
 Evidence Retrieval (if implemented)
             |
             v
 Clinician Review and Dashboard
```

This diagram describes the proposed architecture; it does not imply that every component is already connected or operational.

## 10. Data Strategy

AEVITWIN is intended to use synthetic, appropriately licensed open, or authorized anonymized datasets.

Potential data categories include:

- Patient demographics and historical records.
- Laboratory observations.
- Diagnoses and conditions.
- Medication and encounter history.
- Family-history information.
- Wearable or simulated physiological time series.

The project will document dataset provenance, licensing, feature definitions, units, missingness, preprocessing, and target-label construction.

**Potential resource:** Synthea generates synthetic patient records and may be evaluated for suitability: [https://github.com/synthetichealth/synthea](https://github.com/synthetichealth/synthea)

No identifiable patient information or private credentials should be committed to the public repository.

## 11. AI/ML Methodology

### Classical Machine Learning

A classical baseline is the first priority. Candidate models include Logistic Regression and Random Forest, with additional models considered when justified by the dataset.

The selected prediction target and forecast horizon must be supported by available labels and a documented experimental design.

### Deep Learning

PyTorch-based sequence models such as LSTM or GRU may be explored if sufficient time-series data and sample size are available.

### Optional Quantum Machine Learning

Qiskit Machine Learning or PennyLane may be used for an experimental comparison against a classical baseline. The comparison must use equivalent data splits and evaluation metrics. No quantum advantage is assumed.

### Evaluation

Depending on the prediction task, evaluation may include AUROC, AUPRC, precision, recall, F1 score, calibration, and error analysis.

**Results policy:** Report only metrics obtained from actual experiments. No accuracy values or performance claims are asserted in this README.

## 12. Evidence-Grounded AI and Clinician Oversight

The proposed RAG workflow retrieves relevant passages from documented sources and presents citations alongside generated explanations. Retrieved evidence should retain source identifiers, publication information, and relevant passage details.

Any AI-generated clinical summary is intended to remain reviewable by a qualified professional. The system must not autonomously diagnose, prescribe medication, or override clinical judgment.

Features involving external medical knowledge, AI agents, and what-if simulation should remain clearly labeled as experimental until implemented and tested.

## 13. Privacy, Security, and Responsible Use

- Use synthetic or appropriately authorized data for public demonstrations.
- Keep secrets and credentials out of source code and Git history.
- Enforce authentication and authorization on trusted backend and database layers.
- Apply least-privilege database policies where applicable.
- Do not use phone numbers as primary patient identifiers.
- Label simulated measurements and experimental predictions.
- Preserve data provenance and prediction context.
- Display uncertainty and limitations where supported.
- Require clinician oversight for clinical interpretation.
- Do not claim clinical validation or regulatory approval without evidence.

AEVITWIN is a prototype and research project, not a substitute for professional healthcare services.

## 14. Research Direction

The project investigates the practical integration of longitudinal records, dynamic observations, versioned patient state, traceable prediction inputs, and evidence-grounded explanations.

Potential research questions include:

1. Does adding dynamic observations improve prediction performance over historical-record features for the selected target?
2. Can every prediction be traced to its input snapshot and model version?
3. Does source-cited retrieval improve the traceability of generated explanations?
4. What are the latency, reliability, and implementation costs of the integrated workflow?
5. Can an optional quantum model provide a reproducible benefit over an equivalent classical baseline?

These are research questions, not established findings. Claims of novelty or improvement require supporting literature and experimental evidence.

## 15. Running the Project

Add verified setup instructions based on the submitted repository.

The final repository should document:

1. Prerequisites.
2. Installation commands.
3. Environment-variable setup using a safe `.env.example`.
4. Frontend startup.
5. Backend startup, if implemented.
6. Database setup, if implemented.
7. Tests and expected results.
8. Demo credentials, only if safe and intentionally provided for the prototype.

Do not publish real credentials or patient data.

## 16. Repository and Demo Links

- **Public GitHub Repository:** https://github.com/anjali011111/Aiventwin
- **15–20 Minute Demo Video (Unlisted YouTube):** in github file  
- **Architecture Diagram (PDF/PPT):** in github file
- **Project Presentation (PDF/PPT):** in github file
Verify that evaluators can access every submitted file without requesting additional permissions.

## 17. Open-Source License

**License:**&#x20;

Before submission, select and include an appropriate license file, and verify the redistribution permissions for third-party code, datasets, and visual assets. Do not claim a license has been applied until the repository actually contains it.

## 18. Limitations and Future Scope

Potential future improvements include:

- Reliable integration of additional clinical and wearable data sources.
- More complete FHIR interoperability.
- Improved Twin-state versioning and replay.
- Experimentally evaluated prediction models.
- Evidence-grounded medical-information retrieval.
- More comprehensive security and access-control testing.
- Additional organ-system modules.
- Carefully evaluated what-if simulation.
- Optional deep-learning and quantum-learning comparisons.

These extensions depend on data availability, implementation time, testing, and validation.

## 19. Acknowledgement

AEVITWIN explores the potential of connected health information, computational patient models, predictive analytics, and clinician-reviewed decision support to create a more continuous view of patient health.

**AEVITWIN — A Lifetime of Health, Connected.**

---

