import { Link } from 'react-router'
import Button from '@/components/Button'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-background-light dark:bg-background-dark transition-colors duration-300">

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary dark:text-text-dark mb-4">
          ☕ Desafios tech, torrados todos os dias.
        </h1>
        <p className="max-w-md text-base md:text-lg text-primary/70 dark:text-text-dark/70 mb-8">
          Participe de quizzes diários sobre Frontend, Backend e muito mais. Jogue sozinho ou desafie outro dev em tempo real.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Link to="/solo">
            <Button className="w-full" variant="primary">
              Modo Solo
            </Button>
          </Link>
          <Link to="/room/new">
            <Button className="w-full" variant="outline">
              Modo Online
            </Button>
          </Link>
        </div>
      </section>

      
    </main>
  )
}