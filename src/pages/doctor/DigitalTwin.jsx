import { PageHeader, Badge } from '../../components/ui';
import TwinWorkspace from '../../components/twin/TwinWorkspace';
import { patient } from '../../data/mock';

export default function DoctorTwin() {
  return (
    <>
      <PageHeader title="Digital Twin workspace" subtitle={`Patient ${patient.id} · ${patient.name} (synthetic). Inspect state, replay history and test hypothetical inputs on a forked copy.`} actions={<Badge tone="info">Read-only for raw observations</Badge>} />
      <TwinWorkspace mode="doctor" />
    </>
  );
}
