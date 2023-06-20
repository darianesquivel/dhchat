
import { auth, db, googleProvider } from '../Config/firebase';
import { signInWithPopup, signOut} from 'firebase/auth';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';

const userDocRef = collection(db , 'users')

export const googleSignIn = async () => {
    try {

      let result = await signInWithPopup(auth, googleProvider);

      // query search user in db
      const userQuery = query(userDocRef, where('email', '==', result.user?.email));
      const userDocSnap = await getDocs(userQuery);

      // if the user does not exist, add it
      if (userDocSnap.empty){
        await addDoc(userDocRef, {
          createAt: serverTimestamp(),
          email: result.user?.email,
          displayName: result.user?.displayName,
          avatar:result.user?.photoURL,
          uid: result.user?.uid
        })
      } 
        
    } catch (error) {
      console.error(error);
    }
  };

export const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };