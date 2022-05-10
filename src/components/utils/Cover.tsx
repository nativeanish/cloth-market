import React from "react";
import { login } from "../../util/near";
import { Button } from "react-bootstrap";

const Cover = () => {
  return (
    <div
      className="d-flex justify-content-center flex-column text-center "
      style={{ background: "#ffffff", minHeight: "100vh" }}
    >
      <div className="mt-auto text-dark mb-5">
        <div
          className=" ratio ratio-1x1 mx-auto mb-2"
          style={{ maxWidth: "320px" }}
        >
          <img
            src="https://www.transparentpng.com/thumb/shirt/t0nf0S-t-shirt-transparent-background.png"
            alt=""
          />
        </div>
        <h1>Cloth Market</h1>
        <p>Please connect your wallet to continue.</p>
        <Button
          onClick={login}
          variant="outline-dark"
          className="rounded-pill px-3 mt-3"
        >
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};

export default Cover;
