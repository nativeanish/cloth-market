import Cover from "./components/utils/Cover";
import { Container, Nav } from "react-bootstrap";
import { Notification } from "./components/utils/Notifications";
import Wallet from "./components/Wallet";
import { accountBalance } from "./util/near";
import Clothes from "./components/marketplace/Clothes";
import React, { useState, useEffect, useCallback } from "react";
function App() {
  //@ts-ignore
  const account = window.walletConnection.account();

  const [balance, setBalance] = useState("0");
  //@ts-ignore
  const getBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(await accountBalance());
    }
  });

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <>
      <Notification />
      {account.accountId ? (
        <Container fluid="md">
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              <Wallet address={account.accountId} amount={balance} />
            </Nav.Item>
          </Nav>
          <>
            <main>
              <Clothes />
            </main>
          </>
        </Container>
      ) : (
        <Cover />
      )}
    </>
  );
}
export default App;
