import { db } from './firebase.js'; 
import { collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const signupForm = document.getElementById('signupForm');
const phoneInput = document.getElementById('phone');
const sendCodeBtn = document.getElementById('send-code-btn');
const verificationGroup = document.getElementById('verification-code-group');
const verificationInput = document.getElementById('verification-code');
const confirmCodeBtn = document.getElementById('confirm-code-btn');
const verificationMessage = document.getElementById('verification-message');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const passwordMessage = document.getElementById('password-message');

let isPhoneVerified = false;

sendCodeBtn.addEventListener('click', function() {
    verificationGroup.style.display = 'block';
    this.textContent = '재전송';
    alert('테스트 인증번호 "000000"가 발송되었습니다.');
    isPhoneVerified = false; 
    verificationMessage.textContent = '';
});

confirmCodeBtn.addEventListener('click', function() {
    if (verificationInput.value === '000000') {
        isPhoneVerified = true;
        verificationMessage.textContent = '인증되었습니다.';
        verificationMessage.className = 'message success';
        phoneInput.disabled = true;
        sendCodeBtn.disabled = true;
        verificationInput.disabled = true;
        this.disabled = true;
    } else {
        isPhoneVerified = false;
        verificationMessage.textContent = '인증번호가 올바르지 않습니다.';
        verificationMessage.className = 'message error';
    }
});
        
function checkPasswordMatch() {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    if (passwordConfirm === '') {
        passwordMessage.textContent = '';
        return;
    }

    if (password === passwordConfirm) {
        passwordMessage.textContent = '비밀번호가 일치합니다.';
        passwordMessage.className = 'message success';
    } else {
        passwordMessage.textContent = '비밀번호가 일치하지 않습니다.';
        passwordMessage.className = 'message error';
    }
}
passwordInput.addEventListener('keyup', checkPasswordMatch);
passwordConfirmInput.addEventListener('keyup', checkPasswordMatch);

signupForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const phone = phoneInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const isPasswordValid = password.length === 4 && /^\d{4}$/.test(password);

    if (!isPhoneVerified) {
        alert('휴대폰 인증을 완료해주세요.');
        return;
    }
    if (!isPasswordValid) {
        alert('비밀번호는 숫자 4자리로 입력해주세요.');
        return;
    }
    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', phone));
        const userQuerySnapshot = await getDocs(q);
        
        if (!userQuerySnapshot.empty) {
            alert('이미 가입된 휴대폰 번호입니다.');
            return;
        }

        await addDoc(collection(db, "users"), {
            phone: phone,
            password: password 
        });

        alert('회원가입에 성공했습니다!');
        window.location.href = 'main.html';

    } catch (error) {
        console.error("Error adding document: ", error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
});