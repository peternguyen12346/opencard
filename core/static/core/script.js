window.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ DOM loaded!");

  if (typeof Pi === "undefined") {
    alert("❌ Pi SDK chưa được tải!");
    console.error("Pi SDK is undefined!");
    return;
  }

  await Pi.init({ version: "2.0" });
  console.log("✅ Pi SDK initialized!", Pi);

  const resultEl = document.getElementById("result");
  const authBtn = document.getElementById("authBtn");
  const payBtn = document.getElementById("payBtn");

  let currentUser = null;

  // Nút đăng nhập
  authBtn.addEventListener("click", async () => {
    try {
      const scopes = ["payments"];
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      currentUser = auth.user;
      resultEl.textContent =
        "Đăng nhập thành công:\n" + JSON.stringify(currentUser, null, 2);
      payBtn.disabled = false;
    } catch (error) {
      resultEl.textContent = "Lỗi đăng nhập: " + error.message;
    }
  });

  // Nút thanh toán
  payBtn.addEventListener("click", async () => {
    if (!currentUser) {
      alert("Bạn cần đăng nhập trước!");
      return;
    }

    const paymentData = {
      amount: 1,
      memo: "Thanh toán 1 Pi demo",
      metadata: { purpose: "demo" },
    };

    const paymentCallbacks = {
      // Khi Pi SDK yêu cầu backend approve
      onReadyForServerApproval: function (paymentId) {
        console.log("🔹 Approval requested:", paymentId);
        // Để demo, approve ngay lập tức
        Pi.approvePayment(paymentId)
          .then(() => {
            console.log("✅ Payment approved on server side");
          })
          .catch((err) => {
            console.error("❌ Approval failed:", err);
          });
      },
      // Khi giao dịch hoàn tất
      onReadyForServerCompletion: function (paymentId, txid) {
        console.log("✅ Payment ready for completion:", paymentId, txid);
        resultEl.textContent =
          "Thanh toán thành công!\nPaymentId: " +
          paymentId +
          "\nTxId: " +
          txid;
      },
      onCancel: function (paymentId) {
        console.log("⚠ Người dùng hủy thanh toán:", paymentId);
        resultEl.textContent = "Người dùng hủy thanh toán";
      },
      onError: function (error, payment) {
        console.error("❌ Lỗi thanh toán:", error, payment);
        resultEl.textContent = "Lỗi thanh toán: " + error.message;
      },
    };

    try {
      await Pi.createPayment(paymentData, paymentCallbacks);
    } catch (err) {
      console.error("❌ Pi.createPayment failed:", err);
      resultEl.textContent = "Lỗi thanh toán: " + err.message;
    }
  });

  function onIncompletePaymentFound(payment) {
    console.log("🔁 Giao dịch chưa hoàn tất:", payment);
  }
});
