import { AnimatePresence } from 'framer-motion'
import { useToast } from '@/contexts/ToastContext'
import { Toast } from './Toast'

export function ToastContainer() {
    const { toasts, dismissToast } = useToast()

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-lg mx-auto">
            <AnimatePresence mode="popLayout">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onDismiss={() => dismissToast(toast.id)}
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    )
}

export default ToastContainer
