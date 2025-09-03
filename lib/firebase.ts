import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '@/firebase-config'

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Firestore functions for tasks and projects
export const saveTask = async (userId: string, task: any) => {
  const { doc, setDoc, collection, addDoc } = await import('firebase/firestore')
  
  try {
    // Save task to user's tasks collection
    const taskRef = await addDoc(collection(db, 'users', userId, 'tasks'), {
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    console.log('Task saved to Firebase:', taskRef.id)
    return taskRef.id
  } catch (error) {
    console.error('Error saving task to Firebase:', error)
    throw error
  }
}

export const saveProject = async (userId: string, project: any) => {
  const { doc, setDoc, collection, addDoc } = await import('firebase/firestore')
  
  try {
    // Save project to user's projects collection
    const projectRef = await addDoc(collection(db, 'users', userId, 'projects'), {
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    console.log('Project saved to Firebase:', projectRef.id)
    return projectRef.id
  } catch (error) {
    console.error('Error saving project to Firebase:', error)
    throw error
  }
}

export const getUserTasks = async (userId: string) => {
  const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
  
  try {
    const tasksRef = collection(db, 'users', userId, 'tasks')
    const q = query(tasksRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const tasks: any[] = []
    querySnapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return tasks
  } catch (error) {
    console.error('Error getting user tasks:', error)
    return []
  }
}

export const getUserProjects = async (userId: string) => {
  const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
  
  try {
    const projectsRef = collection(db, 'users', userId, 'projects')
    const q = query(projectsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const projects: any[] = []
    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return projects
  } catch (error) {
    console.error('Error getting user projects:', error)
    return []
  }
}

export const updateTask = async (userId: string, taskId: string, updates: any) => {
  const { doc, updateDoc, getDoc } = await import('firebase/firestore')
  
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId)
    
    // Check if document exists before updating
    const taskDoc = await getDoc(taskRef)
    if (!taskDoc.exists()) {
      console.warn('Task document does not exist:', taskId)
      return
    }
    
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
    
    console.log('Task updated in Firebase:', taskId)
  } catch (error) {
    console.error('Error updating task in Firebase:', error)
    throw error
  }
}

export const updateProject = async (userId: string, projectId: string, updates: any) => {
  const { doc, updateDoc, getDoc } = await import('firebase/firestore')
  
  try {
    const projectRef = doc(db, 'users', userId, 'projects', projectId)
    
    // Check if document exists before updating
    const projectDoc = await getDoc(projectRef)
    if (!projectDoc.exists()) {
      console.warn('Project document does not exist:', projectId)
      return
    }
    
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
    
    console.log('Project updated in Firebase:', projectId)
  } catch (error) {
    console.error('Error updating project in Firebase:', error)
    throw error
  }
}

export const deleteTask = async (userId: string, taskId: string) => {
  const { doc, deleteDoc, getDoc } = await import('firebase/firestore')
  
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId)
    
    // Check if document exists before deleting
    const taskDoc = await getDoc(taskRef)
    if (!taskDoc.exists()) {
      console.warn('Task document does not exist:', taskId)
      return
    }
    
    await deleteDoc(taskRef)
    
    console.log('Task deleted from Firebase:', taskId)
  } catch (error) {
    console.error('Error deleting task from Firebase:', error)
    throw error
  }
}

export const deleteProject = async (userId: string, projectId: string) => {
  const { doc, deleteDoc, getDoc } = await import('firebase/firestore')
  
  try {
    const projectRef = doc(db, 'users', userId, 'projects', projectId)
    
    // Check if document exists before deleting
    const projectDoc = await getDoc(projectRef)
    if (!projectDoc.exists()) {
      console.warn('Project document does not exist:', projectId)
      return
    }
    
    await deleteDoc(projectRef)
    
    console.log('Project deleted from Firebase:', projectId)
  } catch (error) {
    console.error('Error deleting project from Firebase:', error)
    throw error
  }
}