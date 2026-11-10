import { useState } from 'react'
import { useUserDeletion } from '../../../hooks/user/useUserDeletion.ts'
import { useCredentialStore } from '../../../stores/credentialStore.ts'
import { Loader } from 'lucide-react'
import useDismissable from '../../../hooks/sideEffects/useDismissable.ts'

export default function AccountSettings() {

  const [confirmPopup, setConfirmPopup] = useState<boolean>(false)
  const { deleteUser } = useUserDeletion()

  const loading = useCredentialStore(s => s.loading)
  const error = useCredentialStore(s => s.error)
  const name = useCredentialStore(s => s.name)

  const popupRef = useDismissable<HTMLDivElement>({
    isOpen: confirmPopup && !loading,
    onDismiss: () => setConfirmPopup(false)
  })

  return (
    <section className="settings-section">
      <h3>Account</h3>
      <p>name: {name}</p> {/* TODO add change display name? :p */}

      <ul className="account-list">
        <li className='deletion-box' >
          {!confirmPopup && <button
            className='delete-buttons'
            disabled={loading}
            onClick={() => setConfirmPopup(true)}
          >{loading ? 'Loading...' : 'Delete account'}
          </button>}
          {loading
            ? <span role="status" aria-label="Deleting account">
              <Loader className="loader" aria-hidden="true" />
            </span>
            : error && <p role="alert">{error}</p>
          }
          {confirmPopup && (
            <div ref={popupRef} className='popup'>
              <p>Are you sure?</p>
              <div className='popup-buttons'>

                <button
                  className='delete-buttons deleter'
                  disabled={loading}
                  onClick={() => {
                    setConfirmPopup(false)
                    deleteUser()
                  }}
                  type='button'>
                  DELETE
                </button>
                <button
                  disabled={loading}
                  className='delete-buttons'
                  onClick={() => setConfirmPopup(false)}
                  type='button'>
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </li>
      </ul>
    </section>
  )
}