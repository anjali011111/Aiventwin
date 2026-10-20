import { PageHeader } from '../../components/ui';
import TwinWorkspace from '../../components/twin/TwinWorkspace';

export default function PatientTwin() {
  return (
    <>
      <PageHeader title="Your Digital Twin" subtitle="A versioned view of your health state, built only from your records and observations. Drag panels, inspect organs, add an observation and replay how your twin changed." />
      <TwinWorkspace mode="patient" />
    </>
  );
}
