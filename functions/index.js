const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid"); // 고유 ID 생성을 위함

admin.initializeApp();

// 토스페이먼츠 '가상계좌' API를 이용해 QR 코드를 생성하는 함수
exports.generatePaymentQR = functions.region("asia-northeast3") // 서울 리전
  .https.onCall(async (data, context) => {
    // 1. 프론트엔드(payment.js)에서 보낸 금액과 주문 이름을 받습니다.
    const amount = data.amount;
    const orderName = data.orderName;

    // 2. Firebase에 안전하게 저장해 둔 토스페이먼츠 시크릿 키를 불러옵니다.
    const secretKey = functions.config().toss.secret_key;
    
    // 3. 토스페이먼츠 API는 Basic 인증을 사용합니다.
    // 시크릿 키를 Base64로 인코딩합니다. (키 뒤에 ':'를 붙여야 함)
    const basicToken = Buffer.from(secretKey + ":").toString("base64");

    // 4. 토스페이먼츠에 보낼 고유한 주문 ID를 생성합니다.
    const orderId = `order_${uuidv4()}`;

    try {
      // 5. 토스페이먼츠 '가상계좌' API를 호출합니다.
      const response = await fetch("https://api.tosspayments.com/v1/virtual-accounts", {
        method: "POST",
        body: JSON.stringify({
          "method": "virtual-account", // 결제 수단
          "amount": amount,           // 결제 금액
          "orderId": orderId,         // 고유 주문 ID
          "orderName": orderName,     // 주문 이름
          "customerName": "무인 카페 손님", // 고객 이름 (필수)
          "bank": "우리",             // 가상계좌 은행 (아무 곳이나 지정)
          "useQrCode": true,        // [핵심] QR 코드를 사용하겠다고 설정
          "accountType": "general",   // 일반 계좌
        }),
        headers: {
          // [핵심] 인증 헤더
          "Authorization": `Basic ${basicToken}`,
          "Content-Type": "application/json",
          "Idempotency-Key": orderId, // 멱등성 키 (중복 요청 방지)
        },
      });

      const paymentData = await response.json();

      // 6. 토스페이먼츠가 QR 코드 이미지 URL을 성공적으로 반환한 경우
      if (paymentData.virtualAccount && paymentData.virtualAccount.qrCodeImage) {
        // 7. 이 URL을 프론트엔드(payment.js)로 다시 보내줍니다.
        return { qrUrl: paymentData.virtualAccount.qrCodeImage };
      } else {
        // 8. 실패한 경우
        console.error("Toss API Error:", paymentData);
        throw new functions.https.HttpsError("internal", "QR 코드 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      throw new functions.https.HttpsError("internal", "서버 오류가 발생했습니다.");
    }
  });
