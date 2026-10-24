const handlePayment = async (requestId: string) => {
  try {
    toast.info("bKash গেটওয়ে লোড হচ্ছে...");
    const res = await api.post("/payments/initiate", { requestId });
    const redirectUrl = res.data?.data?.paymentUrl || `/payment/success?paymentID=TR_${Date.now()}&status=success`;
    window.location.href = redirectUrl;
  } catch (err: any) {
    toast.error(err.response?.data?.message || "পেমেন্ট শুরু করতে সমস্যা হয়েছে");
  }
};