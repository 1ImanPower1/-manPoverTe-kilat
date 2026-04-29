import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtzTIQm1vvsYZRHV6t9RsTBK3Uma6K8rA",
  authDomain: "imanpowerchat.firebaseapp.com",
  databaseURL: "https://imanpowerchat-default-rtdb.firebaseio.com",
  projectId: "imanpowerchat",
  storageBucket: "imanpowerchat.firebasestorage.app",
  messagingSenderId: "809946654937",
  appId: "1:809946654937:web:f34de2239ecdeb648036c8",
  measurementId: "G-EC5LJKKCPD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const uyeler = {
    "mustafaslan.gamer1907@gmail.com": "osimhendizkapağı",
    "reozt2000@gmail.com": "kuranokuyandefans",
    "g17058525@gmail.com": "yetimhanekundakçısı",
    "beratcihadyeten@gmail.com": "duvaradam"
};

document.getElementById('loginBtn').onclick = () => {
    const email = document.getElementById('email').value.toLowerCase().trim();
    const pass = document.getElementById('password').value;

    if (!uyeler[email]) {
        alert("Teşkilat listesinde yoksunuz!");
        return;
    }

    signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
            localStorage.setItem('userNick', uyeler[email]);
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            loadData();
        })
        .catch(() => alert("Hatalı giriş!"));
};

document.getElementById('adminBtn').onclick = () => {
    const adminPass = prompt("Admin Şifresi:");
    if (adminPass === "teşkilat123") {
        const d = prompt("Yeni Duyuru:");
        if (d) set(ref(db, 'announcement'), { text: d });
    }
};

document.getElementById('sendBtn').onclick = () => {
    const text = document.getElementById('messageInput').value;
    const nick = localStorage.getItem('userNick');
    if (text) {
        push(ref(db, 'messages'), { user: nick, text: text });
        document.getElementById('messageInput').value = '';
    }
};

function loadData() {
    onValue(ref(db, 'messages'), (s) => {
        const mDiv = document.getElementById('messages');
        mDiv.innerHTML = '';
        s.forEach((c) => {
            const d = c.val();
            mDiv.innerHTML += `<p><strong>${d.user}:</strong> ${d.text}</p>`;
        });
        mDiv.scrollTop = mDiv.scrollHeight;
    });
    onValue(ref(db, 'announcement'), (s) => {
        if (s.exists()) document.getElementById('latest-announcement').innerText = s.val().text;
    });
}
