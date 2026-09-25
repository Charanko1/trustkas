<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# PLEDGR

PLEDGR is a community crowdfunding application backed by MongoDB and a Solidity treasury contract on BOT Chain Testnet.

## Stack

- Next.js App Router + React + TypeScript
- MongoDB + Mongoose
- ethers v6 + MetaMask
- Solidity deployed from Remix IDE
- BOT Chain Testnet (chain ID 968)
- React Query for caching and focused application realtime

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `MONGODB_URI` and a random `JWT_SECRET` with at least 32 characters.
3. Deploy the current `contracts/TrustKasTreasury.sol` from Remix on BOT Chain Testnet.
4. Set the deployed address in `NEXT_PUBLIC_CONTRACT_ADDRESS`.
5. Install dependencies with `npm ci`.
6. Run `npm run dev`.

## Important blockchain rule

PLEDGR uses **native BOT**, not an ERC-20 token. Donors send BOT to the PLEDGR treasury contract. After approval, the contract can release the collected BOT to the fundraiser wallet stored in the campaign. If a proposal is cancelled before release, donors claim their own refunds from the contract.

## Wallet flow

Opening a group or proposal does not open MetaMask. MetaMask is requested only when the user explicitly starts a wallet-dependent action.

Wallet ownership is verified using a server-issued nonce and signature. The application stores the verified address in the User profile and uses that same wallet as the campaign recipient.

## Realtime flow

Group join requests and other MongoDB-backed application data use focused React Query polling. Blockchain data uses PLEDGR contract event listeners plus verified server synchronization.

## No Hardhat

The repository intentionally does not include Hardhat, its deployment scripts, or unrelated Web3 libraries. Remix is the single Solidity compile/deploy workflow.

See `FINAL_ARCHITECTURE.md` for the full business and security model.
>>>>>>> master
