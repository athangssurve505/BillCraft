import {createContext, useContext} from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged ,signInWithEmailAndPassword,signOut} from 'firebase/auth'; // Add onAuthStateChanged import
import { getFirestore,doc,setDoc,getDoc, collection, getDocs } from "firebase/firestore";






const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


const FirebaseApp = initializeApp(firebaseConfig)



const FirebaseContext =createContext(null)

// console.log("FirebaseApp:",FirebaseApp,"FirebaseContext:",FirebaseContext)


const FirebaseAuth = getAuth(FirebaseApp)
const db = getFirestore(FirebaseApp);
// console.log(db)

export const FirebaseProvider =(props) =>{

    const signUpUser = (email,password)=>{
       return createUserWithEmailAndPassword(FirebaseAuth,email,password)
      }
    const loginUser = (email,password) =>{
      return signInWithEmailAndPassword(FirebaseAuth, email, password)}

      const Logout = async () =>{
          try{await signOut(FirebaseAuth); }
          catch(err) { console.log(err);}
      }
    
    const sendEmailVerificationLink = () => {
      const currentUser = FirebaseAuth.currentUser;
      if (currentUser) {
          return sendEmailVerification(currentUser);
      } else {
          return Promise.reject(new Error("No authenticated user found."));
      }
  };

 const addBillData = async(data,username) =>{
  try{
    const userBillsRef = doc(collection(db, "users", username, "bills"));
    await setDoc(userBillsRef,data);
  }
  catch (error){
  console.log(error)
  }
 };

  const addUserToFireStore = async (username) => {
    try {
      const docRef = doc(db, "users", username); // Reference to the document
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) { // If document does not exist
        await setDoc(docRef, {
          username: username, // Example field, add more fields as needed
          createdAt: new Date()
        });
        console.log("User added successfully.");
      } else {
        console.log("User already exists.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
    
  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(FirebaseAuth, (user) => {
        if (user) {
          resolve(user); // Return the user if authenticated
        } else {
          reject(new Error("No authenticated user found.")); // Reject if not authenticated
        }
      });
    });
  }

  const isUserLoggedIn = async () => {
    try {
      const user = await getCurrentUser(); 
      return !!user; 
    } catch (error) {
      console.error("Error checking user login status:", error);
      return false;
    }
  };

  const getAllBills = async (username) =>{
    const collectionRef = collection(db,"users",username,"bills")
    const bills = await getDocs(collectionRef)
    return bills.docs.map((doc)=>doc.data())
  }

 

  


    return(
        <FirebaseContext.Provider value={{signUpUser,sendEmailVerificationLink, getCurrentUser,addUserToFireStore,
          addBillData,getAllBills,loginUser,Logout,isUserLoggedIn  

        }}>
            {props.children}
        </FirebaseContext.Provider>
    )
}
export const useFirebase =() => useContext(FirebaseContext)
