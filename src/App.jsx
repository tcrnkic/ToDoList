import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseConfig from "./firebaseConfig";
import TodoList from "./ToDoList";

  firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };

  const signOut = () => {
    firebase.auth().signOut();
  };

  return (
    <>
    <p className="text-white text-4xl font-body flex justify-center pt-8 ">To-Do List</p>
      <div className="text-white flex justify-center font-body mb-16 ">
       
       <div className="bg-opacity-35 mt-8 bg-gray-100 backdrop-blur-lg px-10 py-8 text-center rounded-lg">
         {user ? (
           <div>
      
              <p className="text-4xl">Hello {user.displayName}!</p>
              <TodoList />
              <button className="bg-red-500 rounded-lg mt-16 px-3 py-1" onClick={signOut}>Sign Out</button>
           </div>
           
         ) : (
          
          <div>
            <p className="w-52 py-4 text-lg">Sign in using your google account to track your tasks!</p>
             <button className="bg-blue-600 px-3 py-1 rounded-md" onClick={signInWithGoogle}>Sign In </button>
          </div>
         )}
       </div>

      </div>
    </>
  );
}

export default App;