// Firebase Functions를 사용하기 위한 import를 추가합니다.
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-functions.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 인원수 및 주문 내역 불러오기 (기존과 동일) ---
    // headcount.html에서 저장한 인원수를 가져옵니다.
    const headcountString = sessionStorage.getItem('headcount');
    const headcount = parseInt(headcountString) || 0; // 문자열을 숫자로, 없으면 0명
    const pricePerPerson = 5000; // 1인당 가격
    let totalPrice = headcount * pricePerPerson; // 총 금액 계산

    // HTML 요소들을 가져옵니다.
    const orderSummaryElement = document.getElementById('orderSummary');
    const totalPriceElement = document.getElementById('totalPrice');
    const qrCodeDisplayElement = document.getElementById('qrCodeDisplay');
    const qrMessageElement = document.getElementById('qrMessage');

    // --- 2. 주문 내역 렌더링 및 총액 계산 (기존과 동일) ---
    if (headcount === 0) {
        // 인원수 정보가 없는 비정상적인 경우
        orderSummaryElement.innerHTML = '<li>이용 인원 정보가 없습니다.</li>';
        totalPriceElement.textContent = '0원';
        qrCodeDisplayElement.innerHTML = '<p>결제할 항목이 없습니다.</p>';
        qrMessageElement.textContent = '';
    } else {
        // 주문 내역을 '보드게임 이용료 (N명)'으로 표시
        orderSummaryElement.innerHTML = ''; // 기존 목록 비우기
        const li = document.createElement('li');
        li.innerHTML = `
            <span>보드게임 이용료 (${headcount}명)</span>
            <span class="price">${totalPrice.toLocaleString()}원</span>
        `;
        orderSummaryElement.appendChild(li);
        
        // 계산된 총 금액을 화면에 표시합니다.
        totalPriceElement.textContent = `${totalPrice.toLocaleString()}원`;

        // --- 3. QR 코드 생성 (실제 백엔드 호출) ---
        generateRealQRCode(totalPrice);
    }

    /**
     * 실제 QR 코드를 백엔드(Firebase Functions)에 요청하는 함수
     * @param {number} amount - 총 결제 금액
     */
    async function generateRealQRCode(amount) {
        
        // [!] 중요:
        // 1. Firebase Functions를 초기화합니다.
        const functions = getFunctions();
        
        // 2. 'generatePaymentQR'라는 이름의 백엔드 함수를 호출할 준비를 합니다.
        //    (이 이름은 나중에 functions/index.js 파일에 만들 함수 이름과 같아야 합니다)
        const generatePaymentQR = httpsCallable(functions, 'generatePaymentQR');

        try {
            qrCodeDisplayElement.innerHTML = '<p>QR 코드 생성 중...</p>';
            qrMessageElement.textContent = '결제 정보를 불러오는 중...';

            // 3. 백엔드 함수에 결제 금액(amount)과 주문 이름(orderName)을 담아 호출합니다.
            const orderName = `보드게임 이용료 (${headcount}명)`;
            const result = await generatePaymentQR({ amount: amount, orderName: orderName });

            // 4. 백엔드가 PG사로부터 받아온 실제 QR 코드 이미지 URL을 화면에 표시합니다.
            //    (백엔드가 { qrUrl: '...' } 형태로 데이터를 돌려준다고 가정)
            const qrUrl = result.data.qrUrl; 
            
            if (qrUrl) {
                qrCodeDisplayElement.innerHTML = `<img src="${qrUrl}" alt="결제 QR 코드">`;
                qrMessageElement.textContent = 'QR 코드를 스캔하여 결제해주세요.';
            } else {
                // 백엔드에서 qrUrl을 안 줬을 경우
                throw new Error('백엔드에서 QR 코드 URL을 받지 못했습니다.');
            }

            // [!] 중요 (결제 확인 시뮬레이션):
            // 아래는 5초 뒤 결제가 성공했다고 *가정*하는 시뮬레이션입니다.
            // 실제 구현에서는 
            // 1. (Polling) 3초마다 "결제 완료됐나요?"라고 백엔드에 물어보거나
            // 2. (Webhook) 백엔드가 PG사로부터 "결제 완료됨!" 신호를 받으면 DB에 상태를 바꾸고, 프론트가 그 DB를 실시간으로 감시해야 합니다.
            // 지금은 시뮬레이션으로 남겨두겠습니다.
            setTimeout(() => {
                qrMessageElement.textContent = '결제가 확인되었습니다!';
                qrMessageElement.style.color = '#28a745'; // 초록색으로 변경
                
                setTimeout(() => {
                    alert('결제가 성공적으로 완료되었습니다!');
                    // 결제 완료 후 정보 삭제
                    sessionStorage.removeItem('paymentItems'); 
                    sessionStorage.removeItem('headcount');
                    window.location.href = 'index.html'; // 메인 페이지로 이동
                }, 1500);

            }, 5000); // 5초 대기 (시뮬레이션)

        } catch (error) {
            // 백엔드 호출 자체를 실패했을 때
            console.error("QR 코드 생성 실패:", error);
            qrCodeDisplayElement.innerHTML = '<p>QR 코드 생성에 실패했습니다. 관리자에게 문의해주세요.</p>';
            qrMessageElement.textContent = '오류가 발생했습니다.';
        }
    }
});