import SidebarHeader from '../SidebarHeader.tsx';
import '../../../styles/aside/settings.css'
import AccountSettings from './AccountSettings.tsx';
import { useCredentialStore } from '../../../stores/credentialStore.ts';
export default function Settings() {

  const token = useCredentialStore(s => s.token)

  return (
    <>
      <SidebarHeader title='Settings' />
      {token && <AccountSettings />}
    </>
  )
}