import { clusterApiUrl } from "@solana/web3.js";

export const NETWORK = clusterApiUrl('mainnet-beta');

export const RPC = import.meta.env.VITE_REACT_SOLANA_RPC;

export const API_KEY = import.meta.env.VITE_REACT_SHYFT_API;

export const MARKETID = import.meta.env.VITE_REACT_MARKET_ID
