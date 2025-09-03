import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

// Task operations
export const createTask = async (userId: string, taskData: any) => {
  try {
    const taskRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completed: false,
      progress: 0
    })
    return taskRef.id
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export const getTasks = async (userId: string) => {
  try {
    const tasksRef = collection(db, 'tasks')
    const q = query(
      tasksRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting tasks:', error)
    throw error
  }
}

export const updateTask = async (taskId: string, updates: any) => {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export const deleteTask = async (taskId: string) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId))
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

// Project operations
export const createProject = async (userId: string, projectData: any) => {
  try {
    const projectRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completed: false,
      progress: 0
    })
    return projectRef.id
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export const getProjects = async (userId: string) => {
  try {
    const projectsRef = collection(db, 'projects')
    const q = query(
      projectsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting projects:', error)
    throw error
  }
}

export const updateProject = async (projectId: string, updates: any) => {
  try {
    const projectRef = doc(db, 'projects', projectId)
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export const deleteProject = async (projectId: string) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId))
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

// Get today's tasks
export const getTodaysTasks = async (userId: string) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tasksRef = collection(db, 'tasks')
    const q = query(
      tasksRef, 
      where('userId', '==', userId),
      where('dueDate', '>=', today.toISOString().split('T')[0]),
      where('dueDate', '<', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting today\'s tasks:', error)
    throw error
  }
}

// Get completed items
export const getCompletedItems = async (userId: string) => {
  try {
    const tasksRef = collection(db, 'tasks')
    const projectsRef = collection(db, 'projects')
    
    const tasksQuery = query(
      tasksRef, 
      where('userId', '==', userId),
      where('completed', '==', true)
    )
    const projectsQuery = query(
      projectsRef, 
      where('userId', '==', userId),
      where('completed', '==', true)
    )
    
    const [tasksSnapshot, projectsSnapshot] = await Promise.all([
      getDocs(tasksQuery),
      getDocs(projectsQuery)
    ])
    
    const completedTasks = tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      type: 'task',
      ...doc.data()
    }))
    
    const completedProjects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      type: 'project',
      ...doc.data()
    }))
    
    return [...completedTasks, ...completedProjects]
  } catch (error) {
    console.error('Error getting completed items:', error)
    throw error
  }
}



