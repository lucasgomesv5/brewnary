import { GetDailyQuestionsParams } from "./types"

const url = import.meta.env.VITE_API_URL

export const getDailyQuestions = async ({stack, difficulty}: GetDailyQuestionsParams) => {
  try{
  const res = await fetch(`${url}/questions/daily?stack=${stack}&difficulty=${difficulty}`)

  return await res.json()
  }catch(e){
    console.log(e)
  }
  
}