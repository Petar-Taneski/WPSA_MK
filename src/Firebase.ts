import * as firebase from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBVcyfwHb0Ymys3GD_yS1_p_BUtEcXtnkA",
  authDomain: "wpsa-mk.firebaseapp.com",
  projectId: "wpsa-mk",
  storageBucket: "wpsa-mk.firebasestorage.app",
  messagingSenderId: "852361990689",
  appId: "1:852361990689:web:e66005ef01c19acee20960",
  measurementId: "G-CW407SLQ3T",
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
export { analytics };
