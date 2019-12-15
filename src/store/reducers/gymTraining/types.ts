
interface Exercise {
  id: number // ExerciseSetId
  repeats: number
  loadWeight: number
  exerciseId: number // ExerciseId
  duration: number
  restTime: number
  restDuration: number
  isRest: boolean
  state: 'unfinished' | 'active' | 'finished'
}

export interface GymTrainingState {
  exercises: Exercise[]
}
