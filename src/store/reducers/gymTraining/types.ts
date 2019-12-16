
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

interface Training {

}

export interface GymTrainingState {
  exercises: Exercise[]
  sets: ExerciseSetState[]
}

export interface TrainingState {
  id: TrainingId
  name: string
  duration: number
  isActive: boolean
  isPaused: boolean
  exerciseIds: ExerciseId[]
}

export interface ExerciseState {
  id: ExerciseId
  name: string
  setIds: ExerciseSetId[]
  trainingId: TrainingId
  duration: number
}

export interface ExerciseSetState {
  id: ExerciseSetId
  repeats: number
  loadWeight: number
  exerciseId: ExerciseId
  duration: number
  restTime: number
  restDuration: number
  isRest: boolean
  state: 'unfinished' | 'active' | 'finished'
  // state: 'unfinished' | 'training' | 'rest' | 'finished'
}
