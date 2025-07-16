import { Link } from 'react-router'
import Button from '@/components/Button'

export default function LandingPage() {
  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="text-center flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary dark:text-text-dark mb-4">
          ☕ Desafios técnicos diários.
        </h1>
        <p className="max-w-md text-base md:text-lg text-primary/70 dark:text-text-dark/70 mb-8">
          Participe de quizzes diários sobre Frontend, Backend e muito mais.
        </p>
        <Link to="/setup">
          <Button className="w-full" variant="primary">
            Conferir desafios
          </Button>
        </Link>
      </div>
    </section>
  )
}