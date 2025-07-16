export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function translateDifficulty(difficulty: string){
  switch(difficulty){
    case 'easy': 
      return 'Fácil';
    case 'medium':
      return 'Médio';
    case 'hard':
      return 'Difícil';
    break;
  }
}

export function capitalizeFirstLetter(string: string){
  if(string) return string.charAt(0).toUpperCase() + string.slice(1)
}