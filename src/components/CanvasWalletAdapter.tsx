"use client";

import { useState, useContext, createContext, useEffect, ReactNode } from 'react';
import { CanvasClient } from '@dscvr-one/canvas-client-sdk';
import { registerCanvasWallet } from '@dscvr-one/canvas-wallet-adapter';
import { Connection, PublicKey, Transaction, TransactionVersion, VersionedTransaction } from '@solana/web3.js';
import base58 from "bs58";
import { Network, ShyftSdk } from '@shyft-to/js';
import { API_KEY, RPC } from '../requestsHandler';


export type SupportedTransactionVersions = ReadonlySet<TransactionVersion> | null | undefined;

export type TransactionOrVersionedTransaction<S extends SupportedTransactionVersions> = S extends null | undefined
    ? Transaction
    : Transaction | VersionedTransaction;

export function isVersionedTransaction(
    transaction: Transaction | VersionedTransaction
): transaction is VersionedTransaction {
    return 'version' in transaction;
}

interface WalletContextType {
    connectWallet: () => Promise<boolean>;
    disconnectWallet: () => Promise<boolean>;
    walletAddress: string | null;
    walletIcon: string | null;
    signTransaction: (transaction: any) => Promise<any | null>;
    signMainTransaction: (transaction: Transaction) => Promise<string | null>;
    signCodedTx: (encodedtx: any) => Promise<string | null>
    iframe: boolean;
    marketSDK: ShyftSdk;
    userInfo: { id: string; username: string; avatar?: string | undefined; } | undefined;
    publicKey: PublicKey;
    content: { id: string; portalId: string; portalName: string; } | undefined;
    update: any;
    makeRefetch: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

const SOLANA_MAINNET_CHAIN_ID = "solana:101"; // Solana mainnet chain ID


export const CanvasWalletProvider = ({ children }: { children: ReactNode }) => {
    const [canvasClient, setCanvasClient] = useState<CanvasClient | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const [update, setUpdate] = useState<string | null>('')
    const [walletIcon, setWalletIcon] = useState<string | null>(null);
    const [iframe, setIframe] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<{ id: string; username: string; avatar?: string | undefined; }>();
    const [content, setContent] = useState<{
        id: string;
        portalId: string;
        portalName: string;
    }>();

    useEffect(() => {
        const isIframe = () => {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        };

        setIframe(isIframe());

        if (isIframe()) {
            const client = new CanvasClient();
            registerCanvasWallet(client);
            setCanvasClient(client);
            console.log("CanvasClient initialized");
        }
    }, []);

    const connectWallet = async () => {

        if (canvasClient) {
            try {
                const info = await canvasClient.ready();

                if (info?.untrusted) {
                    const { user, content } = info.untrusted;
                    setUserInfo(user);
                    setContent(content);
                } else {
                    console.error('Failed to retrieve user information');
                }
                await canvasClient.ready();
                console.log("CanvasClient is ready");

                const response = await canvasClient.connectWallet(SOLANA_MAINNET_CHAIN_ID);

                if (response?.untrusted?.success) {
                    setWalletAddress(response.untrusted.address);
                    localStorage.setItem('walletAddress', response.untrusted.address);
                    setWalletIcon(response.untrusted.walletIcon);
                    console.log('Wallet connected:', response.untrusted.address);
                    return true;
                } else {
                    console.error('Failed to connect wallet');
                    return false;

                }

            } catch (error) {
                console.log(error);

                console.error('Error connecting wallet:', error);
                return false;
            }
        } else {
            console.error('CanvasClient is not initialized');
            return false;
        }
    };

    const disconnectWallet = async () => {

        if (canvasClient) {

            try {
                const info = await canvasClient.ready();

                if (info?.untrusted) {
                    const { user, content } = info.untrusted;
                    setUserInfo(user);
                    setContent(content);
                } else {
                    console.error('Failed to retrieve user information');
                }
                await canvasClient.ready();
                console.log("CanvasClient is ready");

                setWalletAddress(null);
                localStorage.removeItem('walletAddress');
                setWalletIcon(null);

                return true;

            } catch (error) {
                console.log(error);

                console.error('Error connecting wallet:', error);
                return false;
            }
        } else {
            console.error('CanvasClient is not initialized');
            return false;
        }
    };
    const signTransaction = async (transaction: Transaction) => {
        if (!canvasClient || !walletAddress) {
            console.error('CanvasClient or walletAddress is not available');
            return null;
        }

        try {
            // const network = RPC;
            // const connection = new Connection(network, 'confirmed');

            // // Fetch the latest blockhash
            // const { blockhash } = await connection.getLatestBlockhash({ commitment: "finalized" });
            // transaction.recentBlockhash = blockhash;
            // transaction.feePayer = new PublicKey(walletAddress);

            // Serialize the transaction
            const serializedTx = transaction.serialize({
                requireAllSignatures: false,
                verifySignatures: false,
            });

            const base58Tx = base58.encode(serializedTx)

            // Sign and send the transaction via canvasClient
            const results = await canvasClient.signAndSendTransaction({
                unsignedTx: base58Tx,
                awaitCommitment: "confirmed",
                chainId: SOLANA_MAINNET_CHAIN_ID,
            });


            if (results?.untrusted?.success) {
                console.log('Transaction signed:', results.untrusted.signedTx);
                return results.untrusted.signedTx;
            } else {
                console.error('Failed to sign transaction');
            }
        } catch (error) {
            console.error('Error signing transaction:', error);
        }

        return null;
    };

    const signMainTransaction = async (transaction: Transaction) => {
        if (!canvasClient || !walletAddress) {
            console.error('CanvasClient or walletAddress is not available');
            return null;
        }

        try {
            const network = RPC || "https://api.devnet.solana.com/";
            const connection = new Connection(network, 'confirmed');

            // Fetch the latest blockhash
            const { blockhash } = await connection.getLatestBlockhash({ commitment: "finalized" });
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = new PublicKey(walletAddress);

            // Serialize the transaction
            const serializedTx = transaction.serialize({
                requireAllSignatures: false,
                verifySignatures: false,
            });

            const base58Tx = base58.encode(serializedTx)

            // Sign and send the transaction via canvasClient
            const results = await canvasClient.signAndSendTransaction({
                unsignedTx: base58Tx,
                awaitCommitment: "confirmed",
                chainId: SOLANA_MAINNET_CHAIN_ID,
            });

            if (results?.untrusted?.success) {
                console.log('Transaction signed:', results.untrusted.signedTx);
                return results.untrusted.signedTx;
            } else {
                console.error('Failed to sign transaction');
            }
        } catch (error) {
            console.error('Error signing transaction:', error);
        }

        return null;
    };

    const signCodedTx = async (encodedtx: any) => {
        if (!canvasClient || !walletAddress) {
            console.error('CanvasClient or walletAddress is not available');
            return null;
        }

        try {

            function base64ToUint8Array(base64) {
                const binaryString = atob(base64); // Decode Base64 string to binary string
                const length = binaryString.length;
                const bytes = new Uint8Array(length); // Create a Uint8Array

                for (let i = 0; i < length; i++) {
                    bytes[i] = binaryString.charCodeAt(i); // Assign byte by byte
                }

                return bytes;
            }
            const uint8ArraySt = base64ToUint8Array(encodedtx);

            const base58Tx = base58.encode(uint8ArraySt)

            // Sign and send the transaction via canvasClient
            const results = await canvasClient.signAndSendTransaction({
                unsignedTx: base58Tx,
                awaitCommitment: "confirmed",
                chainId: SOLANA_MAINNET_CHAIN_ID,
            });

            if (results?.untrusted?.success) {
                console.log('Transaction signed:', results.untrusted.signedTx);
                return results.untrusted.signedTx;
            } else {
                console.error('Failed to sign transaction');
            }
        } catch (error) {
            console.error('Error signing transaction:', error);
        }

        return null;
    };

    const marketSDK = new ShyftSdk({ apiKey: API_KEY, network: Network.Mainnet });

    const publicKey = !walletAddress ? null : new PublicKey(walletAddress);


    const makeRefetch = () => {
        setUpdate(Math.random().toString());
    }

    const value: WalletContextType = {
        connectWallet,
        walletAddress,
        walletIcon,
        signTransaction,
        signMainTransaction,
        signCodedTx,
        iframe,
        userInfo,
        marketSDK,
        content,
        publicKey,
        update,
        makeRefetch,
        disconnectWallet,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );


};
const useCanvasWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useCanvasWallet must be used within a CanvasWalletProvider');
    }
    return context;
};

export default useCanvasWallet;

//const {userInfo, content} = useCanvasWallet()
//userInfo is an array of id, username and avatar, so you can access it like userInfo?.username from any page
//content is an array of id , portalId and portalName, so you can access it like content?.portalId from any page