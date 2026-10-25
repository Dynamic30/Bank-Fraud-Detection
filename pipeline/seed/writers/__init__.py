from .flat_rupees import FlatRupees
from .ledger import Ledger
from .paise_epoch import PaiseEpoch
from .payments_bank import PaymentsBank
from .split_datetime import SplitDatetime

WRITERS = {w.family: w for w in (FlatRupees, PaiseEpoch, Ledger, SplitDatetime, PaymentsBank)}
