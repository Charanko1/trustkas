import { BrowserProvider, Contract } from "ethers";

const CONTRACT =
  "0xYOUR_CONTRACT_ADDRESS";

const ABI = [
  "function donate(string proposalId) payable",
  "function getBalance() view returns(uint)",
  "function getDonationCount() view returns(uint)"
];

export async function getContract() {
  const provider = new BrowserProvider(window.ethereum);

  const signer = await provider.getSigner();

  return new Contract(CONTRACT, ABI, signer);
}