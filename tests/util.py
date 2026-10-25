def h(user_id):
    return {"X-User-Id": user_id}


OFFICER = h("u-officer-1")
SBI = h("u-sbi-analyst")
SBI_ADMIN = h("u-sbi-admin")
SBI_VIEWER = h("u-sbi-viewer")
HDFC = h("u-hdfc-analyst")
CONSUMER1 = h("u-consumer-1")
CONSUMER2 = h("u-consumer-2")
CONSUMER3 = h("u-consumer-3")

SBI_ACCT = "SBI:4444440044"
HDFC_ACCT = "HDFC:2222220022"
