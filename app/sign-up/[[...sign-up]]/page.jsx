import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary hover:bg-primary/90 text-surface-container-lowest',
            card: 'bg-surface-1 border border-outline-variant/30 shadow-none',
            headerTitle: 'text-on-surface',
            headerSubtitle: 'text-on-surface-variant',
            socialButtonsBlockButton: 'text-on-surface border-outline-variant/30 hover:bg-surface-2',
            dividerLine: 'bg-outline-variant/30',
            dividerText: 'text-on-surface-variant',
            formFieldLabel: 'text-on-surface-variant',
            formFieldInput: 'bg-surface-container-high border-outline-variant/30 text-on-surface',
            footerActionText: 'text-on-surface-variant',
            footerActionLink: 'text-primary hover:text-primary/90',
          },
          layout: {
            socialButtonsPlacement: 'bottom',
          }
        }}
      />
    </div>
  )
}
