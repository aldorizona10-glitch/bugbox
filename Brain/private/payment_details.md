# Payment Details — PRIVATE

> **STATUS: GITIGNORED. This file must NEVER enter version control.**
> See `.gitignore` (`Brain/private/`) and `Brain/decisions.md` for the policy.

This file holds real financial receiving details for the operator. It is intentionally kept outside git because:

- It would be irreversible to remove from git history once committed.
- A leaked bank account or wallet address is harder to rotate than a leaked API token.
- The repo may eventually be shared with collaborators or made partially public.

## Owner

Aldo Rizona

## Receiving Methods

### PayPal Invoice
- Issued on request. Use the operator's primary email (see `Brain/identity.md`).
- Best for: USD clients, freelancers, agencies.

### Wise Payment Link
- Issued on request. Best for: cross-border payouts, lower fees than SWIFT.

### Bank Transfer — SeaBank (Indonesia)
- Account number: `901894819238`
- Account name: Aldo Rizona
- Best for: IDR clients, domestic payouts.

### Crypto — USDT BEP20
- Wallet address: `0x9feaaacc40eaba89cbc50b2aa58cdc4b04711170`
- Network: BEP20 (BSC). Do NOT send ERC20 to this address.
- Best for: international clients without PayPal/Wise, bounties paid in stablecoin.

## Rules

1. Never paste any value from this file into:
   - chat logs
   - issue comments
   - PR comments
   - email bodies
   - tracked repo files
2. Never screenshot this file in full. If a payment proof screenshot is needed, mask everything except the last 4 characters of the destination.
3. If this file is accidentally committed, rotate ALL receiving methods before rewriting history. Do not rely on `git rm` alone.
4. Confirm payment destination out-of-band (DM, voice) before sending anything over USD 100.

## Rotation Log

| Date | What changed | Reason |
|---|---|---|
| 2026-06-26 | Initial creation | Separated from `Brain/identity.md` per payment-info-split decision (see `Brain/decisions.md`). |
