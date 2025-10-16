window.addEventListener("DOMContentLoaded", async function() {
    if (typeof Pi === 'undefined') {
        alert('Pi SDK chưa được tải!');
        return;
    }

    await Pi.init({ version: "2.0" }); // ✅ đúng chuẩn
    console.log("Pi SDK initialized!");

    const authBtn = document.getElementById("authBtn");
    const payBtn = document.getElementById("payBtn");
    const resultEl = document.getElementById("result");
    let currentUser = null;

    // Đăng nhập
    authBtn.addEventListener("click", async () => {
        try {
            const auth = await Pi.authenticate(["payments"], onIncompletePaymentFound);
            currentUser = auth.user;
            resultEl.textContent = "Đăng nhập thành công:\n" + JSON.stringify(currentUser, null, 2);
            payBtn.disabled = false;
        } catch (err) {
            resultEl.textContent = "Lỗi đăng nhập: " + err.message;
        }
    });

    // Thanh toán 1 Pi
    payBtn.addEventListener("click", async () => {
        if (!currentUser) {
            alert("Bạn cần đăng nhập trước!");
            return;
        }

        const paymentData = {
            amount: 1,
            memo: "Thanh toán thử nghiệm 1 Pi",
            metadata: { InternalPaymentID: 1234 },
        };

        const paymentCallbacks = {
            onReadyForServerApproval: function(paymentId) {
                console.log("🟢 Ready for server approval:", paymentId);
            },
            onReadyForServerCompletion: function(paymentId, txid) {
                console.log("✅ Payment completed:", paymentId, txid);
                resultEl.textContent = `Thanh toán thành công! PaymentID: ${paymentId}, TxID: ${txid}`;
            },
            onCancel: function(paymentId) {
                console.log("⚠ Người dùng hủy thanh toán:", paymentId);
                resultEl.textContent = "Người dùng hủy thanh toán";
            },
            onError: function(error, payment) {
                console.error("❌ Lỗi thanh toán:", error, payment);
                resultEl.textContent = "Lỗi thanh toán: " + error.message;
            }
        };

        try {
            await Pi.createPayment(paymentData, paymentCallbacks);
        } catch (err) {
            console.error(err);
            resultEl.textContent = "Lỗi gọi Pi.createPayment: " + err.message;
        }
    });

    function onIncompletePaymentFound(payment) {
        console.log("🔁 Giao dịch chưa hoàn tất:", payment);
    }
});
