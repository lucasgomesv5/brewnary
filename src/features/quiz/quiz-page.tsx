import { getDailyQuestions } from "@/api"
import { capitalizeFirstLetter, translateDifficulty } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import QuestionCard from "./components/question-card"
import Button from "@/components/Button"

export default function QuizPage(){
  const [data, setData] = useState()
  const [step, setStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<{answerId: string, questionId: string}[] | null>()
  const location = useLocation()
  const stack = location.state.stack
  const difficulty = location.state.difficulty

  const currentQuestion = data?.questions?.[step]

  const onSelectOption = (answerId: string) => {
    const questionId = currentQuestion?.id

    setSelectedOption(prev => {
      const filtered = (prev ?? [])?.filter(item => item?.questionId !== questionId)
      return [...filtered, {answerId, questionId}]
    })
  }

  const findSelected = (option) => {
    const obj = selectedOption?.find(i => i?.questionId == currentQuestion?.id)

    return obj?.answerId === option?.id
  }

  const onBack = () => {
    setStep(prev => prev - 1)
  }

  const onAdvance = () => {

    setStep(prev => prev + 1)
  }

  const fetchData = async () => {
    const res = await getDailyQuestions({stack, difficulty})
    setData(res)
  }

  
 
  useEffect(() => {
    fetchData()
  },[stack, difficulty])

  return(
    <section className="flex items-center justify-center px-4 py-10 ">
      <div className="w-full text-center space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">{capitalizeFirstLetter(stack)} • {translateDifficulty(difficulty)}</h1>
          <p className="text-sm text-primary/70 dark:text-text-dark/70">
            Escolha a alternativa correta.
          </p>
        </div>
    
      <div className="flex items-center justify-center ">
        {currentQuestion && (
          <div className="space-y-6 md:w-6/12 sm:w-12/12">
          <h2 className="text-xl font-semibold">{currentQuestion?.text}</h2>
          {currentQuestion?.answer?.map((option, index) => (
            <QuestionCard 
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              label={option?.text} 
              position={index} 
              selected={findSelected(option)}
            />
          ))}
          </div>
        )}
      </div>

      <div className="flex justify-center items-center">
        <div className="flex md:w-6/12 sm:w-12/12 justify-between">
        <Button onClick={onBack} variant="outline">
          Voltar
        </Button>
        <Button onClick={onAdvance} variant="primary">
          Avançar
        </Button>
        </div>
      </div>

      </div>
    </section>
  )
}