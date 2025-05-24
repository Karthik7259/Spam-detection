import PatternMatcher from "@/components/pattern-matcher"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto p-6 max-w-5xl bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-xl backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
          Text Pattern Matching Visualizer
        </h1>
        <PatternMatcher />
      </div>
    </main>
  )
}
