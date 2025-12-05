'use client'

import Link from 'next/link'
import { SignInButton } from '@clerk/nextjs'

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-surface">
            {/* Header */}
            <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-outline-variant/30 bg-surface-1 sticky top-0 z-50 backdrop-blur-md bg-surface/80">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="text-xl font-semibold text-primary">PRISM Docs</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm font-medium text-on-surface-variant hover:text-primary">Back to Home</Link>
                    <SignInButton mode="modal">
                        <button className="btn-filled text-sm px-4 py-2">Get Started</button>
                    </SignInButton>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="prose-notebook max-w-none">
                    <h1>Welcome to Prism Documentation</h1>
                    <p className="text-xl text-on-surface-variant mb-12">
                        Master any subject by learning from First Principles. This guide will show you how to use Prism effectively.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="card-elevated">
                            <h3 className="text-lg font-bold text-primary mb-2">🚀 Quick Start</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm">
                                <li>Sign in to Prism</li>
                                <li>Click "New Session"</li>
                                <li>Type a topic (e.g., "Quantum Physics")</li>
                                <li>Answer the diagnostic questions</li>
                                <li>Let the AI guide you from axioms to mastery</li>
                            </ol>
                        </div>
                        <div className="card-elevated">
                            <h3 className="text-lg font-bold text-secondary mb-2">✨ Key Features</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li><strong>First Principles AI</strong>: Deconstructs complex topics</li>
                                <li><strong>Living Notebook</strong>: Auto-generates high-quality notes</li>
                                <li><strong>Doubt Resolver</strong>: Instant analogies for any text</li>
                                <li><strong>Neural Energy</strong>: Gamified learning stamina</li>
                            </ul>
                        </div>
                    </div>

                    <hr className="border-outline-variant/30 my-12" />

                    <h2>5 Practical Use Cases</h2>
                    <p className="mb-8">Here are five ways to use Prism to master different types of subjects.</p>

                    <div className="space-y-12">
                        {/* Use Case 1 */}
                        <section>
                            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-sm">1</span>
                                Mastering Complex Science
                            </h3>
                            <div className="pl-11">
                                <p className="font-medium text-primary mb-2">Scenario: Learning Quantum Entanglement</p>
                                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30">
                                    <p className="mb-4"><strong>Step 1:</strong> Start a session with "Explain Quantum Entanglement".</p>
                                    <p className="mb-4"><strong>Step 2:</strong> Prism will ask what you already know (e.g., "Do you know about superposition?"). Answer honestly.</p>
                                    <p className="mb-4"><strong>Step 3:</strong> Prism breaks it down to the axiom: "Information cannot travel faster than light, yet these particles correlate instantly."</p>
                                    <p className="mb-4"><strong>Step 4:</strong> Use the <strong>Doubt Resolver</strong> on terms like "Wave Function Collapse" to get a simple analogy (e.g., "Like a spinning coin landing flat").</p>
                                    <p><strong>Result:</strong> You understand the <em>why</em> and <em>how</em>, not just the definition. Your notebook is filled with structured notes and analogies.</p>
                                </div>
                            </div>
                        </section>

                        {/* Use Case 2 */}
                        <section>
                            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-sm">2</span>
                                Learning a New Framework
                            </h3>
                            <div className="pl-11">
                                <p className="font-medium text-primary mb-2">Scenario: Learning React.js</p>
                                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30">
                                    <p className="mb-4"><strong>Step 1:</strong> Enter "React.js Core Concepts".</p>
                                    <p className="mb-4"><strong>Step 2:</strong> Prism deconstructs it into: Components, State, and Props.</p>
                                    <p className="mb-4"><strong>Step 3:</strong> It explains <em>State</em> as "The memory of a component" and <em>Props</em> as "Arguments passed to a function".</p>
                                    <p><strong>Result:</strong> You grasp the mental model of React, making coding much easier than just memorizing syntax.</p>
                                </div>
                            </div>
                        </section>

                        {/* Use Case 3 */}
                        <section>
                            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-sm">3</span>
                                Understanding History
                            </h3>
                            <div className="pl-11">
                                <p className="font-medium text-primary mb-2">Scenario: The Fall of Rome</p>
                                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30">
                                    <p className="mb-4"><strong>Step 1:</strong> Ask "Why did Rome fall?".</p>
                                    <p className="mb-4"><strong>Step 2:</strong> Prism avoids a simple date. It explores: Economic inflation, Military over-expansion, and Political corruption.</p>
                                    <p className="mb-4"><strong>Step 3:</strong> It connects these to modern examples to help you relate.</p>
                                    <p><strong>Result:</strong> You gain a systemic understanding of how empires collapse, applicable to other historical events.</p>
                                </div>
                            </div>
                        </section>

                        {/* Use Case 4 */}
                        <section>
                            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-sm">4</span>
                                Preparing for Interviews
                            </h3>
                            <div className="pl-11">
                                <p className="font-medium text-primary mb-2">Scenario: System Design Interview</p>
                                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30">
                                    <p className="mb-4"><strong>Step 1:</strong> Topic: "Design a URL Shortener".</p>
                                    <p className="mb-4"><strong>Step 2:</strong> Prism guides you through requirements: "What happens if 1 million users click at once?" (Scalability).</p>
                                    <p className="mb-4"><strong>Step 3:</strong> It helps you derive the solution (Hashing, Database Sharding) from first principles of data storage.</p>
                                    <p><strong>Result:</strong> You learn to derive solutions on the spot rather than memorizing architectures.</p>
                                </div>
                            </div>
                        </section>

                        {/* Use Case 5 */}
                        <section>
                            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-sm">5</span>
                                Debugging Code Logic
                            </h3>
                            <div className="pl-11">
                                <p className="font-medium text-primary mb-2">Scenario: Understanding Recursion</p>
                                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30">
                                    <p className="mb-4"><strong>Step 1:</strong> Ask "How does recursion actually work?".</p>
                                    <p className="mb-4"><strong>Step 2:</strong> Prism explains the "Base Case" (when to stop) and "Recursive Step" (doing it again).</p>
                                    <p className="mb-4"><strong>Step 3:</strong> It uses the analogy of "Standing between two mirrors" or "Opening nested Russian dolls".</p>
                                    <p><strong>Result:</strong> You visualize the call stack and understand how to write recursive functions without stack overflow errors.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-20 p-8 bg-surface-container-high rounded-2xl text-center">
                        <h2 className="text-2xl font-bold text-on-surface mb-4">Ready to start learning?</h2>
                        <SignInButton mode="modal">
                            <button className="btn-filled text-lg px-8 py-3">Launch Prism</button>
                        </SignInButton>
                    </div>
                </div>
            </main>
        </div>
    )
}
