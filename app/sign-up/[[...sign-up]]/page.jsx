import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-surface relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-tertiary/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="z-10 w-full max-w-md p-8 glass rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-on-surface-variant">Join Prism and start exploring</p>
                </div>

                <SignUp
                    appearance={{
                        layout: {
                            socialButtonsPlacement: "bottom",
                            socialButtonsVariant: "iconButton",
                        },
                        variables: {
                            colorPrimary: "#4285F4",
                            colorText: "white",
                            colorTextSecondary: "#9ca3af",
                            colorBackground: "transparent",
                            colorInputBackground: "rgba(255, 255, 255, 0.05)",
                            colorInputText: "white",
                            borderRadius: "0.75rem",
                        },
                        elements: {
                            card: "shadow-none bg-transparent p-0",
                            rootBox: "w-full",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                            formButtonPrimary: "bg-primary hover:bg-primary/80 text-white transition-all duration-200",
                            formFieldInput: "border-white/10 focus:border-primary transition-all duration-200",
                            footerActionLink: "text-primary hover:text-primary/80",
                            identityPreviewText: "text-white",
                            formFieldLabel: "text-gray-300",
                            dividerLine: "bg-white/10",
                            dividerText: "text-gray-400",
                            socialButtonsIconButton: "border-white/10 hover:bg-white/5",
                        }
                    }}
                />
            </div>
        </div>
    );
}
