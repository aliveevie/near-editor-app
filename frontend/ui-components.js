import React from 'react';

export function SignInPrompt({onClick}) {
  return (
    <main>
      <h1>
       The NEAR Smart Contract Builder
      </h1>
      <h3>
        Welcome to NEAR Smart Contract Builder
      </h3>
      <p>
      This straightforward Editor enables you to craft and deploy smart contracts on the Near blockchain.
      </p>
      <p>
      With just one click, you can effortlessly create and deploy your smart contract.
      </p>
      <br/>
      <p style={{ textAlign: 'center' }}>
        <button onClick={onClick}>Sign in with NEAR Wallet</button>
      </p>
    </main>
  );
}

export function SignOutButton({accountId, onClick}) {
  return (
    <button style={{ float: 'right' }} onClick={onClick}>
      Sign out {accountId}
    </button>
  );
}

