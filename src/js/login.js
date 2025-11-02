// firebase.js에서 db 객체를 가져옵니다.
import { db } from './firebase.js';
// Firestore와 통신하기 위한 함수들을 가져옵니다.
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// HTML에서 id="loginForm" 요소를 찾습니다.
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function(event) {
    // form의 기본 제출 동작(새로고침)을 막습니다.
    event.preventDefault();

    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    // ▼▼▼ 관리자 계정 확인 (비밀번호 '1234'로 수정) ▼▼▼
    if (phone === 'admin' && password === '1234') { // 'admin'에서 '1234'로 변경
        alert('관리자 모드로 접속합니다.');
        window.location.href = 'admin.html'; // 관리자 페이지로 이동
        return; // Firebase 검사를 실행하지 않고 즉시 종료
    }
    // ▲▲▲ 관리자 계정 확인 (비밀번호 '1234'로 수정) ▲▲▲

    // --- (이하 기존 일반 사용자 로그인 로직) ---

    if (!phone || !password) {
        alert('휴대폰 번호와 비밀번호를 모두 입력해주세요.');
        return;
    }

    try {
        // Firestore의 'users' 컬렉션에서 입력된 휴대폰 번호와 일치하는 문서를 찾습니다.
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', phone));
        const userQuerySnapshot = await getDocs(q);

        // 일치하는 휴대폰 번호가 없는 경우
        if (userQuerySnapshot.empty) {
            alert('가입되지 않은 휴대폰 번호입니다.');
            return;
        }

        // 휴대폰 번호가 있으면 비밀번호를 확인합니다.
        let userFound = false;
        userQuerySnapshot.forEach(doc => {
            // 문서의 데이터에서 password를 가져와 입력된 password와 비교
            if (doc.data().password === password) {
                userFound = true;
            }
        });

        // 비밀번호가 일치하는 경우
        if (userFound) {
            alert('로그인 성공!');
            // 인원수 선택 페이지로 이동
            window.location.href = 'headcount.html';
        } else {
            // 비밀번호가 틀린 경우
            alert('비밀번호가 올바르지 않습니다.');
        }

    } catch (error) {
        console.error("Error logging in: ", error);
        alert('로그인 중 오류가 발생했습니다.');
    }
});

